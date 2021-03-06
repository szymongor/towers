import { ChangePositionEventData, GameEvent } from "../../../engine/events/GameEvent";
import { Tile, Vector } from "../../../engine/map/PlayerVision";
import { GameClockMilisInterval, GameDimensions } from "../../../GameDimensions";
import { tileSizeFloor } from "../../../utils/utils";
import { TargetingActionEvent } from "../../ui/UiSceneEvents";
import { customAnimationFromCustomSprite, TransitionAnimation } from "../animation/Animation";
import { MainCamera, UiMode } from "../MainCamera";

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
            let target = new Vector(scene.cursorFollow.x,scene.cursorFollow.y);
            e.action.execute({target, units: e.unitsSource});
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

const onChangePositionAnimation = function(scene: MainCamera) {
    return (e: GameEvent) => {
        let data: ChangePositionEventData = e.data;
        let unit = data.unit;
        let target = data.target;
        let interval = data.interval * GameClockMilisInterval;
        
        let customAnimation = customAnimationFromCustomSprite(data.unit.sprite);

        let unitTransitionAnimation: TransitionAnimation = {
            sprite: customAnimation,
            sourceX: unit.x,
            sourceY: unit.y,
            targetX: target.x,
            targetY: target.y,
            time: interval,
            progress: 0,
            transient: false
        }
        scene.addTransitionAnimation(unitTransitionAnimation);
    }
}

export { onTargetingActionProvider, updateTargetingAction, onChangePositionAnimation }