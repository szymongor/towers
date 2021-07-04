import { MapBoard } from './MapBoard';
import { GameDimensions } from '../GameDimensions';
import { UnitFactory, UnitName } from './units/UnitFactory';
import { Player } from './Player';
import { EventRegistry, EventChannels } from './events/EventsRegistry';
import { GameEvent } from './events/GameEvent';
import { ResourceName } from "./Resources";
import { Unit, UnitTypes } from './units/Unit';
import { UnitStorage } from './units/UnitsStorage';

class GameEngine {
    unitFactory: UnitFactory;
    unitStorage: UnitStorage;
    mapBoard: MapBoard;
    players: Player[];
    events: EventRegistry;

    constructor() {
        this.unitFactory = new UnitFactory();
        this.unitStorage = new UnitStorage();
        this.mapBoard = this.createMapBoard();
        this.players = [new Player('1', 'Player1'), new Player('2', 'Bot')];
        this.events = new EventRegistry();
        this.registerOrderBuildingFlow();
        this.registerUnitDestroyed();

        this.addTowers();
    }

    //DEV method
    addTowers() {
        var buildingsPositions = [
            {x: 200, y: 200}
          ];
          
        var units = buildingsPositions.map(p => this.unitFactory.createTower(p.x, p.y, this.events, this.players[1]));
        this.unitStorage.addUnits(units);
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
        return unit.canPlace(unit, this.unitStorage);
    }

    

    orderBuilding(unitPrototype: Unit) {
        if(unitPrototype.canPlace(unitPrototype, this.unitStorage)) {
            let data = {
                unitPrototype: unitPrototype,
                player: this.getPlayer()
            }
            let orderEvent = new GameEvent(EventChannels.ORDER_BUILDING, data);
            this.events.emit(orderEvent);
        }
    }

    placeBuilding(unitPrototype: Unit, player: Player) {
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

    registerOrderBuildingFlow() {
        var subscriber = {
            call: this.receiveBuildingOrder(this)
        }
        this.events.subscribe(EventChannels.ORDER_BUILDING, subscriber);
    }

    receiveBuildingOrder(gameEngine: GameEngine) {
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

    registerUnitDestroyed() {
        var subscriber = {
            call: this.receiveUnitDestroyed(this)
        }
        this.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
    }

    receiveUnitDestroyed(gameEngine: GameEngine) {
        return (event: GameEvent) => {
            let unitDestroyed = event.data.unit;
            gameEngine.unitStorage.destroyUnit(unitDestroyed);
        }
    }

    update() {
        //TODO receiving resources from owned units;
        // let resourcesAdd: [ResourceName, number][] = [[ResourceName.WOOD, 2]];
        
        // this.getPlayer().addResources(resourcesAdd);

        this.runUnitActions();

        this.updateConstruction();
    }

    runUnitActions() {
        let ge = this;
        let events = this.events;
        this.unitStorage.units.forEach(u => {
            u.actions.forEach( action => {
                action(events, ge, u);
            })
        })
    }

    updateConstruction() {
        this.unitStorage.getUnits({type: UnitTypes.BUILDING}).forEach(unit => {
            if(unit.state.construction) {
                let finished = unit.processTasks();
                if(finished) {
                    unit.updateTexture();
                }
            }
        })
    }

}

export { GameEngine }