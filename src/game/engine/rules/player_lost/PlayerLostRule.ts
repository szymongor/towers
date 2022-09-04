import { EventChannels } from "../../events/EventsRegistry";
import { GameEvent, PlayerLostEventData } from "../../events/GameEvent";
import { GameEngine } from "../../GameEngine";
import { Player } from "../../Player";
import { UnitName } from "../../units/UnitFactory";
import { UnitFilter } from "../../units/UnitsStorage";

const playerLostRule = (gameEngine: GameEngine) => {
    return (event: GameEvent) => {
        let players = gameEngine.players;
        players.forEach(player => {
            if(hasNoCastleUnit(player, gameEngine)) {
                let eventData: PlayerLostEventData = {
                    player: player
                }
                let event = new GameEvent(EventChannels.PLAYER_LOST, eventData);
                gameEngine.events.emit(event);
            }
        });
    }
}

const hasNoCastleUnit = (player: Player, gameEngine: GameEngine): Boolean => {
    let unitsFilter: UnitFilter = {
        owner: player,
        unitName: UnitName.CASTLE
    }
    let castles = gameEngine.unitStorage.getUnits(unitsFilter);
    return castles.length == 0;
}

export { playerLostRule }