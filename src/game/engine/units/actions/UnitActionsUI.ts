import { GameDimensions } from "../../../GameDimensions";
import { EventRegistry } from "../../events/EventsRegistry";
import { GameEngine } from "../../GameEngine";
import { Vector } from "../../map/PlayerVision";
import { Player } from "../../Player";
import { Unit } from "../Unit";

//TODO get ownerPlayer as source unit owner?
interface UnitActionUIProvider {
    (unit: Unit, gameEngine: GameEngine, player: Player): UnitActionUI
}

interface UnitActionParams {
    target: Vector,
    units?: Unit[]
}

enum UiActionType {
    ORDERING = "ORDERING",
    TARGETING = "TARGETING"

}

interface UnitActionUI {
    actionName: string;
    type: UiActionType;
    actionIcon: string;
    canExecute: () => boolean;
    execute: (params?: UnitActionParams) => void;
}


export { UnitActionUI, UnitActionUIProvider, UiActionType }