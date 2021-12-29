import { GameEngine } from "../../GameEngine";
import { moveAllSoldiersUnitAction, orderUnitAction } from "../actions/AiActionFactory";
import { ActionSchedule } from "./ActionSchedule";
import { AiProcessor } from "./AiProcessor";

const basicAiProcessorProvider = (gameEnginge: GameEngine) => {
    let basicAiProcessor = new AiProcessor(gameEnginge);

    let orderUnitSchedule = new ActionSchedule();
    orderUnitSchedule.addCondition((round, ge) => {
        return round%15 == 0;
    });

    let moveAllSoldiersSchedule = new ActionSchedule();
    moveAllSoldiersSchedule.addCondition((round, ge) => {
        return round%15 == 0;
    });

    basicAiProcessor.addAction(orderUnitAction, orderUnitSchedule);
    basicAiProcessor.addAction(moveAllSoldiersUnitAction, moveAllSoldiersSchedule);
    return basicAiProcessor;
}

export { basicAiProcessorProvider }