import * as Phaser from 'phaser';
import { Player } from '../../engine/Player';
import { GameDimensions } from '../../GameDimensions';
import { TowerGame } from '../TowerGame';

interface GameResult {
    winner: Player;
}

class FinishScene extends Phaser.Scene {

    parent: TowerGame;
    gameResult: GameResult;

    constructor(handle: string, parent: TowerGame, gameResult: GameResult ) {
        super(handle);
        this.parent = parent;
        this.gameResult = gameResult;
    }

    create() {

        var mainBackground = this.add.rectangle(GameDimensions.finishScene.x, GameDimensions.finishScene.y, 
            GameDimensions.finishScene.width, 
            GameDimensions.finishScene.height, 
            GameDimensions.backgroundColor);
        mainBackground.setOrigin(0,0);

        let gameResultText = "Winner: "+ this.gameResult.winner.name;

        let startText = this.add.text(this.renderer.width/2-150, this.renderer.height/2-50, 
            gameResultText, { font: '30px Arial', color: '#FFFFFF' });

        let restartText = this.add.text(this.renderer.width/2-150, this.renderer.height/2, 
            'Click here to restart', { font: '30px Arial', color: '#FFFFFF' });
    
        restartText.setInteractive();
        restartText.on('pointerdown', () => {
            this.parent.setStartScene();

        }, this)
        
    }



}

export { FinishScene, GameResult }