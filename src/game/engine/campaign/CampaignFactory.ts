import { basicAiProcessorProvider } from "../Ai/processor/AiProcessorFactory";
import { GameEngine } from "../GameEngine";
import { initBasicMap } from "../map/maps/basic/basicMap";
import { Campaign } from "./Campaign";

type CampaignProvider = (ge: GameEngine) => Campaign;

enum CampaignName {
    BASIC_CAMPAIGN = 'BASIC_CAMPAIGN'
}

class CampaignFactory {
    campaigns: Map<CampaignName, CampaignProvider>;

    constructor() {
        this.campaigns = new Map();
        this.campaigns.set(CampaignName.BASIC_CAMPAIGN, basicCampaign);
    }

    get(campaignName: CampaignName): CampaignProvider {
        return this.campaigns.get(campaignName);
    }
}

const basicCampaign = (gameEngine: GameEngine): Campaign => {
    let map = initBasicMap(gameEngine);
    let aiProcessor = basicAiProcessorProvider(gameEngine);
    let campaign = new Campaign(map, aiProcessor);

    return campaign;

}

export { CampaignFactory, CampaignName }