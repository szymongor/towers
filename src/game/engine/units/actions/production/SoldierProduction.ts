import { GameDimensions } from "../../../../GameDimensions"
import { EventChannels } from "../../../events/EventsRegistry"
import { GameEvent } from "../../../events/GameEvent"
import { GameEngine } from "../../../GameEngine"
import { Vector } from "../../../map/PlayerVision"
import { Player } from "../../../Player"
import { Unit } from "../../Unit"
import { UnitName } from "../../UnitFactory"
import { UnitTask, UnitTaskNames } from "../../UnitTask"
import { UnitCommandProvider, UnitCommandType } from "../UnitCommands"

const TILE_SIZE = GameDimensions.grid.tileSize;

const soldierProductionProvider : UnitCommandProvider = 
(unit: Unit, gameEngine: GameEngine, owner: Player) => {
    return {
        commandName: 'soldierProduction',
        type: UnitCommandType.ORDERING,
        actionIcon: "soldier_production_icon",
        canExecute: () => true,
        executeCommand: () => {
            unit.addUnitTask(soldierProductionTask(unit, gameEngine, owner))
        }
    }
}

const soldierProductionTask = (unit: Unit, gameEngine: GameEngine, owner: Player ): UnitTask => {
    let done = () => {
        //TODO remove?
        let unitOwner = owner ? owner : gameEngine.getPlayer();
        
        let soldier = gameEngine.unitFactory.of(UnitName.SOLDIER, unit.x, unit.y, unitOwner);

        let spawnSpot = findSpawnSpot(unit, soldier, gameEngine);
        
        soldier.setLocation(spawnSpot);
        
        // TODO UNIT_CREATED event_data type
        // TODO UNIT_PRODUCED event and event_data types
        let data : any = {
            unitPrototype: soldier
        }
        let event = new GameEvent(EventChannels.UNIT_CREATED, data)
        gameEngine.events.emit(event);
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
        return spawningSpots[0];
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