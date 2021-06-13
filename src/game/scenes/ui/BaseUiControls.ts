import * as Phaser from 'phaser';
import { UnitName } from '../../engine/UnitFactory';
import { UiSceneEvents } from './UiSceneEvents';
import { UiScene, UIButton } from './UiScene';

const createBaseUIButtons = function(scene: UiScene) {
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

const towerButtonClick = function(button: UIButton, scene: UiScene) {
    return () => {
        scene.clearButtonsTint(scene);
        if(scene.gameEngine.canBuild(UnitName.TOWER, null)) {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiSceneEvents.BUILDBUILDING,{building: UnitName.TOWER});
        } else {
            scene.events.emit(UiSceneEvents.DESELECT_BUILDING,{});
        }
    }
}

const sawmillButtonClick = function(button: UIButton, scene: UiScene) {
    return () => {
        scene.clearButtonsTint(scene);
        if(scene.gameEngine.canBuild(UnitName.SAWMILL, null)) {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiSceneEvents.BUILDBUILDING,{building: UnitName.SAWMILL});
        } else {
            scene.events.emit(UiSceneEvents.DESELECT_BUILDING,{});
        }
    }
}

export { createBaseUIButtons };