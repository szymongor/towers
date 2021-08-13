import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { createBaseUIButtons } from './BaseUIControls';
import { CustomSprite } from '../../engine/units/Unit';
import { SelectedUnitUI, showSelectedUnitUI } from './SelectedUnitUI';

interface UIButton {
    clearTint: () => void;
    setVisible: (prop: boolean) => void;
    setTintFill: (prop: number) => void;
}

class UiScene extends Phaser.Scene {

    gameEngine: GameEngine;
    originX: number;            //
    originY: number;            //    
    originActionUIX: number;    //
    originActionUIY: number;    //TODO - UI Dimensions
    selectedUnitUI?: SelectedUnitUI;

    uiButtons: UIButton[];

    constructor(handle: string, parent: Phaser.Scene, gameEngine: GameEngine) {
        super(handle);
        Phaser.Scene.call(this, { key: handle, active: true });
        this.uiButtons = [];
        this.gameEngine = gameEngine;
        this.originActionUIY = GameDimensions.ui.uiButtonsY;
    }

    preload() {
    }

    create() {
        this.originX = GameDimensions.gameWidth-GameDimensions.uiSceneWidth;
        this.originY = GameDimensions.gameHeight-GameDimensions.uiSceneHeight;
        var viewRectangle = this.add.rectangle(this.originX, this.originY, GameDimensions.uiSceneWidth, GameDimensions.uiSceneHeight);
        viewRectangle.setOrigin(0,0);
        viewRectangle.setDepth(1);
        viewRectangle.setStrokeStyle(5, 0xFFFFFF);

        var info = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', color: '#FFFFFF' });

        createBaseUIButtons(this);
    }

    registerOuterEvents() {
        this.scene.get(Scenes.MainCamera)
        .events.on('unitselected', this.unitSelected(this));

        this.scene.get(Scenes.MainCamera)
        .events.on('deselect', this.unitSelected(this));
    }

    unitSelected(uiScene: UiScene) {
        return (gameUnit: CustomSprite) => {
            uiScene.clearButtonsTint(uiScene);
            if(gameUnit) {
                // uiScene.selectedUnitInfo.text = "x: "+gameUnit.unit.x+",\ny: "+gameUnit.unit.y
                uiScene.uiButtons.forEach(btn => {
                    btn.setVisible(false);
                });
                uiScene.uiButtons = [];
                showSelectedUnitUI(this, gameUnit.unit);
                
    
            } else {
                if(this.selectedUnitUI){
                    this.selectedUnitUI.hide();
                }
                uiScene.uiButtons.forEach(btn => {
                    btn.setVisible(true);
                });
            }
        }
    }

    clearButtonsTint(uiScene: UiScene) {
        uiScene.uiButtons.forEach(btn => {
            btn.clearTint();
        });
    }

    update() {
        if(this.selectedUnitUI) {
            this.selectedUnitUI.update();
        }
    }
}



export { UiScene, UIButton };