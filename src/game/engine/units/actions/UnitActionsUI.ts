import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Tile } from "../../map/PlayerVision";
import { Unit } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitTask, UnitTaskNames } from "../UnitTask";

interface UnitActionUIProvider {
    (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry): UnitActionUI
}

interface UnitActionParams {
    target: Tile
}

enum UiActionType {
    ORDERING = "ORDERING",
    TARGETING = "TARGETING"

}

interface UnitActionUI {
    type: UiActionType;
    actionIcon: string;
    canExecute: () => boolean;
    execute: (params?: UnitActionParams) => void;
}

const soldierProductionProvider : UnitActionUIProvider = function(unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry) {
    return {
        type: UiActionType.ORDERING,
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
    let constructionTime = gameEngine.unitFactory.unitConfig[UnitName.SOLDIER].constructionTime;
    return new UnitTask(UnitTaskNames.PRODUCTION, constructionTime, done);
}



const changePositionProvider : UnitActionUIProvider = function(unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry) {
    return {
        type: UiActionType.TARGETING,
        actionIcon: "change_position_icon",
        canExecute: () => true,
        execute: (props) => {
            console.log("Change position");
            unit.addUnitTask(changePositionTask(unit, gameEngine,eventRegistry, props.target))
        }
    }
}

const changePositionTask = (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry, target: Tile ) => {
    let done = () => {
        unit.x = target.x,
        unit.y = target.y
        unit.updateTexture();
    }

    let callBack = () => {
    }

    let constructionTime = 3;
    return new UnitTask(UnitTaskNames.CHANGE_POSITION, constructionTime, done, callBack);
}

export { UnitActionUI, UnitActionUIProvider, UiActionType, soldierProductionProvider, changePositionProvider }