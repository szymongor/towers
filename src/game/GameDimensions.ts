let gameWidth = 1000;
let uiSceneWidth = 200;

var GameDimensions = {
    gameWidth: gameWidth,
    gameHeight: 600,
    uiSceneWidth: uiSceneWidth,
    uiSceneHeight: 400,
    ui: {
        uiButtonsY: 420
    },
    minimapWidth: 0,
    minimapHeight: 0,
    mainCameraWidth: 0,
    mainCameraHeight: 0,
    finishScene: {
        x: (gameWidth-uiSceneWidth)/2,
        y: 600/2,
        width: 1000/3,
        height: 600/3
    },
    resourcesScene: {
        height: 50,
        width: 0
    },
    grid: {
        tileSize: 20,
        grassTileSize: 100,
        imgSize: 200
    },
    backgroundColor: 0x3a8210,
    selectColor: 0xefc53f,
    windowColor: 0xfc9003,
    font: 'atari'
};

GameDimensions.minimapWidth = GameDimensions.uiSceneWidth;
GameDimensions.minimapHeight =  GameDimensions.gameHeight - GameDimensions.uiSceneHeight;

GameDimensions.mainCameraWidth = GameDimensions.gameWidth - GameDimensions.uiSceneWidth;
GameDimensions.mainCameraHeight = GameDimensions.gameHeight;

GameDimensions.resourcesScene.width = GameDimensions.mainCameraWidth;

enum Scenes {
    UIScene = "UIScene",
    MainCamera = "MainCamera",
    ResourcesScene = "ResourcesScene",
    StartScene = "StartScene",
    FinishScene = "FinishScene"
}

export { GameDimensions, Scenes };
