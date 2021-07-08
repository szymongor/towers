import * as Phaser from 'phaser';
import { GameDimensions } from '../../GameDimensions';
import { TowerGame } from '../TowerGame';


class StartScene extends Phaser.Scene {

    parent: TowerGame;

    constructor(handle: string, parent: TowerGame) {
        super(handle);
        this.parent = parent;
    }

    create() {
        var mainBackground = this.add.rectangle(0, 0, 
            this.renderer.width, 
            this.renderer.height, 
            GameDimensions.backgroundColor);
        mainBackground.setOrigin(0,0);

        let startText = this.add.text(this.renderer.width/2-150, this.renderer.height/2-50, 
            'Click to start new game', { font: '30px Arial', color: '#FFFFFF' });

    
        startText.setInteractive();

        startText.on('pointerdown', () => { this.parent.startNewGame();
        }, this);
        
    }



}

export { StartScene }