import { CustomSprite, Unit, UnitTypes } from '../../engine/units/Unit';
import { unitObjectOver, unitObjectOut, selectUnitEmitEvent, selectUnitEmitEventOnClickProvider, selectUnit, deselectUnit, updateCursorFollow } from './UnitsControls';
import { createBoxSelect, createMainCamera, createMiniMapCamera } from './CameraControls';
import { GameDimensions } from  '../../GameDimensions';
import { EventChannels } from '../../engine/events/EventsRegistry';
import { GameEngine } from '../../engine/GameEngine';
import { registerOnResourceCollect, registerOnDamageDealt } from './Actions';
import { Bar } from '../utils/bars';
import { PlayersVision, Tile } from '../../engine/map/PlayerVision';
import { registerNewBuildingOrderEvents } from './orders/NewBuildingOrder';
import { UnitTaskNames } from '../../engine/units/UnitTask';
import { registerOuterUIEvents } from './orders/RegisterOuterUIEvents';
import { SpriteCache } from '../SpriteCache';
import { TowerGame } from '../TowerGame';
import { KeyboardListener } from '../KeyboardListener';
import { getActionsForUnits } from '../ui/SelectedUnitUI';

const TILE_SIZE = GameDimensions.grid.tileSize;

enum MainCameraEvents {
    UNIT_SELECTED = 'UNIT_SELECTED',
    DESELECT = 'DESELECT'
}

interface TransitionAnimation {
    sprite: Phaser.GameObjects.Sprite;
    sourceX: number;
    sourceY: number;
    dX: number;
    dY: number;
    angle?: number;
    steps: number;
    progress: number;
    transient: boolean;
}

interface CursorFollow extends Phaser.GameObjects.Sprite {
    unitPrototype?: Unit;
    action?: UiMode;
    actionOnClick?: () => void;
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
    tiles: Map<string, CustomSprite>;
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
    spriteCache: SpriteCache;
    keyboardListener: KeyboardListener;
    active: boolean;
    cursorFollow: CursorFollow;
    cursorSelect: Phaser.GameObjects.Rectangle;
    selectedUnits?: CustomSprite[];
    cameras: CameraManager;
    transitionAnimations: Set<TransitionAnimation>;
    latestVision: PlayersVision;
    latestVisibleSprites: VisibleSprites;



    constructor(handle: string, parent: TowerGame, gameEngine: GameEngine, spriteCache: SpriteCache) {
        super(handle);
        this.spriteCache = spriteCache;
        this.keyboardListener = parent.keyboardListener;
        this.active = false;
        this.cursorFollow;
        this.transitionAnimations = new Set();
        this.gameEngine = gameEngine;
        this.latestVisibleSprites = {tiles: new Map(), units: new Set() };
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
        this.events.on(MainCameraEvents.UNIT_SELECTED,(gameUnits: CustomSprite[]) => {
            if(this.selectedUnits != null) {
                this.selectedUnits.forEach(u=> u.deselectUnit(u));
                this.selectedUnits = [];
            }
            if(gameUnits) {
                this.selectedUnits = gameUnits;
                gameUnits.forEach(u=>u.selectUnit(u));
            } else {
                if(this.cursorFollow) {
                    this.cursorFollow.destroy();
                    this.cursorFollow = null;
                }
            }
        });

        this.events.on(MainCameraEvents.DESELECT, () => {
            if(this.selectedUnits) {
                this.selectedUnits.forEach(u=> {
                    u.deselectUnit(u);
                });
                this.selectedUnits = [];
            }
        });


        this.input.on(Phaser.Input.Events.POINTER_DOWN, this.pointerDown(this));
    }

    registerOuterEvents() {
        registerOuterUIEvents(this);
    }

    pointerDown(scene: MainCamera) {
        return (pointer: Phaser.Input.Pointer) => {

            //on right click
            if(pointer.rightButtonDown()) {
                if(scene.selectedUnits) {
                    let actions = getActionsForUnits(scene.selectedUnits.map(cs => cs.unit));
                    //choose default action on right click
                    if(actions[0]) {
                        //TODO utils
                        var x = Math.floor((scene.input.mousePointer.x+scene.cameras.main.scrollX)/TILE_SIZE)*TILE_SIZE;
                        var y = Math.floor(((scene.input.mousePointer.y+scene.cameras.main.scrollY))/TILE_SIZE)*TILE_SIZE;
                        let target = { x: x, y: y};
                        let action = actions[0][0];
                        let units = actions[0][1];
                        action.execute({target: target, units: units});
                        return;
                    }
                }
            }
            
            if(scene.cursorFollow) {
                scene.cursorFollow.actionOnClick();
            }
        }
    }

