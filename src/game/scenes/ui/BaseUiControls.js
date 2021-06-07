import Phaser from 'phaser';
import { UnitFactory } from '../../engine/UnitFactory';
import { UiSceneEvents } from './UiSceneEvents';

const createBaseUIButtons = function(scene) {
    var buttonTower = scene.add.image(scene.originX, scene.originY+50, 'tower')
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();

    var buttonSawmill = scene.add.image(scene.originX+50, scene.originY+50, 'sawmill')
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();

    buttonTower.on(Phaser.Input.Events.POINTER_DOWN, towerButtonClick(buttonTower, scene));
    buttonSawmill.on(Phaser.Input.Events.POINTER_DOWN, sawmillButtonClick(buttonSawmill, scene));

    scene.baseUIButtons.push(buttonTower, buttonSawmill);
}

const towerButtonClick = function(button, scene) {
    return () => {
        scene.clearButtonsTint(scene);
        if(scene.gameEngine.canBuild(UnitFactory.Units.TOWER)) {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiSceneEvents.BUILDBUILDING,{building: UnitFactory.Units.TOWER});
        } else {
            scene.events.emit(UiSceneEvents.DESELECT_BUILDING,{});
        }
    }
}

const sawmillButtonClick = function(button, scene) {
    return () => {
        scene.clearButtonsTint(scene);
        if(scene.gameEngine.canBuild(UnitFactory.Units.SAWMILL)) {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiSceneEvents.BUILDBUILDING,{building: UnitFactory.Units.SAWMILL});
        } else {
            scene.events.emit(UiSceneEvents.DESELECT_BUILDING,{});
        }
    }
}

export { createBaseUIButtons };