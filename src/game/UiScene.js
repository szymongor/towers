import Phaser from 'phaser';
import { GameDimensions } from  './GameDimensions';
import { UnitFactory } from './engine/UnitFactory';
import towerPng from '../images/tower.png';
import sawmillPng from '../images/sawmill.png';

class UiScene extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
        this.uiButtons = [];
    }

    //load assets
    preload() {
        //TODO Load images in TowerGame
        this.load.image('sawmill', sawmillPng);
        this.load.image('tower', towerPng);
    }

    create() {
        this.originX = GameDimensions.gameWidth-GameDimensions.uiSceneWidth;
        this.originY = GameDimensions.gameHeight-GameDimensions.uiSceneHeight;
        var viewRectangle = this.add.rectangle(this.originX, this.originY, GameDimensions.uiSceneWidth, GameDimensions.uiSceneHeight);
        viewRectangle.setOrigin(0,0);
        viewRectangle.setDepth(1);
        viewRectangle.setStrokeStyle(5, 0xFFFFFF);
        console.log("Created UI Scene: ");

        var info = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', fill: '#FFFFFF' });
        this.selectedUnitInfo = this.add.text(this.originX, this.originY+48, 
            '', { font: '48px Arial', fill: '#FFFFFF' });

        //TODO get Events from event bus
        this.scene.get('mainCamera')
        .events.on('unitselected', this.unitSelected(this));

        //TODO get Events from event bus
        this.scene.get('mainCamera')
        .events.on('deselect', this.unitSelected(this));

        var buttonTower = this.add.image(this.originX, this.originY+50, 'tower')
        .setOrigin(0)
        .setScale(0.25)
        .setInteractive();

        var buttonSawmill = this.add.image(this.originX+50, this.originY+50, 'sawmill')
        .setOrigin(0)
        .setScale(0.25)
        .setInteractive();

        buttonTower.on(Phaser.Input.Events.POINTER_DOWN, this.towerButtonClick(buttonTower, this));
        buttonSawmill.on(Phaser.Input.Events.POINTER_DOWN, this.sawmillButtonClick(buttonSawmill, this));

        this.uiButtons.push(buttonTower, buttonSawmill);
    }

    towerButtonClick(button, scene) {
        return () => {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiScene.Events.BUILDBUILDING,{building: UnitFactory.Units.TOWER});
        }
    }

    sawmillButtonClick(button, scene) {
        return () => {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiScene.Events.BUILDBUILDING,{building: UnitFactory.Units.SAWMILL});
        }
    }

    unitSelected(uiScene) {
        return (gameUnit) => {
            if(gameUnit) {
                uiScene.selectedUnitInfo.text = "x: "+gameUnit.unit.x+",\ny: "+gameUnit.unit.y
                uiScene.uiButtons.forEach(btn => {
                    btn.setVisible(false);
                    btn.clearTint();
                });
    
            } else {
                uiScene.selectedUnitInfo.text ='';
                uiScene.uiButtons.forEach(btn => {
                    btn.setVisible(true);
                    btn.clearTint();
                });
            }
        }
    }

    update() {
    }
}

UiScene.Events = {
    "BUILDBUILDING":"BUILDBUILDING"
}

export { UiScene };