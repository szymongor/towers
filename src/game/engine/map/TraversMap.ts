import { GameDimensions } from "../../GameDimensions";
import { unitIntersect } from "../units/actions/UnitRules";
import { Unit, UnitTypes } from "../units/Unit";
import { UnitFilter } from "../units/UnitsStorage";
import { MapBoard, TerrainType } from "./MapBoard";
import { Vector } from "./PlayerVision";

const TILE_SIZE = GameDimensions.grid.tileSize;
const MAX_UNIT_SIZE = 5;

class TraversMap {

    mapBoard: MapBoard
    traversableGrid: Map<number, Map<number, number>>

    constructor(mapBoard: MapBoard) {
        this.mapBoard = mapBoard;
        this.initTraversableGrid();
        this.calculateTraversableGrid(0, 0, mapBoard.width, mapBoard.height);
    }

    getTraversableGridValue(vector: Vector): number {
        return this.traversableGrid.get(vector.x).get(vector.y);
    }

    initTraversableGrid() {
        this.traversableGrid = new Map();
        for(let i = 0; i < this.mapBoard.width ; i += TILE_SIZE) {
            this.traversableGrid.set(i, new Map())
            for(let j = 0; j < this.mapBoard.height ; j += TILE_SIZE) {
                this.traversableGrid.get(i).set(j, 0)
            }
        }
    }

    calculateTraversableGrid(x0: number, y0: number, width: number, height: number) {

        for(let i = x0; i < width ; i += TILE_SIZE) {
            for(let j = y0; j < height ; j += TILE_SIZE) {
                let vector = new Vector(i, j);
                this.calculateTraversableForUnits(vector, MAX_UNIT_SIZE);
            }
        }

    }

    calculateTraversableForUnits(vector: Vector, maxSize: number) {
        let traversableForSize = 0;
        for(let i = 1; i < maxSize; i++) {
            let borderTiles = sideBorderVectors[i].map(border => border.add(vector));
            
            let isTraversable = borderTiles.every(tile => this.isTileTraversable(tile));

            if(isTraversable) {
                traversableForSize = i
            } else {
                break;
            }
        }

        this.traversableGrid.get(vector.x).set(vector.y, traversableForSize);
    }

    isTileTraversable(vector: Vector): boolean {
        let isTerrainTraversable = this.mapBoard.terrain.type(vector.x, vector.y) == TerrainType.GRASS;

        let units = this.mapBoard.unitStorage.getUnits({});

        let isOccupiedByOtherUnit = units.every(u => !unitIntersect(u, vector.x, vector.y, 1));

        return isTerrainTraversable && isOccupiedByOtherUnit;
    }

    isTileTraversableForUnit(tile: Vector, unit: Unit) {
        return this.getTraversableGridValue(tile) >= unit.size;
    }
}

const getSideBorderVectors = (size: number): Vector[] => {
    let sidesBorder = [];

    let borderLayer = size -1;

    for(let i = 0; i < borderLayer ; i ++ ) {
        sidesBorder.push(new Vector(borderLayer*TILE_SIZE, i*TILE_SIZE));
        sidesBorder.push(new Vector(i*TILE_SIZE, borderLayer*TILE_SIZE));
    }

    sidesBorder.push(new Vector(borderLayer*TILE_SIZE, borderLayer*TILE_SIZE));

    return sidesBorder;
}

const sideBorderVectors = Array.from(Array(MAX_UNIT_SIZE).keys()).map(i => getSideBorderVectors(i));

export { TraversMap }