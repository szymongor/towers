import { Unit } from "../../../engine/units/Unit";
import { GameDimensions } from "../../../GameDimensions";
import { drawWindow } from "../../elements/Window";
import { Bar } from "../../utils/bars";
import { UIElement, UiScene } from "../UiScene";


const getHpBarUiElement = (scene: UiScene, selectedUnits: Unit[]): UIElement => {
    let width = scene.width;
    let heigth = 50;
    let window = drawWindow(scene, 0, 0, width, heigth );
    let bar = createHPBar(scene, selectedUnits);
    
    

    let uiElement: UIElement = {
        width: width,
        heigth: heigth,
        show: () => {
            bar.show();
            window.show();
        },
        hide: () => {
            bar.hide();
            window.hide();
        },
        setX: (x: number) => {
            bar.setX(x+25);
            window.setX(x);
        },
        setY: (y: number) => {
            bar.setY(y+heigth/2);
            window.setY(y);
        },
        update: () => {
            bar.updateProgress(getUnitsHpRatio(selectedUnits));
        }
    }
    return uiElement;
}

const getUnitsHpRatio = (units: Unit[]): number => {
    let hpValue = 0;
        let hpMax = 0;
        units.forEach(u => {
            hpValue += u.hp.value;
            hpMax += u.hp.max
        })

        if(hpMax) {
            return hpValue/ hpMax;
        } else {
            return 0;
        }
}

const createHPBar = (scene: UiScene, selectedUnits: Unit[]): Bar => {
    let space = 50;
    let progress = getUnitsHpRatio(selectedUnits);
    let hpBar = new Bar(scene, scene.originX+space/2, scene.originY+50, progress,
          GameDimensions.uiSceneWidth-space, 10, 0xff0000);
          
    return hpBar;
}

export { getHpBarUiElement }