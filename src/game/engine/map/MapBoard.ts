import { GameDimensions } from  '../../GameDimensions';
import { GameEngine } from '../GameEngine';
import { Unit } from '../units/Unit';
import { UnitFactory, UnitName } from '../units/UnitFactory';
import { UnitStorage } from '../units/UnitsStorage';

const TILE_SIZE = GameDimensions.grid.tileSize;

class MapBoard {

    height: number;
    width: number;
    unitFactory: UnitFactory;
    unitStorage: UnitStorage;

    constructor(height: number, width: number, gameEngine: GameEngine) {
        this.height = height;
        this.width = width;
        this.unitFactory = gameEngine.unitFactory;
        this.unitStorage = gameEngine.unitStorage;
        // this.unitStorage.addUnits(this.createUnits());
    }
    
    createUnits() {
        var units = this.randomTrees(200, 2000, 2000);
        units = units.concat(this.randomStones(200, 2000, 2000));
        return this.randomAllUnits(2000, 2000);
    }

    randomAllUnits(width: number, height: number): Unit[] {
        let grid: any = {};
        let rand = -506;
        let sParam = 30;
        let TILE_SPAN = GameDimensions.grid.tileSize;
        for(let i = 0 ; i < width ; i+=TILE_SPAN ) {
            grid[i]={};
            for(let j = 0 ; j < height ; j+=TILE_SPAN ) {
                grid[i][j] = Math.sin((i/sParam+rand)*(-j/sParam+rand));
            }
        }

        let gridWithUnits: any = {}

        let units: Unit[] = [];

        

        for(let i = 0 ; i < width ; i+= TILE_SPAN ) {
            if(!gridWithUnits[i]){
                gridWithUnits[i] = {};
            }
            for(let j = 0 ; j < height; j+=TILE_SPAN ) {
                if(!gridWithUnits[i][j]) {
                    
                    if(grid[i][j] < 0.8) {
                        gridWithUnits[i][j] = -1;
                    }
                    else if(grid[i][j] < 0.99) {
                        let unit = this.unitFactory.of(UnitName.TREE, i, j, null);
                        if(this.checkIfCanPlaceUnit(gridWithUnits, unit)) {
                            for(let ui = i ; ui <= i+unit.size*TILE_SPAN  ; ui +=TILE_SPAN ) { 
                                if(!gridWithUnits[ui]){
                                    gridWithUnits[ui] = {};
                                }
                                for(let uj = j ; uj <= j+unit.size*TILE_SPAN  ; uj +=TILE_SPAN ) {
                                    gridWithUnits[ui][uj] = 1;
                                }
                            }
                            units.push(unit);
                        }
                        
                        
                    }
                    else if(grid[i][j] < 1) {
                        let unit = this.unitFactory.of(UnitName.STONES, i, j, null);
                        if(this.checkIfCanPlaceUnit(gridWithUnits, unit)) {
                            for(let ui = i ; ui <= i+unit.size*TILE_SPAN  ; ui +=TILE_SPAN ) {
                                if(!gridWithUnits[ui]){
                                    gridWithUnits[ui] = {};
                                }
                                for(let uj = j ; uj <= j+unit.size*TILE_SPAN  ; uj +=TILE_SPAN ) {
                                    gridWithUnits[ui][uj] = 2;
                                }
                            }
                            units.push(unit);
                        }
                    }
                }
            }
        }

        return units;
    }

    checkIfCanPlaceUnit(gridWithUnits: any, unit: Unit) {
        if(!gridWithUnits[unit.x+TILE_SIZE*unit.size]){
            gridWithUnits[unit.x+TILE_SIZE*unit.size] = {};
        }
        return !gridWithUnits[unit.x][unit.y] 
        && !gridWithUnits[unit.x+TILE_SIZE*unit.size][unit.y]
        && !gridWithUnits[unit.x][unit.y+TILE_SIZE*unit.size] 
        && !gridWithUnits[unit.x+TILE_SIZE*unit.size][unit.y+TILE_SIZE*unit.size]
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