var GameDimensions = {
    gameWidth: 1000,
    gameHeight: 600,
    uiSceneWidth: 200,
    uiSceneHeight: 400,
    resourcesScene: {
        height: 50
    },
    grid: {
        tileSize: 50,
        grassTileSize: 100,
        imgSize: 200
    },
    bacgroudColor: 0xaaff00
};

GameDimensions.minimapWidth = GameDimensions.uiSceneWidth;
GameDimensions.minimapHeight =  GameDimensions.gameHeight - GameDimensions.uiSceneHeight;

GameDimensions.mainCameraWidth = GameDimensions.gameWidth - GameDimensions.uiSceneWidth;
GameDimensions.mainCameraHeight = GameDimensions.gameHeight;

GameDimensions.resourcesScene.width = GameDimensions.mainCameraWidth;

var Scenes = {
    "UIScene":"UIScene",
    "MainCamera":"MainCamera",
    "ResourcesScene":"ResourcesScene"
}

export { GameDimensions, Scenes };
