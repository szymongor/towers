import { MapBoard } from './MapBoard';
import { GameDimensions } from '../GameDimensions';
import { UnitFactory } from './UnitFactory';
import { Player } from './Player';
import { EventRegistry, EventChannels } from './events/EventsRegistry';
import { GameEvent } from './events/GameEvent';

interface Cost {
    name: string;
    value: number;
}

class GameEngine {
    unitFactory: UnitFactory | any;
    mapBoard: MapBoard;
    players: Player[];
    events: EventRegistry;

    constructor() {
        this.unitFactory = new UnitFactory();
        this.mapBoard = this.createMapBoard();
        this.players = [new Player('1'), new Player('2')];
        this.events = new EventRegistry();
        this.registerOrderBuildingFlow();
    }

    getPlayer() {
        return this.players[0];
    }

    createMapBoard() {
        return new MapBoard(2000, 2000, this.unitFactory);
    }

    getMap() {
        return this.mapBoard;
    }

    canBuild(unitType: any, player: any) {
        let unitCosts = this.unitFactory.getConfig(unitType).cost;
        let resources = this.getPlayer().resources;
        if(player) {
            resources = player.resources;
        }
        let result = true;
        unitCosts.forEach((cost: Cost) => {
            if(cost.value > resources[cost.name]) {
                console.log("Not enough "+cost.name);
                result = false;
            }
        });
        return result;
    }

    // TODO - intersect from phaser?
    canPlaceUnit(unit: any) {
        return 0 == this.mapBoard.units.filter(u=> this.unitIntersect(u, unit.x, unit.y, unit.size)).length; 
    }

    unitIntersect(unit: any, x: number, y: number, size: number) {
        var s = GameDimensions.grid.tileSize -0.01;
        if(
            (unit.x <= x && unit.x + unit.size*s > x)
            ||
            (unit.x <= x + size*s && unit.x + unit.size*s > x + size*s)
            ||
            (unit.x >= x  && unit.x + unit.size*s < x + size*s)
            ||
            (unit.x <= x  && unit.x + unit.size*s > x + size*s)
        ) {
            if(
                (unit.y <= y && unit.y + unit.size*s > y)
                ||
                (unit.y <= y + size*s && unit.y + unit.size*s > y + size*s)
                ||
                (unit.y >= y  && unit.y + unit.size*s < y + size*s)
                ||
                (unit.y <= y  && unit.y + unit.size*s > y + size*s)
            ) {
                
                return true;
            }
        }
        return false;
    }

    orderBuilding(unitPrototype: any) {
        if(this.canPlaceUnit(unitPrototype)) {
            let data = {
                unitPrototype: unitPrototype,
                player: this.getPlayer()
            }
            let orderEvent = new GameEvent(EventChannels.ORDER_BUILDING, data);
            this.events.emit(orderEvent);
        }
    }

    placeBuilding(unitPrototype: any, player: Player) {
        let ownerPlayer = this.getPlayer();
        if(player) {
            ownerPlayer = player;
        }
        if(this.canPlaceUnit(unitPrototype)) {
            let unit = this.unitFactory.constructionOf(unitPrototype.unitName, 
                unitPrototype.x, 
                unitPrototype.y, 
                ownerPlayer);
            let unitCosts = this.unitFactory.getConfig(unitPrototype.unitName).cost;
            this.chargeResources(ownerPlayer, unitCosts)
            this.mapBoard.units.push(unit);
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
        return (event: any) => {
            let prototype = event.data.unitPrototype;
            let player = event.data.player;
            if(gameEngine.canBuild(prototype.unitName, player) 
            && gameEngine.canPlaceUnit(prototype)) {
                let data = {
                    player: event.data.player,
                    unitPrototype: gameEngine.placeBuilding(prototype, player)
                };
                let placeBuildingEvent = new GameEvent(EventChannels.BUILDING_PLACED, data);
                gameEngine.events.emit(placeBuildingEvent);
            }
        }
        
    }

    chargeResources(player: Player, costs: Cost[]) {
        
        costs.forEach(cost  => {
            player.resources[cost.name] -= cost.value;
        })
    }

    update() {
        //TODO receiving resources from owned units;
        this.getPlayer().resources['wood'] += 2;

        this.updateConstruction();
    }

    updateConstruction() {
        this.mapBoard.units.forEach(unit => {
            if(unit.state.construction) {
                let finished = unit.processTasks();
                if(finished) {
                    unit.updateTexture();
                }
            }
        })
    }

}

export { GameEngine, Cost }