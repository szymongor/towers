import Phaser from 'phaser';

class UiScene extends Phaser.Scene {
    constructor(handle, parent, x, y) {
        super(handle);
        this.x = x;
        this.y = y;
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }

    //load assets
    preload() {
    }

    create() {
        this.width = 200;
        this.height = 400;
        this.originX = this.x-this.width;
        this.originY = this.y-this.height;
        var viewRectangle = this.add.rectangle(this.originX, this.originY, this.width, this.height);
        viewRectangle.setOrigin(0,0);
        viewRectangle.setDepth(1);
        viewRectangle.setStrokeStyle(5, 0xFFFFFF);
        console.log("Created UI Scene: ");

        var info = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', fill: '#FFFFFF' });

    }

    update() {
    }
}

export { UiScene };