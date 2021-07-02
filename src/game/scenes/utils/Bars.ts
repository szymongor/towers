import { Scene } from "phaser";

class Bar {
    border: Phaser.GameObjects.Rectangle;
    valueBar: Phaser.GameObjects.Rectangle;
    height: number;
    widthMax: number;

    constructor(scene: Scene, x: number, y: number, progress: number, widthMax: number, height: number, color: number) {
       
        this.valueBar = scene.add.rectangle(x, y, progress*widthMax, height,color);
        this.border = scene.add.rectangle(x, y, widthMax, height);
        this.border.setOrigin(0);
        this.border.setStrokeStyle(2, color);

        this.valueBar.setOrigin(0);
        this.height = height;
        this.widthMax = widthMax;
    }

    destroy() {
        this.border.visible = false;
        this.valueBar.visible = false;
    }

    updateProgress(progress: number) {
        
        this.valueBar.setSize(progress*this.widthMax, this.height);
    }
}

export { Bar }