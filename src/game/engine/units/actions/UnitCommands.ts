import { GameEngine } from "../../GameEngine";
import { Vector } from "../../map/Tile";
import { Player } from "../../Player";
import { Unit } from "../Unit";

//TODO get ownerPlayer as source unit owner?
interface UnitCommandProvider {
    (unit: Unit, gameEngine: GameEngine, player: Player): UnitCommand
}

interface UnitCommandParams {
    target: Vector,
    units?: Unit[]
}

enum UnitCommandType {
    ORDERING = "ORDERING",
    TARGETING = "TARGETING"

}

//TODO Separate Ui and Engine - move actionIcon
interface UnitCommand {
    commandName: string;
    type: UnitCommandType;
    actionIcon: string;
    canExecute: () => boolean;
    executeCommand: (params?: UnitCommandParams) => void;
}


export { UnitCommand, UnitCommandProvider, UnitCommandType };