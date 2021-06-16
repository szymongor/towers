import { Player } from "../Player";
import { Unit, UnitTypes } from "./Unit";


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

    getUnits(owner?: Player, type?: UnitTypes ): Unit[] {
        let units = this.units;
        if(owner) {
            units = units.filter((unit) => unit.player == owner);
        }

        if(type) {
            units = units.filter((unit) => unit.type = type);
        }
        return units;
    }

}

export { UnitStorage }