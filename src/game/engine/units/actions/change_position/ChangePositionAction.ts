import { GameDimensions } from "../../../../GameDimensions"
import { vectorDist } from "../../../../utils/utils"
import { EventChannels, EventRegistry } from "../../../events/EventsRegistry"
import { ChangePositionEventData, GameEvent } from "../../../events/GameEvent"
import { GameEngine } from "../../../GameEngine"
import { TerrainType } from "../../../map/MapBoard"
import { Vector } from "../../../map/PlayerVision"
import { Unit } from "../../Unit"
import { UnitTask, UnitTaskNames } from "../../UnitTask"
import { UiActionType, UnitActionUIProvider } from "../UnitActionsUI"

const TILE_SIZE = GameDimensions.grid.tileSize;

const changePositionProvider : UnitActionUIProvider = function(unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry) {
    return {
        actionName: 'changePosition',
        type: UiActionType.TARGETING,
        actionIcon: "change_position_icon",
        canExecute: () => true,
        execute: (props) => {
            if(props.units) {
                props.units.forEach(unit => {
                    unit.addUnitTask(changePositionTask(unit, gameEngine, eventRegistry, props.target))
                })  
            }
        }
    }
}

const changePositionTask = (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry, target: Vector ) => {
    
    
    let direction = choseDirection(target, unit, gameEngine);

    let duration = 15; //TODO - get from unit props
    if(direction) {
        duration = Math.floor(duration*vectorDist({x: 0, y: 0}, direction)/TILE_SIZE);
    }
    
    let done = () => {
        if(direction) {
            unit.x += direction.x;
            unit.y += direction.y;
            unit.updateTexture();
            unit.addUnitTask(changePositionTask(unit, gameEngine, eventRegistry, target));
        } else {
        }
    }

    let callBack = () => {
    }

    let name = UnitTaskNames.CHANGE_POSITION + Unit.name + unit.x + ":"+ unit.y;

    if(direction) {
        let changePositionEventData : ChangePositionEventData = {
            unit: unit,
            target: new Vector(unit.x + direction.x,unit.y + direction.y),
            interval: duration
        }
        let changePositionEvent = new GameEvent(EventChannels.CHANGE_POSITION, changePositionEventData);
        eventRegistry.emit(changePositionEvent);
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
        return new Vector(0, 0);
    }
}

const isDirectionTraversable = (dir: Vector, unit: Unit, gameEngine: GameEngine): boolean => {
    return gameEngine.traversMap.isTileTraversableForUnit(dir, unit);
}

export { changePositionProvider }