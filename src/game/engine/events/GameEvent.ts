import { Player } from '../Player';
import { EventChannels } from './EventsRegistry';

interface PlayerLostEventData {
    player: Player;
}

interface GameFinishedEventData {
    winner: Player;
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

export { GameEvent, PlayerLostEventData, GameFinishedEventData };