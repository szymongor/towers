import { EventChannels, Subscriber } from "../events/EventsRegistry";
import { GameEvent, GameFinishedEventData } from "../events/GameEvent";
import { GameEngine } from "../GameEngine";
import { gameFinishedRule } from "./game_finished/GameFinishedRule";
import { playerLostRule } from "./player_lost/PlayerLostRule";

interface GameStateRule {
    (gameEngine: GameEngine): (event: GameEvent) => void;
}


const registerPlayerLostRule = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: playerLostRule(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.UNIT_DESTROYED, subscriber);
}

const registerGameFinishedRule = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: gameFinishedRule(gameEngine)
    }
    gameEngine.events.subscribe(EventChannels.PLAYER_LOST, subscriber);
}

const logGameFinishedEvent = (gameEngine: GameEngine) => {
    let subscriber: Subscriber = {
        call: (event: GameEvent) => {
            console.log("Game Finished!");
            let data: GameFinishedEventData = event.data;
            console.log("Winner: " + data.winner.name);
        }
    }
    gameEngine.events.subscribe(EventChannels.GAME_FINISHED, subscriber);
}



export { registerPlayerLostRule as registerPlayerLostFlow, registerGameFinishedRule as registerGameFinishedCheckFlow, logGameFinishedEvent as registerGameFinishedFlow}