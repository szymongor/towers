import Phaser from 'phaser';
import towerPng from '../images/Tower.png';

class TowerGame extends Phaser.Scene
{
    constructor () {
        super();
    }

    //load assets
    preload () {
        this.load.image('tower',towerPng)

    }
      
    create () {
        this.tower = this.add.sprite(400, 180, 'tower' );
        this.tower.scale =0.2;
    }

    update() {
        this.tower.angle += 1;

    }
}

const createTowerGame = () => {

    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        scene: TowerGame
    };

    const game = new Phaser.Game(config);

    return game;

}

export { createTowerGame }
