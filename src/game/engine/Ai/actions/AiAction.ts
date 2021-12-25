import { GameEngine } from "../../GameEngine";


interface AiAction {

    execute: (ge: GameEngine) => void;
}

export { AiAction }
