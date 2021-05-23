import towerPng from '../images/Tower.png';
import grassPng from '../images/grass1.png';
import tree1 from '../images/tree1.png';
import tree2 from '../images/tree2.png';
import tree3 from '../images/tree3.png';
import { UnitTypes } from './Unit';
import { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit } from './UnitsControls';
import { createMainCamera, createMiniMapCamera } from './CameraControls';
import { GameDimensions } from  './GameDimensions';

class MainCamera extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        this.mapBoard;
        this.gameUnits = [];
        this.cameras = {};
        this.active = false;
    }

    //load assets
    preload() {
        this.load.image('tower', towerPng);
        this.load.image('grass', grassPng);
        this.load.image('tree1', tree1);
        this.load.image('tree2', tree2);
        this.load.image('tree3', tree3);
    }

    create() {
        console.log("Created main camera");
        this.mapBoard = this.registry.map;
        
        this.cameras.main = createMainCamera(this, this.mapBoard);
        this.cameras.minimap = createMiniMapCamera(this, this.mapBoard);

        this.drawMap(this.mapBoard);
        this.selectSprite();
    }

    selectSprite() {
        this.input.on('gameobjectover', (pointer, gameObject) => {
            if(gameObject.gameObjectOver) {
                gameObject.gameObjectOver(pointer, gameObject);
            }
        });

        this.input.on('gameobjectout', (pointer, gameObject) => {
            if(gameObject.gameObjectOut) {
                gameObject.gameObjectOut(pointer, gameObject);
            }
        });

        //highlight selected unit
        this.events.on('unitselected',(gameUnit) => {
            if(this.selectedUnit != null) {
                this.selectedUnit.deselectUnit();
            }

            this.selectedUnit = gameUnit;
            gameUnit.selectUnit();
        })
    }

    update() {
    }

    drawMap(map) {
        console.log(map);
        map.units.forEach(unit => {
            var gameUnit = this.createGameUnit(this, unit);
            this.gameUnits.push(gameUnit);
        });
        this.drawBackground(map);
    }

    drawBackground(map) {
        for(let i = 0; i < map.width/GameDimensions.grid.tileSize; i++ ) {
            for(let j = 0; j < map.height/GameDimensions.grid.tileSize ; j++) {
                this.add.sprite(i*GameDimensions.grid.tileSize, j*GameDimensions.grid.tileSize, 'grass')
                .setDepth(-2)
                .setOrigin(0)
                .setScale(GameDimensions.grid.tileSize/GameDimensions.grid.grassTileSize -0.01);
            }
        }
    }

    createGameUnit(game, unit) {
        var gameUnit = game.add.sprite(unit.x, unit.y, unit.name);
        gameUnit.unit = unit;
        switch (unit.type) {
            case UnitTypes.BUILDING:
                gameUnit.scale = 0.2;
                gameUnit.gameObjectOver = buildingObjectOver(this);
                gameUnit.gameObjectOut = buildingObjectOut(this);
                gameUnit.on('pointerdown', selectUnitEmitEvent(this, gameUnit) );
                gameUnit.selectUnit = selectUnit(this);
                gameUnit.deselectUnit = deselectUnit();
                gameUnit.setDepth(2);
                gameUnit.setInteractive();
                break;
            case UnitTypes.TREE:
                gameUnit.selectUnit = selectUnit(this);
                gameUnit.deselectUnit = deselectUnit();

                break;
            default:
                gameUnit.gameObjectOver = (pointer, gameObject) => { };
                gameUnit.gameObjectOut = (pointer, gameObject) => { };
        }
        return gameUnit;
    }
}

export { MainCamera };
