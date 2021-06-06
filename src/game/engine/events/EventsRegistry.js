

class EventRegistry {
    constructor() {
        this.events = [];
        this.subscribers = [];
    }

    emit(event) {
        this.events.push(event);
        let channelSubscribers = this.subscribers[event.channel];
        if(channelSubscribers) {
            channelSubscribers.forEach( (sub) => sub.call(event));
        }
        
    }

    subscribe(channel, subscriber) {
        if(this.subscribers[channel]) {
            this.subscribers[channel].push(subscriber);
        } else {
            this.subscribers[channel] = [subscriber];
        }
    }

}

EventRegistry.events = {
    "ORDER_BUILDING": "ORDER_BUILDING",
    "PLACE_BUILDING": "PLACE_BUILDING"
}
export { EventRegistry }