import * as Phaser from 'phaser';
import { CampaignName } from '../../engine/campaign/CampaignFactory';
import { UnitName } from '../../engine/units/UnitFactory';
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

        this.addCampaignButton();

    
        
        
    }

    addCampaignButton() {
        let scene = this;
        let campaignName = CampaignName.BASIC_CAMPAIGN;

        let xPos = this.renderer.width/2-100;
        let yPos = this.renderer.height/2-150;
        var buttonCastle = scene.add.image(xPos, yPos, UnitName.CASTLE)
        .setScale(0.5)
        .setOrigin(0)
        .setInteractive();

        let startText = this.add.text(xPos, yPos+100, 
            '1 vs 1 AI', { font: '30px Arial', color: '#FFFFFF' });

        startText.setInteractive();
        buttonCastle.setInteractive();

        startText.on('pointerdown', () => { this.parent.startNewGame(campaignName);
        }, this);
        buttonCastle.on('pointerdown', () => { this.parent.startNewGame(campaignName);
        }, this);
    }



}

export { StartScene }