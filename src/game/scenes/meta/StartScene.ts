import * as Phaser from 'phaser';
import { CampaignName } from '../../engine/campaign/CampaignFactory';
import { UnitName } from '../../engine/units/UnitFactory';
import { GameDimensions } from '../../GameDimensions';
import { drawWindow } from '../elements/Window';
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

        this.addCampaignButton();
    }

    addCampaignButton() {
        let scene = this;
        let campaignName = CampaignName.BASIC_CAMPAIGN;

        let xPos = this.renderer.width/2;
        let yPos = this.renderer.height/2;
        var buttonCastle = scene.add.image(xPos, yPos, UnitName.CASTLE)
        .setScale(0.5)
        .setOrigin(0.5, 0.5)
        .setInteractive();

        drawWindow(this, xPos, yPos/3, 450, 100);
        let towersLogo = this.add.bitmapText(xPos, yPos/3, GameDimensions.font,
            'Towers 2.0', 40).setOrigin(0.5,0.5);

        let startText = this.add.bitmapText(xPos, yPos, GameDimensions.font,
            'Play', 30);

        startText.setInteractive();
        startText.setOrigin(0.5,0.5);
        buttonCastle.setInteractive();

        startText.on('pointerdown', () => { this.parent.startNewGame(campaignName);
        }, this);
        buttonCastle.on('pointerdown', () => { this.parent.startNewGame(campaignName);
        }, this);
    }



}

export { StartScene }