import { EventChannels } from "../../events/EventsRegistry";
import { GameEvent } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { GameRuleConfigurator } from "../GameStateRules";

const registerUnitDestroyedRule: GameRuleConfigurator = (gameEngine: GameEngine) => {
    var subscriber = {
        call: receiveUnitDestroyed(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
    console.log("registerUnitDestroyedRule");
}

const  receiveUnitDestroyed = (gameEngine: GameEngine) => {
    return (event: GameEvent) => {
        let unitDestroyed = event.data.unit;
        gameEngine.unitStorage.destroyUnit(unitDestroyed);
    }
}

export { registerUnitDestroyedRule }