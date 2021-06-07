var GameDimensions = {
    gameWidth: 1000,
    gameHeight: 600,
    uiSceneWidth: 200,
    uiSceneHeight: 400,
    grid: {
        tileSize: 50,
        grassTileSize: 100,
        imgSize: 200
    }
};

GameDimensions.minimapWidth = GameDimensions.uiSceneWidth;
GameDimensions.minimapHeight =  GameDimensions.gameHeight - GameDimensions.uiSceneHeight;

GameDimensions.mainCameraWidth = GameDimensions.gameWidth - GameDimensions.uiSceneWidth;
GameDimensions.mainCameraHeight = GameDimensions.gameHeight;

var Scenes = {
    "UIScene":"UIScene",
    "MainCamera":"MainCamera"
}

export { GameDimensions, Scenes };
