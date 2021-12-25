import { GameEngine } from "../GameEngine";
import { AiAction } from "./actions/AiAction";
import { moveAllSoldiersUnitAction, orderUnitAction } from "./actions/AiActionFactory";



class AiProcessor {
    gameEnginge: GameEngine;
    actionsToRun: AiAction[];

    constructor(gameEnginge: GameEngine) {
        this.gameEnginge = gameEnginge;
        this.actionsToRun = [];
        
        this.addAction(orderUnitAction);
        this.addAction(moveAllSoldiersUnitAction);

    }

    run(round: number) {
        
        if(round%15 == 0) { //TODO Scheduler
            console.log('AiProcessor run round: '+round);
            this.actionsToRun.forEach(action => action.execute(this.gameEnginge));
        }
    }

    addAction(aiAction: AiAction) {
        this.actionsToRun.push(aiAction);
    }
}

export { AiProcessor }