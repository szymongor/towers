import { EventChannels } from "../../events/EventsRegistry";
import { GameEvent, GameFinishedEventData } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";

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

export { gameFinishedRule }