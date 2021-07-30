import { GameDimensions } from "../../GameDimensions";
import { GameEngine } from "../GameEngine";
import { Unit } from "../units/Unit";
import { UnitFilter } from "../units/UnitsStorage";

const TILE_SIZE = GameDimensions.grid.tileSize;

interface Tile {
    x: number,
    y: number
}

interface PlayersVision {
    tiles: Set<Tile>,
    units: Set<Unit>
}

const getPlayerVision = function(gameEngine: GameEngine): PlayersVision {
    let tilesInRange = new Map<String, Tile>();
    
    let visibleUnits = new Set<Unit>();

    let ownersUnitFilter : UnitFilter = {
        owner: gameEngine.getPlayer()
    }

    gameEngine.unitStorage.getUnits(ownersUnitFilter).forEach( u => {
        visibleUnits.add(u);
        let ux = u.getCentre().x;
        let uy = u.getCentre().y;
        let uRange = u.actionRange;

        let topLeftX = ((ux-uRange)%50)*50;
        let topLeftY = ((uy-uRange)%50)*50;
        
        
        for(let i = topLeftX; i < ux + uRange +u.size ; i += TILE_SIZE) {
            for(let j = topLeftY; j < uy + uRange+ u.size ; j += TILE_SIZE) {
                let distX = (ux - i)*(ux - i);
                let distY = (uy - j)*(uy - j);
                if(Math.sqrt(distX+distY) < uRange) {
                    let tile: Tile = {
                        x: i,
                        y: j
                    }
                    tilesInRange.set(i+':'+j, tile);
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
            tilesInRange.set(unitTile.x+':'+unitTile.y, unitTile);
        })
    });

    let playersVison : PlayersVision = {
        tiles: new Set(tilesInRange.values()),
        units: visibleUnits
    }

    return playersVison;
}



export { getPlayerVision, Tile, PlayersVision }