
import { CampaignName } from "../../../../game/engine/campaign/CampaignFactory";
import { EventChannels } from '../../../../game/engine/events/EventsRegistry';
import { GameEngine } from "../../../../game/engine/GameEngine";
import { DealtDamage } from '../../../../game/engine/units/Unit';
import { UnitName } from '../../../../game/engine/units/UnitFactory';
import { UnitFilter } from '../../../../game/engine/units/UnitsStorage';


const gameEngine = new GameEngine(CampaignName.BASIC_CAMPAIGN);

describe("Game Finished tests", () => {
    test('should finish the game when player lost Castle', () => {
        //given
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
        expect(hasGameFinishedEvent(gameEngine)).toBeTruthy();
        
    });
});

const hasGameFinishedEvent = (gameEngine: GameEngine): Boolean => {
    return gameEngine.events.getChannelEvents(EventChannels.GAME_FINISHED).length == 1
}