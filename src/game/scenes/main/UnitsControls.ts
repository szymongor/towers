import { GameObjects } from "phaser";
import { CustomSprite, Unit } from "../../engine/units/Unit";
import { MainCamera } from "./MainCamera";

const buildingObjectOver = function(gameScene: MainCamera) {
    return (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => {
            var highlightSprite = gameScene.add.sprite(gameObject.x, gameObject.y, gameObject.texture );
            highlightSprite.setTintFill(0xffffff);
            highlightSprite.setDepth(-2);
            highlightSprite.setOrigin(0);
            highlightSprite.setScale(gameObject.unit.getScale())
            gameObject.highlight = highlightSprite;
        }
};

const buildingObjectOut = function(gameScene: MainCamera) {
    return (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => {
        gameObject.clearTint();
        gameObject.highlight.destroy();
    }
};

const selectUnit = function(gameScene: MainCamera, unit: Unit) {
    return function() {
        var highlightSprite = gameScene.add.sprite(this.x, this.y, this.texture );
            highlightSprite.setTintFill(0x00ffdd);
            highlightSprite.setDepth(-1);
            highlightSprite.setOrigin(0);
            highlightSprite.setScale(unit.getScale())
            this.highlightSelected = highlightSprite;
            this.rangeHighlight = createRangeHighlight(gameScene, unit);
    }
}

const createRangeHighlight = function(gameScene: MainCamera, unit: Unit) {
    let centre = unit.getCentre();
    let highlight = gameScene.add.circle(centre.x, centre.y, unit.getActionRange());
    highlight.setStrokeStyle(4, 0x90e079);
    highlight.setDepth(-2);

    return highlight;
}

const deselectUnit = function() {
    return function(gameUnit: CustomSprite) {
        this.clearTint();
        this.highlightSelected.destroy();
        this.rangeHighlight.visible = false;
    }
}

const selectUnitEmitEvent = function(gameScene: MainCamera, gameObject: CustomSprite) {
    
    return function() {
        gameScene.events.emit('unitselected', gameObject);
    }
}

const deselectUnitEmitEvent = function(gameScene: MainCamera, gameObject: CustomSprite) {
    
    return function() {
        if(gameScene.cursorFollow == null) {
            gameScene.events.emit('deselect', gameObject);
        }
    }
}



export { buildingObjectOver, buildingObjectOut, selectUnitEmitEvent, selectUnit, deselectUnit, deselectUnitEmitEvent}