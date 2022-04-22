import { GameEngine } from "../../GameEngine";
import { changePositionProvider } from "../../units/actions/change_position/ChangePositionAction";
import { soldierProductionProvider } from "../../units/actions/UnitActionsUI";
import { UnitName } from "../../units/UnitFactory";

const orderUnitAction = {
    execute : (ge: GameEngine) => {
        let botPlayer = ge.players[1];
        let castle = ge.unitStorage.getUnits({owner: botPlayer, unitName: UnitName.CASTLE});
        if(castle.length == 1) {
            let gameActionProvider = soldierProductionProvider(castle[0], ge, ge.events, botPlayer);
            gameActionProvider.execute();
        }
    }
}

const moveAllSoldiersUnitAction = {
    execute : (ge: GameEngine) => {
        let botPlayer = ge.players[1];
        let allBotUnits = ge.unitStorage.getUnits({owner: botPlayer, unitName: UnitName.SOLDIER});
        if(allBotUnits) {
            let gameActionProvider = changePositionProvider(allBotUnits[0], ge, ge.events, botPlayer);
            let actionProps = {
                target: {x: 0, y:0},
                units: allBotUnits
            }
            gameActionProvider.execute(actionProps);
        }
    }
}

export { orderUnitAction, moveAllSoldiersUnitAction }