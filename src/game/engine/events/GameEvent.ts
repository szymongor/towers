import { Tile } from '../map/PlayerVision';
import { Player } from '../Player';
import { Unit } from '../units/Unit';
import { EventChannels } from './EventsRegistry';

interface PlayerLostEventData {
    player: Player;
}

interface GameFinishedEventData {
    winner: Player;
}

interface ChangePositionEventData {
    unit: Unit,
    target: Tile
}

class GameEvent {
    timestamp: number;
    channel: EventChannels;
    data: any;

    constructor(channel: EventChannels, data: any) {
        this.timestamp = Date.now();
        this.channel = channel;
        this.data = data;
    }
}

export { GameEvent, PlayerLostEventData, GameFinishedEventData, ChangePositionEventData };