import Phaser from 'phaser';
import towerPng from '../images/Tower.png';

class TowerGame extends Phaser.Scene
{
    constructor () {
        super();
        this.map = {};
        this.towers = [];
    }

    //load assets
    preload () {
        this.load.image('tower',towerPng);

    }
      
    create () {
        this.camera = this.cameras.main.setSize(800, 600);
        this.drawMap(this.registry.map);
        this.selectSprite();
    }

    selectSprite() {
        this.input.on('gameobjectover', this.gameObjectOver(this));

        this.input.on('gameobjectout', function (pointer, gameObject) {
            gameObject.clearTint();
            gameObject.highlight.destroy();
        });
    }

    gameObjectOver(game) {
        return (pointer, gameObject) => {
                var spriteB = game.add.sprite(gameObject.x, gameObject.y, gameObject.texture );
                spriteB.setScale(0.25,0.22)
                spriteB.setTintFill(0xffffff);
                spriteB.setDepth(-1);
                gameObject.highlight = spriteB;
            }
    }
    

    update() {
        this.mouseScroll();
    }

    mouseScroll() {
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
            this.towers.push(tower.setInteractive());
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
