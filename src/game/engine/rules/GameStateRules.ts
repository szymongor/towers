import { GameEngine } from "../GameEngine";

interface GameRuleConfigurator {
    (gameEngine: GameEngine): void;
}

export { GameRuleConfigurator }