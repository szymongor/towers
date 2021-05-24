import { GameObjects } from "phaser";

const buildingObjectOver = function(gameScene) {
    return (pointer, gameObject) => {
            var highlightSprite = gameScene.add.sprite(gameObject.x, gameObject.y, gameObject.texture );
            highlightSprite.setTintFill(0xffffff);
            highlightSprite.setDepth(-2);
            highlightSprite.setOrigin(0);
            highlightSprite.setScale(gameObject.unit.getScale())
            gameObject.highlight = highlightSprite;
        }
};

const buildingObjectOut = function(gameScene) {
    return (pointer, gameObject) => {
        gameObject.clearTint();
        gameObject.highlight.destroy();
    }
};

const selectUnit = function(gameScene, unit) {
    return function() {
        var highlightSprite = gameScene.add.sprite(this.x, this.y, this.texture );
            highlightSprite.setTintFill(0x00ffdd);
            highlightSprite.setDepth(-1);
            highlightSprite.setOrigin(0);
            highlightSprite.setScale(unit.getScale())
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