import { Player } from "../Player";
import { Unit, UnitTypes } from "./Unit";
import { UnitName } from "./UnitFactory";

interface UnitFilter {
    owner?: Player;
    player_ne?: Player;
    type?: UnitTypes;
    unitName?: UnitName;
    range?: RangeFilter;
}

interface RangeFilter {
    unit: Unit;
    range: number;
}

class UnitStorage {

    units: Unit[];

    constructor() {
        this.units = [];
    }

    addUnit(unit: Unit){
        this.units.push(unit);
    }

    addUnits(units: Unit[]){
        this.units = this.units.concat(units);
    }

    destroyUnit(unit: Unit) {
        // let indexOf = this.units.indexOf(unit);
        // if(indexOf != -1) {
        //     this.units.splice(indexOf, 1);
        // }
        this.units = this.units.filter(u => u != unit);
        unit.destroy();
    }

    getUnits(unitFilter: UnitFilter): Unit[] {
        let units = this.units;
        
        
        if(unitFilter.owner) {
            units = units.filter((unit) => unit.player == unitFilter.owner);
        }

        if(unitFilter.player_ne) {
            units = units.filter((unit) => (unit.player != unitFilter.player_ne));
        }

        if(unitFilter.type) {
            units = units.filter((unit) => unit.type == unitFilter.type);
        }

        if(unitFilter.unitName) {
            units = units.filter((unit) => unit.unitName == unitFilter.unitName);
        }

        if(unitFilter.range) {
            let unit = unitFilter.range.unit;
            let range = unitFilter.range.range;
            units = units.filter((u) => unit.distanceToUnit(u) <= range)
        }
        
        return units;
    }

    getUnitsInRange(unitFilter: UnitFilter, unit: Unit, range: Number): Unit[] {
        let units = this.getUnits(unitFilter);
        units = units.filter((u) => unit.distanceToUnit(u) <= range);
        
        return units;
    }

    getNearestUnit(unitFilter: UnitFilter, unit: Unit): Unit  {
        let units = this.getUnits(unitFilter);
        let closestUnit;
        let lastDistance = Number.MAX_SAFE_INTEGER;
        
        units.forEach((u)=> {
            let distance = unit.distanceToUnit(u);
            if(distance < lastDistance) {
                closestUnit = u;
                lastDistance = distance;
                
            }
        });

        return closestUnit;
    }

}

export { UnitStorage, UnitFilter }