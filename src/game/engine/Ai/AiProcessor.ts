import { GameEngine } from "../GameEngine";
import { soldierProductionProvider } from "../units/actions/UnitActionsUI";
import { UnitName } from "../units/UnitFactory";
import { AiAction } from "./AiAction";



class AiProcessor {
    gameEnginge: GameEngine;
    actionsToRun: AiAction[];

    constructor(gameEnginge: GameEngine) {
        this.gameEnginge = gameEnginge;
        this.actionsToRun = [];

        //TODO AiActionsFactory - orderUnit, etc.
        let orderUnitaction = (ge: GameEngine) => {
            let botPlayer = ge.players[1];
            let castle = ge.unitStorage.getUnits({owner: botPlayer, unitName: UnitName.CASTLE});
            if(castle.length == 1) {
                let gameActionProvider = soldierProductionProvider(castle[0], ge, ge.events, botPlayer);
                gameActionProvider.execute();
            }
            
        }

        //TODO AiFactory - basicAi, etc.
        this.addAction(new AiAction(this.gameEnginge, orderUnitaction));

    }

    run(round: number) {
        
        if(round%15 == 0) { //TODO Scheduler
            console.log('AiProcessor run round: '+round);
            
            this.actionsToRun.forEach(a => a.execute());
        }
    }

    addAction(aiAction: AiAction) {
        this.actionsToRun.push(aiAction);
    }
}

export { AiProcessor }