import { UiActionType, UnitActionUI } from "../../../engine/units/actions/UnitActionsUI";
import { Unit } from "../../../engine/units/Unit";
import { UIDimensions } from "../../../GameDimensions";
import { UIElement, UiScene } from "../UiScene";
import { TargetingActionEvent, UiSceneEvents } from "../UiSceneEvents";
import { Coord } from "../utils/UIGrid";

const getSelectedUnitsActionsUIElement = (scene: UiScene, selectedUnits: Unit[]): UIElement => {
    let actionsToDraw = getActionsForUnits(selectedUnits);

    let icons = actionsToDraw.map((actionParams) => 
        getActionUIImage(scene, actionParams[0], actionParams[1], actionParams[2])
    );

    let iconsUIElement = {
        width: 0,
        heigth: 150,
        show: () => {
            icons.forEach(i => i.setVisible(true));
        },
        hide: () => {
            icons.forEach(i => i.setVisible(false));
        },
        update: () => {}
    }

    return iconsUIElement;
}

const getActionsForUnits = (units: Unit[]) : [UnitActionUI, Unit[], Coord][] => {
    let actions = new Map<string, Unit[]>();

    let buttonGrid: Coord[] = UIDimensions.buttonGrid;
    let btnIndex = 0;
    
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

    let actionTuples: [UnitActionUI, Unit[], Coord][] = [];

    actions.forEach((selectedUnitsWithAction: Unit[], actionName: string) => {
        if(selectedUnitsWithAction.length == units.length) {
            let action =  selectedUnitsWithAction[0].actionUI.find((action => action.actionName == actionName));
            actionTuples.push([action, units, buttonGrid[btnIndex++]]);
        }
    });

    return actionTuples;
}


const getActionUIImage = (scene: UiScene, actionUI: UnitActionUI, selectedUnits: Unit[], coord: Coord): Phaser.GameObjects.Image => {
    switch(actionUI.type) {
        case UiActionType.ORDERING:
            return createOrderingButton(scene, actionUI, coord);
        case UiActionType.TARGETING: 
            return createTargetingButton(scene, actionUI, selectedUnits, coord);
    }
}

const createOrderingButton = (scene: UiScene, actionUI: UnitActionUI, coord: Coord ): Phaser.GameObjects.Image => {
    let icon = scene.add.image(coord[0], coord[1], actionUI.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,actionUI.execute);
    return icon;
}

const createTargetingButton = (scene: UiScene, actionUI: UnitActionUI, units: Unit[], coord: Coord ): Phaser.GameObjects.Image => {
    let icon = scene.add.image(coord[0], coord[1], actionUI.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,createTargetingCursorFollow(scene, actionUI, units));
    return icon;
}

const createTargetingCursorFollow = (scene: UiScene, actionUI: UnitActionUI, units: Unit[] ) => {
    return () => {
        let eventData: TargetingActionEvent = {action: actionUI, unitsSource: units};
        scene.events.emit(UiSceneEvents.TARGETING_ACTION, eventData);
    }
}

export { getSelectedUnitsActionsUIElement, getActionsForUnits }