import { Vector } from "../map/Tile";
import { Player } from "../Player";
import { Unit } from "../units/Unit";


enum CommandType {
    CHANGE_POSITION = "CHANGE_POSITION",
    ORDER_PRODUCTION = "ORDER_PRODUCTION",
    ORDER_BUILDING = "ORDER_BUILDING",

}

class Command {
    id: String;
    sender: Player;
    type: CommandType;
    data: CommandData;
}

class CommandBuilder {
    private command: Command;

    constructor() {
        this.command = new Command();
    }

    id(id: String) {
        this.command.id = id;
        return this;
    }

    sender(sender: Player) {
        this.command.sender = sender;
        return this;
    }

    type(type: CommandType) {
        this.command.type = type;
        return this;
    }

    data(data: CommandData) {
        this.command.data = data;
        return this;
    }

    build() {
        return this.command;
    }

}

class CommandData {
    recivers?: Unit[];
    targetUnit: Unit;
    targetVector: Vector;
}

class CommandDataBuilder {
    private data: CommandData;

    constructor() {
        this.data = new CommandData();
    }

    recivers(recivers: Unit[]) {
        this.data.recivers = recivers;
        return this;
    }

    targetUnit(targetUnit: Unit) {
        this.data.targetUnit = targetUnit;
        return this;
    }

    targetVector(targetVector: Vector) {
        this.data.targetVector = targetVector;
        return this;
    }

    build() {
        return this.data;
    }
}

export { Command, CommandBuilder, CommandData, CommandDataBuilder, CommandType }