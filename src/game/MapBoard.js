import { GameDimensions } from  './GameDimensions';
import { Unit, UnitTypes } from './Unit';

class MapBoard {

    constructor(height, width, units) {
        this.height = height;
        this.width = width;
        this.units = units;
    }

}

MapBoard.randomTrees = function(n, width, heighth) {
    var treesPositions = [];

    for(let i = 0 ; i < n ; i ++) {
        let x = getRandomPosition(width);
        let y = getRandomPosition(heighth);
        let name = Math.floor(Math.random() *3) +1;
        treesPositions.push({x: x, y: y, name: name});
    }
    return treesPositions.map(p => new Unit(p.x, p.y, 'tree'+p.name, UnitTypes.TREE, 1));
}

function getRandomPosition(max) {
    return ((Math.floor(Math.random() * max/GameDimensions.grid.tileSize))*GameDimensions.grid.tileSize)+GameDimensions.grid.tileSize/2
}

export { MapBoard };