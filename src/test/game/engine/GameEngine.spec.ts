import { basicUnitConfig } from "../../../game/campaign/basic/basicUnitConfig";
import { AiProcessor } from "../../../game/engine/Ai/processor/AiProcessor";
import { Campaign } from "../../../game/engine/campaign/Campaign";
import { GameEngine } from "../../../game/engine/GameEngine"
import { MapBoard, Terrain, TerrainType } from "../../../game/engine/map/MapBoard";
import { Player } from "../../../game/engine/Player";
import { ResourceName, Resources } from "../../../game/engine/Resources";
import { logGameFinishedEvent, registerGameFinishedRule } from "../../../game/engine/rules/game_finished/GameFinishedRule";
import { registerOrderBuildingCommand } from "../../../game/engine/rules/order_building/OrderBuilding";
import { registerPlayerLostRule } from "../../../game/engine/rules/player_lost/PlayerLostRule";
import { registerUnitDestroyedRule } from "../../../game/engine/rules/unit_destroyed/UnitDestroyedRule";

const testCampaignProvider = (gameEngine: GameEngine) => {
    let initResources = new Resources([[ResourceName.WOOD, 2000], [ResourceName.STONE, 1000]]);
    let players = [new Player('1', 'Player1', initResources), new Player('2', 'Bot', initResources)];

    let terrain: Terrain = { type: (x: number, y: number) => TerrainType.DEFAULT }
    let mapSupplier = () => new MapBoard(100, 100, gameEngine, terrain);

    let aiProcessor =  new AiProcessor(gameEngine);

    let rulesConfig = [registerUnitDestroyedRule, registerPlayerLostRule, 
        registerGameFinishedRule,
        logGameFinishedEvent,
        registerOrderBuildingCommand];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players, basicUnitConfig, () => {});
    
    return campaign;
}

describe("GameEngine test", () => {
    test("should change round", () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);

        //wnen
        gameEngine.update();

        //then
        expect(gameEngine.round).toEqual(1);
    })
})