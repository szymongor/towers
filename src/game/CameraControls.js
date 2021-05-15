const createMainCamera = function(game, x, y, xBound, yBound) {
    var main = game.cameras.main.setSize(x, y);
    main.setBounds(0, 0, xBound, yBound);
    main.setName('main');

    main.viewRectangle = game.add.rectangle(0, 0, x, y);
    main.viewRectangle.setOrigin(0,0);
    main.viewRectangle.setDepth(1);
    main.viewRectangle.setStrokeStyle(5, 0xFFFFFF);
    return main;
};

const mapScroll = function(gameEngine, camera) {
    var game = gameEngine.game;
    if (game.input.activePointer.isDown) {	
        if (game.origDragPoint) {		
            // move the camera by the amount the mouse has moved since last update		
                camera.scrollX += game.origDragPoint.x - game.input.activePointer.position.x;		
                camera.scrollY += game.origDragPoint.y - game.input.activePointer.position.y;
                camera.viewRectangle.x = camera.scrollX
                camera.viewRectangle.y = camera.scrollY;
            }	
            // set new drag origin to current position
            
            game.origDragPoint = game.input.activePointer.position.clone();
        }
        else {	game.origDragPoint = null;}
}

const createMiniMapCamera = function(gameEngine, mapBoard, heigh, width, xPos, yPos) {
    var minimapZoom = { x: heigh/ mapBoard.height , y: width / mapBoard.width};
    var minimap = gameEngine.cameras.add(xPos, yPos, heigh, width)
        .setZoom(minimapZoom.x, minimapZoom.y).setName('mini');
    minimap.setOrigin(0,0);
    minimap.setBackgroundColor(0x002244);

    return minimap;
}

export { createMainCamera, mapScroll, createMiniMapCamera }