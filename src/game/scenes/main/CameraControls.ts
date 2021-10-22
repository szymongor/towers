import { GameEngine } from '../../engine/GameEngine';
import { GameDimensions } from  '../../GameDimensions';
import { CameraZone, MainCamera, ViewCamera } from './MainCamera';
import { deselectUnitEmitEvent } from './UnitsControls';

const createMainCamera = function(game: MainCamera, gameEngine: GameEngine) {

    var mainCameraWidth = GameDimensions.gameWidth - GameDimensions.uiSceneWidth;
    var mainCameraHeight = GameDimensions.gameHeight;
    var xBound = gameEngine.mapBoard.height;
    var yBound = gameEngine.mapBoard.width;

    var main = game.cameras.main.setSize(mainCameraWidth, mainCameraHeight);
    main.setBounds(0, 0, xBound, yBound);
    main.setName('main');

    main.viewRectangle = game.add.rectangle(0, 0, GameDimensions.mainCameraWidth, GameDimensions.mainCameraHeight);
    main.viewRectangle.setOrigin(0,0);
    main.viewRectangle.setDepth(1);
    main.viewRectangle.setStrokeStyle(5, 0xFFFFFF);
    main.viewRectangle.moveTo = function(x, y) {
        this.setPosition(x,y);
        this.geom.setPosition(x,y);
    }
    main.ignore(main.viewRectangle);
    createMainCameraZone(game, main);

    return main;
};

const createMainCameraZone = function(gameScene: MainCamera, camera: ViewCamera) {
    var cameraZone: CameraZone = gameScene.add.zone(0, 0, GameDimensions.mainCameraWidth, GameDimensions.mainCameraHeight)
        .setOrigin(0).setName('mainCameraZone').setInteractive().setDepth(-2);
    cameraZone.setScrollFactor(0,0);
    cameraZone.camera = camera;
    cameraZone.gameObjectOut = (a,b) => {};
    cameraZone.gameObjectOver = (a,b) => {};

    cameraZone.on('pointermove', scrollAction(gameScene, camera));
    cameraZone.on('pointerdown', deselectUnitEmitEvent(gameScene, null));
    return cameraZone;

}

const scrollAction = function(gameScene: MainCamera, camera: ViewCamera) {
    return (p: Phaser.Input.Pointer) => {
        let kl = gameScene.keyboardListener;

        if(kl.isKeyPressed(Phaser.Input.Keyboard.KeyCodes.CTRL)) {
            //TODO MultiSelect
        } else {
            mapScroll(camera)(p);
        }
    }
    
}

const mapScroll = function(camera: ViewCamera) {
    return (p: Phaser.Input.Pointer) => {
        
    if (!p.isDown) return;
        camera.scrollX -= (p.x - p.prevPosition.x) / camera.zoom;
        camera.scrollY -= (p.y - p.prevPosition.y) / camera.zoom;

        camera.viewRectangle.moveTo(camera.scrollX,camera.scrollY);
    };
}


const createMiniMapCamera = function(gameScene: MainCamera, gameEngine: GameEngine) {

    var width = GameDimensions.minimapWidth;
    var height = GameDimensions.minimapHeight;

    var xPos = GameDimensions.gameWidth - width;
    var yPos = 0;

    var mapBoard = gameEngine.getMap();

    var minimapZoom = { x: height/ mapBoard.height,
         y: width / mapBoard.width};
    var minimap = gameScene.cameras.add(xPos, yPos, width, height)
        .setZoom(minimapZoom.x, minimapZoom.y).setName('mini');
    minimap.setOrigin(0,0);
    minimap.setBackgroundColor(0x002244);

    var cameraZone = gameScene.add.zone(xPos, yPos, width, height)
        .setOrigin(0).setName('minimapCameraZone').setInteractive().setDepth(0);

    cameraZone.on('pointermove', miniMapScroll(minimap));

    return minimap;
}

const miniMapScroll = function(camera: ViewCamera) {
    return (p: Phaser.Input.Pointer) => {
        //todo
        return;
    };
}

export { createMainCamera, createMiniMapCamera }