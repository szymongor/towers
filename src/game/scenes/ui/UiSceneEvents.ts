import { UnitName } from "../../engine/UnitFactory";

enum UiSceneEvents {
    BUILDBUILDING = "BUILDBUILDING",
    DESELECT_BUILDING = "DESELECT_BUILDING"
}

interface UiSetBuildingModeEvent {
    building: UnitName
}

export { UiSceneEvents, UiSetBuildingModeEvent };