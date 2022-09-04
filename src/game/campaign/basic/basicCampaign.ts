import { Campaign } from "../../engine/campaign/Campaign";
import { GameEngine } from "../../engine/GameEngine";
import { Player } from "../../engine/Player";
import { logGameFinishedEvent, registerGameFinishedRule } from "../../engine/rules/game_finished/GameFinishedRule";
import { registerOrderBuildingRule } from "../../engine/rules/order_building/OrderBuilding";
import { registerPlayerLostRule } from "../../engine/rules/player_lost/PlayerLostRule";
import { registerUnitDestroyedRule } from "../../engine/rules/unit_destroyed/UnitDestroyedRule";
import { basicAiProcessorProvider } from "./basicAiProcessor";
import { basicMapSupplier } from "./basicMap";

const basicCampaign = (gameEngine: GameEngine): Campaign => {
    let players = [new Player('1', 'Player1'), new Player('2', 'Bot')];
    
    let mapSupplier = basicMapSupplier(gameEngine);
    let aiProcessor = basicAiProcessorProvider(gameEngine);
    let rulesConfig = [registerUnitDestroyedRule, registerPlayerLostRule, 
        registerGameFinishedRule,
        logGameFinishedEvent,
        registerOrderBuildingRule];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players);
    
    return campaign;
}

export { basicCampaign }