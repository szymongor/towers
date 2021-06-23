import { GameEvent } from "./GameEvent";

enum EventChannels {
    ORDER_BUILDING = "ORDER_BUILDING",
    BUILDING_PLACED = "BUILDING_PLACED",
    RESOURCE_COLLECTED = "RESOURCE_COLLECTED", //when building collects resource from nearest unit
    UNIT_DESTROYED = "UNIT_DESTROYED"

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

    subscribe(channel: string, subscriber: Subscriber) {
        if(this.subscribers[channel]) {
            this.subscribers[channel].push(subscriber);
        } else {
            this.subscribers[channel] = [subscriber];
        }
    }

}

export { EventRegistry, EventChannels }