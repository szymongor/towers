import { AiProcessor } from "../../../../../game/engine/Ai/processor/AiProcessor";
import { Campaign } from "../../../../../game/engine/campaign/Campaign";
import { EventChannels } from "../../../../../game/engine/events/EventsRegistry";
import { GameEvent } from "../../../../../game/engine/events/GameEvent";
import { GameEngine } from "../../../../../game/engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../../../../game/engine/map/MapBoard";
import { Player } from "../../../../../game/engine/Player";
import { ResourceName, Resources } from "../../../../../game/engine/Resources";
import { GameRuleConfigurator } from "../../../../../game/engine/rules/GameStateRules";
import { ArrowAttack } from "../../../../../game/engine/units/actions/attack/ArrowAttackAction";
import { UnitTypes } from "../../../../../game/engine/units/Unit";
import { UnitName, UnitsConfig } from "../../../../../game/engine/units/UnitFactory";


let unitsConfig: UnitsConfig = {
    soldier: {
        name: 'Soldier',
        unitName: UnitName.SOLDIER,
        spriteName: 'soldier',
        size: 2,
        type: UnitTypes.CREATURE,
        cost: [
            [
                ResourceName.WOOD,
                10
            ],
            [
                ResourceName.STONE,
                10
            ]
        ],
        actions: [ArrowAttack],
        commands: [],
        actionInterval: 5,
        actionRange: 200,
        constructionTime: 10,
        maxHP: 200
    }
}

const testCampaignProvider = (gameEngine: GameEngine) => {
    let initResources = new Resources([[ResourceName.WOOD, 2000], [ResourceName.STONE, 1000]]);
    let players = [new Player('1', 'Player1', initResources), new Player('2', 'Bot', initResources)];

    let terrain: Terrain = { type: (x: number, y: number) => TerrainType.DEFAULT }
    let mapSupplier = () => new MapBoard(100, 100, gameEngine, terrain);

    let aiProcessor =  new AiProcessor(gameEngine);

    let rulesConfig: GameRuleConfigurator[] = [];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players, unitsConfig, () => {});

    return campaign;
}


describe('Unit storage test', () => {

    test('Should add created Unit', () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);
        let eventRegistry = gameEngine.events;
        let unitStorage = gameEngine.unitStorage;

        let unit = gameEngine.unitFactory.of(UnitName.SOLDIER, 1,1, null);

        let unitCreatedEvent = new GameEvent(EventChannels.UNIT_CREATED, {unit: unit});

        //when
        eventRegistry.emit(unitCreatedEvent);

        //then
        expect(unitStorage.getUnits({})).toHaveLength(1);
    })

    test('Should delete destroyed Unit', () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);
        let eventRegistry = gameEngine.events;
        let unitStorage = gameEngine.unitStorage;

        let unit = gameEngine.unitFactory.of(UnitName.SOLDIER, 1,1, null);

        let unitCreatedEvent = new GameEvent(EventChannels.UNIT_CREATED, {unit: unit});
        let unitDestroyed = new GameEvent(EventChannels.UNIT_DESTROYED, {unit: unit});

        //when
        eventRegistry.emit(unitCreatedEvent);
        eventRegistry.emit(unitDestroyed);

        //then
        expect(unitStorage.getUnits({})).toHaveLength(0);
    })

    test('Should return Units in box area', () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);
        let eventRegistry = gameEngine.events;
        let unitStorage = gameEngine.unitStorage;

        let player = gameEngine.getPlayer();

        let unit1 = gameEngine.unitFactory.of(UnitName.SOLDIER, 10,10, player);
        let unit2 = gameEngine.unitFactory.of(UnitName.SOLDIER, 30,30, player);

        let unitCreatedEvent1 = new GameEvent(EventChannels.UNIT_CREATED, {unit: unit1});
        let unitCreatedEvent2 = new GameEvent(EventChannels.UNIT_CREATED, {unit: unit2});

        //when
        eventRegistry.emit(unitCreatedEvent1);
        eventRegistry.emit(unitCreatedEvent2);

        //then
        expect(unitStorage.getUnits({})).toHaveLength(2);
        expect(unitStorage.boxSelect(0,0,20,20, player)).toHaveLength(1);
        expect(unitStorage.boxSelect(0,0,100,100, player)).toHaveLength(2);
    })

})