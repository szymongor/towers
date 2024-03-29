import { GameDimensions } from "../../../../GameDimensions"
import { CommandBuilder, CommandDataBuilder, CommandType } from "../../../commands/Command"
import { EventChannels } from "../../../events/EventsRegistry"
import { ChangePositionEventData, GameEvent } from "../../../events/GameEvent"
import { GameEngine } from "../../../GameEngine"
import { Vector } from "../../../map/Tile"
import { Player } from "../../../Player"
import { Unit } from "../../Unit"
import { UnitTask, UnitTaskNames } from "../../UnitTask"
import { UnitCommandProvider, UnitCommandType } from "../UnitCommands"

const TILE_SIZE = GameDimensions.grid.tileSize;
const IDLE_TIME = 10;

const changePositionProvider : UnitCommandProvider = function(unit: Unit, gameEngine: GameEngine, player?: Player) {
    return {
        commandName: 'changePosition',
        type: UnitCommandType.TARGETING,
        actionIcon: "change_position_icon",
        canExecute: () => true,
        executeCommand: (props) => {
            //TODO Command helper?
            //TODO Unit test - Command is sended
            let senderPlayer = player? player: gameEngine.getPlayer(); 
            let commandData = new CommandDataBuilder().recivers(props.units).targetVector(props.target).build();
            let command = new CommandBuilder()
                .data(commandData)
                .sender(senderPlayer)
                .type(CommandType.CHANGE_POSITION)
                .build();
            gameEngine.commandLog.add(command);
            
            //TODO On Command Sent event
            //TODO Set Unit target + Unit State: WALK?
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
        duration = Math.floor(duration*Vector.zeroVector().distanceTo(direction)/TILE_SIZE);
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

    let unitDist = unitPosition.distanceTo(target);

    let possibleDirs = unitDirections
    .map(uDir => { return {dir: uDir.dir, futurePos: uDir.futurePos, dist: uDir.futurePos.distanceTo(target)}})
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
