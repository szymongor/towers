import { Game } from "phaser";
import { basicUnitConfig } from "../../../../game/campaign/basic/basicUnitConfig";
import { AiProcessor } from "../../../../game/engine/Ai/processor/AiProcessor";
import { Campaign } from "../../../../game/engine/campaign/Campaign";
import { EventChannels } from "../../../../game/engine/events/EventsRegistry";
import { GameEvent } from "../../../../game/engine/events/GameEvent";
import { GameEngine } from "../../../../game/engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../../../game/engine/map/MapBoard";
import { Player } from "../../../../game/engine/Player";
import { ResourceName, Resources } from "../../../../game/engine/Resources";
import { registerOrderBuildingCommand } from "../../../../game/engine/rules/order_building/OrderBuilding";
import { UnitName } from "../../../../game/engine/units/UnitFactory";

const fullInitialResources = () =>  new Resources([[ResourceName.WOOD, 50], [ResourceName.STONE, 50]]);
const emptyInitialResources = () =>  new Resources([]);



describe("Order building test", () => {
    test("Should consume required resources and create a unit", () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider(fullInitialResources()));
        setGameUnist(gameEngine);
        let towerPrototype = gameEngine.unitFactory.of(UnitName.TOWER, 280, 220);
        towerPrototype.player = gameEngine.getPlayer();

        //when
        gameEngine.orderBuilding(towerPrototype);

        //then
        expect(gameEngine.players[0].resourcesSorage.resources.get(ResourceName.WOOD)).toEqual(0);
        expect(gameEngine.events.getChannelEvents(EventChannels.UNIT_CREATED)).toHaveLength(2);

    })

    test("Should not consume resources and not build outside the vison", () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider(fullInitialResources()));
        setGameUnist(gameEngine);
        let towerPrototype = gameEngine.unitFactory.of(UnitName.TOWER, 1080, 1220);
        towerPrototype.player = gameEngine.getPlayer();

        //when
        gameEngine.orderBuilding(towerPrototype);

        //then
        expect(gameEngine.players[0].resourcesSorage.resources.get(ResourceName.WOOD)).toEqual(50);
        expect(gameEngine.events.getChannelEvents(EventChannels.UNIT_CREATED)).toHaveLength(1);

    })

    test("Should not build if player cant afford resources cost", () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider(emptyInitialResources()));
        setGameUnist(gameEngine);
        let towerPrototype = gameEngine.unitFactory.of(UnitName.TOWER, 280, 220);
        towerPrototype.player = gameEngine.getPlayer();

        //when
        gameEngine.orderBuilding(towerPrototype);

        //then
        expect(gameEngine.players[0].resourcesSorage.resources.get(ResourceName.WOOD)).toEqual(0);
        expect(gameEngine.events.getChannelEvents(EventChannels.UNIT_CREATED)).toHaveLength(1);

    })

    //TODO Building mine test
})


const testCampaignProvider = (initialResources: Resources) => { 
    return (gameEngine: GameEngine) => {
        let initResources = initialResources;
        let players = [new Player('1', 'Player1', initResources), new Player('2', 'Bot', initResources)];

        let terrain: Terrain = { type: (x: number, y: number) => TerrainType.DEFAULT }
        let mapSupplier = () => new MapBoard(500, 500, gameEngine, terrain);

        let aiProcessor =  new AiProcessor(gameEngine);

        let rulesConfig = [registerOrderBuildingCommand];

        let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players, basicUnitConfig, () => {});
        return campaign;
    }
}

const setGameUnist = (gameEngine: GameEngine) => {
    let players = gameEngine.players;
    let castle1 = gameEngine.unitFactory.of(UnitName.CASTLE, 100, 100, players[0]);
    let unitCreatedEvent = new GameEvent(EventChannels.UNIT_CREATED, {unit: castle1})
    gameEngine.events.emit(unitCreatedEvent);
}
