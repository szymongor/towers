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
        let prototype: Unit = event.data.unitPrototype;
        let player: Player = event.data.player;
        if(gameEngine.canBuild(prototype.unitName, player) 
        && prototype.canPlace(prototype,  gameEngine)) {
            let data = {
                player: event.data.player,
                unitPrototype: placeBuilding(gameEngine, prototype, player)
            };
            let placeBuildingEvent = new GameEvent(EventChannels.BUILDING_PLACED, data);
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
        gameEngine.unitStorage.addUnit(unit);
        return unit;
    }
}

export { registerOrderBuildingRule }