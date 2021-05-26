import Phaser from 'phaser';
import { GameDimensions } from  './GameDimensions';
import towerPng from '../images/tower.png';
import { UnitFactory } from './engine/UnitFactory';

class UiScene extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
        this.uiButtons = [];
    }

    //load assets
    preload() {
        this.load.image('button', towerPng);
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

        this.scene.get('mainCamera')
        .events.on('unitselected', this.unitSelected(this));

        var button = this.add.image(this.originX, this.originY+50, 'button')
        .setOrigin(0)
        .setScale(0.25)
        .setInteractive();

        button.on(Phaser.Input.Events.POINTER_DOWN, this.towerButtonClick(button, this));

        this.uiButtons.push(button);
    }

    towerButtonClick(button, scene) {
        return () => {
            button.setTintFill(0x00ffff);
            scene.events.emit(UiScene.Events.BUILDBUILDING,{building: UnitFactory.Units.TOWER});
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