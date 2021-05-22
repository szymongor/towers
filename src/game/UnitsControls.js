import { GameObjects } from "phaser";

const buildingObjectOver = function(gameScene) {
    return (pointer, gameObject) => {
            var highlightSprite = gameScene.add.sprite(gameObject.x, gameObject.y, gameObject.texture );
            highlightSprite.setScale(0.25,0.22)
            highlightSprite.setTintFill(0xffffff);
            highlightSprite.setDepth(-2);
            gameObject.highlight = highlightSprite;
        }
};

const buildingObjectOut = function(gameScene) {
    return (pointer, gameObject) => {
        gameObject.clearTint();
        gameObject.highlight.destroy();
    }
};

const selectUnit = function(gameScene) {
    return function() {
        var highlightSprite = gameScene.add.sprite(this.x, this.y, this.texture );
            highlightSprite.setScale(0.25,0.22)
            highlightSprite.setTintFill(0x00ffdd);
            highlightSprite.setDepth(-1);
            this.highlightSelected = highlightSprite;
    }
}

const deselectUnit = function() {
    return function(gameUnit) {
        this.clearTint();
        this.highlightSelected.destroy();
    }
}

const selectUnitEmitEvent = function(gameScene, gameObject) {
    return function() {
        gameScene.events.emit('unitselected', gameObject);
    }
}



export { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit}