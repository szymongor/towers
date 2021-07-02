import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine"
import { ResourceName } from "../../Resources";
import { Unit, UnitTypes } from "../Unit";
import { UnitName } from "../UnitFactory";

interface ResourceCollectedEventData {
    collector: Unit;
    source: Unit;
    resource: ResourceName;
}

interface UnitDestroyedEventData {
    unit: Unit;
}

interface UnitAction {
    (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit): void
}

const SawmillWoodCollect: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    let unitFilter = {
        type: UnitTypes.RESOURCE,
        name: UnitName.TREE,
        range: {
            unit: unit,
            range: unit.actionRange
        }
    };
    let nearestTree = gameEngine.unitStorage.getNearestUnit(unitFilter, unit);
    let resourceCollect: [ResourceName, number][] = [[ResourceName.WOOD, 1]];
    if(nearestTree && unit.isUnitInRange(nearestTree)) {
        
        if(nearestTree.resources.checkEnoughResources(resourceCollect)) {
            nearestTree.resources.chargeResources(resourceCollect);
            unit.player.addResources(resourceCollect);
            let resourceCollectedEventData : ResourceCollectedEventData = {
                collector: unit,
                source: nearestTree,
                resource: ResourceName.WOOD
            }
            let resourceCollectedEvent = new GameEvent(EventChannels.RESOURCE_COLLECTED, resourceCollectedEventData);
            eventRegistry.emit(resourceCollectedEvent);
        }

        if(!nearestTree.resources.checkEnoughResources(resourceCollect)) {
            let unitDestroyedEventData: UnitDestroyedEventData = {
                unit: nearestTree
            }
            let unitDestroyedEvent = new GameEvent(EventChannels.UNIT_DESTROYED, unitDestroyedEventData);
            eventRegistry.emit(unitDestroyedEvent);
        }
    }
}

const MineStoneCollect: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    let unitFilter = {
        type: UnitTypes.RESOURCE,
        name: UnitName.STONES,
        range: {
            unit: unit,
            range: unit.actionRange
        }
    };
    let nearestStones = gameEngine.unitStorage.getNearestUnit(unitFilter, unit);
    let resourceCollect: [ResourceName, number][] = [[ResourceName.STONE, 1]];
    if(nearestStones && unit.isUnitInRange(nearestStones)) {
        
        if(nearestStones.resources.checkEnoughResources(resourceCollect)) {
            nearestStones.resources.chargeResources(resourceCollect);
            unit.player.addResources(resourceCollect);
            let resourceCollectedEventData : ResourceCollectedEventData = {
                collector: unit,
                source: nearestStones,
                resource: ResourceName.STONE
            }
            let resourceCollectedEvent = new GameEvent(EventChannels.RESOURCE_COLLECTED, resourceCollectedEventData);
            eventRegistry.emit(resourceCollectedEvent);
        }

        if(!nearestStones.resources.checkEnoughResources(resourceCollect)) {
            let unitDestroyedEventData: UnitDestroyedEventData = {
                unit: nearestStones
            }
            let unitDestroyedEvent = new GameEvent(EventChannels.UNIT_DESTROYED, unitDestroyedEventData);
            eventRegistry.emit(unitDestroyedEvent);
        }
    }
}

export { UnitAction, SawmillWoodCollect , ResourceCollectedEventData, MineStoneCollect}