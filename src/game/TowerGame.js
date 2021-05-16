import Phaser from 'phaser';
import { MainCamera } from './MainCamera';
import { UiScene } from './UiScene';
import { GameDimensions } from  './GameDimensions';

class TowerGame extends Phaser.Scene {

    constructor() {
        super();
    }

    preload() {

    }

    create() {
        var mainBackground = this.add.rectangle(0, 0, this.renderer.width, this.renderer.height, 0xaaff00);
        mainBackground.setOrigin(0,0);
        console.log("Created main view: "+this.renderer.width+","+this.renderer.height);
        this.createWindow();
    }

    createWindow() {
        this.addMainCamera();
        this.addUiScene();
        
    }

    addMainCamera() {
        var mainCamera = new MainCamera("mainCamera", this);
        this.scene.add("mainCamera", mainCamera, true);
    }

    addUiScene() {
        var uiScene = new UiScene("uiScene", this,  this.renderer.width, this.renderer.height);
        this.scene.add("uiScene", uiScene, this);
    }

    update() {

    }

}

const createTowerGame = (map) => {

    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: GameDimensions.gameWidth,
        height: GameDimensions.gameHeight,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: TowerGame
    };

    const game = new Phaser.Game(config);
    game.registry.map = map;
    return game;
}

export { createTowerGame };