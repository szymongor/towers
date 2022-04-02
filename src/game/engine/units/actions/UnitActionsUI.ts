import { GameDimensions } from "../../../GameDimensions";
import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { ChangePositionEventData, GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Tile, Vector } from "../../map/PlayerVision";
import { Player } from "../../Player";
import { Unit } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitTask, UnitTaskNames } from "../UnitTask";

const TILE_SIZE = GameDimensions.grid.tileSize;

//TODO get ownerPlayer as source unit owner?
interface UnitActionUIProvider {
    (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry, player: Player): UnitActionUI
}

interface UnitActionParams {
    target: Vector,
    units?: Unit[]
}

enum UiActionType {
    ORDERING = "ORDERING",
    TARGETING = "TARGETING"

}

interface UnitActionUI {
    actionName: string;
    type: UiActionType;
    actionIcon: string;
    canExecute: () => boolean;
    execute: (params?: UnitActionParams) => void;
}

//TODO extract eventRegistry from gameEngine
//TODO unit owner param
const soldierProductionProvider : UnitActionUIProvider = 
function(unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry, owner: Player) {
    return {
        actionName: 'soldierProduction',
        type: UiActionType.ORDERING,
        actionIcon: "soldier_production_icon",
        canExecute: () => true,
        execute: () => {
            unit.addUnitTask(soldierProductionTask(unit, gameEngine,eventRegistry, owner))
        }
    }
}

const soldierProductionTask = (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry, owner: Player ) => {
    let done = () => {
        console.log("Soldier Ready");

        //TODO remove?
        let unitOwner = owner ? owner : gameEngine.getPlayer();
        
        let soldier = gameEngine.unitFactory.of(UnitName.SOLDIER, unit.x, unit.y, eventRegistry, unitOwner);
        gameEngine.unitStorage.addUnit(soldier);

        // TODO BUILDING_PLACED event_data type
        // TODO UNIT_PRODUCED event and event_data types
        let data : any = {
            unitPrototype: soldier
        }
        let event = new GameEvent(EventChannels.BUILDING_PLACED, data)
        eventRegistry.emit(event);
    }
    let constructionTime = gameEngine.unitFactory.unitConfig[UnitName.SOLDIER].constructionTime;
    return new UnitTask(UnitTaskNames.PRODUCTION, UnitTaskNames.PRODUCTION, constructionTime, done);
}

const changePositionProvider : UnitActionUIProvider = function(unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry) {
    return {
        actionName: 'changePosition',
        type: UiActionType.TARGETING,
        actionIcon: "change_position_icon",
        canExecute: () => true,
        execute: (props) => {
            if(props.units) {
                props.units.forEach(unit => {
                    unit.addUnitTask(changePositionTask(unit, gameEngine,eventRegistry, props.target))
                })  
            }
        }
    }
}

const changePositionTask = (unit: Unit, gameEngine: GameEngine, eventRegistry: EventRegistry, target: Vector ) => {
    let duration = 3; //TODO - get from unit props
    let dX = (target.x - unit.x);
    let dY = (target.y - unit.y);
    let direction = choseDirection(dX, dY);
    
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
            target: new Vector(unit.x + direction.x,unit.y + direction.y)
        }
        let changePositionEvent = new GameEvent(EventChannels.CHANGE_POSITION, changePositionEventData);
        eventRegistry.emit(changePositionEvent);
    }

    return new UnitTask(name, UnitTaskNames.CHANGE_POSITION, duration, done, callBack);
}

const choseDirection = function(dX: number, dY: number): Vector {
    if(Math.abs(dX) <= TILE_SIZE && Math.abs(dY) <= TILE_SIZE) {
        
        return null;
    } else if (Math.abs(dX) >= Math.abs(dY)) {
        return {x:TILE_SIZE*Math.sign(dX), y:0};
    } else {
       return {x:0, y:TILE_SIZE*Math.sign(dY)};
    }

}

export { UnitActionUI, UnitActionUIProvider, UiActionType, soldierProductionProvider, changePositionProvider }