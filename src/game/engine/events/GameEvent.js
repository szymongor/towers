
class GameEvent {
    constructor(channel, data) {
        this.timestamp = Date.now();
        this.channel = channel;
        this.data = data;
    }
}

export { GameEvent };