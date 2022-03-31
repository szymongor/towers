import { Unit } from "../../../engine/units/Unit";
import { UIElement, UiScene } from "../UiScene";
import { getSelectedUnitsActionsUIElement } from "./SelectedUnitsActions";
import { getHpBarUiElement } from "./SelectedUnitsHpBar";
import { getUnitInfoUiElement } from "./SelectedUnitsInfo";

const getSelectedUnitsUIElements = (scene: UiScene, selectedUnits: Unit[]): UIElement[]  => {
    var uiElements: UIElement[] = [];
    uiElements.push(getUnitInfoUiElement(scene, selectedUnits));
    uiElements.push(getHpBarUiElement(scene, selectedUnits));
    uiElements.push(getSelectedUnitsActionsUIElement(scene, selectedUnits))
    return uiElements;
}

export { getSelectedUnitsUIElements }