import { GameEngine } from "../GameEngine";


class AiAction {

    gameEngine: GameEngine;
    action: (ge: GameEngine) => void;

    constructor(gameEngine: GameEngine, action: (ge: GameEngine) => void) {
        this.gameEngine = gameEngine;
        this.action = action;


    }

    execute() {
        this.action(this.gameEngine);
        console.log("Basic Ai Action");

    }
}

export { AiAction }
