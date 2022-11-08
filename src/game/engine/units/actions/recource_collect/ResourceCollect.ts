import { EventRegistry, EventChannels } from "../../../events/EventsRegistry";
import { GameEvent } from "../../../events/GameEvent";
import { GameEngine } from "../../../GameEngine";
import { ResourceName } from "../../../Resources";
import { Unit, UnitTypes } from "../../Unit";
import { UnitName } from "../../UnitFactory";
import { UnitTaskNames, UnitTask } from "../../UnitTask";
import { UnitAction } from "../UnitActions";
import { ResourceCollectedEventData, UnitDestroyedEventData } from "../../../events/EventDataTypes";
import { UnitFilter } from "../../unit_storage/UnitFilter";


const SawmillWoodCollect: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    let unitFilter: UnitFilter = {
        types: [UnitTypes.RESOURCE],
        unitName: UnitName.TREE,
        range: {
            unit: unit,
            range: unit.actionRange
        }
    };

    if(isUnitReadyToCollectResources(unit)) {
        let nearestTree = gameEngine.unitStorage.getNearestUnit(unitFilter, unit);
        let resourceCollect: [ResourceName, number][] = [[ResourceName.WOOD, 25]];
        //TODO && unit.isUnitInRange(nearestTree) replace with Optional<nearestTreeInRange> in line 24
        if(nearestTree && unit.isUnitInRange(nearestTree)) {
            let callback = () => {
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

            let taskId = UnitTaskNames.PRODUCTION;

            let action: UnitTask = new UnitTask(taskId, UnitTaskNames.PRODUCTION, unit.actionInterval, callback);
            unit.currentTasks.set(action.name, action);
        }
    }
}

const MineStoneCollect: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    if(isUnitReadyToCollectResources(unit)) {
        let unitFilter: UnitFilter = {
            types: [UnitTypes.RESOURCE],
            unitName: UnitName.STONES,
            range: {
                unit: unit,
                range: unit.actionRange
            }
        };
        let nearestStones = gameEngine.unitStorage.getNearestUnit(unitFilter, unit);
        let resourceCollect: [ResourceName, number][] = [[ResourceName.STONE, 10]];
        //TODO refucktor && unit.isUnitInRange(nearestStones)
        if(nearestStones && unit.isUnitInRange(nearestStones)) {

            let callback = () => {
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

            let taskId = UnitTaskNames.PRODUCTION;

            let action: UnitTask = new UnitTask(taskId, UnitTaskNames.PRODUCTION, unit.actionInterval, callback);
            unit.currentTasks.set(action.name, action);
        }
    }
}

const isUnitReadyToCollectResources = (unit: Unit): boolean => {
    return (!unit.currentTasks.has(UnitTaskNames.PRODUCTION)) && !unit.state.construction
}

export { SawmillWoodCollect, MineStoneCollect }
