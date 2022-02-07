import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { drawWindow } from '../elements/Window';

class ResourcesScene extends Phaser.Scene {

    gameEngine: GameEngine;
    originX: number;
    originY: number;
    resources: Phaser.GameObjects.BitmapText;

    constructor(handle: string, parent: Phaser.Scene, gameEngine: GameEngine) {
        super(handle);
        this.gameEngine = gameEngine;
    }

    preload() {}

    create() {
        let rect = this.add.rectangle(0, 0, 
            GameDimensions.resourcesScene.width, GameDimensions.resourcesScene.height,GameDimensions.backgroundColor);
        rect.setOrigin(0,0);
        this.originX = 0;
        this.originY = 0;

        drawWindow(this, GameDimensions.resourcesScene.width/2, GameDimensions.resourcesScene.height/2, GameDimensions.resourcesScene.width, GameDimensions.resourcesScene.height);

        let textX = this.originX + GameDimensions.resourcesScene.width/2;
        let textY = this.originY + GameDimensions.resourcesScene.height/2;
        this.resources = this.add.bitmapText(textX, textY, GameDimensions.font, 'UI', 30).setOrigin(0.5,0.5)
    }

    update() {
        this.updateResources();
    }

    updateResources() {
        let player = this.gameEngine.getPlayer();
        this.resources.text = player.getResourcesString();
    }



}

export { ResourcesScene };