import towerPng from '../images/tower.png';
import grassPng from '../images/grass1.png';
import tree1 from '../images/tree1.png';
import tree2 from '../images/tree2.png';
import tree3 from '../images/tree3.png';
import { UnitTypes } from './engine/Unit';
import { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit } from './UnitsControls';
import { createMainCamera, createMiniMapCamera } from './CameraControls';
import { GameDimensions } from  './GameDimensions';
import { UiScene } from './UiScene';

class MainCamera extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        this.gameEngine;
        this.gameUnits = [];
        this.cameras = {};
        this.active = false;
        this.cursorFollow;
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
        this.gameEngine = this.registry.gameEngine;
        
        this.cameras.main = createMainCamera(this, this.gameEngine);
        this.cameras.minimap = createMiniMapCamera(this, this.gameEngine);

        this.drawMap(this.gameEngine);
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
            if(gameUnit) {
                this.selectedUnit = gameUnit;
                gameUnit.selectUnit();
            } else {
                if(this.cursorFollow) {
                    this.cursorFollow.destroy();
                    this.cursorFollow = null;
                }
            }
        })

        //TODO - export to UiControls
        this.scene.get('UIScene').events.on(UiScene.Events.BUILDBUILDING, (e) => {
            if(this.cursorFollow) {
                this.cursorFollow.destroy();
            }
            let unitPrototype = this.gameEngine.unitFactory.of(e.building);
            this.cursorFollow = this.add.sprite(0, 0, unitPrototype.name);
            this.cursorFollow.unitPrototype = unitPrototype;
            this.cursorFollow.setTintFill(0x00ff00);
            this.cursorFollow.setScale(unitPrototype.getScale());
            this.cursorFollow.setOrigin(0);
        })
    }

    update() {
        //TODO - export to UiControls
        if(this.cursorFollow) {
            let tileSize = GameDimensions.grid.tileSize;
            var x = Math.floor((this.input.mousePointer.x+this.cameras.main.scrollX)/tileSize)*tileSize;
            var y = Math.floor(((this.input.mousePointer.y+this.cameras.main.scrollY))/tileSize)*tileSize;
            this.cursorFollow.setPosition(x, y);
            if(!this.gameEngine.canPlaceUnit(x, y, this.cursorFollow.unitPrototype)) {
                this.cursorFollow.setTintFill(0xff0000);
            } else {
                this.cursorFollow.setTintFill(0x00ff00);
            }
        }
    }

    drawMap(gameEngine) {
        var map = gameEngine.getMap();
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
        gameUnit.setScale(unit.getScale());
        gameUnit.setOrigin(0);
        switch (unit.type) {
            case UnitTypes.BUILDING:
                gameUnit.gameObjectOver = buildingObjectOver(this);
                gameUnit.gameObjectOut = buildingObjectOut(this);
                gameUnit.on('pointerdown', selectUnitEmitEvent(this, gameUnit) );
                gameUnit.selectUnit = selectUnit(this, unit);
                gameUnit.deselectUnit = deselectUnit();
                
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
