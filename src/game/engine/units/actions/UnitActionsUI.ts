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




export { UnitActionUI, UnitActionUIProvider, UiActionType, soldierProductionProvider }