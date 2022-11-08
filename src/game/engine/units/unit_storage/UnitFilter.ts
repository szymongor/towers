import { Player } from "../../Player";
import { Unit, UnitTypes } from "../Unit";
import { UnitName } from "../UnitFactory";

interface BoxSelect {
    leftX: number,
    leftY: number,
    rightX: number,
    rightY: number
}

interface RangeFilter {
    unit: Unit;
    range: number;
}

class UnitFilter {
    owner?: Player;
    player_ne?: Player;
    types?: UnitTypes[];
    unitName?: UnitName;
    range?: RangeFilter;
    boxSelect?: BoxSelect;



    static nearestEnemy = (unit: Unit) => {
        let unitFilterBuilder = new UnitFilterBuilder();
        let types = [ UnitTypes.BUILDING, UnitTypes.CREATURE ];
        let range = {
            unit: unit,
            range: unit.actionRange,
        };
        let playerNotEqual = unit.player;

        return unitFilterBuilder.types(types)
        .range(range)
        .playerNotEqual(playerNotEqual)
        .build();
    }
}

class UnitFilterBuilder {
    unitFilter: UnitFilter;

    constructor() {
        this.unitFilter = new UnitFilter();
    }

    owner(owner: Player) {
        this.unitFilter.owner = owner;
        return this;
    }

    playerNotEqual(playerNotEqual: Player) {
        this.unitFilter.player_ne = playerNotEqual;
        return this;
    }

    types(types: UnitTypes[]) {
        this.unitFilter.types = types;
        return this;
    }

    unitName(unitName: UnitName) {
        this.unitFilter.unitName = unitName;
        return this;
    }

    range(range: RangeFilter) {
        this.unitFilter.range = range;
        return this;
    }

    boxSelect(boxSelect: BoxSelect) {
        this.unitFilter.boxSelect = boxSelect;
        return this;
    }

    build() {
        return this.unitFilter;
    }


}

export {UnitFilter, BoxSelect}