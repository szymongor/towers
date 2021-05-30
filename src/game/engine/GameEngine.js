import { MapBoard } from './MapBoard';
import { Unit, UnitTypes } from './Unit';
import { GameDimensions } from '../GameDimensions';
import { UnitFactory } from './UnitFactory';
import { Player } from './Player';

class GameEngine {

    constructor() {
        this.unitFactory = new UnitFactory();
        this.mapBoard = this.createMapBoard();
        this.players = [new Player(1), new Player(2)];
    }

    createMapBoard() {
        return new MapBoard(2000, 2000, this.unitFactory);
    }

    getMap() {
        return this.mapBoard;
    }

    // TODO - intersect from phaser?
    canPlaceUnit(x, y, unit) {
        return 0 == this.mapBoard.units.filter(u=> this.unitIntersect(u, x, y, unit.size)).length; 
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

    placeBuilding(unitPrototype, playerOwner) {
        if(this.canPlaceUnit(unitPrototype.x, unitPrototype.y, unitPrototype)) {
            let unit = this.unitFactory.of(unitPrototype.unitName, unitPrototype.x, unitPrototype.y, playerOwner);
            this.mapBoard.units.push(unit);
            return unit;
        }
        
    }

}

export { GameEngine }