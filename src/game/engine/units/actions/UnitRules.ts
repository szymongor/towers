import { GameDimensions } from "../../../GameDimensions";
import { Unit } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitFilter, UnitStorage } from "../UnitsStorage";

interface CanPlaceRule {
    (unit: Unit, unitStorage: UnitStorage): boolean
}

const canPlaceStandard = (unit: Unit, unitStorage: UnitStorage): boolean => {
    let units = unitStorage.getUnits({});
    return 0 == units.filter(u=> unitIntersect(u, unit.x, unit.y, unit.size)).length; 
}

const canPlaceMine = (unit: Unit, unitStorage: UnitStorage): boolean => {
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

export { CanPlaceRule, canPlaceStandard, canPlaceMine }