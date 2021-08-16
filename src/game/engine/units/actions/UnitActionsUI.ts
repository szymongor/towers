import { EventRegistry } from "../../events/EventsRegistry";
import { GameEngine } from "../../GameEngine";
import { Unit } from "../Unit";

interface UnitActionUIProvider {
    (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry): UnitActionUI
}

interface UnitActionUI {
    actionIcon: string;
    canExecute: () => boolean;
    execute: () => void;
}

const soldierProductionProvider : UnitActionUIProvider = function(unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry) {
    return {
        actionIcon: "soldier_production_icon",
        canExecute: () => true,
        execute: () => {
            console.log("Soldier production");
            // gameEngine.startCreatureProduction() TODO
        }
    }
}

export { UnitActionUI, UnitActionUIProvider, soldierProductionProvider }