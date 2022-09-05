
import { AiProcessor } from "../../../../game/engine/Ai/processor/AiProcessor";
import { Campaign } from "../../../../game/engine/campaign/Campaign";
import { CampaignFactory, CampaignName } from "../../../../game/engine/campaign/CampaignFactory";
import { EventChannels } from '../../../../game/engine/events/EventsRegistry';
import { GameFinishedEventData } from "../../../../game/engine/events/GameEvent";
import { GameEngine } from "../../../../game/engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../../../game/engine/map/MapBoard";
import { Player } from "../../../../game/engine/Player";
import { registerGameFinishedRule } from "../../../../game/engine/rules/game_finished/GameFinishedRule";
import { registerPlayerLostRule } from "../../../../game/engine/rules/player_lost/PlayerLostRule";
import { registerUnitDestroyedRule } from "../../../../game/engine/rules/unit_destroyed/UnitDestroyedRule";
import { UnitName } from '../../../../game/engine/units/UnitFactory';


const testCampaignProvider = (gameEngine: GameEngine) => {
    let players = [new Player('1', 'Player1'), new Player('2', 'Bot')];

    let terrain: Terrain = { type: (x: number, y: number) => TerrainType.DEFAULT }
    let mapSupplier = () => new MapBoard(1, 1, gameEngine, terrain);

    let aiProcessor =  new AiProcessor(gameEngine);

    let rulesConfig = [registerUnitDestroyedRule, registerPlayerLostRule, 
        registerGameFinishedRule];

    let campaign = new Campaign(mapSupplier, aiProcessor, rulesConfig, players);

    let castle1 = gameEngine.unitFactory.of(UnitName.CASTLE, 20, 20, gameEngine, players[0])
    let castle2 = gameEngine.unitFactory.of(UnitName.CASTLE, 80, 80, gameEngine, players[1])

    gameEngine.unitStorage.addUnit(castle1);
    gameEngine.unitStorage.addUnit(castle2);
    
    return campaign;
}

describe("Game Finished tests", () => {
    test('should finish the game when player lost Castle', () => {
        //given
        let gameEngine = new GameEngine(testCampaignProvider);
        let player = gameEngine.getPlayer();
        let castleFilter = {
            owner: player,
            unitName: UnitName.CASTLE
        }
        let castle = gameEngine.unitStorage.getUnits(castleFilter)[0];
        let dealtDamage = {
            value: 2000,
            source: castle
        }

        //when
        castle.dealDamage(dealtDamage);

        //then
        expect(hasGameFinishedEventWithBotWinner(gameEngine)).toBeTruthy();
    });
});

const hasGameFinishedEventWithBotWinner = (gameEngine: GameEngine): Boolean => {
    let finishedGameEvents = gameEngine.events.getChannelEvents(EventChannels.GAME_FINISHED);
    if(finishedGameEvents.length == 1 ) {
        let finishedGameEventData: GameFinishedEventData = finishedGameEvents[0].data;
        return finishedGameEventData.winner.id == '2';
    }
    return false;
}