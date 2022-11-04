
import { GameDimensions } from "../GameDimensions"

const TILE_SIZE = GameDimensions.grid.tileSize;

const tileSizeFloor = function(n: number) : number {
    return Math.floor(n/TILE_SIZE)*TILE_SIZE;
}

export { tileSizeFloor }