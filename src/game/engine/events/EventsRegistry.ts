import { GameEvent } from "./GameEvent";

enum EventChannels {
    COMMAND_SENT = "COMMAND_SEND",
    ORDER_BUILDING = "ORDER_BUILDING", //TODO Command
    UNIT_CREATED = "UNIT_CREATED",
    RESOURCE_COLLECTED = "RESOURCE_COLLECTED", //when building collects resource from nearest unit
    UNIT_DESTROYED = "UNIT_DESTROYED",
    PROJECTILE_FIRED = "PROJECTILE_FIRED", //TODO DAMAGE_DEALT event
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