import towerPng from '../images/Tower.png';
import { UnitTypes } from './Unit';
import { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit } from './UnitsControls';
import { createMainCamera, createMiniMapCamera } from './CameraControls';

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
    }

    createGameUnit(game, unit) {
        var gameUnit = game.add.sprite(unit.x, unit.y, unit.name);
        gameUnit.unit = unit;
        gameUnit.scale = 0.2;
        switch (unit.type) {
            case UnitTypes.BUILDING:
                gameUnit.gameObjectOver = buildingObjectOver(this);
                gameUnit.gameObjectOut = buildingObjectOut(this);
                gameUnit.on('pointerdown', selectUnitEmitEvent(this, gameUnit) );
                gameUnit.selectUnit = selectUnit(this);
                gameUnit.deselectUnit = deselectUnit();
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
