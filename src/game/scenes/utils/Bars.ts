import { Scene } from "phaser";

class Bar {
    border: Phaser.GameObjects.Rectangle;
    valueBar: Phaser.GameObjects.Rectangle;
    height: number;
    widthMax: number;
    show: () => void;
    hide: () => void;
    setX: (x: number) => void;
    setY: (y: number) => void;

    constructor(scene: Scene, x: number, y: number, progress: number, widthMax: number, height: number, color: number) {
       
        this.valueBar = scene.add.rectangle(x, y, progress*widthMax, height,color);
        this.border = scene.add.rectangle(x, y, widthMax, height);
        this.border.setOrigin(0);
        this.border.setStrokeStyle(2, color);

        this.valueBar.setOrigin(0);
        this.height = height;
        this.widthMax = widthMax;

        this.show = () => {
            this.border.visible = true;
            this.valueBar.visible = true;
        }

        this.hide = () => {
            this.border.visible = false;
            this.valueBar.visible = false;
        }

        this.setX = (x: number) => {
            this.border.setX(x);
            this.valueBar.setX(x);
        }
        this.setY = (y: number) => {
            this.border.setY(y);
            this.valueBar.setY(y);
        }
        
    }
    
    updateProgress(progress: number) {
        this.valueBar.setSize(progress*this.widthMax, this.height);
    }
}

export { Bar }