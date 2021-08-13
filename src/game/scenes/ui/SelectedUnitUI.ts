import { Unit } from "../../engine/units/Unit";
import { GameDimensions } from "../../GameDimensions";
import { selectUnit } from "../main/UnitsControls";
import { Bar } from "../utils/bars";
import { UiScene } from "./UiScene";

class SelectedUnitUI {
    unit: Unit;
    selectedUnitInfo: Phaser.GameObjects.Text;
    hpBar?: Bar;

    constructor(unit: Unit) {
        this.unit = unit;
    }

    hide() {
        this.selectedUnitInfo.visible = false;
        this.hpBar.destroy();
    }

    update() {
        if(this.unit) {
            this.selectedUnitInfo.text = getUnitInfoText(this.unit);
            let progress = this.unit.hp.value/ this.unit.hp.max;
            this.hpBar.updateProgress(progress);
        }
    }

}

const showSelectedUnitUI = (scene: UiScene, selectedUnit: Unit) => {
    if(scene.selectedUnitUI) {
        scene.selectedUnitUI.hide()
    }
    let selectedUnitUI = new SelectedUnitUI(selectedUnit);
    scene.selectedUnitUI = selectedUnitUI;


    let infoTxt = scene.add.text(scene.originX+2, scene.originY+80, 
        '', { font: '30px Arial', color: '#FFFFFF' });

    selectedUnitUI.selectedUnitInfo = infoTxt;

    selectedUnitUI.hpBar = createHPBar(scene, selectedUnit, selectedUnitUI);

    infoTxt.text = getUnitInfoText(selectedUnit);
    drawUnitActionUI(scene, selectedUnit);

}

const getUnitInfoText = (unit: Unit): string => {
    let unitInfo = unit.getUnitInfo();
    let info = unitInfo.name + '\n';
    info += "HP: "+ unitInfo.hp.value +"/"+unitInfo.hp.max + '\n';
    info += "Player: " + unitInfo.player.id + '\n'
    info += "Coords: " + unitInfo.x + "," + unitInfo.y;
    return info;
}

const drawUnitActionUI = (scene: UiScene, unit: Unit): void => {
    for(let i = 0 ; i < unit.actionUI.length ; i++) {
        let actionUI = unit.actionUI[i];
        let icon = scene.add.image(scene.originX, scene.originActionUIY, actionUI.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,actionUI.execute);
        scene.uiButtons.push(icon);
    }
}

const createHPBar = (scene: UiScene, selectedUnit: Unit, selectedUnitUI: SelectedUnitUI ): Bar => {
    let space = 50;
    let progress = selectedUnit.hp.value/ selectedUnit.hp.max;
    let hpBar = new Bar(scene, scene.originX+space/2, scene.originY+50, progress,
          GameDimensions.uiSceneWidth-space, 10, 0xff0000);
    return hpBar;
}

export { showSelectedUnitUI, SelectedUnitUI }