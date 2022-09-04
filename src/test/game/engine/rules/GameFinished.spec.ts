
import { CampaignFactory, CampaignName } from "../../../../game/engine/campaign/CampaignFactory";
import { EventChannels } from '../../../../game/engine/events/EventsRegistry';
import { GameFinishedEventData } from "../../../../game/engine/events/GameEvent";
import { GameEngine } from "../../../../game/engine/GameEngine";
import { UnitName } from '../../../../game/engine/units/UnitFactory';


const campaignFactory = new CampaignFactory();

describe("Game Finished tests", () => {
    test('should finish the game when player lost Castle', () => {
        //given
        let campaignProvider = campaignFactory.get(CampaignName.BASIC_CAMPAIGN);
        let gameEngine = new GameEngine(campaignProvider);
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