import Phaser from 'phaser';
import towerPng from '../images/Tower.png';
import { UnitTypes } from './Unit';
import { buildingObjectOver, buildingObjectOut } from './UnitsControls';

class TowerGame extends Phaser.Scene
{
    constructor () {
        super();
        this.map = {};
        this.gameUnits = [];
    }

    //load assets
    preload () {
        this.load.image('tower',towerPng);
    }
      
    create () {
        var mapBoard = this.registry.map;
        this.camera = this.cameras.main.setSize(800, 600);

        const minimapDimensions = { x: 200, y: 200};
        var minimapZoom = { x: minimapDimensions.x / mapBoard.height , y: minimapDimensions.y / mapBoard.width};    
        this.minimap = this.cameras.add(600, 0, minimapDimensions.x, minimapDimensions.y)
            .setZoom(minimapZoom.x, minimapZoom.y).setName('mini');
        this.minimap.setOrigin(0,0);
        this.minimap.setBackgroundColor(0x002244);

        this.r3 = this.add.rectangle(this.camera.x, this.camera.y, 800, 600);
        this.r3.setOrigin(0,0);

        this.r3.setStrokeStyle(5, 0xFFFFFF);

        this.drawMap(mapBoard);
        this.selectSprite();
    }

    selectSprite() {
        this.input.on('gameobjectover', (pointer, gameObject) => {
            gameObject.gameObjectOver(pointer, gameObject);
        });

        this.input.on('gameobjectout', (pointer, gameObject) => {
            gameObject.gameObjectOut(pointer, gameObject);
        });
    }
    

    update() {
        this.mapScroll();
    }

    mapScroll() {
        if (this.game.input.activePointer.isDown) {	
            if (this.game.origDragPoint) {		
                // move the camera by the amount the mouse has moved since last update		
                this.camera.scrollX += this.game.origDragPoint.x - this.game.input.activePointer.position.x;		
                this.camera.scrollY += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
                this.r3.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.r3.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
            	}	
                // set new drag origin to current position
                
                this.game.origDragPoint = this.game.input.activePointer.position.clone();}
                else {	this.game.origDragPoint = null;}
    }

    miniMapRect() {
        // this.minimap.
    }

    drawMap(map) {
        console.log(map);
        map.units.forEach(unit => {
            var gameUnit = this.createGameUnit(this, unit);
            this.gameUnits.push(gameUnit);
        
        });
    }

    createGameUnit(game, unit) {
        var gameUnit = game.add.sprite(unit.x, unit.y, unit.name);
        gameUnit.scale =0.2;
        switch(unit.type) {
            case UnitTypes.BUILDING :
                gameUnit.gameObjectOver = buildingObjectOver(this);
                gameUnit.gameObjectOut = buildingObjectOut(this);
                gameUnit.setInteractive();
                break;
            default :
                gameUnit.gameObjectOver = (pointer, gameObject) => {};
                gameUnit.gameObjectOut = (pointer, gameObject) => {};
        }
        return gameUnit;
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
