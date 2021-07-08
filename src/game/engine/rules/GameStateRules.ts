import { EventChannels, Subscriber } from "../events/EventsRegistry";
import { GameEvent, GameFinishedEventData, PlayerLostEventData } from "../events/GameEvent";
import { GameEngine } from "../GameEngine";
import { Player } from "../Player";
import { UnitName } from "../units/UnitFactory";
import { UnitFilter } from "../units/UnitsStorage";

interface GameStateRule {
    (gameEngine: GameEngine): (event: GameEvent) => void;
}



const registerPlayerLostFlow = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: playerLostRule(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
}

const registerGameFinishedCheckFlow = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: gameFinishedRule(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.PLAYER_LOST, subscriber);
}

const registerGameFinishedFlow = (gameEngine: GameEngine) => {
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
        console.log(gameEngine.events.getChannelEvents(EventChannels.PLAYER_LOST));
        
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

const playerLostRule = (gameEngine: GameEngine) => {
    return (event: GameEvent) => {
        let players = gameEngine.players;
        players.forEach(player => {
            let unitsFilter: UnitFilter = {
                owner: player,
                unitName: UnitName.CASTLE
            }
            let castles = gameEngine.unitStorage.getUnits(unitsFilter);
            if(castles.length == 0) {
                let eventData: PlayerLostEventData = {
                    player: player
                }
                let event = new GameEvent(EventChannels.PLAYER_LOST, eventData);
                gameEngine.events.emit(event);
            }
        });
    }
}

export { registerPlayerLostFlow, registerGameFinishedCheckFlow, registerGameFinishedFlow}