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
        {x: TILE_SIZE, y:0},
        {x: TILE_SIZE, y: TILE_SIZE},
        {x: 0, y:TILE_SIZE},
        {x: -TILE_SIZE, y:TILE_SIZE},
        {x: -TILE_SIZE, y:0},
        {x: -TILE_SIZE, y:-TILE_SIZE},
        {x: 0, y:-TILE_SIZE},
        {x: TILE_SIZE, y:-TILE_SIZE},
    ];

    let unitPosition = {x: unit.x, y: unit.y};

    let unitDirections = directions.map(dir => {
        return  {
            dir: dir,
            futurePos: {x: dir.x + unitPosition.x, y: dir.y + unitPosition.y}}
    });

    let unitDist = vectorDist(unitPosition, target);

    let possibleDirs = unitDirections
    .map(uDir => { return {dir: uDir.dir, futurePos: uDir.futurePos, dist: vectorDist(uDir.futurePos, target)}})
    .filter(uDir => uDir.dist <= unitDist )
    .filter(uDir => isDirectionTraversable(uDir.futurePos, gameEngine) )
    .sort((a,b) => a.dist - b.dist);

    if(possibleDirs.length) {
        return possibleDirs[0].dir;
    } else {
        return {x: 0, y: 0};
    }
}

const isDirectionTraversable = (dir: Vector, gameEngine: GameEngine): boolean => {
    let isTerrainTraversable = gameEngine.getMap().terrain.type(dir.x, dir.y) == TerrainType.GRASS;

    return isTerrainTraversable;
}

export { changePositionProvider }