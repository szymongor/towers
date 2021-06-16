import * as Phaser from 'phaser';
import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions, Scenes } from  '../../GameDimensions';

class ResourcesScene extends Phaser.Scene {

    gameEngine: GameEngine;
    originX: number;
    originY: number;
    resources: Phaser.GameObjects.Text;

    constructor(handle: string, parent: Phaser.Scene) {
        super(handle);
    }

    preload() {}

    create() {
        this.gameEngine = this.registry.get('GameEngine');
        let rect = this.add.rectangle(0, 0, 
            GameDimensions.resourcesScene.width, GameDimensions.resourcesScene.height,GameDimensions.backgroundColor);
        rect.setOrigin(0,0);
        this.originX = 0;
        this.originY = 0;

        this.resources = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', color: '#FFFFFF' });
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