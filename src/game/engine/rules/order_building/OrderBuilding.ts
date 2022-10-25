import { Command, CommandType } from "../../commands/Command";
import { UnitCreatedEventData } from "../../events/EventDataTypes";
import { EventChannels } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Player } from "../../Player";
import { Unit } from "../../units/Unit";
import { GameRuleConfigurator } from "../GameStateRules";

const registerOrderBuildingCommand: GameRuleConfigurator = (gameEngine: GameEngine) => {
    var subscriber = {
        call: receiveBuildingOrderCommand(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.COMMAND_SENT, subscriber);
}

const receiveBuildingOrderCommand = (gameEngine: GameEngine) =>  {
    return (event: any) => {
        let command: Command = event.data.command;
        if(command.type != CommandType.ORDER_BUILDING) {
            return;
        }

        let unitPrototype = command.data.targetUnit;
        if(!gameEngine.canPlaceUnit(unitPrototype)) {
            return;
        }

        if(!gameEngine.canBuild(unitPrototype.unitName, unitPrototype.player) ) {
            return;
        }

        let createdUnit = placeBuildingAndChargeResources(gameEngine, unitPrototype, unitPrototype.player)
        if(!createdUnit) {
            return;
        }

        let data: UnitCreatedEventData = {
            unit: createdUnit
        };

        let placeBuildingEvent = new GameEvent(EventChannels.UNIT_CREATED, data);
        gameEngine.events.emit(placeBuildingEvent);
    }
}

const placeBuildingAndChargeResources = (gameEngine: GameEngine, unitPrototype: Unit, player: Player): Unit => {
    let ownerPlayer = gameEngine.getPlayer();
    if(player) {
        ownerPlayer = player;
    }
    let unit = gameEngine.unitFactory.constructionOf(unitPrototype.unitName, 
        unitPrototype.x, 
        unitPrototype.y, 
        gameEngine,
        ownerPlayer);
    let unitCosts = gameEngine.unitFactory.getConfig(unitPrototype.unitName).cost;
    ownerPlayer.chargeResources(unitCosts);
    
    return unit;
}

export { registerOrderBuildingCommand };
