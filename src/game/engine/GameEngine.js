import { MapBoard } from './MapBoard';
import { Unit, UnitTypes } from './Unit';
import { GameDimensions } from '../GameDimensions';
import { UnitFactory } from './UnitFactory';
import { Player } from './Player';
import { EventRegistry } from './events/EventsRegistry';
import { GameEvent } from './events/GameEvent';

class GameEngine {

    constructor() {
        this.unitFactory = new UnitFactory();
        this.mapBoard = this.createMapBoard();
        this.players = [new Player(1), new Player(2)];
        this.events = new EventRegistry();
        this.registerOrderBuildingFlow();
        this.registerPlaceBuildingFlow();
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

    canBuild(unitType, player) {
        let unitCosts = this.unitFactory.getConfig(unitType).cost;
        let resources = this.getPlayer().resources;
        if(player) {
            resources = player.resources;
        }
        let result = true;
        unitCosts.forEach(cost => {
            if(cost.value > resources[cost.name]) {
                console.log("Not enough "+cost.name);
                result = false;
            }
        });
        return result;
    }

    // TODO - intersect from phaser?
    canPlaceUnit(unit) {
        return 0 == this.mapBoard.units.filter(u=> this.unitIntersect(u, unit.x, unit.y, unit.size)).length; 
    }

    unitIntersect(unit, x, y, size) {
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

    orderBuilding(unitPrototype) {
        if(this.canPlaceUnit(unitPrototype)) {
            let data = {
                unitPrototype: unitPrototype,
                player: this.getPlayer()
            }
            let orderEvent = new GameEvent(EventRegistry.events.ORDER_BUILDING, data);
            this.events.emit(orderEvent);
        }
    }

    placeBuilding(unitPrototype, player) {
        let ownerPlayer = this.getPlayer();
        if(player) {
            ownerPlayer = player;
        }
        if(this.canPlaceUnit(unitPrototype)) {
            let unit = this.unitFactory.of(unitPrototype.unitName, 
                unitPrototype.x, 
                unitPrototype.y, 
                ownerPlayer);
            this.mapBoard.units.push(unit);
            return unit;
        }
    }

    registerOrderBuildingFlow() {
        var subscriber = {
            call: this.receiveBuildingOrder(this)
        }
        this.events.subscribe(EventRegistry.events.ORDER_BUILDING, subscriber);
    }

    receiveBuildingOrder(gameEngine) {
        return (event) => {
            let prototype = event.data.unitPrototype;
            let player = event.data.player;
            if(gameEngine.canBuild(prototype.unitName, player) 
            && gameEngine.canPlaceUnit(prototype)) {
                let placeBuildingEvent = new GameEvent(EventRegistry.events.PLACE_BUILDING, event.data);
                gameEngine.events.emit(placeBuildingEvent);
            }
        }
        
    }

    registerPlaceBuildingFlow() {
        var subscriber = {
            call: this.receivePlaceBuilding(this)
        }
        this.events.subscribe(EventRegistry.events.PLACE_BUILDING, subscriber);
    }

    receivePlaceBuilding(gameEngine) {
        return (event) => {
            let prototype = event.data.unitPrototype;
            let player = event.data.player;
            gameEngine.placeBuilding(prototype, player);
        }
        
    }

}

export { GameEngine }