    update() {
        this.updateProgress(this);
        updateCursorFollow(this);
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
                u.dispose();
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

    drawBackground(tiles: Map<string, Tile>) {
        let scene = this;

        let tilesToDispose: string[] = Array.of();
        scene.latestVisibleSprites.tiles.forEach((tile,id) => {  
            if(!tiles.has(id)) {  
                tilesToDispose.push(id);
            }
        });

        tilesToDispose.forEach(id => {
            scene.latestVisibleSprites.tiles.get(id).dispose();
            scene.latestVisibleSprites.tiles.delete(id);
        })

        
        tiles.forEach(t => {
            if(!scene.latestVisibleSprites.tiles.has(t.id)) {
                let sprite = scene.spriteCache.get('grass', scene);
                sprite.setPosition(t.x,t.y)
                .setDepth(-2)
                .setOrigin(0)
                .setScale(GameDimensions.grid.tileSize/GameDimensions.grid.grassTileSize -0.01)
                scene.latestVisibleSprites.tiles.set(t.id, sprite);
            }
            
        });
    }

    createCustomSprite(game: MainCamera, unit: Unit): CustomSprite {
        var gameUnit: CustomSprite = game.spriteCache.get(unit.getTexture(), game);
        gameUnit.setPosition(unit.x, unit.y);
        gameUnit.unit = unit;
        unit.sprite = gameUnit;
        gameUnit.setScale(unit.getScale());
        gameUnit.setOrigin(0);

        switch (unit.type) {
            case UnitTypes.BUILDING:
                gameUnit.gameObjectOver = unitObjectOver(this);
                gameUnit.gameObjectOut = unitObjectOut(this);
                gameUnit.on('pointerdown', selectUnitEmitEventOnClickProvider(this, [gameUnit]) );
                gameUnit.selectUnit = selectUnit(this, unit);
                gameUnit.deselectUnit = deselectUnit(this);
                
                gameUnit.setInteractive();
                break;
            case UnitTypes.CREATURE:
                gameUnit.gameObjectOver = unitObjectOver(this);
                gameUnit.gameObjectOut = unitObjectOut(this);
                gameUnit.on('pointerdown', selectUnitEmitEventOnClickProvider(this, [gameUnit]) );
                gameUnit.selectUnit = selectUnit(this, unit);
                gameUnit.deselectUnit = deselectUnit(this);
                unit.sprite.setDepth(2);
                gameUnit.setInteractive();
                break;
            case UnitTypes.RESOURCE:
                gameUnit.selectUnit = selectUnit(this, unit);
                gameUnit.deselectUnit = deselectUnit(this);
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
            if(ta.sprite){
                ta.sprite.x += ta.dX;
                ta.sprite.y += ta.dY;
            }
            ta.progress += 1;
            if(ta.progress == ta.steps) {
                finished.add(ta);
            }
        });

        finished.forEach( (ta: TransitionAnimation) => {
            if(ta.transient) {
                this.spriteCache.dispose(ta.sprite);
                // ta.sprite.setActive(false).setVisible(false);
                // ta.sprite.destroy();
            }
            animations.delete(ta);
        });
    }

    boxSelectMove(p: Phaser.Input.Pointer) {
        if(this.cursorFollow != undefined) {
            if(this.cursorFollow.action != UiMode.BOX_MULTISELECT) { 
                this.cursorFollow.destroy();
                this.cursorFollow = null;
            }
        }

        

        if(this.cursorSelect != undefined) {
            let cam = this.cameras.getCamera('main');
            let x = p.x - this.cursorSelect.x + cam.scrollX;
            let y = p.y - this.cursorSelect.y + cam.scrollY;
            this.cursorSelect.setSize(x, y);
            
        } else {
            this.cursorSelect = createBoxSelect(this, p);
        }
    }

    boxSelect() {
        if(this.cursorSelect) {
            let x = this.cursorSelect.x;
            let y = this.cursorSelect.y;
            let dx = this.cursorSelect.width;
            let dy = this.cursorSelect.height;

            let units = this.gameEngine.boxSelect(x, y, dx, dy);
            selectUnitEmitEvent(this, units.map(u => u.sprite));
            
            this.cursorSelect.destroy();
            this.cursorSelect = null;
        }
    }
}

enum UiMode {
    BUILD_BUILDING = "BUILD_BUILDING",
    TARGETING_ACTION = "TARGETING_ACTION",
    BOX_MULTISELECT = "BOX_MULTISELECT"
}

export { MainCamera, UiMode, ViewCamera, CameraZone, Selectable, TransitionAnimation, MainCameraEvents };
