import { AiProcessor } from "../Ai/processor/AiProcessor";
import { GameEngine } from "../GameEngine";
import { MapBoard } from "../map/MapBoard";
import { Player } from "../Player";
import { GameRuleConfigurator } from "../rules/GameStateRules";
import { UnitConfig, UnitsConfig } from "../units/UnitFactory";

type CampaignInit = (gameEngine: GameEngine) => void;

class Campaign {

    mapSupplier: () => MapBoard;
    aiProcessor: AiProcessor;
    rulesConfig: GameRuleConfigurator[];
    unitsConfig: UnitsConfig;
    players: Player[];
    initCampaign: CampaignInit;

    constructor(mapSupplier: () => MapBoard,
     aiProcessor: AiProcessor, rulesConfig: GameRuleConfigurator[],
      players: Player[], unitsConfig: UnitsConfig, initCampaign: CampaignInit) {
        this.mapSupplier = mapSupplier;
        this.aiProcessor = aiProcessor;
        this.rulesConfig = rulesConfig;
        this.unitsConfig = unitsConfig;
        this.players = players;
        this.initCampaign = initCampaign;
    }

}

type MapBoardSupplier = () => MapBoard

export { Campaign, MapBoardSupplier, CampaignInit}