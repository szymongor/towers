import { GameDimensions } from  './GameDimensions';

const createMainCamera = function(game, mapBoard) {

    var mainCameraWidth = GameDimensions.gameWidth - GameDimensions.uiSceneWidth;
    var mainCameraHeight = GameDimensions.gameHeight;
    var xBound = mapBoard.height;
    var yBound = mapBoard.width;

    var main = game.cameras.main.setSize(mainCameraWidth, mainCameraHeight);
    main.setBounds(0, 0, xBound, yBound);
    main.setName('main');

    main.viewRectangle = game.add.rectangle(0, 0, GameDimensions.mainCameraWidth, GameDimensions.mainCameraHeight);
    main.viewRectangle.setOrigin(0,0);
    main.viewRectangle.setDepth(1);
    main.viewRectangle.setStrokeStyle(5, 0xFFFFFF);
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

    cameraZone.on('pointermove',mapScroll(camera)); 
    return cameraZone;

}

const mapScroll = function(camera) {
    return (p) => {
    if (!p.isDown) return;
        camera.scrollX -= (p.x - p.prevPosition.x) / camera.zoom;
        camera.scrollY -= (p.y - p.prevPosition.y) / camera.zoom;
        camera.viewRectangle.x = camera.scrollX
        camera.viewRectangle.y = camera.scrollY;
    };
}


const createMiniMapCamera = function(gameEngine, mapBoard) {

    var width = GameDimensions.minimapWidth;
    var height = GameDimensions.minimapHeight;

    var xPos = GameDimensions.gameWidth - width;
    var yPos = 0;

    var minimapZoom = { x: height/ mapBoard.height,
         y: width / mapBoard.width};
    var minimap = gameEngine.cameras.add(xPos, yPos, width, height)
        .setZoom(minimapZoom.x, minimapZoom.y).setName('mini');
    minimap.setOrigin(0,0);
    minimap.setBackgroundColor(0x002244);

    var cameraZone = gameEngine.add.zone(xPos, yPos, width, height)
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