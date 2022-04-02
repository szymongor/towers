import { GameDimensions } from "../../GameDimensions";
import { UIElement } from "../ui/UiScene";
import { Coord } from "../ui/utils/UIGrid";

const drawWindow = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number) : UIElement => {

    let background = scene.add.rectangle(x, y, width, heigth, 0xfc9003).setOrigin(0.5,0.5);
    let border: UIElement = woodBorder(scene, x, y, width, heigth);

    let uiElem: UIElement = {
        width: 0,
        heigth: 0,
        show: () => {
            background.setVisible(true);
            border.show();
        },
        hide: () => {
            background.setVisible(false);
            border.hide();
        },
        update: () => {

        },
        setX: (x: number) => {
            background.setX(x);
            border.setX(x);
        },
        setY: (y: number) => {
            background.setY(x);
            border.setY(y);
        }
    }

    return uiElem;

}

const woodBorder = (scene: Phaser.Scene, x: number, y: number, width: number, heigth: number ) : UIElement => {

    let borderImgSize = 50;
    
    // TODO use enum for image names
    
    let elements: [Phaser.GameObjects.Image, Coord][] = [];

    let coord1: Coord = [0, -heigth/2];
    let img1 = scene.add.image(x,y-heigth/2, 'border').setScale((width)/borderImgSize,1).setOrigin(0.5,0)
    elements.push([img1, coord1])

    let coord2: Coord = [0, heigth/2];
    let img2 = scene.add.image(x,y+heigth/2, 'border').setAngle(180).setScale(width/borderImgSize,1).setOrigin(0.5,0)
    elements.push([img2, coord2])

    let coord3: Coord = [-width/2, 0];
    let img3 = scene.add.image(x-width/2,y, 'border').setAngle(270).setScale(heigth/borderImgSize,1).setOrigin(0.5,0);
    elements.push([img3, coord3])

    let coord4: Coord = [+width/2, 0];
    let img4 = scene.add.image(x+width/2,y, 'border').setAngle(90).setScale(heigth/borderImgSize,1).setOrigin(0.5,0);
    elements.push([img4, coord4])

    let coord5: Coord = [-width/2, -heigth/2];
    let img5 = scene.add.image(x-width/2,y-heigth/2,'border_corner').setOrigin(0);
    elements.push([img5, coord5])

    let coord6: Coord = [+width/2, -heigth/2];
    let img6 = scene.add.image(x+width/2,y-heigth/2,'border_corner').setAngle(90).setOrigin(0);
    elements.push([img6, coord6])

    let coord7: Coord = [width/2, heigth/2];
    let img7 = scene.add.image(x+width/2,y+heigth/2,'border_corner').setAngle(180).setOrigin(0);
    elements.push([img7, coord7]);

    let coord8: Coord = [-width/2, heigth/2];
    let img8 = scene.add.image(x-width/2,y+heigth/2,'border_corner').setAngle(270).setOrigin(0);
    elements.push([img8, coord8]);

    let uiElem: UIElement = {
        width: width,
        heigth: heigth,
        show: () => {
            elements.forEach(elem => elem[0].setVisible(true))
        },
        hide: () => {
            elements.forEach(elem => elem[0].setVisible(false))
        },
        update: () => {

        },
        setX: (x: number) => {
            elements.forEach(elem => elem[0].setX(x + elem[1][0] + width/2))
        },
        setY: (y: number) => {
            elements.forEach(elem => elem[0].setY(y + elem[1][1] + heigth/2))
        }
    }

    return uiElem;


}

export { drawWindow };