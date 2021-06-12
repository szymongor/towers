import { EventChannels } from './EventsRegistry';

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

export { GameEvent };