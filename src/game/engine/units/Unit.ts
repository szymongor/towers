import { GameDimensions } from  '../../GameDimensions';
import { Selectable } from '../../scenes/main/MainCamera';
import { Player } from '../Player';
import { ResourcesStorage } from '../Resources';
import { UnitAction } from './actions/UnitActions';

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

interface GameUnit extends Phaser.GameObjects.Sprite, Selectable {
    progressBar?: ProgressBar | undefined;
    unit?: Unit;
    highlight?: Phaser.GameObjects.Sprite;

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
    resources?: ResourcesStorage;
    actions: UnitAction[];
    actionRange: number;

    constructor (xPos: number, 
                    yPos: number, 
                    name: string, 
                    type: UnitTypes, 
                    size: number, 
                    player: Player, 
                    unitName: string,
                    actions: UnitAction[],
                    actionRange: number,
                    resources?: ResourcesStorage, 
                    ) {
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
        this.resources = resources;
        this.actions = actions;
        this.actionRange = actionRange;
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

    destroy() {
        this.gameUnit.destroy();
    }

    distanceToUnit(unit: Unit): number {
        let centre = {
            x: this.x + this.size * GameDimensions.grid.tileSize/2,
            y: this.y + this.size * GameDimensions.grid.tileSize/2,
        };

        let unitCentre = {
            x: unit.x + unit.size * GameDimensions.grid.tileSize/2,
            y: unit.y + unit.size * GameDimensions.grid.tileSize/2,
        }
        let dX = unitCentre.x-centre.x;
        let dY = unitCentre.y-centre.y;
        
        
        return Math.sqrt( dX*dX + dY*dY);
    }

    isUnitInRange(unit: Unit): boolean {
        let distnace = this.distanceToUnit(unit);

        return distnace < this.actionRange + unit.size * GameDimensions.grid.tileSize/2;

    }
}

export { Unit, UnitTypes, GameUnit };