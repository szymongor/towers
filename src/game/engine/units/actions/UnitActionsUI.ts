import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Unit } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitTask, UnitTaskNames } from "../UnitTask";

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
            unit.addUnitTask(soldierProductionTask(unit, gameEngine,eventRegistry))
        }
    }
}

const soldierProductionTask = (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry ) => {
    let done = () => {
        let soldier = gameEngine.unitFactory.of(UnitName.SOLDIER, unit.x, unit.y, eventRegistry, gameEngine.getPlayer());
        gameEngine.unitStorage.addUnit(soldier);

        // TODO BUILDING_PLACED event_data type
        // TODO UNIT_PRODUCED event and event_data types
        let data : any = {
            unitPrototype: soldier
        }
        let event = new GameEvent(EventChannels.BUILDING_PLACED, data)
        eventRegistry.emit(event);

    }
    return new UnitTask(UnitTaskNames.PRODUCTION, 3, done);
}

export { UnitActionUI, UnitActionUIProvider, soldierProductionProvider }