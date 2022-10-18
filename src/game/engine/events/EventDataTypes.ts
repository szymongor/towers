import { Command } from "../commands/Command";
import { ResourceName } from "../Resources";
import { Unit } from "../units/Unit";

type CommandSentEventData = {
    command: Command;
}

type UnitCreatedEventData =  {
    unit: Unit;
}

type UnitDestroyedEventData =  {
    unit: Unit;
}

type DamageDealtEventData = {
    target: Unit;
    source: Unit;
    time: number;
}

type ResourceCollectedEventData = {
    collector: Unit;
    source: Unit;
    resource: ResourceName;
}

export { UnitCreatedEventData, UnitDestroyedEventData, DamageDealtEventData , ResourceCollectedEventData, CommandSentEventData}