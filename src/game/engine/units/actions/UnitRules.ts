import { GameDimensions } from "../../../GameDimensions";
import { selectUnitEmitEvent } from "../../../scenes/main/UnitsControls";
import { GameEngine } from "../../GameEngine";
import { TerrainType } from "../../map/MapBoard";
import { Unit } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitFilter } from "../unit_storage/UnitFilter";

interface CanPlaceRule {
    (unit: Unit, gameEngine: GameEngine): boolean
}

const canPlaceStandard = (unit: Unit, gameEngine: GameEngine): boolean => {
    let isSpaceNotOccupied = isSpaceNotOccupiedByOtherUnit(unit, gameEngine);
    if(isSpaceNotOccupied) {
        return isSpaceSuitableForConstruction(unit, gameEngine);
    } else {
        return isSpaceNotOccupied;
    }
}

const isSpaceNotOccupiedByOtherUnit = (unit: Unit, gameEngine: GameEngine): boolean => {
    let unitStorage = gameEngine.unitStorage;
    let units = unitStorage.getUnits({});
    return 0 == units.filter(u=> unitIntersect(u, unit.x, unit.y, unit.size)).length;
}

const isSpaceSuitableForConstruction = (unit: Unit, gameEngine: GameEngine): boolean => {
    let map = gameEngine.mapBoard;
    let isTileSuitableForConstruction = (t: TerrainType) => t != TerrainType.WATER;
    return unit.getUnitTiles()
    .filter(v => !isTileSuitableForConstruction(map.terrain.type(v.x, v.y))).length == 0;
}

const canPlaceMine = (unit: Unit, gameEngine: GameEngine): boolean => {
    let unitStorage = gameEngine.unitStorage;
    let filter: UnitFilter = {
        unitName: UnitName.STONES,
        range: {
            unit: unit,
            range: GameDimensions.grid.tileSize-1
        }
    }
    let stones = unitStorage.getUnits(filter);

    return 1 == stones.length; 
}

const unitIntersect = (unit: Unit, x: number, y: number, size: number) => {
    var tileSize = GameDimensions.grid.tileSize;
    let r1 = {
        left: unit.x,
        right: unit.x + unit.size*tileSize-1,
        bottom: unit.y,
        top: unit.y + unit.size*tileSize-1
    }

    let r2 = {
        left: x,
        right: x + size*tileSize-1,
        bottom: y,
        top: y + size*tileSize-1
    }

    let sortedXRect = r1.left < r2.left ? {min: r1, max: r2} : {min: r2, max: r1}

    let xOverlap = sortedXRect.max.left <= sortedXRect.min.right;

    if(xOverlap) {
        let sortedYRect = r1.bottom < r2.bottom ? {min: r1, max: r2} : {min: r2, max: r1}
        let yOverlap = sortedYRect.max.bottom <= sortedYRect.min.top;
        return yOverlap;
    } else {
        return xOverlap;
    }
}

export { CanPlaceRule, canPlaceStandard, canPlaceMine, unitIntersect }