import { UnitActionUI } from "../../engine/units/actions/UnitActionsUI";
import { Unit } from "../../engine/units/Unit";
import { UnitName } from "../../engine/units/UnitFactory";

enum UiSceneEvents {
    BUILDBUILDING = "BUILDBUILDING",
    DESELECT_BUILDING = "DESELECT_BUILDING",
    TARGETING_ACTION = "TARGETING_ACTION"
}

interface UiSetBuildingModeEvent {
    building: UnitName
}

interface TargetingActionEvent {
    action: UnitActionUI,
    unitsSource: Unit[],
}

export { UiSceneEvents, UiSetBuildingModeEvent, TargetingActionEvent };