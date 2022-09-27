import { basicUnitConfig } from "../../../../game/campaign/basic/basicUnitConfig";
import { AiProcessor } from "../../../../game/engine/Ai/processor/AiProcessor";
import { Campaign } from "../../../../game/engine/campaign/Campaign";
import { GameEngine } from "../../../../game/engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../../../game/engine/map/MapBoard";
import { Player } from "../../../../game/engine/Player";
import { ResourceName, Resources } from "../../../../game/engine/Resources";
import { registerOrderBuildingRule } from "../../../../game/engine/rules/order_building/OrderBuilding";
import { UnitName } from "../../../../game/engine/units/UnitFactory";


const testCampaignProvider = (gameEngine: GameEngine) => {
    let initResources = new Resources([[ResourceName.WOOD, 50], [ResourceName.STONE, 50]]);
    let players = [new Player('1', 'Player1', initResources), new Player('2', 'Bot', initResources)];

    let terrain: Terrain = { type: (x: number, y: number) => TerrainType.DEFAULT }
    let mapSupplier = () => new MapBoard(500, 500, gameEngine, terrain);

    let aiProcessor =  new AiProcessor(gameEngine);

    let rulesConfig = [registerOrderBuildingRule];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players, basicUnitConfig);


    
    return campaign;
}

const setGameUnist = (gameEngine: GameEngine) => {
    let players = gameEngine.players;
    let castle1 = gameEngine.unitFactory.of(UnitName.CASTLE, 100, 100, players[0]);
    gameEngine.unitStorage.addUnit(castle1);
}

describe("Order building test", () => {
    test("Should consume required resources", () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);
        setGameUnist(gameEngine);
        let towerPrototype = gameEngine.unitFactory.of(UnitName.TOWER, 280, 220);

        //when
        gameEngine.orderBuilding(towerPrototype);

        //then
        console.log("Resources:" +gameEngine.players[0].resourcesSorage.resources.get(ResourceName.WOOD));
        
        expect(gameEngine.players[0].resourcesSorage.resources.get(ResourceName.WOOD)).toEqual(0);
        

    })
})

