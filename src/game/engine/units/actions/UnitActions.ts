import { EventChannels, EventRegistry } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { ResourceName } from "../../Resources";
import { Unit, UnitTypes, Damage } from "../Unit";
import { UnitName } from "../UnitFactory";
import { UnitFilter } from "../UnitsStorage";
import { UnitTask, UnitTaskNames } from "../UnitTask";

interface ResourceCollectedEventData {
    collector: Unit;
    source: Unit;
    resource: ResourceName;
}

interface DamageDealtEventData {
    target: Unit;
    source: Unit;
}

interface UnitDestroyedEventData {
    unit: Unit;
}

interface UnitAction {
    (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit): void
}

const SawmillWoodCollect: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    let unitFilter: UnitFilter = {
        types: [UnitTypes.RESOURCE],
        unitName: UnitName.TREE,
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
    let unitFilter: UnitFilter = {
        types: [UnitTypes.RESOURCE],
        unitName: UnitName.STONES,
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

const TowerAttack: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    
    if(unit.currentTasks.has(UnitTaskNames.TOWER_ATTACK)) {

    } else {
        let unitFilter: UnitFilter = {
            types: [UnitTypes.BUILDING, UnitTypes.CREATURE],
            range: {
                unit: unit,
                range: unit.actionRange,
            },
            player_ne: unit.player
        }
        let nearestEnemy = gameEngine.unitStorage.getNearestUnit(unitFilter, unit);
        if(nearestEnemy) {
            let callback = () => {
                let dmg: Damage = {
                    value: 50,
                    source: unit
                }
                nearestEnemy.dealDamage(dmg);
                unit.currentTasks.delete(UnitTaskNames.TOWER_ATTACK);
                let damageDealtEventData : DamageDealtEventData = {
                    target: nearestEnemy,
                    source: unit
                }
                let damageDealtEvent = new GameEvent(EventChannels.DAMAGE_DEALT, damageDealtEventData);
                eventRegistry.emit(damageDealtEvent);
            }

            let action: UnitTask = new UnitTask(UnitTaskNames.TOWER_ATTACK, UnitTaskNames.TOWER_ATTACK, unit.actionInterval, callback);
            unit.currentTasks.set(UnitTaskNames.TOWER_ATTACK, action);
        }

    }

}

export { UnitAction, SawmillWoodCollect , ResourceCollectedEventData, MineStoneCollect, TowerAttack, DamageDealtEventData}