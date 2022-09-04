import { EventChannels, Subscriber } from "../../events/EventsRegistry";
import { GameEvent, GameFinishedEventData } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { GameRuleConfigurator } from "../GameStateRules";


const registerGameFinishedRule: GameRuleConfigurator = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: gameFinishedRule(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.PLAYER_LOST, subscriber);
    console.log("registerGameFinishedRule");
}

const logGameFinishedEvent: GameRuleConfigurator = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: (event: GameEvent) => {
            console.log("Game Finished!");
            let data: GameFinishedEventData = event.data;
            console.log("Winner: " + data.winner.name);
        }
    }
    gameEngine.events.subscribe(EventChannels.GAME_FINISHED, subscriber);
}

const gameFinishedRule = (gameEngine: GameEngine) => {
    return (event: GameEvent) => {
        let playerLost = gameEngine.events.getChannelEvents(EventChannels.PLAYER_LOST).map(e => e.data.player);
        
        if(gameEngine.players.length == playerLost.length+1) {
            let winnerIndex = 0;
            let winner = gameEngine.players[0];

            gameEngine.players.forEach(player => {
                if(playerLost.indexOf(player)>=0) {
                    winnerIndex++;
                } else {
                    winner = gameEngine.players[winnerIndex]
                }
            });

            let data: GameFinishedEventData = {
                winner: winner
            };
            let event = new GameEvent(EventChannels.GAME_FINISHED, data);
            gameEngine.events.emit(event);
        } else if(gameEngine.players.length == playerLost.length) {
            console.log("Draw");
        }
    }
}

export { registerGameFinishedRule, logGameFinishedEvent}