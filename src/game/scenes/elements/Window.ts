import { GameDimensions } from "../../GameDimensions";


const drawWindow = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number) => {

    scene.add.rectangle(x, y, width, heigth, 0xfc9003).setOrigin(0.5,0.5);
    woodBorder(scene, x, y, width, heigth);

}

const woodBorder = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number ) => {
    scene.add.image(x-width/2,y-heigth/2,'border_corner'); // TODO use enum for image names

    scene.add.image(x+width/2,y-heigth/2,'border_corner').setAngle(90);
    scene.add.image(x+width/2,y+heigth/2,'border_corner').setAngle(180);
    scene.add.image(x-width/2,y+heigth/2,'border_corner').setAngle(270);

    scene.add.image(x,y-heigth/2, 'border').setScale(width/50,1); //TODO 50 from img width const?
    scene.add.image(x,y+heigth/2, 'border').setScale(width/50,1);

    scene.add.image(x-width/2,y, 'border').setAngle(90).setScale(heigth/50,1);
    scene.add.image(x+width/2,y, 'border').setAngle(90).setScale(heigth/50,1);
}

export { drawWindow };