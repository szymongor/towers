import * as Phaser from 'phaser';
import { MainCamera } from './main/MainCamera';
import { UiScene } from './ui/UiScene';
import { ResourcesScene } from './resources/ResourcesScene';
import { GameDimensions, Scenes } from  '../GameDimensions';
import grass1Png from '../../images/grass1.png';
import tree1Png from '../../images/tree1.png';
import towerPng from '../../images/tower.png';
import castlePng from '../../images/castle.png';
import sawmillPng from '../../images/sawmill.png';
import minePng from '../../images/mine.png';
import constructionPng from '../../images/construction.png';
import logPng from '../../images/log.png';
import stonePng from '../../images/stone.png';
import stonesPng from '../../images/stones.png';
import arrowPng from '../../images/arrow.png';
import soldierProductionIcon from '../../images/soldier_production_icon.png';
import soldierPng from '../../images/soldier.png';
import { GameEngine } from '../engine/GameEngine';
import { StartScene } from './meta/StartScene';
import { EventChannels, Subscriber } from '../engine/events/EventsRegistry';
import { GameEvent, GameFinishedEventData } from '../engine/events/GameEvent';
import { FinishScene, GameResult } from './meta/FinishScene';
import { SpriteCache } from './SpriteCache';
import { KeyboardListener } from './KeyboardListener';
import { CampaignName } from '../engine/campaign/CampaignFactory';


class TowerGame extends Phaser.Scene {

    loader: Phaser.Loader.LoaderPlugin;
    gameEngine: GameEngine;
    timedEvent: Phaser.Time.TimerEvent;
    gameIsRunning: boolean;
    spriteCache: SpriteCache;
    keyboardListener: KeyboardListener;

    constructor() {
        super('');
        this.gameIsRunning = false;
        this.spriteCache = new SpriteCache(this);
    }

    preload() {
        this.loader = new Phaser.Loader.LoaderPlugin(this);
        this.loader.image('grass', grass1Png);
        this.loader.image('tree', tree1Png);
        this.loader.image('sawmill', sawmillPng);
        this.loader.image('tower', towerPng);
        this.loader.image('construction', constructionPng);
        this.loader.image('log', logPng);
        this.loader.image('stone', stonePng);
        this.loader.image('stones', stonesPng);
        this.loader.image('arrow', arrowPng);
        this.loader.image('mine', minePng);
        this.loader.image('castle', castlePng);
        this.loader.image('soldier_production_icon', soldierProductionIcon);
        this.loader.image('change_position_icon', soldierProductionIcon);
        this.loader.image('soldier', soldierPng);
        

        this.loader.start();
    }

    create() {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        let scene = this;
        this.loader.on(Phaser.Loader.Events.POST_PROCESS, () => scene.setStartScene());
        this.keyboardListener = new KeyboardListener(this);
    }

    startNewGame(campaignName: CampaignName) {
        this.scene.remove(Scenes.StartScene);
        let gameEngine = new GameEngine(campaignName);
        this.gameEngine = gameEngine
        this.registerOnGameFinished(gameEngine);
        var mainBackground = this.add.rectangle(0, 0, this.renderer.width, this.renderer.height, GameDimensions.backgroundColor);
        mainBackground.setOrigin(0,0);
        this.createWindow(gameEngine);
        this.createTimer(this);
    }

    registerOnGameFinished(gameEngine: GameEngine) {
        let towerGame = this;
        let subscriber: Subscriber = {
            call: (event: GameEvent) => {
                let eventData: GameFinishedEventData = event.data;
                towerGame.gameFinished(eventData);
            }
        }
        gameEngine.events.subscribe(EventChannels.GAME_FINISHED, subscriber);
    }

    gameFinished(gameResult: GameResult) {
        this.setFinishScene(gameResult);
    }

    setFinishScene(gameResult: GameResult) {
        if(this.timedEvent) {
            this.timedEvent.destroy();
        }
        let finishScene = new FinishScene(Scenes.FinishScene, this, gameResult);
        this.scene.add(Scenes.FinishScene, finishScene, true);

    }

    setStartScene() {

        this.scene.remove(Scenes.FinishScene);
        this.scene.remove(Scenes.MainCamera);
        this.scene.remove(Scenes.UIScene);
        this.scene.remove(Scenes.ResourcesScene);
        

        let startScene = new StartScene(Scenes.StartScene, this);
        this.scene.add(Scenes.StartScene, startScene, true);
    }

    createWindow(gameEngine: GameEngine) {
        let main = this.addMainCamera(gameEngine);
        let ui = this.addUiScene(gameEngine);
        let resources = this.addResourcesScene(gameEngine);
        main.registerOuterEvents();
        ui.registerOuterEvents();

    }

    addMainCamera(gameEngine: GameEngine) {
        var mainCamera = new MainCamera(Scenes.MainCamera, this, gameEngine, this.spriteCache);
        this.scene.add(Scenes.MainCamera, mainCamera, true);
        return mainCamera;
    }

    addUiScene(gameEngine: GameEngine) {
        var uiScene = new UiScene(Scenes.UIScene, this, gameEngine);
        this.scene.add(Scenes.UIScene, uiScene, true);
        return uiScene;
    }

    addResourcesScene(gameEngine: GameEngine) {
        var resourcesScene = new ResourcesScene(Scenes.ResourcesScene, this, gameEngine);
        this.scene.add(Scenes.ResourcesScene, resourcesScene, true);
        return resourcesScene;
    }

    createTimer(scene: TowerGame) {
        scene.timedEvent = scene.time.addEvent({ 
            delay: 250, 
            callback: this.updateEvent, 
            callbackScope: this,
            loop: true
        });
    }

    updateEvent() {
        this.gameEngine.update();
    }

    update() {
    }

}



const createTowerGame = () => {

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
    return game;
}

export { createTowerGame, TowerGame };
