import { GameEngine } from "../../GameEngine";
import { Vector } from "../../map/PlayerVision";
import { changePositionProvider } from "../../units/actions/change_position/ChangePositionAction";
import { soldierProductionProvider } from "../../units/actions/production/SoldierProduction";
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
                target: new Vector(0, 0),
                units: allBotUnits
            }
            // gameActionProvider.execute(actionProps);
        }
    }
}

export { orderUnitAction, moveAllSoldiersUnitAction }