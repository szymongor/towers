import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { ResourceName } from "../../Resources";
import { Unit, UnitTypes, Damage } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitFilter } from "../UnitsStorage";
import { UnitTask, UnitTaskNames } from "../UnitTask";



interface ResourceCollectedEventData {
    collector: Unit;
    source: Unit;
    resource: ResourceName;
}

interface DamageDealtEventData {
    target: Unit;
    source: Unit;
    time: number;
}

interface UnitDestroyedEventData {
    unit: Unit;
}

interface UnitAction {
    (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit): void
}


export { UnitAction , ResourceCollectedEventData, DamageDealtEventData, UnitDestroyedEventData}