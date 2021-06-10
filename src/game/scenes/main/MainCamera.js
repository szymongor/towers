import { UnitTypes } from '../../engine/Unit';
import { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit } from './UnitsControls';
import { createMainCamera, createMiniMapCamera } from './CameraControls';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { UiScene } from '../ui/UiScene';

import { UiSceneEvents } from '../ui/UiSceneEvents';
import { EventRegistry } from '../../engine/events/EventsRegistry';

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
    }

    create() {
        this.gameEngine = this.registry.gameEngine;
        
        this.cameras.main = createMainCamera(this, this.gameEngine);
        this.cameras.minimap = createMiniMapCamera(this, this.gameEngine);

        this.drawMap(this.gameEngine);
        
        this.registerUnitPlaced(this);
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

        this.input.on(Phaser.Input.Events.POINTER_DOWN, this.placeUnit(this));


        
    }

    registerOuterEvents() {
        //TODO - export to UiControls
        this.scene.get(Scenes.UIScene).events.on(UiSceneEvents.BUILDBUILDING, (e) => {
            if(this.cursorFollow) {
                this.cursorFollow.destroy();
            }
            let unitPrototype = this.gameEngine.unitFactory.of(e.building);
            this.cursorFollow = this.add.sprite(-100, -100, unitPrototype.name);
            this.cursorFollow.unitPrototype = unitPrototype;
            this.cursorFollow.setTintFill(0x00ff00);
            this.cursorFollow.setScale(unitPrototype.getScale());
            this.cursorFollow.setOrigin(0);
            this.cursorFollow.action = MainCamera.UiMode.BUILD_BUILDING;
        })

        this.scene.get(Scenes.UIScene).events.on(UiSceneEvents.DESELECT_BUILDING, (e) => {
            if(this.cursorFollow) {
                this.cursorFollow.destroy();
            }
            this.cursorFollow = null;
        })

    }

    registerUnitPlaced() {
        let subscriber = {
            call: this.unitPlaced(this)
        }
        this.gameEngine.events.subscribe(EventRegistry.events.BUILDING_PLACED, subscriber);
    }

    unitPlaced(scene) {
        return (event) => {
            let unit = event.data.unitPrototype;
            if(unit) {
                scene.gameUnits.push(scene.createGameUnit(scene, unit));
            }
        }
        
    }

    placeUnit(scene) {
        return () => {
            if(scene.cursorFollow && scene.cursorFollow.action == MainCamera.UiMode.BUILD_BUILDING) {
                let unit = scene.gameEngine.orderBuilding(scene.cursorFollow.unitPrototype);
                // if(unit) {
                //     scene.createGameUnit(scene, unit);
                // }
                selectUnitEmitEvent(scene, null)(); //TODO - deselectUnit

            }
        }
    }

    update() {
        this.updateProgress(this);
        //TODO - export to UiControls
        if(this.cursorFollow) {
            let tileSize = GameDimensions.grid.tileSize;
            var x = Math.floor((this.input.mousePointer.x+this.cameras.main.scrollX)/tileSize)*tileSize;
            var y = Math.floor(((this.input.mousePointer.y+this.cameras.main.scrollY))/tileSize)*tileSize;

            if(this.cameras.main.viewRectangle.geom.contains(x,y)) {
                this.cursorFollow.setPosition(x, y);
                this.cursorFollow.unitPrototype.x = x;
                this.cursorFollow.unitPrototype.y = y;
                if(!this.gameEngine.canPlaceUnit(this.cursorFollow.unitPrototype)) {
                    this.cursorFollow.setTintFill(0xff0000);
                } else {
                    this.cursorFollow.setTintFill(0x00ff00);
                }
            }
        }
    }

    updateProgress(scene) {
        
        scene.gameUnits.forEach(gameUnit => {
            if(gameUnit.unit.state.construction) {
                let u = gameUnit.unit;
                let tileSize = GameDimensions.grid.tileSize;
                let w = u.size * tileSize;
                if(gameUnit.progressBar == null) {
                    
                    let x = u.x;
                    let y = u.y;
                    let w = u.size * tileSize;
                    let bar = scene.add.rectangle(x, y, w * u.getProgress(), 8,0x42c5f5);
                    bar.setOrigin(0);
                    gameUnit.progressBar = bar;
                } else {
                    gameUnit.progressBar.setSize( w * u.getProgress(), 8);
                }
                

            }
        })

    }

    drawMap(gameEngine) {
        var map = this.gameEngine.getMap();
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
        var gameUnit = game.add.sprite(unit.x, unit.y, unit.getTexture());
        gameUnit.unit = unit;
        unit.gameUnit = gameUnit;
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

MainCamera.UiMode = {
    "BUILD_BUILDING": "BUILD_BUILDING"
}

export { MainCamera };
