import { UiActionType, UnitActionUI } from "../../engine/units/actions/UnitActionsUI";
import { Unit } from "../../engine/units/Unit";
import { GameDimensions } from "../../GameDimensions";
import { drawWell } from "../elements/Well";
import { Bar } from "../utils/bars";
import { UiScene } from "./UiScene";
import { TargetingActionEvent, UiSceneEvents } from "./UiSceneEvents";

class SelectedUnitUI {
    units: Unit[];
    selectedUnitInfo: Phaser.GameObjects.BitmapText;
    hpBar?: Bar;

    constructor(units: Unit[]) {
        this.units = units;
    }

    hide() {
        if(this.selectedUnitInfo) {
            this.selectedUnitInfo.visible = false;
        }
        if(this.hpBar) {
            this.hpBar.destroy();
            this.hpBar = undefined;
        }
        this.units = [];
    }

    update() {
        if(this.units.length == 1) {
            this.selectedUnitInfo.text = getUnitInfoText(this.units[0]);
        }

        updateHpBar(this.hpBar, this.units);
    }

}



const showSelectedUnitUI = (scene: UiScene, selectedUnits: Unit[]) => {
    if(scene.selectedUnitUI) {
        scene.selectedUnitUI.hide()
    }
    let selectedUnitUI = new SelectedUnitUI(selectedUnits);
    scene.selectedUnitUI = selectedUnitUI;

    if(selectedUnits.length == 1) {
        let selectedUnit = selectedUnits[0];

        let infoTxt = scene.add.bitmapText(scene.originX+2, scene.originY+80,  GameDimensions.font,
            '', 12);
        selectedUnitUI.selectedUnitInfo = infoTxt;
        infoTxt.text = getUnitInfoText(selectedUnit);
    } else {
        let infoTxt = scene.add.bitmapText(scene.originX+2, scene.originY+80, GameDimensions.font,
            '', 12);
        selectedUnitUI.selectedUnitInfo = infoTxt;
        infoTxt.text = getUnitsInfoText(selectedUnits);
    }
    selectedUnitUI.hpBar = createHPBar(scene, selectedUnits, selectedUnitUI);
    drawUnitActionUI(scene, selectedUnits);
}

const getUnitInfoText = (unit: Unit): string => {
    let unitInfo = unit.getUnitInfo();
    let info = unitInfo.name + '\n';
    info += "HP: "+ unitInfo.hp.value +"/"+unitInfo.hp.max + '\n';
    info += "Player: " + unitInfo.player.id + '\n'
    info += "Coords: " + unitInfo.x + "," + unitInfo.y;
    return info;
}

const getUnitsInfoText = (units: Unit[]): string => {
    let info = 'Units: '+units.length;
    return info;
}

//TODO Default Action for multiple Units
//TODO New File?
const drawUnitActionUI = (scene: UiScene, units: Unit[]): void => {
    let actionsToDraw = getActionsForUnits(units);

    actionsToDraw.forEach((tuple) => {
            drawActionUI(scene, tuple[0], tuple[1]);
    });
}

const drawActionUI = (scene: UiScene, actionUI: UnitActionUI, selectedUnits: Unit[]): void => {
    switch(actionUI.type) {
        case UiActionType.ORDERING:
            createCrderingButton(scene, actionUI);
            break;
        case UiActionType.TARGETING: 
            createTargetingButton(scene, actionUI, selectedUnits);
            break;       
    }
}

const getActionsForUnits = (units: Unit[]) : [UnitActionUI, Unit[]][] => {
    let actions = new Map<string, Unit[]>();
    
    units.forEach(unit => {
        unit.actionUI.forEach(unitAction => {
            if(actions.has(unitAction.actionName)) {
                let unitsWithAction = actions.get(unitAction.actionName);
                unitsWithAction.push(unit);
                actions.set(unitAction.actionName, unitsWithAction);
            } else {
                actions.set(unitAction.actionName, [unit]);
            }
        })
    });

    let actionTuples: [UnitActionUI, Unit[]][] = [];

    actions.forEach((selectedUnitsWithAction: Unit[], actionName: string) => {
        if(selectedUnitsWithAction.length == units.length) {
            let action =  selectedUnitsWithAction[0].actionUI.find((action => action.actionName == actionName));
            actionTuples.push([action, units]);
        }
    });

    return actionTuples;
}

const createCrderingButton = (scene: UiScene, actionUI: UnitActionUI ) => {
    drawWell(scene, scene.originX, scene.originActionUIY, 50, 50);
    let icon = scene.add.image(scene.originX, scene.originActionUIY, actionUI.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,actionUI.execute);
        scene.uiButtons.push(icon);
}

const createTargetingButton = (scene: UiScene, actionUI: UnitActionUI, units: Unit[] )=> {
    let icon = scene.add.image(scene.originX, scene.originActionUIY, actionUI.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,createTargetingCursorFollow(scene, actionUI, units));
        scene.uiButtons.push(icon);
}

const createTargetingCursorFollow = (scene: UiScene, actionUI: UnitActionUI, units: Unit[] ) => {
    return () => {
        let eventData: TargetingActionEvent = {action: actionUI, unitsSource: units};
        scene.events.emit(UiSceneEvents.TARGETING_ACTION, eventData);
    }
}

const getUnitsHpRatio = (units: Unit[]): number => {
    let hpValue = 0;
        let hpMax = 0;
        units.forEach(u => {
            hpValue += u.hp.value;
            hpMax += u.hp.max
        })

        if(hpMax) {
            return hpValue/ hpMax;
        } else {
            return 0;
        }
}

const updateHpBar = (hpBar: Bar, selectedUnits: Unit[]): void => {
    if(hpBar) {
        
        hpBar.updateProgress(getUnitsHpRatio(selectedUnits));
    }
}

const createHPBar = (scene: UiScene, selectedUnits: Unit[], selectedUnitUI: SelectedUnitUI ): Bar => {
    let space = 50;
    let progress = getUnitsHpRatio(selectedUnits);
    let hpBar = new Bar(scene, scene.originX+space/2, scene.originY+50, progress,
          GameDimensions.uiSceneWidth-space, 10, 0xff0000);
    return hpBar;
}

export { showSelectedUnitUI, SelectedUnitUI, getActionsForUnits }