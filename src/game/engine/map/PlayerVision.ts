import { GameDimensions } from "../../GameDimensions";
import { GameEngine } from "../GameEngine";
import { Unit } from "../units/Unit";
import { BoxSelect, UnitFilter } from "../units/unit_storage/UnitsStorage";
import { Terrain, TerrainType } from "./MapBoard";

const TILE_SIZE = GameDimensions.grid.tileSize;

//TODO move to another package
class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    equal(vector: Vector): boolean {
        if(this.x != vector.x) {
            return false
        } else if( this.y != vector.y) {
            return false
        }
        return true;
    }

    static zeroVector(): Vector {
        return new Vector(0, 0);
    }

    boundaryBox(size: number): BoxSelect {
        let searchBox = {
            leftX: this.x - size,
            leftY: this.y - size,
            rightX: this.x + size,
            rightY: this.y + size,
        }
        return searchBox;
    }


}

class Tile extends Vector {
    terrain: TerrainType;
    id: string;

    constructor(x: number, y: number, terrain: TerrainType) {
        super(x, y);
        this.id = Tile.getTileId(x,y);
        this.terrain = terrain;
    }

    static fromVector(vector: Vector, terrain: Terrain) {
        return new Tile(vector.x, vector.y, terrain.type(vector.x, vector.y));
    }

    static getTileId(x: number, y: number): string {
        return x+':'+y;
    }
    
}

interface PlayersVision {
    tiles: Map<string, Tile>,
    units: Set<Unit>
}

const getPlayerVision = function(gameEngine: GameEngine): PlayersVision {
    let tilesInRange = new Map<string, Tile>();
    let visibleUnits = new Set<Unit>();
    let terrain = gameEngine.getMap().terrain;
    let ownersUnitFilter : UnitFilter = {
        owner: gameEngine.getPlayer()
    }
    
    gameEngine.unitStorage.getUnits(ownersUnitFilter).forEach( u => {
        visibleUnits.add(u);
        let ux = u.getCentre().x;
        let uy = u.getCentre().y;
        let uRange = u.actionRange;

        let topLeftX = Math.ceil((ux-uRange)/TILE_SIZE)*TILE_SIZE;
        let topLeftY = Math.ceil((uy-uRange)/TILE_SIZE)*TILE_SIZE;
        let topRightY = ux + uRange +u.size;
        let botomLeftY = uy + uRange+ u.size

        for(let i = topLeftX; i < topRightY; i += TILE_SIZE) {
            for(let j = topLeftY; j <  botomLeftY ; j += TILE_SIZE) {
                let distX = (ux - i-TILE_SIZE/2)*(ux - i-TILE_SIZE/2);
                let distY = (uy - j-TILE_SIZE/2)*(uy - j-TILE_SIZE/2);
                if(Math.sqrt(distX+distY) < uRange) {
                    let tile = new Tile(i,j, gameEngine.getMap().terrain.type(i,j));
                    tilesInRange.set(tile.id, tile);
                }
                    
            }
        }
    });

    let unitFilter : UnitFilter = {
        player_ne : gameEngine.getPlayer()
    }

    let unitsInVison = gameEngine.unitStorage.getUnitsInVision(unitFilter, new Set(tilesInRange.values()));
    unitsInVison.forEach(vu => { 
        visibleUnits.add(vu);
        vu.getUnitTiles().forEach(unitTile => {
            tilesInRange.set(unitTile.x+':'+unitTile.y, Tile.fromVector(unitTile, terrain));
        })
    });

    let playersVison : PlayersVision = {
        tiles: tilesInRange,
        units: visibleUnits
    }

    return playersVison;
}

const isUnitInVision = function(gameEngine: GameEngine, unit: Unit) : boolean {
    let visionTiles = getPlayerVision(gameEngine).tiles;
    let unitTiles = unit.getUnitTiles();
    return unitTiles.every(tile => visionTiles.has(tile.x+":"+tile.y));
}



export { getPlayerVision, Vector, Tile, PlayersVision, isUnitInVision }