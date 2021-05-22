import Phaser from 'phaser';
import { GameDimensions } from  './GameDimensions';

class UiScene extends Phaser.Scene {
    constructor(handle, parent) {
        super(handle);
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }

    //load assets
    preload() {
    }

    create() {
        this.originX = GameDimensions.gameWidth-GameDimensions.uiSceneWidth;
        this.originY = GameDimensions.gameHeight-GameDimensions.uiSceneHeight;
        var viewRectangle = this.add.rectangle(this.originX, this.originY, GameDimensions.uiSceneWidth, GameDimensions.uiSceneHeight);
        viewRectangle.setOrigin(0,0);
        viewRectangle.setDepth(1);
        viewRectangle.setStrokeStyle(5, 0xFFFFFF);
        console.log("Created UI Scene: ");

        var info = this.add.text(this.originX, this.originY, 'UI', { font: '48px Arial', fill: '#FFFFFF' });
        var selectedUnitInfo = this.add.text(this.originX, this.originY+48, 'Dupa', { font: '48px Arial', fill: '#FFFFFF' });

        this.scene.get('mainCamera')
        .events.on('unitselected', (gameUnit) => { selectedUnitInfo.text = "x: "+gameUnit.unit.x+",\ny: "+gameUnit.unit.y});
    }

    update() {
    }
}

export { UiScene };