import { CustomSprite, Unit, UnitTypes } from '../../engine/units/Unit';
import { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit } from './UnitsControls';
import { createMainCamera, createMiniMapCamera } from './CameraControls';
import { GameDimensions, Scenes } from  '../../GameDimensions';
import { UiSceneEvents, UiSetBuildingModeEvent } from '../ui/UiSceneEvents';
import { EventChannels } from '../../engine/events/EventsRegistry';
import { GameEngine } from '../../engine/GameEngine';
import { GameEvent } from '../../engine/events/GameEvent';
import { MapBoard } from '../../engine/map/MapBoard';
import { registerOnResourceCollect, registerOnDamageDealt } from './Actions';
import { Bar } from '../utils/bars';
import { PlayersVision, Tile } from '../../engine/map/PlayerVision';
import { tileSizeFloor } from '../../utils/utils';
import { registerNewBuildingOrderEvents, registerOuterUIEvents, updateBuildingOrderCursor, updateTargetingAction } from './orders/NewBuildingOrder';
import { UnitTaskNames } from '../../engine/units/UnitTask';
import { UiActionType } from '../../engine/units/actions/UnitActionsUI';

interface TransitionAnimation {
    sprite: Phaser.GameObjects.Sprite;
    sourceX: number;
    sourceY: number;
    dX: number;
    dY: number;
    angle?: number;
    steps: number;
    progress: number;
}

interface CursorFollow extends Phaser.GameObjects.Sprite {
    unitPrototype?: Unit;
    action?: UiMode;
    actionOnClick?: () => void;
}

interface TileSprite extends Phaser.GameObjects.Sprite {
    x: number;
    y: number;
}

interface CameraManager extends Phaser.Cameras.Scene2D.CameraManager {
    main: ViewCamera
}

interface ViewRectangle extends Phaser.GameObjects.Shape {
    moveTo?: (x: number,y: number) => void;
}

interface ViewCamera extends Phaser.Cameras.Scene2D.Camera {
    viewRectangle?: ViewRectangle
}

interface VisibleSprites {
    tiles: Set<Phaser.GameObjects.Sprite>;
    units: Set<CustomSprite>;
}


