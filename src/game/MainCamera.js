import towerPng from '../images/Tower.png';
import { UnitTypes } from './Unit';
import { buildingObjectOver, buildingObjectOut } from './UnitsControls';
import { createMainCamera, mapScroll, createMiniMapCamera } from './CameraControls';

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

        this.cameras.main = createMainCamera(this, 800-200, 600, mapBoard.height, mapBoard.width);
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

export { MainCamera };