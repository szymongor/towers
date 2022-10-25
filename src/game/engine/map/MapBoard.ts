import { GameDimensions } from  '../../GameDimensions';
import { GameEngine } from '../GameEngine';
import { Unit } from '../units/Unit';
import { UnitFactory, UnitName } from '../units/UnitFactory';
import { UnitStorage } from '../units/unit_storage/UnitsStorage';

const TILE_SIZE = GameDimensions.grid.tileSize;

class MapBoard {

    height: number;
    width: number;
    unitFactory: UnitFactory;
    unitStorage: UnitStorage;
    terrain: Terrain;

    constructor(height: number, width: number, gameEngine: GameEngine, terrain: Terrain) {
        this.height = height;
        this.width = width;
        this.unitFactory = gameEngine.unitFactory;
        this.unitStorage = gameEngine.unitStorage;
        this.terrain = terrain;
    }

}

type Terrain = {
    type(x: number, y: number): TerrainType, 
}

enum TerrainType {
    //TODO Why default?
    DEFAULT = "DEFAULT",
    GRASS = "GRASS",
    WATER = "WATER"
}


export { MapBoard, Terrain, TerrainType };