import { EventChannels } from "../../../engine/events/EventsRegistry";
import { Scenes } from "../../../GameDimensions";
import { UiSceneEvents } from "../../ui/UiSceneEvents";
import { MainCamera } from "../MainCamera";
import { onChangePositionAnimation, onTargetingActionProvider } from "./MoveUnitOrder";
import { onBuildBuilding, onDeselectBuilding } from "./NewBuildingOrder";

const registerOuterUIEvents = function(scene: MainCamera): void {
    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.BUILDBUILDING, onBuildBuilding(scene));

    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.DESELECT_BUILDING, onDeselectBuilding(scene));

    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.TARGETING_ACTION, onTargetingActionProvider(scene));

    scene.gameEngine.events.subscribe(EventChannels.CHANGE_POSITION, {call: onChangePositionAnimation(scene)})


}

export { registerOuterUIEvents }