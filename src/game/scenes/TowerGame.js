import Phaser from 'phaser';
import { MainCamera } from './main/MainCamera';
import { UiScene } from './ui/UiScene';
import { GameDimensions, Scenes } from  '../GameDimensions';
import grass1Png from '../../images/grass1.png';
import tree1Png from '../../images/tree1.png';
import tree2Png from '../../images/tree2.png';
import tree3Png from '../../images/tree3.png';
import towerPng from '../../images/tower.png';
import sawmillPng from '../../images/sawmill.png';

class TowerGame extends Phaser.Scene {

    constructor() {
        super();
    }

    preload() {
        this.loader = new Phaser.Loader.LoaderPlugin(this);
        this.loader.image('grass', grass1Png);
        this.loader.image('tree1', tree1Png);
        this.loader.image('tree2', tree2Png);
        this.loader.image('tree3', tree3Png);
        this.loader.image('sawmill', sawmillPng);
        this.loader.image('tower', towerPng);
        this.loader.start();
    }

    create() {
        var mainBackground = this.add.rectangle(0, 0, this.renderer.width, this.renderer.height, 0xaaff00);
        mainBackground.setOrigin(0,0);
        this.loader.once(Phaser.Loader.Events.COMPLETE, () => {
            this.createWindow();
        });
    }

    createWindow() {
        let main = this.addMainCamera();
        let ui = this.addUiScene();
        main.registerOuterEvents();
        ui.registerOuterEvents();

    }

    addMainCamera() {
        var mainCamera = new MainCamera(Scenes.MainCamera, this);
        this.scene.add(Scenes.MainCamera, mainCamera, true);
        return mainCamera;
    }

    addUiScene() {
        var uiScene = new UiScene(Scenes.UIScene, this);
        this.scene.add(Scenes.UIScene, uiScene, this);
        return uiScene;
    }

    update() {
    }

}



const createTowerGame = (gameEngine) => {

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
    game.registry.gameEngine = gameEngine;
    return game;
}

export { createTowerGame };
