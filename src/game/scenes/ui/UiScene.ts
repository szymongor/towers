import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { createBaseUIButtons } from './BaseUIControls';
import { CustomSprite } from '../../engine/units/Unit';
import { SelectedUnitUI, showSelectedUnitUI } from './SelectedUnitUI';
import { MainCameraEvents } from '../main/MainCamera';
import { drawWindow } from '../elements/Window';

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

        let windowX = this.originX+GameDimensions.uiSceneWidth/2;
        let windowY = this.originY +GameDimensions.uiSceneHeight/2;
        drawWindow(this, windowX, windowY, GameDimensions.uiSceneWidth, GameDimensions.uiSceneHeight);

        var info = this.add.bitmapText(this.originX, this.originY, GameDimensions.font, 'UI', 30);
        
        createBaseUIButtons(this);
    }

    registerOuterEvents() {
        this.scene.get(Scenes.MainCamera)
        .events.on(MainCameraEvents.UNIT_SELECTED, this.unitsSelected(this));

        this.scene.get(Scenes.MainCamera)
        .events.on(MainCameraEvents.DESELECT, this.unitsSelected(this));
    }

    unitsSelected(uiScene: UiScene) {
        return (gameUnits: CustomSprite[]) => {
            uiScene.clearButtons(uiScene);
            if(gameUnits) {
                uiScene.uiButtons = [];
                let units = gameUnits.filter(u => u).map(customSprite => customSprite.unit);
                showSelectedUnitUI(this, units);
            } else {
                if(this.selectedUnitUI){
                    this.selectedUnitUI.hide();
                }
                createBaseUIButtons(this);
            }

        }
    }

    clearButtons(uiScene: UiScene) {
        uiScene.uiButtons.forEach(btn => {
            btn.destroy();
        });
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