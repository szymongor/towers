import { GameEvent } from "./GameEvent";

enum EventChannels {
    ORDER_BUILDING = "ORDER_BUILDING",
    BUILDING_PLACED = "BUILDING_PLACED"
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

EventRegistry.events = {
    "ORDER_BUILDING": EventChannels.ORDER_BUILDING,
    "BUILDING_PLACED": EventChannels.BUILDING_PLACED
}

export { EventRegistry, EventChannels }