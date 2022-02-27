import { GameDimensions } from "../../GameDimensions";
import { drawWindow } from "./Window";


const drawWell = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number) => {

    let well = scene.add.rectangle(x, y, width, heigth, GameDimensions.ui.wellColor).setOrigin(0);

}

export { drawWell }