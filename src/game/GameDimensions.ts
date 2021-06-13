var GameDimensions = {
    gameWidth: 1000,
    gameHeight: 600,
    uiSceneWidth: 200,
    uiSceneHeight: 400,
    minimapWidth: 0,
    minimapHeight: 0,
    mainCameraWidth: 0,
    mainCameraHeight: 0,
    resourcesScene: {
        height: 50,
        width: 0
    },
    grid: {
        tileSize: 50,
        grassTileSize: 100,
        imgSize: 200
    },
    backgroundColor: 0x3a8210
};

GameDimensions.minimapWidth = GameDimensions.uiSceneWidth;
GameDimensions.minimapHeight =  GameDimensions.gameHeight - GameDimensions.uiSceneHeight;

GameDimensions.mainCameraWidth = GameDimensions.gameWidth - GameDimensions.uiSceneWidth;
GameDimensions.mainCameraHeight = GameDimensions.gameHeight;

GameDimensions.resourcesScene.width = GameDimensions.mainCameraWidth;

enum Scenes {
    UIScene = "UIScene",
    MainCamera = "MainCamera",
    ResourcesScene = "ResourcesScene"
}

export { GameDimensions, Scenes };
