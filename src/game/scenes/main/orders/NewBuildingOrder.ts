import { EventChannels } from "../../../engine/events/EventsRegistry";
import { GameEvent } from "../../../engine/events/GameEvent";
import { GameDimensions, Scenes } from "../../../GameDimensions";
import { tileSizeFloor } from "../../../utils/utils";
import { TargetingActionEvent, UiSceneEvents, UiSetBuildingModeEvent } from "../../ui/UiSceneEvents";
import { MainCamera, UiMode } from "../MainCamera";
import { selectUnitEmitEvent } from "../UnitsControls";


const registerNewBuildingOrderEvents = function(scene: MainCamera): void {
    registerUnitPlaced(scene);
}

const registerUnitPlaced = function(scene: MainCamera): void {
    let subscriber = {
        call: unitPlaced(scene)
    }
    scene.gameEngine.events.subscribe(EventChannels.BUILDING_PLACED, subscriber);
}

const unitPlaced = function(scene: MainCamera): (event: GameEvent) => void {
    return (event: GameEvent) => {
        let unit = event.data.unitPrototype;
        if(unit) {
            scene.latestVisibleSprites.units.add(scene.createCustomSprite(scene, unit));
            scene.drawMap(scene.gameEngine);
        }
    }  
}

const updateBuildingOrderCursor = function(scene: MainCamera): void {
    let tileSize = GameDimensions.grid.tileSize;
    var x = Math.floor((scene.input.mousePointer.x+scene.cameras.main.scrollX)/tileSize)*tileSize;
    var y = Math.floor(((scene.input.mousePointer.y+scene.cameras.main.scrollY))/tileSize)*tileSize;

    if(scene.cameras.main.viewRectangle.geom.contains(x,y)) {
        
        let unitHalfSize = tileSizeFloor(scene.cursorFollow.unitPrototype.size*tileSize/2);
        let posX = x - unitHalfSize;
        let posY = y - unitHalfSize;
        scene.cursorFollow.setPosition(posX, posY);
        scene.cursorFollow.unitPrototype.x = posX;
        scene.cursorFollow.unitPrototype.y = posY;
        if(!scene.gameEngine.canPlaceUnit(scene.cursorFollow.unitPrototype)) {
            scene.cursorFollow.setTintFill(0xff0000);
        } else {
            scene.cursorFollow.setTintFill(0x00ff00);
        }
        scene.cursorFollow.actionOnClick = () => {
            scene.gameEngine.orderBuilding(scene.cursorFollow.unitPrototype);
            selectUnitEmitEvent(scene, null)(); //TODO - deselectUnit
        }
    }
}

const registerOuterUIEvents = function(scene: MainCamera): void {
    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.BUILDBUILDING, (e: UiSetBuildingModeEvent) => {
        if(scene.cursorFollow) {
            scene.cursorFollow.destroy();
        }
        let tempCoords = {
            x: -100,
            y: -100
        }
        let unitPrototype = scene.gameEngine.unitFactory.of(e.building, tempCoords.x, tempCoords.y, null);
        scene.cursorFollow = scene.add.sprite(tempCoords.x, tempCoords.y, unitPrototype.getTexture());
        scene.cursorFollow.setOrigin(0);
        scene.cursorFollow.unitPrototype = unitPrototype;
        scene.cursorFollow.setTintFill(0x00ff00);
        scene.cursorFollow.setScale(unitPrototype.getScale());
        scene.cursorFollow.action = UiMode.BUILD_BUILDING;
    });

    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.DESELECT_BUILDING, (e: UiSetBuildingModeEvent) => {
        if(scene.cursorFollow) {
            scene.cursorFollow.destroy();
        }
        scene.cursorFollow = null;
    });

    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.TARGETING_ACTION, onTargetingActionProvider(scene));
}

// TARGETING ACTIONS

const onTargetingActionProvider = (scene: MainCamera) => {
    return (e: TargetingActionEvent) => {
        if(scene.cursorFollow) {
            scene.cursorFollow.destroy();
        }
        let tempCoords = {
            x: -100,
            y: -100
        }
        scene.cursorFollow = scene.add.sprite(tempCoords.x, tempCoords.y, e.action.actionIcon);
        scene.cursorFollow.setScale(0.25);
        scene.cursorFollow.setTintFill(0x00ff00);
        scene.cursorFollow.action = UiMode.TARGETING_ACTION;
        scene.cursorFollow.actionOnClick = () => {
            let target = {x: scene.cursorFollow.x, y: scene.cursorFollow.y}
            e.action.execute({target});
            scene.cursorFollow.destroy();
            scene.cursorFollow = null;
        };
    }
}

const updateTargetingAction = (scene: MainCamera): void => {
    let tileSize = GameDimensions.grid.tileSize;
    var x = Math.floor((scene.input.mousePointer.x+scene.cameras.main.scrollX)/tileSize)*tileSize;
    var y = Math.floor(((scene.input.mousePointer.y+scene.cameras.main.scrollY))/tileSize)*tileSize;
    if(scene.cameras.main.viewRectangle.geom.contains(x,y)) {
        let unitHalfSize = tileSizeFloor(tileSize/2);
        let posX = x - unitHalfSize;;
        let posY = y - unitHalfSize;
        scene.cursorFollow.setPosition(posX, posY);
    }
}

export { registerNewBuildingOrderEvents, registerOuterUIEvents, updateBuildingOrderCursor, updateTargetingAction}