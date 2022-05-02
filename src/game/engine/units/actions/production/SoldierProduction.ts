import { GameDimensions } from "../../../../GameDimensions"
import { EventRegistry, EventChannels } from "../../../events/EventsRegistry"
import { GameEvent } from "../../../events/GameEvent"
import { GameEngine } from "../../../GameEngine"
import { Vector } from "../../../map/PlayerVision"
import { Player } from "../../../Player"
import { Unit } from "../../Unit"
import { UnitName } from "../../UnitFactory"
import { UnitTask, UnitTaskNames } from "../../UnitTask"
import { UiActionType, UnitActionUIProvider } from "../UnitActionsUI"

const TILE_SIZE = GameDimensions.grid.tileSize;

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

        let spawnSpot = findSpawnSpot(unit, soldier, gameEngine);
        
        soldier.setLocation(spawnSpot);

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

const findSpawnSpot = (unitSource: Unit, producedUnit: Unit, gameEngine: GameEngine): Vector => {
    let spawningSpots = getSpawnigSpots(unitSource, producedUnit);

    let spawnSpot = spawningSpots.find(spot => gameEngine.traversMap.isTileTraversableForUnit(spot, producedUnit));
    
    if(spawnSpot) {
        return spawnSpot
    } else {
        spawningSpots[0];
    }
}

const getSpawnigSpots = (unitSource: Unit, producedUnit: Unit): Vector[] => {
    let spawningSpots = [];
    let unitSizeOffset = -producedUnit.size*TILE_SIZE;

    let topLeftCorner = new Vector(unitSource.x, unitSource.y).add(new Vector(unitSizeOffset,unitSizeOffset));
    //TODO add other corners

    spawningSpots.push(topLeftCorner);
    let spawnBordersize = unitSource.size + producedUnit.size;

    for(let i = 1 ; i < spawnBordersize ; i ++) {
        spawningSpots.push(topLeftCorner.add(new Vector(i*TILE_SIZE, 0)))
        spawningSpots.push(topLeftCorner.add(new Vector(0, i*TILE_SIZE)))
        spawningSpots.push(topLeftCorner.add(new Vector(i*TILE_SIZE, spawnBordersize*TILE_SIZE)))
        spawningSpots.push(topLeftCorner.add(new Vector(spawnBordersize*TILE_SIZE, i*TILE_SIZE)))
    }

    return spawningSpots;

}

export { soldierProductionProvider }