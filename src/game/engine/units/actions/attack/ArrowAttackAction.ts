import { EventChannels, EventRegistry } from "../../../events/EventsRegistry";
import { GameEvent } from "../../../events/GameEvent";
import { GameEngine } from "../../../GameEngine";
import { DealtDamage, Unit, UnitTypes } from "../../Unit";
import { UnitFilter } from "../../unit_storage/UnitsStorage";
import { UnitTask, UnitTaskNames } from "../../UnitTask";
import { DamageDealtEventData, UnitAction } from "../UnitActions";

const ARROW_SPEED = 50; //TODO create config file

const ArrowAttack: UnitAction = (eventRegistry: EventRegistry, gameEngine: GameEngine, unit: Unit) => {
    
    if(isUnitReadyToAttack(unit)) {
        let unitFilter: UnitFilter = {
            types: [UnitTypes.BUILDING, UnitTypes.CREATURE ],
            range: {
                unit: unit,
                range: unit.actionRange,
            },
            player_ne: unit.player
        }
        let nearestEnemy = gameEngine.unitStorage.getNearestUnit(unitFilter, unit);
        if(nearestEnemy) {
            let done = () => {
                let distance = unit.distanceToUnit(nearestEnemy);
                let flighTime = distance/ARROW_SPEED;
                
                let damageDealtEventData : DamageDealtEventData = {
                    target: nearestEnemy,
                    source: unit,
                    time: flighTime
                }
                let damageDealtEvent = new GameEvent(EventChannels.DAMAGE_DEALT, damageDealtEventData);
                eventRegistry.emit(damageDealtEvent);
                
                let arrowFlightTask = new UnitTask(UnitTaskNames.ARROW_FLIGHT, UnitTaskNames.ARROW_FLIGHT,
                    flighTime,
                    () => arrowFlightDone(unit, nearestEnemy, eventRegistry),
                    () => {}
                    )
                unit.currentTasks.set(UnitTaskNames.ARROW_FLIGHT, arrowFlightTask);
            }

            let callback = () => {};

            let action: UnitTask = new UnitTask(UnitTaskNames.TOWER_ATTACK, 
                UnitTaskNames.TOWER_ATTACK, 
                unit.actionInterval, 
                done,
                callback
                );
            unit.currentTasks.set(UnitTaskNames.TOWER_ATTACK, action);
        }
    }
}

const arrowFlightDone = (unit: Unit, nearestEnemy: Unit, eventRegistry: EventRegistry) => {
    let dmg: DealtDamage = {
        value: 50,
        source: unit
    }
    nearestEnemy.dealDamage(dmg);
    unit.currentTasks.delete(UnitTaskNames.TOWER_ATTACK);
}

const isUnitReadyToAttack = (unit: Unit): boolean => {
    return (!unit.currentTasks.has(UnitTaskNames.TOWER_ATTACK)) && !unit.state.construction
}

export { ArrowAttack }