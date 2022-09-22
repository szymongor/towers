import { UnitCommand, UnitCommandType } from "../../../engine/units/actions/UnitCommands";
import { Unit } from "../../../engine/units/Unit";
import { UIDimensions } from "../../../GameDimensions";
import { UIElement, UiScene } from "../UiScene";
import { TargetingActionEvent, UiSceneEvents } from "../UiSceneEvents";
import { Coord } from "../utils/UIGrid";

const getSelectedUnitsActionsUIElement = (scene: UiScene, selectedUnits: Unit[]): UIElement => {
    let actionsToDraw = getCommandsForUnits(selectedUnits);

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
        setX: (x: number) => {
            icons.forEach(icon => {
                icon.setX(x);
            })
        },
        setY: (y: number) => {
            icons.forEach(icon => {
                icon.setY(y);
            })
        },
        update: () => {}
    }

    return iconsUIElement;
}

const getCommandsForUnits = (units: Unit[]) : [UnitCommand, Unit[], Coord][] => {
    let command = new Map<string, Unit[]>();

    let buttonGrid: Coord[] = UIDimensions.buttonGrid;
    let btnIndex = 0;
    
    units.forEach(unit => {
        unit.commands.forEach(unitCommand => {
            if(command.has(unitCommand.commandName)) {
                let unitsWithAction = command.get(unitCommand.commandName);
                unitsWithAction.push(unit);
                command.set(unitCommand.commandName, unitsWithAction);
            } else {
                command.set(unitCommand.commandName, [unit]);
            }
        })
    });

    let actionTuples: [UnitCommand, Unit[], Coord][] = [];

    command.forEach((selectedUnitsWithAction: Unit[], commandName: string) => {
        if(selectedUnitsWithAction.length == units.length) {
            let action =  selectedUnitsWithAction[0].commands.find((action => action.commandName == commandName));
            actionTuples.push([action, units, buttonGrid[btnIndex++]]);
        }
    });

    return actionTuples;
}


const getActionUIImage = (scene: UiScene, unitCommand: UnitCommand, selectedUnits: Unit[], coord: Coord): Phaser.GameObjects.Image => {
    switch(unitCommand.type) {
        case UnitCommandType.ORDERING:
            return createOrderingButton(scene, unitCommand, coord);
        case UnitCommandType.TARGETING: 
            return createTargetingButton(scene, unitCommand, selectedUnits, coord);
    }
}

const createOrderingButton = (scene: UiScene, unitCommand: UnitCommand, coord: Coord ): Phaser.GameObjects.Image => {
    let icon = scene.add.image(coord[0], coord[1], unitCommand.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,unitCommand.executeCommand);
    return icon;
}

const createTargetingButton = (scene: UiScene, unitCommand: UnitCommand, units: Unit[], coord: Coord ): Phaser.GameObjects.Image => {
    let icon = scene.add.image(coord[0], coord[1], unitCommand.actionIcon);
        icon.setOrigin(0);
        icon.setScale(0.25);
        icon.setInteractive();
        icon.on(Phaser.Input.Events.POINTER_DOWN,createTargetingCursorFollow(scene, unitCommand, units));
    return icon;
}

const createTargetingCursorFollow = (scene: UiScene, unitCommand: UnitCommand, units: Unit[] ) => {
    return () => {
        let eventData: TargetingActionEvent = {command: unitCommand, unitsSource: units};
        scene.events.emit(UiSceneEvents.TARGETING_ACTION, eventData);
    }
}

export { getSelectedUnitsActionsUIElement, getCommandsForUnits as getActionsForUnits }