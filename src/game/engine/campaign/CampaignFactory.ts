import { basicAiProcessorProvider } from "../Ai/processor/AiProcessorFactory";
import { GameEngine } from "../GameEngine";
import { initBasicMap } from "../map/maps/basic/basicMap";
import { Campaign } from "./Campaign";

const basicCampaign = (gameEngine: GameEngine): Campaign => {
    let map = initBasicMap(gameEngine);
    let aiProcessor = basicAiProcessorProvider(gameEngine);
    let campaign = new Campaign(map, aiProcessor);

    return campaign;

}

export { basicCampaign }