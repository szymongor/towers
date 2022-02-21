import * as Phaser from 'phaser';
import { Player } from '../../engine/Player';
import { GameDimensions } from '../../GameDimensions';
import { drawWindow } from '../elements/Window';
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

        // var mainBackground = this.add.rectangle(GameDimensions.finishScene.x, GameDimensions.finishScene.y, 
        //     GameDimensions.finishScene.width, 
        //     GameDimensions.finishScene.height, 
        //     GameDimensions.backgroundColor);
        // mainBackground.setOrigin(0,0);

        let posX = GameDimensions.finishScene.x;
        let posY = GameDimensions.finishScene.y;

        drawWindow(this, posX, posY, 
            GameDimensions.finishScene.width, GameDimensions.finishScene.height);

        let gameResultText = this.gameResult.winner.name+" won!";

        let startText = this.add.bitmapText(posX, this.renderer.height/2-50, GameDimensions.font,
            gameResultText, 25);
            startText.setOrigin(0.5,0.5);

        let restartText = this.add.bitmapText(posX, this.renderer.height/2, GameDimensions.font,
            'Restart', 25);
        restartText.setOrigin(0.5,0.5);
    
        restartText.setInteractive();
        restartText.on('pointerdown', () => {
            this.parent.setStartScene();

        }, this)
        
    }



}

export { FinishScene, GameResult }