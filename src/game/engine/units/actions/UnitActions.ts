import { EventRegistry } from "../../events/EventsRegistry";
import { GameEngine } from "../../GameEngine";
import { Unit} from "../Unit";


interface UnitAction {
    (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit): void
}


export { UnitAction }