import { UnitName } from "../../engine/units/UnitFactory";

enum UiSceneEvents {
    BUILDBUILDING = "BUILDBUILDING",
    DESELECT_BUILDING = "DESELECT_BUILDING"
}

interface UiSetBuildingModeEvent {
    building: UnitName
}

export { UiSceneEvents, UiSetBuildingModeEvent };