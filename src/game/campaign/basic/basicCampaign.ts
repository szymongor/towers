import { Campaign } from "../../engine/campaign/Campaign";
import { GameEngine } from "../../engine/GameEngine";
import { basicAiProcessorProvider } from "./basicAiProcessor";
import { initBasicMap } from "./basicMap";

const basicCampaign = (gameEngine: GameEngine): Campaign => {
    let map = initBasicMap(gameEngine);
    let aiProcessor = basicAiProcessorProvider(gameEngine);
    let campaign = new Campaign(map, aiProcessor);
    return campaign;
}

export { basicCampaign }