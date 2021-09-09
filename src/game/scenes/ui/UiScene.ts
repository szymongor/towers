import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { createBaseUIButtons } from './BaseUIControls';
import { CustomSprite } from '../../engine/units/Unit';
import { SelectedUnitUI, showSelectedUnitUI } from './SelectedUnitUI';
import { MainCameraEvents } from '../main/MainCamera';

interface UIButton {
    clearTint: () => void;
    setVisible: (prop: boolean) => void;
    setTintFill: (prop: number) => void;
    destroy: () => void;
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
        .events.on(MainCameraEvents.UNIT_SELECTED, this.unitSelected(this));

        this.scene.get(Scenes.MainCamera)
        .events.on(MainCameraEvents.DESELECT, this.unitSelected(this));
    }

    unitSelected(uiScene: UiScene) {
        return (gameUnit: CustomSprite) => {
            uiScene.clearButtonsTint(uiScene);
            uiScene.uiButtons.forEach(btn => {
                btn.destroy();
            });
            if(gameUnit) {
                uiScene.uiButtons = [];
                showSelectedUnitUI(this, gameUnit.unit);
            } else {
                if(this.selectedUnitUI){
                    this.selectedUnitUI.hide();
                }
                createBaseUIButtons(this);
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