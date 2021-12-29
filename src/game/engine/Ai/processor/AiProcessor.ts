import { GameEngine } from "../../GameEngine";
import { AiAction } from "../actions/AiAction";
import { moveAllSoldiersUnitAction, orderUnitAction } from "../actions/AiActionFactory";
import { ActionSchedule } from "./ActionSchedule";



class AiProcessor {
    gameEnginge: GameEngine;
    actionsToRun: [AiAction, ActionSchedule][];

    constructor(gameEnginge: GameEngine) {
        this.gameEnginge = gameEnginge;
        this.actionsToRun = [];
    }

    run(round: number) {
        
        this.actionsToRun.forEach(action => {
            if(action[1].isReady(round, this.gameEnginge)) {
                action[0].execute(this.gameEnginge);
            }
        });
    }

    addAction(aiAction: AiAction, schedule: ActionSchedule) {
        this.actionsToRun.push([aiAction, schedule]);
    }
}

export { AiProcessor }