import { GameDimensions } from "../../../../GameDimensions"
import { vectorDist } from "../../../../utils/utils"
import { EventChannels, EventRegistry } from "../../../events/EventsRegistry"
import { ChangePositionEventData, GameEvent } from "../../../events/GameEvent"
import { GameEngine } from "../../../GameEngine"
import { Vector } from "../../../map/PlayerVision"
import { Unit } from "../../Unit"
import { UnitTask, UnitTaskNames } from "../../UnitTask"
import { UiActionType, UnitActionUIProvider } from "../UnitActionsUI"

const TILE_SIZE = GameDimensions.grid.tileSize;
const IDLE_TIME = 10;

const changePositionProvider : UnitActionUIProvider = function(unit: Unit, gameEngine: GameEngine) {
    return {
        actionName: 'changePosition',
        type: UiActionType.TARGETING,
        actionIcon: "change_position_icon",
        canExecute: () => true,
        execute: (props) => {
            if(props.units) {
                props.units.forEach(unit => {
                    unit.addUnitTask(changePositionTask(unit, gameEngine, props.target))
                })  
            }
        }
    }
}

const changePositionTask = (unit: Unit, gameEngine: GameEngine, target: Vector ) => {

    let direction = choseDirection(target, unit, gameEngine);
    unit.clearUnitTaskByType(UnitTaskNames.CHANGE_POSITION);

    let duration = IDLE_TIME;
    if(direction && !direction.equal(Vector.zeroVector())) {
        duration = Math.floor(duration*vectorDist(Vector.zeroVector(), direction)/TILE_SIZE);
    }

    let done = () => {
        let destination = unit.getLocation().add(direction)
        if(direction && isDirectionTraversable(destination, unit, gameEngine)) {
            unit.x += direction.x;
            unit.y += direction.y;
            unit.updateTexture();
        }

        if(isDestinationReached(unit, target)) {
            unit.addUnitTask(changePositionTask(unit, gameEngine, target));
        }
        
    }

    let callBack = () => {
    }

    let name = UnitTaskNames.CHANGE_POSITION + Date.now();

    if(direction) {
        let changePositionEventData : ChangePositionEventData = {
            unit: unit,
            target: new Vector(unit.x + direction.x,unit.y + direction.y),
            interval: duration
        }
        let changePositionEvent = new GameEvent(EventChannels.CHANGE_POSITION, changePositionEventData);
        gameEngine.events.emit(changePositionEvent);
    }

    return new UnitTask(name, UnitTaskNames.CHANGE_POSITION, duration, done, callBack);
}

const choseDirection = (target: Vector, unit: Unit, gameEngine: GameEngine, ): Vector => {
    let directions = [
        new Vector(TILE_SIZE, 0),
        new Vector(TILE_SIZE, TILE_SIZE),
        new Vector(0, TILE_SIZE),
        new Vector(-TILE_SIZE, TILE_SIZE),
        new Vector(-TILE_SIZE, 0),
        new Vector(-TILE_SIZE, -TILE_SIZE),
        new Vector(0, -TILE_SIZE),
        new Vector(TILE_SIZE, -TILE_SIZE),
    ];

    let unitPosition = new Vector(unit.x, unit.y);

    let unitDirections = directions.map(dir => {
        return  {
            dir: dir,
            futurePos: unitPosition.add(dir)
        }
    });

    let unitDist = vectorDist(unitPosition, target);

    let possibleDirs = unitDirections
    .map(uDir => { return {dir: uDir.dir, futurePos: uDir.futurePos, dist: vectorDist(uDir.futurePos, target)}})
    .filter(uDir => uDir.dist <= unitDist )
    .filter(uDir => isDirectionTraversable(uDir.futurePos, unit, gameEngine) )
    .sort((a,b) => a.dist - b.dist);

    if(possibleDirs.length) {
        return possibleDirs[0].dir;
    } else {
        return Vector.zeroVector();
    }
}

const isDirectionTraversable = (dir: Vector, unit: Unit, gameEngine: GameEngine): boolean => {
    return gameEngine.traversMap.isTileTraversableForUnit(dir, unit);
}

const isDestinationReached = (unit: Unit, target: Vector): boolean => {
    return unit.distanceToVector(target) > TILE_SIZE
}

export { changePositionProvider }