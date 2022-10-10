import { UnitCommand } from "../../engine/units/actions/UnitCommands";
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

//TODO TargetSelectedEvent?
//TODO Domain Event?
interface TargetingActionEvent {
    command: UnitCommand,
    unitsSource: Unit[],
}

export { UiSceneEvents, UiSetBuildingModeEvent, TargetingActionEvent };