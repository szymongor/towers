import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { Tile } from "../../map/PlayerVision";
import { Player } from "../../Player";
import { Unit, UnitTypes } from "../Unit";
import { UnitName } from "../UnitFactory";

interface UnitFilter {
    owner?: Player;
    player_ne?: Player;
    types?: UnitTypes[];
    unitName?: UnitName;
    range?: RangeFilter;
    boxSelect?: BoxSelect;
}

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

class UnitStorage {

    units: Unit[];
    eventRegistry: EventRegistry;

    constructor(eventRegistry: EventRegistry) {
        this.units = [];
        this.eventRegistry = eventRegistry;

        var subscribeAddUnit = {
            call: this.onUnitCreated()
        }
        this.eventRegistry.subscribe(EventChannels.UNIT_CREATED, subscribeAddUnit);

        var subscribeDestroyUnit = {
            call: this.onUnitDestroyed()
        }
        this.eventRegistry.subscribe(EventChannels.UNIT_DESTROYED, subscribeDestroyUnit);
    }

    onUnitCreated() {
        let us = this;
        return (eventData: GameEvent) => {
            let unit = eventData.data.unitPrototype;
            us.addUnit(unit);
        }
    }

    onUnitDestroyed() {
        let us = this;
        return (eventData: GameEvent) => {
            let unit = eventData.data.unit;
            us.destroyUnit(unit);
        }
    }

    //COMMANDS

    addUnit(unit: Unit){
        this.units.push(unit);
    }

    addUnits(units: Unit[]){
        this.units = this.units.concat(units);
    }

    destroyUnit(unit: Unit) {
        this.units = this.units.filter(u => u != unit);
    }

    //QUERIES

    getUnits(unitFilter: UnitFilter): Unit[] {
        let units = this.units;
        
        
        if(unitFilter.owner) {
            units = units.filter((unit) => unit.player == unitFilter.owner);
        }

        if(unitFilter.player_ne) {
            units = units.filter((unit) => (unit.player != unitFilter.player_ne));
        }

        if(unitFilter.types) {
            units = units.filter((unit) => unitFilter.types.includes(unit.type));
        }

        if(unitFilter.unitName) {
            units = units.filter((unit) => unit.unitName == unitFilter.unitName);
        }

        if(unitFilter.range) {
            let unit = unitFilter.range.unit;
            let range = unitFilter.range.range;
            units = units.filter((u) => unit.distanceToUnit(u) <= range)
        }

        if(unitFilter.boxSelect) {
            units = units.filter((u) => 
            u.x >= unitFilter.boxSelect.leftX && 
            u.x <= unitFilter.boxSelect.rightX &&
            u.y >= unitFilter.boxSelect.leftY &&
            u.y <= unitFilter.boxSelect.rightY)
        }
        
        return units;
    }

    getUnitsInVision(unitFilter: UnitFilter, vision: Set<Tile>) {
        let units = this.getUnits(unitFilter);
        units = units.filter(u => {
            return u.isUnitInVision(vision);
        } );
        
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

    boxSelect(x:number, y: number, dx: number, dy: number, owner: Player): Unit[] {
        let boxSelect = {leftX: 0, leftY: 0, rightX: 0, rightY: 0};
        if(dx < 0) {
            boxSelect.leftX = x+dx;
            boxSelect.rightX = x;
        } else {
            boxSelect.leftX = x;
            boxSelect.rightX = x+dx;
        }

        if(dy < 0) {
            boxSelect.leftY = y+dy;
            boxSelect.rightY = y;
        } else {
            boxSelect.leftY = y;
            boxSelect.rightY = y+dy;
        }

        let unitFilter: UnitFilter = {
            boxSelect: boxSelect,
            types: [UnitTypes.CREATURE],
            owner: owner
            
        }
        return this.getUnits(unitFilter);
    }

}

export { UnitStorage, UnitFilter, BoxSelect }