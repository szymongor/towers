import Phaser from 'phaser';
import { GameDimensions, Scenes } from  '../../GameDimensions';

class ResourcesScene extends Phaser.Scene {

    constructor(handle, parent) {
        super(handle);
    }

    preload() {}

    create() {
        this.gameEngine = this.registry.gameEngine;
        let rect = this.add.rectangle(0, 0, 
            GameDimensions.resourcesScene.width, GameDimensions.resourcesScene.height,GameDimensions.bacgroudColor);
        rect.setOrigin(0,0);
        this.originX = 0;
        this.originY = 0;

        this.resources = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', fill: '#FFFFFF' });
    }

    update() {
        this.updateResources();
    }

    updateResources() {
        let player = this.gameEngine.getPlayer();
        let resources = '';
        for (const [key, value] of Object.entries(player.resources)) {
            resources += key + ':' + value + ' ';
        }
        this.resources.text = resources;
    }



}

export { ResourcesScene };