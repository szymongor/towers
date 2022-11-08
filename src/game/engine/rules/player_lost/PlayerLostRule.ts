import { EventChannels, Subscriber } from "../../events/EventsRegistry";
import { GameEvent, PlayerLostEventData } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Player } from "../../Player";
import { UnitName } from "../../units/UnitFactory";
import { UnitFilter } from "../../units/unit_storage/UnitFilter";
import { GameRuleConfigurator } from "../GameStateRules";

const registerPlayerLostRule: GameRuleConfigurator = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: playerLostRule(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
    console.log("registerPlayerLostRule");
    
}

const playerLostRule = (gameEngine: GameEngine) => {
    return (event: GameEvent) => {
        let players = gameEngine.players;
        players.forEach(player => {
            console.log("playerLostRule: "+ hasNoCastleUnit(player, gameEngine));
            
            if(hasNoCastleUnit(player, gameEngine)) {
                let eventData: PlayerLostEventData = {
                    player: player
                }
                let event = new GameEvent(EventChannels.PLAYER_LOST, eventData);
                gameEngine.events.emit(event);
                console.log("playerLost!");
            }
        });
    }
}

const hasNoCastleUnit = (player: Player, gameEngine: GameEngine): Boolean => {
    let unitsFilter: UnitFilter = {
        owner: player,
        unitName: UnitName.CASTLE
    }
    let castles = gameEngine.unitStorage.getUnits(unitsFilter);
    return castles.length == 0;
}

export { registerPlayerLostRule }