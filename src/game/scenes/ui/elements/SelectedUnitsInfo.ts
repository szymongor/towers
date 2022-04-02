import { Unit } from "../../../engine/units/Unit";
import { GameDimensions } from "../../../GameDimensions";
import { UIElement, UiScene } from "../UiScene";

const getUnitInfoUiElement = (scene: UiScene, units: Unit[]): UIElement => {
    let infoTxtposition = {
        x: scene.originX+2,
        y: scene.originY+80,
    };

    let infoTextFunc = () => {
        return '';
    }

    if(units.length == 1) {
        infoTextFunc = () => {
            return getUnitInfoText(units[0]);
        }
    } else {
        infoTextFunc = () => {
            return getUnitsInfoText(units);
        }
    }

    let infoText = infoTextFunc();
    let infoTxt = scene.add.bitmapText(infoTxtposition.x, infoTxtposition.y,  GameDimensions.font,
        infoText, 12);

    let uiElement : UIElement = {
        width: 0,
        heigth: 100,
        show: () => {
            infoTxt.setVisible(true);
        },
        hide: () => {
            infoTxt.setVisible(false);
        },
        setX: (x: number) => {
            infoTxt.setX(x);
        },
        setY: (y: number) => {
            infoTxt.setY(y);
        },
        update: () => {
            infoTxt.setText(infoTextFunc());
        }
    }
    return uiElement;
}



const getUnitInfoText = (unit: Unit): string => {
    let unitInfo = unit.getUnitInfo();
    let info = unitInfo.name + '\n';
    info += "HP: "+ unitInfo.hp.value +"/"+unitInfo.hp.max + '\n';
    info += "Player: " + unitInfo.player.id + '\n'
    info += "Coords: " + unitInfo.x + "," + unitInfo.y
    return info;
}

const getUnitsInfoText = (units: Unit[]): string => {
    let info = 'Units: '+units.length;
    return info;
}

export { getUnitInfoUiElement }