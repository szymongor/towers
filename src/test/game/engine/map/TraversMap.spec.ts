import { basicUnitConfig } from "../../../../game/campaign/basic/basicUnitConfig";
import { AiProcessor } from "../../../../game/engine/Ai/processor/AiProcessor";
import { Campaign } from "../../../../game/engine/campaign/Campaign";
import { EventChannels } from "../../../../game/engine/events/EventsRegistry";
import { GameEvent } from "../../../../game/engine/events/GameEvent";
import { GameEngine } from "../../../../game/engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../../../game/engine/map/MapBoard";
import { Vector } from "../../../../game/engine/map/Tile";
import { Player } from "../../../../game/engine/Player";
import { Resources } from "../../../../game/engine/Resources";
import { registerOrderBuildingCommand } from "../../../../game/engine/rules/order_building/OrderBuilding";
import { UnitName } from "../../../../game/engine/units/UnitFactory";


const testCampaignProvider = (gameEngine: GameEngine) => {
    let initResources = new Resources([]);
    let players = [new Player('1', 'Player1', initResources), new Player('2', 'Bot', initResources)];

    let terrain: Terrain = { type: (x: number, y: number) => TerrainType.GRASS }
    let mapSupplier = () => new MapBoard(500, 500, gameEngine, terrain);

    let aiProcessor =  new AiProcessor(gameEngine);

    let rulesConfig = [registerOrderBuildingCommand];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players, basicUnitConfig, () => {});
    return campaign;
}

describe("Travers map test", () => {
    test("Should calculate traversable map after UnitCreatedEvent", () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);
        let creature = gameEngine.unitFactory.of(UnitName.SOLDIER, 0, 0, gameEngine.getPlayer());
        let vector = new Vector(100, 100);
        let otherVector = new Vector(400, 400);

        //when
        let isTraversableBeforeBuilding = gameEngine.traversMap.isTileTraversableForUnit(vector, creature);
        createCastle(gameEngine);
        let isTraversableAfterBuilding = gameEngine.traversMap.isTileTraversableForUnit(vector, creature);
        let isTraversableOtherTile = gameEngine.traversMap.isTileTraversableForUnit(otherVector, creature);

        //then
        expect(isTraversableBeforeBuilding).toEqual(true);
        expect(isTraversableAfterBuilding).toEqual(false);
        expect(isTraversableOtherTile).toEqual(true);
    })
})

const createCastle = (gameEngine: GameEngine) => {
    let players = gameEngine.players;
    let castle1 = gameEngine.unitFactory.of(UnitName.CASTLE, 100, 100, players[0]);
    let unitCreatedEvent = new GameEvent(EventChannels.UNIT_CREATED, {unit: castle1})
    gameEngine.events.emit(unitCreatedEvent);
}