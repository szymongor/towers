import Phaser from 'phaser';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { createBaseUIButtons } from './BaseUIControls';

class UiScene extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        Phaser.Scene.call(this, { key: handle, active: true });
        this.baseUIButtons = [];
    }

    preload() {
    }

    create() {
        this.gameEngine = this.registry.gameEngine;
        this.originX = GameDimensions.gameWidth-GameDimensions.uiSceneWidth;
        this.originY = GameDimensions.gameHeight-GameDimensions.uiSceneHeight;
        var viewRectangle = this.add.rectangle(this.originX, this.originY, GameDimensions.uiSceneWidth, GameDimensions.uiSceneHeight);
        viewRectangle.setOrigin(0,0);
        viewRectangle.setDepth(1);
        viewRectangle.setStrokeStyle(5, 0xFFFFFF);

        var info = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', fill: '#FFFFFF' });
        this.selectedUnitInfo = this.add.text(this.originX, this.originY+48, 
            '', { font: '48px Arial', fill: '#FFFFFF' });

        createBaseUIButtons(this);
    }

    registerOuterEvents() {
        this.scene.get(Scenes.MainCamera)
        .events.on('unitselected', this.unitSelected(this));

        this.scene.get(Scenes.MainCamera)
        .events.on('deselect', this.unitSelected(this));
    }

    unitSelected(uiScene) {
        return (gameUnit) => {
            uiScene.clearButtonsTint(uiScene);
            if(gameUnit) {
                uiScene.selectedUnitInfo.text = "x: "+gameUnit.unit.x+",\ny: "+gameUnit.unit.y
                uiScene.baseUIButtons.forEach(btn => {
                    btn.setVisible(false);
                });
    
            } else {
                uiScene.selectedUnitInfo.text ='';
                uiScene.baseUIButtons.forEach(btn => {
                    btn.setVisible(true);
                });
            }
        }
    }

    clearButtonsTint(uiScene) {
        uiScene.baseUIButtons.forEach(btn => {
            btn.clearTint();
        });
    }

    update() {
    }
}



export { UiScene };