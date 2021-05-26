import { GameDimensions } from  '../GameDimensions';
import { Unit, UnitTypes } from './Unit';


class MapBoard {

    constructor(height, width, unitFactory) {
        this.height = height;
        this.width = width;
        this.unitFactory = unitFactory;
        this.units = this.createUnits();
    }

    createUnits() {
        var buildingsPositions = [
            {x: 50, y: 50},
            {x: 300, y: 350},
            {x: 500, y: 350},
            {x: 600, y: 250},
            {x: 900, y: 900},
            {x: 500, y: 600},
            {x: 800, y: 800},
            {x: 200, y: 150}
          ];
          
        var units = buildingsPositions.map(p => this.unitFactory.createTower(p.x, p.y, null));
        var units = units.concat( this.randomTrees(200, 2000, 2000));
        return units;
    }

    randomTrees(n, width, heighth) {
        var treesPositions = [];
    
        for(let i = 0 ; i < n ; i ++) {
            let x = getRandomPosition(width);
            let y = getRandomPosition(heighth);
            treesPositions.push({x: x, y: y, name: name});
        }
        return treesPositions.map(p => this.unitFactory.createTree(p.x, p.y));
    }

}

function getRandomPosition(max) {
    return ((Math.floor(Math.random() * max/GameDimensions.grid.tileSize))*GameDimensions.grid.tileSize)+GameDimensions.grid.tileSize
}

export { MapBoard };