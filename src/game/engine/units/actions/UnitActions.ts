import { EventRegistry } from "../../events/EventsRegistry";
import { GameEngine } from "../../GameEngine";
import { ResourceName } from "../../Resources";
import { Unit} from "../Unit";



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