import { AiProcessor } from "../Ai/processor/AiProcessor";
import { MapBoard } from "../map/MapBoard";
import { Player } from "../Player";
import { GameRuleConfigurator } from "../rules/GameStateRules";


class Campaign {

    mapSupplier: () => MapBoard;
    aiProcessor: AiProcessor;
    rulesConfig: GameRuleConfigurator[];
    players: Player[];

    constructor(mapSupplier: () => MapBoard, aiProcessor: AiProcessor, rulesConfig: GameRuleConfigurator[], players: Player[]) {
        this.mapSupplier = mapSupplier;
        this.aiProcessor = aiProcessor;
        this.rulesConfig = rulesConfig;
        this.players = players;
    }

}

type MapBoardSupplier = () => MapBoard

export { Campaign, MapBoardSupplier}