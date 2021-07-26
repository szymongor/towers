import { GameDimensions } from  '../../GameDimensions';
import { Unit } from '../units/Unit';
import { UnitFactory, UnitName } from '../units/UnitFactory';
import { UnitStorage } from '../units/UnitsStorage';

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
        var units = this.randomTrees(200, 2000, 2000);
        units = units.concat(this.randomStones(200, 2000, 2000));
        return this.randomAllUnits(2000, 2000);
    }

    randomAllUnits(width: number, height: number): Unit[] {
        let grid: any = {};
        let rand = -56;
        let sParam = 15;
        for(let i = 0 ; i < width ; i+=GameDimensions.grid.tileSize ) {
            grid[i]={};
            for(let j = 0 ; j < height ; j+=GameDimensions.grid.tileSize ) {
                grid[i][j] = Math.sin((i/sParam+rand)*(-j/sParam+rand));
            }
        }

        let gridWithUnits: any = {}

        let units: Unit[] = [];

        

        for(let i = 0 ; i < width ; i+= GameDimensions.grid.tileSize ) {
            if(!gridWithUnits[i]){
                gridWithUnits[i] = {};
            }

            if(!gridWithUnits[i+GameDimensions.grid.tileSize]){
                gridWithUnits[i+GameDimensions.grid.tileSize] = {};
            }
            
            for(let j = 0 ; j < height; j+=GameDimensions.grid.tileSize ) {
                if(!gridWithUnits[i][j]) {
                    
                    
                    if(grid[i][j] < 0.6) {
                        gridWithUnits[i][j] = -1;
                    }
                    else if(grid[i][j] < 0.99) {
                        gridWithUnits[i][j] = 1;
                        units.push(this.unitFactory.of(UnitName.TREE, i, j, null))
                    }
                    else if(grid[i][j] < 1) {
                        gridWithUnits[i][j] = 2;
                        gridWithUnits[i+GameDimensions.grid.tileSize][j] = 2;
                        gridWithUnits[i+GameDimensions.grid.tileSize][j+GameDimensions.grid.tileSize] = 2;
                        gridWithUnits[i][j+GameDimensions.grid.tileSize] = 2;
                        units.push(this.unitFactory.of(UnitName.STONES,i, j, null))
                    }
                }
            }
        }

        return units;
    }

    randomTrees(n: number, width: number, heighth: number) {
        var treesPositions = [];
    
        for(let i = 0 ; i < n ; i ++) {
            let x = getRandomPosition(width);
            let y = getRandomPosition(heighth);
            treesPositions.push({x: x, y: y});
        }
        return treesPositions.map(p => this.unitFactory.of(UnitName.TREE,p.x, p.y, null));
    }

    randomStones(n: number, width: number, heighth: number) {
        var stonesPositions = [];
    
        for(let i = 0 ; i < n ; i ++) {
            let x = getRandomPosition(width);
            let y = getRandomPosition(heighth);
            stonesPositions.push({x: x, y: y});
        }
        
        return stonesPositions.map(p => this.unitFactory.of(UnitName.STONES,p.x, p.y, null));
    }

}

function getRandomPosition(max: number) {
    return ((Math.floor(Math.random() * max/GameDimensions.grid.tileSize))*GameDimensions.grid.tileSize)+GameDimensions.grid.tileSize
}

export { MapBoard };