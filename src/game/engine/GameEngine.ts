import { MapBoard } from './map/MapBoard';
import { UnitFactory, UnitName } from './units/UnitFactory';
import { Player } from './Player';
import { EventRegistry, EventChannels } from './events/EventsRegistry';
import { GameEvent } from './events/GameEvent';
import { Unit, UnitTypes } from './units/Unit';
import { UnitStorage } from './units/UnitsStorage';
import { registerGameFinishedCheckFlow, registerGameFinishedFlow, registerPlayerLostFlow } from './rules/GameStateRules';
import { getPlayerVision, isUnitInVision } from './map/PlayerVision';

class GameEngine {
    unitFactory: UnitFactory;
    unitStorage: UnitStorage;
    mapBoard: MapBoard;
    players: Player[];
    events: EventRegistry;

    constructor() {
        this.unitFactory = new UnitFactory(this);
        this.unitStorage = new UnitStorage();
        this.mapBoard = this.createMapBoard();
        this.players = [new Player('1', 'Player1'), new Player('2', 'Bot')];
        this.events = new EventRegistry();
        this.registerOrderBuildingFlow();
        this.registerUnitDestroyed();

        this.addStartBuildings();

        registerPlayerLostFlow(this);
        registerGameFinishedCheckFlow(this);
        registerGameFinishedFlow(this);
    }

    //DEV method
    private addStartBuildings() {
        var buildingsPositions = [
            {x: 150, y: 200}
          ];
          
        var units = buildingsPositions.map(p => 
            this.unitFactory.of(UnitName.CASTLE,900, 950, this.events, this.players[1]));

        units.push(this.unitFactory.of(UnitName.TOWER,690, 200, this.events, this.players[1]));
        units.push(this.unitFactory.of(UnitName.TOWER,950, 850, this.events, this.players[1]));

        units.push(this.unitFactory.of(UnitName.CASTLE,150, 200, this.events, this.players[0]));
        this.unitStorage.addUnits(units);
    }

    private placeBuilding(unitPrototype: Unit, player: Player) {
        let ownerPlayer = this.getPlayer();
        if(player) {
            ownerPlayer = player;
        }
        if(unitPrototype.canPlace(unitPrototype, this.unitStorage)) {
            let unit = this.unitFactory.constructionOf(unitPrototype.unitName, 
                unitPrototype.x, 
                unitPrototype.y, 
                this.events,
                ownerPlayer);
            let unitCosts = this.unitFactory.getConfig(unitPrototype.unitName).cost;
            ownerPlayer.chargeResources(unitCosts);
            this.unitStorage.addUnit(unit);
            return unit;
        }
    }

    private registerOrderBuildingFlow() {
        var subscriber = {
            call: this.receiveBuildingOrder(this)
        }
        this.events.subscribe(EventChannels.ORDER_BUILDING, subscriber);
    }

    private receiveBuildingOrder(gameEngine: GameEngine) {
        let storage = this.unitStorage;
        return (event: any) => {
            let prototype: Unit = event.data.unitPrototype;
            let player: Player = event.data.player;
            if(gameEngine.canBuild(prototype.unitName, player) 
            && prototype.canPlace(prototype,  storage)) {
                let data = {
                    player: event.data.player,
                    unitPrototype: gameEngine.placeBuilding(prototype, player)
                };
                let placeBuildingEvent = new GameEvent(EventChannels.BUILDING_PLACED, data);
                gameEngine.events.emit(placeBuildingEvent);
            }
        }
    }

    private registerUnitDestroyed() {
        var subscriber = {
            call: this.receiveUnitDestroyed(this)
        }
        this.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
    }

    private receiveUnitDestroyed(gameEngine: GameEngine) {
        return (event: GameEvent) => {
            let unitDestroyed = event.data.unit;
            gameEngine.unitStorage.destroyUnit(unitDestroyed);
        }
    }

    private runUnitActionsAndTasks() {
        let ge = this;
        let events = this.events;
        this.unitStorage.units.forEach(u => {
            u.actions.forEach( action => {
                action(events, ge, u);
            });
            let doneTasksKeys : string[] = [];
            u.currentTasks.forEach((task, key) => {
                let done = task.processTask();
                if(done) {
                    doneTasksKeys.push(key);
                }
            });
            doneTasksKeys.forEach( key => {
                u.clearUnitTask(key);
            })
        })
    }

    update() {
        this.runUnitActionsAndTasks();
    }

    getPlayer() {
        return this.players[0];
    }

    createMapBoard() {
        return new MapBoard(2000, 2000, this.unitStorage, this.unitFactory);
    }

    getMap() {
        return this.mapBoard;
    }

    getPlayerVision() {
        return getPlayerVision(this);
    }

    canBuild(unitType: UnitName, player: Player) {
        let unitCosts = this.unitFactory.getConfig(unitType).cost;
        let owner;
        if(player) {
            owner = player;
        } else {
            owner = this.getPlayer();
        }
        return owner.checkEnoughResources(unitCosts);
    }

    canPlaceUnit(unit: Unit) {
        return isUnitInVision(this, unit) && unit.canPlace(unit, this.unitStorage);
    }
    
    orderBuilding(unitPrototype: Unit) {
        if(this.canPlaceUnit(unitPrototype)) {
            let data = {
                unitPrototype: unitPrototype,
                player: this.getPlayer()
            }
            let orderEvent = new GameEvent(EventChannels.ORDER_BUILDING, data);
            this.events.emit(orderEvent);
        }
    }

    boxSelect(x:number, y: number, dx: number, dy: number): Unit[] {
        let boxSelect = {leftX: 0, leftY: 0, rightX: 0, rightY: 0};
        if(dx < 0) {
            boxSelect.leftX = x+dx;
            boxSelect.rightX = x;
        } else {
            boxSelect.leftX = x;
            boxSelect.rightX = x+dx;
        }

        if(dy < 0) {
            boxSelect.leftY = y+dy;
            boxSelect.rightY = y;
        } else {
            boxSelect.leftY = y;
            boxSelect.rightY = y+dy;
        }

        let unitFilter = {
            boxSelect: boxSelect,
            types: [UnitTypes.CREATURE]
        }
        return this.unitStorage.getUnits(unitFilter);
    }

    

}

export { GameEngine }