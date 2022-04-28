import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { createBaseUIButtons } from './BaseUIControls';
import { CustomSprite } from '../../engine/units/Unit';
import { getSelectedUnitsUIElements } from './elements/SelectedUnitUI';
import { MainCameraEvents } from '../main/MainCamera';
import { drawWindow } from '../elements/Window';

type UIButton = {
    clearTint: () => void;
    setVisible: (prop: boolean) => void;
    setTintFill: (prop: number) => void;
    destroy: () => void;
}

type UIElement = {
    width: number;
    heigth: number;
    setX: (x: number) => void;
    setY: (y: number) => void;
    show: () => void;
    hide: () => void;
    update: () => void;
}

class UiScene extends Phaser.Scene {

    gameEngine: GameEngine;
    originX: number;            //
    originY: number;  
    width: number;          //    
    originActionUIX: number;    //
    originActionUIY: number;    //TODO - UI Dimensions

    uiElements: UIElement[];
    uiButtons: UIButton[];

    constructor(handle: string, parent: Phaser.Scene, gameEngine: GameEngine) {
        super(handle);
        Phaser.Scene.call(this, { key: handle, active: true });
        this.uiElements = [];
        this.uiButtons = [];
        this.gameEngine = gameEngine;
        this.originActionUIY =420; //UIDimensions.uiButtonsY;
        this.width = 200;
    }

    preload() {
    }

    create() {
        this.originX = GameDimensions.gameWidth-GameDimensions.uiSceneWidth;
        this.originY = GameDimensions.gameHeight-GameDimensions.uiSceneHeight;

        let windowX = this.originX+GameDimensions.uiSceneWidth/2;
        let windowY = this.originY +GameDimensions.uiSceneHeight/2;
        drawWindow(this, windowX, windowY, GameDimensions.uiSceneWidth, GameDimensions.uiSceneHeight);
        
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
            this.uiElements.forEach(elem => elem.hide());
            uiScene.clearButtons(uiScene);
            if(gameUnits) {
                if(areUnitsOwned(gameUnits, uiScene.gameEngine)) {
                    console.log("Owned");
                    
                    uiScene.uiButtons = [];
                    let units = gameUnits.filter(u => u).map(customSprite => customSprite.unit);
                    this.uiElements = getSelectedUnitsUIElements(this, units);
                    let y = this.originY +10;
                    this.uiElements.forEach(elem => {
                        elem.setY(y);
                        elem.setX(this.originX);
                        elem.show()
                        y+=elem.heigth;
                    })
                }
                
            } else {
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
        this.uiElements.forEach(elem => elem.update());
    }
}

const areUnitsOwned = (units: CustomSprite[], gameEngine: GameEngine): boolean => {
    let player = gameEngine.getPlayer();
    return units.map(u => u.unit.player).filter(unitOwner => unitOwner == player).length == units.length;
}



export { UiScene, UIButton, UIElement };