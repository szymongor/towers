import { GameDimensions } from  '../GameDimensions';
import { Player } from './Player';

enum UnitTypes {
    BUILDING = "BUILDING",
    TREE = "TREE"
}

interface UnitStateProgress {
    limit: number;
    value: number;
}

interface UnitState {
    construction: boolean;
    progress: UnitStateProgress;
}

interface GameUnit extends Phaser.GameObjects.Sprite {
    progressBar?: ProgressBar | undefined;
    unit?: Unit;
    gameObjectOver?: (pointer: Phaser.Input.Pointer, gameObject: GameUnit) => void;
    gameObjectOut?: (pointer: Phaser.Input.Pointer, gameObject: GameUnit) => void;
    selectUnit?: () => void;
    deselectUnit?: () => void;
}

interface ProgressBar extends Phaser.GameObjects.Rectangle {
    destroy: () => void;
}

class Unit {
    x: number;
    y: number;
    name: string;
    type: UnitTypes;
    size: number;
    player: Player;
    unitName: string;
    state: UnitState;
    gameUnit: GameUnit;

    constructor (xPos: number, 
                    yPos: number, 
                    name: string, 
                    type: UnitTypes, 
                    size: number, 
                    player: Player, 
                    unitName: string) {
        this.x = xPos;
        this.y = yPos;
        this.name = name;
        this.type = type;
        this.size = size;
        this.player = player;
        this.unitName = unitName;
        this.state = {
            construction: false,
            progress: {
                limit:0,
                value: 0
            }
        };
    }

    getProgress() {
        return this.state.progress.value / this.state.progress.limit;
    }

    getTexture() {
        if(this.state.construction) {
            return 'construction';
        } else {
            return this.name;
        }
    }

    updateTexture() {
        if(this.gameUnit) {
            this.gameUnit.setTexture(this.getTexture());
            if(this.gameUnit.progressBar) {
                this.gameUnit.progressBar.destroy();
                this.gameUnit.progressBar = null;
            }
        }
    }

    getScale() {
        return (GameDimensions.grid.tileSize/GameDimensions.grid.imgSize)*this.size
    }

    processTasks() { 
        let progres = this.state.progress;
        if(progres.limit == progres.value) {
            this.state.construction = false;
            return true;
        } else {
            this.state.progress.value++;
            return false;
        }
    }
}

export { Unit, UnitTypes, GameUnit };