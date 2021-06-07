import { GameDimensions } from  '../../GameDimensions';
import { deselectUnitEmitEvent } from './UnitsControls';

const createMainCamera = function(game, gameEngine) {

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

const createMainCameraZone = function(gameScene, camera) {
    var cameraZone = gameScene.add.zone(0, 0, GameDimensions.mainCameraWidth, GameDimensions.mainCameraHeight)
        .setOrigin(0).setName('mainCameraZone').setInteractive().setDepth(-2);
    cameraZone.setScrollFactor(0,0);
    cameraZone.camera = camera;
    cameraZone.gameObjectOut = (a,b) => {};
    cameraZone.gameObjectOver = (a,b) => {};

    
    cameraZone.on('pointermove', mapScroll(camera));
    cameraZone.on('pointerdown', deselectUnitEmitEvent(gameScene, null));
    return cameraZone;

}

const mapScroll = function(camera) {
    return (p) => {
    if (!p.isDown) return;
        camera.scrollX -= (p.x - p.prevPosition.x) / camera.zoom;
        camera.scrollY -= (p.y - p.prevPosition.y) / camera.zoom;

        camera.viewRectangle.moveTo(camera.scrollX,camera.scrollY);
    };
}


const createMiniMapCamera = function(gameScene, gameEngine) {

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

const miniMapScroll = function(camera) {
    return (p) => {
        //todo
        return;
    };
}

export { createMainCamera, createMiniMapCamera }