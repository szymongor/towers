var GameDimensions = {
    gameWidth: 800,
    gameHeight: 600,
    uiSceneWidth: 200,
    uiSceneHeight: 400,
};

GameDimensions.minimapWidth = GameDimensions.uiSceneWidth;
GameDimensions.minimapHeight =  GameDimensions.gameHeight - GameDimensions.uiSceneHeight;

export { GameDimensions };