import { Campaign } from "../../engine/campaign/Campaign";
import { GameEngine } from "../../engine/GameEngine";
import { Player } from "../../engine/Player";
import { ResourceName, Resources } from "../../engine/Resources";
import { logGameFinishedEvent, registerGameFinishedRule } from "../../engine/rules/game_finished/GameFinishedRule";
import { registerOrderBuildingRule } from "../../engine/rules/order_building/OrderBuilding";
import { registerPlayerLostRule } from "../../engine/rules/player_lost/PlayerLostRule";
import { registerUnitDestroyedRule } from "../../engine/rules/unit_destroyed/UnitDestroyedRule";
import { basicAiProcessorProvider } from "./basicAiProcessor";
import { basicMapSupplier } from "./basicMap";
import { basicUnitConfig } from "./basicUnitConfig";

const basicCampaign = (gameEngine: GameEngine): Campaign => {
    let initResources = new Resources([[ResourceName.WOOD, 2000], [ResourceName.STONE, 1000]]);
    let players = [new Player('1', 'Player1', initResources), new Player('2', 'Bot', initResources)];
    
    let mapSupplier = basicMapSupplier(gameEngine);
    let aiProcessor = basicAiProcessorProvider(gameEngine);
    let rulesConfig = [registerUnitDestroyedRule, registerPlayerLostRule, 
        registerGameFinishedRule,
        logGameFinishedEvent,
        registerOrderBuildingRule];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players, basicUnitConfig);
    
    
    return campaign;
}

export { basicCampaign }