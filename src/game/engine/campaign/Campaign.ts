import { AiProcessor } from "../Ai/processor/AiProcessor";
import { MapBoard } from "../map/MapBoard";
import { Player } from "../Player";
import { GameRuleConfigurator } from "../rules/GameStateRules";
import { UnitConfig, UnitsConfig } from "../units/UnitFactory";


class Campaign {

    mapSupplier: () => MapBoard;
    aiProcessor: AiProcessor;
    rulesConfig: GameRuleConfigurator[];
    unitsConfig: UnitsConfig;
    players: Player[];

    constructor(mapSupplier: () => MapBoard,
     aiProcessor: AiProcessor, rulesConfig: GameRuleConfigurator[], players: Player[], unitsConfig: UnitsConfig) {
        this.mapSupplier = mapSupplier;
        this.aiProcessor = aiProcessor;
        this.rulesConfig = rulesConfig;
        this.unitsConfig = unitsConfig;
        this.players = players;
    }

}

type MapBoardSupplier = () => MapBoard

export { Campaign, MapBoardSupplier}