import * as Phaser from 'phaser';
import { UnitName } from '../../engine/units/UnitFactory';
import { UiSceneEvents } from './UiSceneEvents';
import { UiScene, UIButton } from './UiScene';

const createBaseUIButtons = function(scene: UiScene) {

    //TODO Refactor button positioning

    var buttonTower = scene.add.image(scene.originX, scene.originY+50, UnitName.TOWER)
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();

    var buttonSawmill = scene.add.image(scene.originX+50, scene.originY+50, UnitName.SAWMILL)
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();

    var buttonMine = scene.add.image(scene.originX+100, scene.originY+50, UnitName.MINE)
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();

    var buttonCastle = scene.add.image(scene.originX+150, scene.originY+50, UnitName.CASTLE)
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();

    buttonTower.on(Phaser.Input.Events.POINTER_DOWN, towerButtonClick(buttonTower, scene));
    buttonSawmill.on(Phaser.Input.Events.POINTER_DOWN, sawmillButtonClick(buttonSawmill, scene));
    buttonMine.on(Phaser.Input.Events.POINTER_DOWN, mineButtonClick(buttonMine, scene));
    buttonCastle.on(Phaser.Input.Events.POINTER_DOWN, castleButtonClick(buttonCastle, scene));


    scene.uiButtons.push(buttonTower, buttonSawmill, buttonMine, buttonCastle);
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


const mineButtonClick = function(button: UIButton, scene: UiScene) {
    return () => {
        scene.clearButtonsTint(scene);
        if(scene.gameEngine.canBuild(UnitName.MINE, null)) {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiSceneEvents.BUILDBUILDING,{building: UnitName.MINE});
        } else {
            scene.events.emit(UiSceneEvents.DESELECT_BUILDING,{});
        }
    }
}

const castleButtonClick = function(button: UIButton, scene: UiScene) {
    return () => {
        scene.clearButtonsTint(scene);
        if(scene.gameEngine.canBuild(UnitName.CASTLE, null)) {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiSceneEvents.BUILDBUILDING,{building: UnitName.CASTLE});
        } else {
            scene.events.emit(UiSceneEvents.DESELECT_BUILDING,{});
        }
    }
}

export { createBaseUIButtons };