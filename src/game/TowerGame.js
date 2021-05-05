import Phaser from 'phaser';
import towerPng from '../images/Tower.png';

class TowerGame extends Phaser.Scene
{
    constructor () {
        super();
        this.map = {};
        this.towers = [];
        this.iter = 0;
    }

    //load assets
    preload () {
        this.load.image('tower',towerPng);

    }
      
    create () {
        this.camera = this.cameras.main.setSize(800, 600);
        // this.tower = this.add.sprite(400, 180, 'tower' );
        // this.tower.scale =0.2;
        this.drawMap(this.registry.map);
    }

    update() {
        // var halfWidth = 800 / 2;
        // var quarterWidth = halfWidth / 2;
        // var halfHeight = 600 / 2;
        // var quarterHeight = halfHeight / 2;

        // this.camera.scrollX = (halfWidth - quarterWidth + (Math.cos(this.iter) * quarterWidth))|0;
        // this.camera.scrollY = (halfHeight - quarterHeight + (Math.sin(this.iter) * quarterHeight))|0;

        // this.iter += 0.02;
        if (this.game.input.activePointer.isDown) {	
            if (this.game.origDragPoint) {		
                // move the camera by the amount the mouse has moved since last update		
                this.camera.scrollX += this.game.origDragPoint.x - this.game.input.activePointer.position.x;		
                this.camera.scrollY += this.game.origDragPoint.y - this.game.input.activePointer.position.y;	}	
                // set new drag origin to current position	
                this.game.origDragPoint = this.game.input.activePointer.position.clone();}
                else {	this.game.origDragPoint = null;}
    }

    drawMap(map) {
        console.log(map);
        map.forEach(mapElement => {
            console.log("x: "+ mapElement.x);
            var tower = this.add.sprite(mapElement.x, mapElement.y, 'tower' );
            tower.scale =0.2;
    
        });
    }
}

const createTowerGame = (map) => {

    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        scene: TowerGame
    };

    const game = new Phaser.Game(config);

    game.registry.map = map;

    return game;

}

export { createTowerGame }
