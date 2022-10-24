import { UnitCreatedEventData } from "../../events/EventDataTypes";
import { EventChannels } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Player } from "../../Player";
import { Unit } from "../../units/Unit";
import { GameRuleConfigurator } from "../GameStateRules";


const registerOrderBuildingRule: GameRuleConfigurator = (gameEngine: GameEngine) => {
    var subscriber = {
        call: receiveBuildingOrder(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.ORDER_BUILDING, subscriber);
}

const receiveBuildingOrder = (gameEngine: GameEngine) =>  {
    return (event: any) => {
        let data: UnitCreatedEventData = event.data;
        let prototype: Unit = data.unit;
        if(gameEngine.canBuild(prototype.unitName, prototype.player) 
        && prototype.canPlace(prototype,  gameEngine)) {
            let data: UnitCreatedEventData = {
                unit: placeBuilding(gameEngine, prototype, prototype.player)
            };
            let placeBuildingEvent = new GameEvent(EventChannels.UNIT_CREATED, data);
            gameEngine.events.emit(placeBuildingEvent);
        }
    }
}

const placeBuilding = (gameEngine: GameEngine, unitPrototype: Unit, player: Player): Unit => {
    let ownerPlayer = gameEngine.getPlayer();
    if(player) {
        ownerPlayer = player;
    }
    if(unitPrototype.canPlace(unitPrototype, gameEngine)) {
        let unit = gameEngine.unitFactory.constructionOf(unitPrototype.unitName, 
            unitPrototype.x, 
            unitPrototype.y, 
            gameEngine,
            ownerPlayer);
        let unitCosts = gameEngine.unitFactory.getConfig(unitPrototype.unitName).cost;
        ownerPlayer.chargeResources(unitCosts);
        
        return unit;
    }
}

export { registerOrderBuildingRule };
