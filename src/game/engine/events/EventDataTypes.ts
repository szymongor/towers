import { ResourceName } from "../Resources";
import { Unit } from "../units/Unit";

type UnitCreatedEventData =  {
    unit: Unit
}

type UnitDestroyedEventData =  {
    unit: Unit
}

type DamageDealtEventData = {
    target: Unit;
    source: Unit;
    time: number;
}

interface ResourceCollectedEventData {
    collector: Unit;
    source: Unit;
    resource: ResourceName;
}

export { UnitCreatedEventData, UnitDestroyedEventData, DamageDealtEventData , ResourceCollectedEventData}