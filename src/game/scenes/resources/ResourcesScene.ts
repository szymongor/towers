import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';

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

        this.resources = this.add.bitmapText(this.originX, this.originY, GameDimensions.font, 'UI', 35);
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