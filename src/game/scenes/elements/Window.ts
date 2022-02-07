import { GameDimensions } from "../../GameDimensions";


const drawWindow = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number) => {

    scene.add.rectangle(x, y, width, heigth, 0xfc9003).setOrigin(0.5,0.5);
    woodBorder(scene, x, y, width, heigth);

}

const woodBorder = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number ) => {

    let borderImgSize = 50;
    
    // TODO use enum for image names
    

    scene.add.image(x,y-heigth/2, 'border').setScale((width)/borderImgSize,1).setOrigin(0.5,0); 
    scene.add.image(x,y+heigth/2, 'border').setAngle(180).setScale(width/borderImgSize,1).setOrigin(0.5,0);
    scene.add.image(x-width/2,y, 'border').setAngle(270).setScale(heigth/borderImgSize,1).setOrigin(0.5,0)
    scene.add.image(x+width/2,y, 'border').setAngle(90).setScale(heigth/borderImgSize,1).setOrigin(0.5,0);

    scene.add.image(x-width/2,y-heigth/2,'border_corner').setOrigin(0); 
    scene.add.image(x+width/2,y-heigth/2,'border_corner').setAngle(90).setOrigin(0);
    scene.add.image(x+width/2,y+heigth/2,'border_corner').setAngle(180).setOrigin(0);
    scene.add.image(x-width/2,y+heigth/2,'border_corner').setAngle(270).setOrigin(0);
}

export { drawWindow };