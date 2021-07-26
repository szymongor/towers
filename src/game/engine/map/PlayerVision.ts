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
    let tilesInRange : Set<Tile> = new Set();
    
    let visibleUnits = new Set<Unit>();

    let ownersUnitFilter : UnitFilter = {
        owner: gameEngine.getPlayer()
    }

    gameEngine.unitStorage.getUnits(ownersUnitFilter).forEach( u => {
        visibleUnits.add(u);
        let ux = u.getCentre().x;
        let uy = u.getCentre().y;
        let uSize = u.actionRange/2 * TILE_SIZE;
        for(let i = ux - uSize -TILE_SIZE/2; i < ux + uSize +TILE_SIZE/2 ; i += TILE_SIZE) {
            for(let j = uy - uSize-TILE_SIZE/2; j < uy + uSize+TILE_SIZE/2 ; j += TILE_SIZE) {
                let tile: Tile = {
                    x: i,
                    y: j
                }
                tilesInRange.add(tile)
            }
        }
    });

    let unitFilter : UnitFilter = {
        player_ne : gameEngine.getPlayer()
    }

    let unitsInVison = gameEngine.unitStorage.getUnitsInVision(unitFilter, tilesInRange);
    unitsInVison.forEach(vu => { 
        visibleUnits.add(vu);
        vu.getUnitTiles().forEach(unitTile => {
            tilesInRange.add(unitTile);
        })
    });

    let playersVison : PlayersVision = {
        tiles: tilesInRange,
        units: visibleUnits
    }

    return playersVison;
}



export { getPlayerVision, Tile, PlayersVision }