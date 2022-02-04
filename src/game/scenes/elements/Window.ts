import { GameDimensions } from "../../GameDimensions";


const drawWindow = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number) => {

    scene.add.rectangle(x, y, width, heigth, 0xfc9003).setOrigin(0.5,0.5);
    //TODO

}

export { drawWindow };