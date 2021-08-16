import { EventChannels } from "../../../engine/events/EventsRegistry";
import { GameEvent } from "../../../engine/events/GameEvent";
import { GameDimensions, Scenes } from "../../../GameDimensions";
import { tileSizeFloor } from "../../../utils/utils";
import { UiSceneEvents, UiSetBuildingModeEvent } from "../../ui/UiSceneEvents";
import { MainCamera, UiMode } from "../MainCamera";


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
        let posX = x - unitHalfSize;;
        let posY = y - unitHalfSize;
        scene.cursorFollow.setPosition(posX, posY);
        scene.cursorFollow.unitPrototype.x = posX;
        scene.cursorFollow.unitPrototype.y = posY;
        if(!scene.gameEngine.canPlaceUnit(scene.cursorFollow.unitPrototype)) {
            scene.cursorFollow.setTintFill(0xff0000);
        } else {
            scene.cursorFollow.setTintFill(0x00ff00);
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
    })

    scene.scene.get(Scenes.UIScene).events.on(UiSceneEvents.DESELECT_BUILDING, (e: UiSetBuildingModeEvent) => {
        if(scene.cursorFollow) {
            scene.cursorFollow.destroy();
        }
        scene.cursorFollow = null;
    })
}

export { registerNewBuildingOrderEvents, registerOuterUIEvents, updateBuildingOrderCursor}