import Phaser from 'phaser';
import towerPng from '../images/Tower.png';
import { UnitTypes } from './Unit';
import { buildingObjectOver, buildingObjectOut } from './UnitsControls';
import { createMainCamera, mapScroll, createMiniMapCamera } from './CameraControls';

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
        var win = this.add.zone(0, 0, this.renderer.width, this.renderer.height).setInteractive().setOrigin(0);
        var mainCamera = new MainCamera("mainCamera", this);
        this.scene.add("mainCamera", mainCamera, true);

        var uiScene = new UiScene("uiScene", this,  this.renderer.width, this.renderer.height);
        this.scene.add("uiScene", uiScene, this);
    }

    update() {

    }

}

class MainCamera extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        this.map = {};
        this.gameUnits = [];
        this.cameras = {};
    }

    //load assets
    preload() {
        this.load.image('tower', towerPng);
    }

    create() {
        console.log("Created main camera");
        var mapBoard = this.registry.map;
        // this.camera = this.cameras.main.setSize(800, 600);

        this.cameras.main = createMainCamera(this, 800-200, 600, mapBoard.height, mapBoard.width)


        this.cameras.minimap = createMiniMapCamera(this, mapBoard, 200, 200, 600, 0);

        this.drawMap(mapBoard);
        this.selectSprite();
    }

    selectSprite() {
        this.input.on('gameobjectover', (pointer, gameObject) => {
            gameObject.gameObjectOver(pointer, gameObject);
        });

        this.input.on('gameobjectout', (pointer, gameObject) => {
            gameObject.gameObjectOut(pointer, gameObject);
        });
    }


    update() {
        mapScroll(this, this.cameras.main);
    }

    drawMap(map) {
        console.log(map);
        map.units.forEach(unit => {
            var gameUnit = this.createGameUnit(this, unit);
            this.gameUnits.push(gameUnit);

        });
    }

    createGameUnit(game, unit) {
        var gameUnit = game.add.sprite(unit.x, unit.y, unit.name);
        gameUnit.scale = 0.2;
        switch (unit.type) {
            case UnitTypes.BUILDING:
                gameUnit.gameObjectOver = buildingObjectOver(this);
                gameUnit.gameObjectOut = buildingObjectOut(this);
                gameUnit.setInteractive();
                break;
            default:
                gameUnit.gameObjectOver = (pointer, gameObject) => { };
                gameUnit.gameObjectOut = (pointer, gameObject) => { };
        }
        return gameUnit;
    }
}

class UiScene extends Phaser.Scene {
    constructor(handle, parent, x, y) {
        super(handle);
        this.x = x;
        this.y = y;
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }

    //load assets
    preload() {
    }

    create() {
        this.width = 200;
        this.height = 400;
        this.originX = this.x-this.width;
        this.originY = this.y-this.height;
        var viewRectangle = this.add.rectangle(this.originX, this.originY, this.width, this.height);
        viewRectangle.setOrigin(0,0);
        viewRectangle.setDepth(1);
        viewRectangle.setStrokeStyle(5, 0xFFFFFF);
        console.log("Created UI Scene: ");

        var info = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', fill: '#FFFFFF' });

    }

    update() {
    }

}

const createTowerGame = (map) => {

    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        scene: TowerGame
    };

    const game = new Phaser.Game(config);
    game.registry.map = map;
    return game;
}

export { createTowerGame }
