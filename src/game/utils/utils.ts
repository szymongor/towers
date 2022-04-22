import { Vector } from "matter";
import { GameDimensions } from "../GameDimensions"

const TILE_SIZE = GameDimensions.grid.tileSize;

const tileSizeFloor = function(n: number) : number {
    return Math.floor(n/TILE_SIZE)*TILE_SIZE;
}

const vectorDist = (v1: Vector, v2: Vector): number => {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
}

export { tileSizeFloor, vectorDist }