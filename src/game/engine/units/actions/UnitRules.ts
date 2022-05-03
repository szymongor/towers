import { GameDimensions } from "../../../GameDimensions";
import { GameEngine } from "../../GameEngine";
import { TerrainType } from "../../map/MapBoard";
import { Unit } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitFilter, UnitStorage } from "../UnitsStorage";

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
    var s = GameDimensions.grid.tileSize -0.01;
    if(
        (unit.x <= x && unit.x + unit.size*s > x)
        ||
        (unit.x <= x + size*s && unit.x + unit.size*s > x + size*s)
        ||
        (unit.x >= x  && unit.x + unit.size*s < x + size*s)
        ||
        (unit.x <= x  && unit.x + unit.size*s > x + size*s)
    ) {
        if(
            (unit.y <= y && unit.y + unit.size*s > y)
            ||
            (unit.y <= y + size*s && unit.y + unit.size*s > y + size*s)
            ||
            (unit.y >= y  && unit.y + unit.size*s < y + size*s)
            ||
            (unit.y <= y  && unit.y + unit.size*s > y + size*s)
        ) {
            
            return true;
        }
    }
    return false;
}

export { CanPlaceRule, canPlaceStandard, canPlaceMine, unitIntersect }