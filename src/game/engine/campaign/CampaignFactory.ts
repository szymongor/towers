
import { basicCampaign } from "../../campaign/basic/basicCampaign";
import { GameEngine } from "../GameEngine";
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

export { CampaignFactory, CampaignName }