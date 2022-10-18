import { CommandSentEventData } from "../events/EventDataTypes";
import { EventChannels, EventRegistry } from "../events/EventsRegistry";
import { GameEvent } from "../events/GameEvent";
import { Command } from "./Command";

class CommandLog {

    private commands: Command[];
    private eventRegistry: EventRegistry;

    constructor(eventRegistry: EventRegistry) {
        this.commands = [];
        this.eventRegistry = eventRegistry;
    }

    add(command: Command) {
        this.commands.push(command);
        let data: CommandSentEventData = {
            command: command
        }
        let event = new GameEvent(EventChannels.COMMAND_SENT, data);
        this.eventRegistry.emit(event);
    }

}

export { CommandLog }