interface Selectable {
    gameObjectOver?: (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => void;
    gameObjectOut?: (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => void;
    selectUnit?: (gameUnit: CustomSprite) => void;
    deselectUnit?: (gameUnit: CustomSprite) => void;
}

interface CameraZone extends Phaser.GameObjects.Zone, Selectable {
    camera?: ViewCamera;

}

class MainCamera extends Phaser.Scene {
    gameEngine: GameEngine;
    active: boolean;
    cursorFollow: CursorFollow;
    selectedUnit?: CustomSprite;
    cameras: CameraManager;
    transitionAnimations: Set<TransitionAnimation>;
    latestVision: PlayersVision;
    latestVisibleSprites: VisibleSprites;


    constructor(handle: string, parent: Phaser.Scene, gameEngine: GameEngine) {
        super(handle);
        this.gameEngine;
        this.active = false;
        this.cursorFollow;
        this.transitionAnimations = new Set();
        this.gameEngine = gameEngine;
        this.latestVisibleSprites = {tiles: new Set(), units: new Set() }
    }

    //load assets
    preload() {
    }

    create() {
        this.cameras.main = createMainCamera(this, this.gameEngine);
        this.cameras.addExisting(createMiniMapCamera(this, this.gameEngine));

        this.drawMap(this.gameEngine);
        
        registerNewBuildingOrderEvents(this);
        registerOnResourceCollect(this, this.gameEngine);
        registerOnDamageDealt(this, this.gameEngine);
        this.registerUnitDestroyed(this);
        this.selectSprite();
    }

    selectSprite() {
        this.input.on('gameobjectover', (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => {
            if(gameObject.gameObjectOver) {
                gameObject.gameObjectOver(pointer, gameObject);
            }
        });

        this.input.on('gameobjectout', (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => {
            if(gameObject.gameObjectOut) {
                gameObject.gameObjectOut(pointer, gameObject);
            }
        });

        //highlight selected unit
        this.events.on('unitselected',(gameUnit: CustomSprite) => {
            if(this.selectedUnit != null) {
                this.selectedUnit.deselectUnit(this.selectedUnit);
            }
            if(gameUnit) {
                this.selectedUnit = gameUnit;
                gameUnit.selectUnit(gameUnit);
            } else {
                if(this.cursorFollow) {
                    this.cursorFollow.destroy();
                    this.cursorFollow = null;
                }
            }
        });

        this.events.on('deselect', () => {
            if(this.selectedUnit) {
                this.selectedUnit.deselectUnit(this.selectedUnit);
            }
        });


        this.input.on(Phaser.Input.Events.POINTER_DOWN, this.pointerDown(this));
    }

    registerOuterEvents() {
        registerOuterUIEvents(this);
    }

    pointerDown(scene: MainCamera) {
        return () => {
            if(scene.cursorFollow) {
                scene.cursorFollow.actionOnClick();
            }
        }
    }

    update() {
        this.updateProgress(this);
        //TODO - export to UiControls
        if(this.cursorFollow) {
            
            switch(this.cursorFollow.action) {
                case UiMode.BUILD_BUILDING: {
                    updateBuildingOrderCursor(this);
                    break;
                }
                case UiMode.TARGETING_ACTION: {
                    updateTargetingAction(this);
                    break;
                }
                
            }
            
        }

        this.updateTransitionAnimation();
    }

    updateProgress(scene: MainCamera) {
        
        scene.latestVisibleSprites.units.forEach(gameUnit => {
            let unitProgress = gameUnit.unit.getProgress();
            if(gameUnit.unit.state.construction) {
                //CONSTRUCTION PROGRESS BAR
                let u = gameUnit.unit;
                let tileSize = GameDimensions.grid.tileSize;
                let w = u.size * tileSize;
                if(gameUnit.progressBar == null) {
                    
                    let x = u.x;
                    let y = u.y;
                    let w = u.size * tileSize;
                    let bar = new Bar(this, x, y, unitProgress.get(UnitTaskNames.CONSTRUCTION), w, 8, 0x42c5f5);
                    
                    gameUnit.progressBar = bar;
                } else {
                    gameUnit.progressBar.updateProgress( unitProgress.get(UnitTaskNames.CONSTRUCTION));
                }
            } else {
                //PRODUCTUION PROGRESS BAR
                if(unitProgress.get(UnitTaskNames.PRODUCTION)) {
                    let u = gameUnit.unit;
                    let tileSize = GameDimensions.grid.tileSize;
                    let w = u.size * tileSize;
                    if(gameUnit.progressBar == null) {
                        
                        let x = u.x;
                        let y = u.y;
                        let w = u.size * tileSize;
                        let bar = new Bar(this, x, y, unitProgress.get(UnitTaskNames.PRODUCTION), w, 8, 0xf5ad42);
                        
                        gameUnit.progressBar = bar;
                    } else {
                        gameUnit.progressBar.updateProgress( unitProgress.get(UnitTaskNames.PRODUCTION));
                    }

                }
                

            }
        })

    }

    registerUnitDestroyed(scene: MainCamera) {
        let subscriber = {
            call: () => {scene.drawMap(scene.gameEngine)}
        }
        scene.gameEngine.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
    }

    drawMap(gameEngine: GameEngine) {
        
        let vision : PlayersVision = gameEngine.getPlayerVision();
        let units = vision.units;
        this.drawBackground(vision.tiles);

        this.latestVisibleSprites.units.forEach(u => {
            if(!units.has(u.unit)) {
                u.unit.sprite = undefined;
                u.destroy();
            }
        })
        
        units.forEach(unit => {
            if(unit.sprite == undefined) {
                var gameUnit = this.createCustomSprite(this, unit);
                this.latestVisibleSprites.units.add(gameUnit);
            }
        });

        this.latestVisibleSprites.units = new Set();

        units.forEach(u => {
            this.latestVisibleSprites.units.add(u.sprite);
        })        
    }

    drawBackground(tiles: Map<String, Tile>) {

        this.latestVisibleSprites.tiles.forEach(t => {
            t.destroy()});
            this.latestVisibleSprites.tiles = new Set();
        let scene = this;

        tiles.forEach(t => {
            scene.latestVisibleSprites.tiles.add(scene.add.sprite(t.x, t.y, 'grass')
                .setDepth(-2)
                .setOrigin(0)
                .setScale(GameDimensions.grid.tileSize/GameDimensions.grid.grassTileSize -0.01));
        })
    }

    createCustomSprite(game: MainCamera, unit: Unit): CustomSprite {
        var gameUnit:CustomSprite = game.add.sprite(unit.x, unit.y, unit.getTexture());
        gameUnit.unit = unit;
        unit.sprite = gameUnit;
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
            case UnitTypes.CREATURE:
                gameUnit.gameObjectOver = buildingObjectOver(this);
                gameUnit.gameObjectOut = buildingObjectOut(this);
                gameUnit.on('pointerdown', selectUnitEmitEvent(this, gameUnit) );
                gameUnit.selectUnit = selectUnit(this, unit);
                gameUnit.deselectUnit = deselectUnit();
                unit.sprite.setDepth(2);
                gameUnit.setInteractive();
                break;
            case UnitTypes.RESOURCE:
                gameUnit.selectUnit = selectUnit(this, unit);
                gameUnit.deselectUnit = deselectUnit();
                break;
            default:
                gameUnit.gameObjectOver = (pointer, gameObject) => { };
                gameUnit.gameObjectOut = (pointer, gameObject) => { };
        }
        return gameUnit;
    }

    addTransitionAnimation(ta: TransitionAnimation) {
        this.transitionAnimations.add(ta);
    }

    updateTransitionAnimation() {
        let finished = new Set();
        let animations = this.transitionAnimations;
        animations.forEach((ta) => {
            ta.sprite.x += ta.dX;
            ta.sprite.y += ta.dY;
            ta.sprite.angle += 0.5;
            ta.progress += 1;
            if(ta.progress == ta.steps) {
                finished.add(ta);
            }
        });

        finished.forEach( (ta: TransitionAnimation) => {
            animations.delete(ta);
            ta.sprite.destroy();
        });
    }
}

enum UiMode {
    BUILD_BUILDING = "BUILD_BUILDING",
    TARGETING_ACTION = "TARGETING_ACTION"
}

export { MainCamera, UiMode, ViewCamera, CameraZone, Selectable, TransitionAnimation };
