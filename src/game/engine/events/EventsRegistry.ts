import { GameEvent } from "./GameEvent";

enum EventChannels {
    ORDER_BUILDING = "ORDER_BUILDING",
    BUILDING_PLACED = "BUILDING_PLACED",
    RESOURCE_COLLECTED = "RESOURCE_COLLECTED", //when building collects resource from nearest unit
    UNIT_DESTROYED = "UNIT_DESTROYED",
    DAMAGE_DEALT = "DAMAGE_DEALT",
    PLAYER_LOST = "PLAYER_LOST",
    GAME_FINISHED = "GAME_FINISHED",
    CHANGE_POSITION = "CHANGE_POSITION"
}

interface Subscriber {
    call: (event: GameEvent) => void;
}

class EventRegistry {

    events: GameEvent[];
    subscribers: { [key: string]: Subscriber[]};
    static events: { [key: string]: EventChannels };

    constructor() {
        this.events = [];
        this.subscribers = {};
    }

    emit(event: GameEvent) {
        this.events.push(event);
        let channelSubscribers = this.subscribers[event.channel];
        if(channelSubscribers) {
            channelSubscribers.forEach( (sub) => sub.call(event));
        }
    }

    subscribe(channel: EventChannels, subscriber: Subscriber) {
        if(this.subscribers[channel]) {
            this.subscribers[channel].push(subscriber);
        } else {
            this.subscribers[channel] = [subscriber];
        }
    }

    getChannelEvents(channel: EventChannels): GameEvent[] {
        return this.events.filter(e => { return e.channel == channel});
    }

}

export { EventRegistry, EventChannels, Subscriber }