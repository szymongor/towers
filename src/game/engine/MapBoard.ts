import { GameDimensions } from  '../GameDimensions';
import { Unit } from './units/Unit';
import { UnitFactory } from './units/UnitFactory';
import { UnitStorage } from './units/UnitsStorage';

class MapBoard {

    height: number;
    width: number;
    unitFactory: UnitFactory;
    unitStorage: UnitStorage;

    constructor(height: number, width: number, unitStorage: UnitStorage, unitFactory: UnitFactory) {
        this.height = height;
        this.width = width;
        this.unitFactory = unitFactory;
        this.unitStorage = unitStorage;
        this.unitStorage.addUnits(this.createUnits());
    }

    createUnits() {
        var units = this.randomTrees(200, 2000, 2000)
        return units;
    }

    randomTrees(n: number, width: number, heighth: number) {
        var treesPositions = [];
    
        for(let i = 0 ; i < n ; i ++) {
            let x = getRandomPosition(width);
            let y = getRandomPosition(heighth);
            treesPositions.push({x: x, y: y});
        }
        return treesPositions.map(p => this.unitFactory.createTree(p.x, p.y));
    }

}

function getRandomPosition(max: number) {
    return ((Math.floor(Math.random() * max/GameDimensions.grid.tileSize))*GameDimensions.grid.tileSize)+GameDimensions.grid.tileSize
}

export { MapBoard };