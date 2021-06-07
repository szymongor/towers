import { GameEngine } from './game/engine/GameEngine';
import { createTowerGame } from './game/scenes/TowerGame';



var gameEngine = new GameEngine();


const towerGame = createTowerGame(gameEngine);