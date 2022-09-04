import { moveAllSoldiersUnitAction, orderUnitAction } from "../../engine/Ai/actions/AiActionFactory";
import { ActionSchedule } from "../../engine/Ai/processor/ActionSchedule";
import { AiProcessor } from "../../engine/Ai/processor/AiProcessor";
import { GameEngine } from "../../engine/GameEngine";


const basicAiProcessorProvider = (gameEnginge: GameEngine) => {
    let basicAiProcessor = new AiProcessor(gameEnginge);

    let orderUnitSchedule = new ActionSchedule();
    orderUnitSchedule.addCondition((round, ge) => {
        return round%45 == 0;
    });

    let moveAllSoldiersSchedule = new ActionSchedule();
    moveAllSoldiersSchedule.addCondition((round, ge) => {
        return round%45 == 0;
    });

    basicAiProcessor.addAction(orderUnitAction, orderUnitSchedule);
    basicAiProcessor.addAction(moveAllSoldiersUnitAction, moveAllSoldiersSchedule);
    return basicAiProcessor;
}

export { basicAiProcessorProvider }