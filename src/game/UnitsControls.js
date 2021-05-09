
const buildingObjectOver = function(game) {
    return (pointer, gameObject) => {
            var highlightSprite = game.add.sprite(gameObject.x, gameObject.y, gameObject.texture );
            highlightSprite.setScale(0.25,0.22)
            highlightSprite.setTintFill(0xffffff);
            highlightSprite.setDepth(-1);
            gameObject.highlight = highlightSprite;
        }
};

const buildingObjectOut = function(game) {
    return (pointer, gameObject) => {
        gameObject.clearTint();
        gameObject.highlight.destroy();
    }
};

export { buildingObjectOver, buildingObjectOut }