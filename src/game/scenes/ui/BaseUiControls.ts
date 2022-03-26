import * as Phaser from 'phaser';
import { UnitName } from '../../engine/units/UnitFactory';
import { UiSceneEvents } from './UiSceneEvents';
import { UiScene, UIButton } from './UiScene';
import { UIDimensions } from '../../GameDimensions';

const createBaseUIButtons = function(scene: UiScene) {

    //TODO Refactor button positioning

    var buttonPosition = UIDimensions.buttonGrid;

    var baseButons = [
        {name: UnitName.TOWER, func: towerButtonClick, coords: buttonPosition[0]},
        {name: UnitName.SAWMILL, func: sawmillButtonClick, coords: buttonPosition[1]},
        {name: UnitName.MINE, func: mineButtonClick, coords: buttonPosition[2]},
        {name: UnitName.CASTLE, func: castleButtonClick, coords: buttonPosition[3]},
        {name: UnitName.CASTLE, func: castleButtonClick, coords: buttonPosition[4]},
    ];

    baseButons.forEach(btn => {
        let btnImg = scene.add.image(btn.coords[0], btn.coords[1], btn.name)
        .setOrigin(0)
        .setScale(0.25) //TODO - set from dims
        .setInteractive();
        btnImg.on(Phaser.Input.Events.POINTER_DOWN, btn.func(btnImg, scene));
        scene.uiButtons.push(btnImg);
    })
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