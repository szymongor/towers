import { CustomSprite, Unit } from "../../engine/units/Unit";
import { MainCamera, MainCameraEvents, UiMode } from "./MainCamera";
import { updateTargetingAction } from "./orders/MoveUnitOrder";
import { updateBuildingOrderCursor } from "./orders/NewBuildingOrder";

const unitObjectOver = function (gameScene: MainCamera) {
    return (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => {
        if(!gameObject.highlight) {
            var highlightSprite = gameScene.add.sprite(gameObject.x, gameObject.y, gameObject.texture);
            highlightSprite.setTintFill(0xffffff);
            highlightSprite.setDepth(-2);
            highlightSprite.setOrigin(0);
            highlightSprite.setScale(gameObject.unit.getScale())
            gameObject.highlight = highlightSprite;
        }
        
    }
};

const unitObjectOut = function (gameScene: MainCamera) {
    return (pointer: Phaser.Input.Pointer, gameObject: CustomSprite) => {
        gameObject.clearTint();
        if(gameObject.highlight && !gameScene.selectedUnits.includes(gameObject)) {
            gameObject.highlight.destroy();
        }
        
    }
};

const selectUnit = function (gameScene: MainCamera, unit: Unit) {
    return function (customSprite: CustomSprite) {
        //TODO refactor gameScene.add.sprite to SpriteCache
        if(customSprite.highlight) {
            customSprite.highlight.destroy();
        }
        var highlightSprite = gameScene.add.sprite(unit.x, unit.y, customSprite.texture);
        highlightSprite.setTintFill(0x00ffdd);
        highlightSprite.setDepth(-1);
        highlightSprite.setOrigin(0);
        highlightSprite.setScale(unit.getScale())
        customSprite.highlight = highlightSprite;
        customSprite.rangeHighlight = createRangeHighlight(gameScene, unit);
    }
}
const createRangeHighlight = function (gameScene: MainCamera, unit: Unit) {
    let centre = unit.getCentre();
    let highlight = gameScene.add.circle(centre.x, centre.y, unit.getActionRange());
    highlight.setStrokeStyle(4, 0x90e079);
    highlight.setDepth(-2);

    return highlight;
}


const deselectUnit = function (gameScene: MainCamera) {
    return function (gameUnit: CustomSprite) {
        gameUnit.clearTint();
        if(gameUnit.highlight) {
            gameUnit.highlight.destroy();
            gameUnit.highlight = null;
        }
        gameUnit.rangeHighlight.setVisible(false);
    }
}

//TODO MULTI-SELECT REFACTOR
const selectUnitEmitEventOnClickProvider = function (gameScene: MainCamera, gameObjects: CustomSprite[]) {
    return function (pointer: Phaser.Input.Pointer) {
        if(pointer.leftButtonDown()) {
            selectUnitEmitEvent(gameScene, gameObjects);
        } 
    }
}

const selectUnitEmitEvent = function (gameScene: MainCamera, gameObjects: CustomSprite[]) {
    gameScene.events.emit(MainCameraEvents.UNIT_SELECTED, gameObjects);
}

const deselectUnitEmitEvent = function (gameScene: MainCamera, gameObjects: CustomSprite[]) {

    return function (pointer: Phaser.Input.Pointer) {
        if(pointer.leftButtonDown()) {
            if (gameScene.cursorFollow == null) {
                gameScene.events.emit(MainCameraEvents.DESELECT, gameObjects);
            }
        }
    }
}

const updateCursorFollow = (scene: MainCamera) => {
    if (scene.cursorFollow) {
        switch (scene.cursorFollow.action) {
            case UiMode.BUILD_BUILDING: {
                updateBuildingOrderCursor(scene);
                break;
            }
            case UiMode.TARGETING_ACTION: {
                updateTargetingAction(scene);
                break;
            }
        }
    }
}



export {
    unitObjectOver,
    unitObjectOut,
    selectUnitEmitEventOnClickProvider,
    selectUnitEmitEvent,
    selectUnit,
    deselectUnit,   
    deselectUnitEmitEvent,
    updateCursorFollow,
}