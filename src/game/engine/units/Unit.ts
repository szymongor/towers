import { GameDimensions } from  '../../GameDimensions';
import { Selectable } from '../../scenes/main/MainCamera';
import { Player } from '../Player';
import { ResourcesStorage } from '../Resources';
import { UnitAction } from './actions/UnitActions';
import { UnitConfig } from './UnitFactory';
import { Bar } from '../../scenes/utils/bars';

enum UnitTypes {
    BUILDING = "BUILDING",
    RESOURCE = "RESOURCE"
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
    progressBar?: Bar;
    unit?: Unit;
    highlight?: Phaser.GameObjects.Sprite;
}

interface UnitInfo {
    name: string;
    x: number;
    y: number;
    hp: HP;
    player: Player;
}

class HP {
    value: number;
    max: number;
    constructor(value: number, max?: number) {
        if(value) {
            this.value = value;
        } else {
            this.value = 0;
        }
        if(max) {
            this.max = max;
        } else {
            this.max = 0;
        }
        
    }

    addHealthValue(value: number) {
        let sum = this.value + value;
        if(sum > this.max) {
            this.value = this.max;
        } else if(sum < 0) {
            this.value = 0;
        }else {
            this.value = sum;
        }
    }

    addMax(max: number) {
        this.max += max;
    }
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
    hp: HP;

    constructor(xPos: number, yPos: number, config: UnitConfig, player?: Player) {
        this.x = xPos;
        this.y = yPos;
        this.name = config.name;
        this.type = config.type;
        this.size = config.size;
        this.player = player;
        this.unitName = config.name;
        this.state = {
            construction: false,
            progress: {
                limit:0,
                value: 0
            }
        };
        this.actions = config.actions;
        this.actionRange = config.actionRange;
        this.hp = new HP(0, config.maxHP);

    }

    // constructor (xPos: number, 
    //                 yPos: number, 
    //                 name: string, 
    //                 type: UnitTypes, 
    //                 size: number, 
    //                 player: Player, 
    //                 unitName: string,
    //                 actions: UnitAction[],
    //                 actionRange: number,
    //                 resources?: ResourcesStorage, 
    //                 ) {
    //     this.x = xPos;
    //     this.y = yPos;
    //     this.name = name;
    //     this.type = type;
    //     this.size = size;
    //     this.player = player;
    //     this.unitName = unitName;
    //     this.state = {
    //         construction: false,
    //         progress: {
    //             limit:0,
    //             value: 0
    //         }
    //     };
    //     this.resources = resources;
    //     this.actions = actions;
    //     this.actionRange = actionRange;
    //     this.hp = new HP(0, 400);
    // }

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

    getCentre(): {x: number, y: number} {
        let centre = {
            x: this.x + this.size * GameDimensions.grid.tileSize/2,
            y: this.y + this.size * GameDimensions.grid.tileSize/2,
        };
        return centre;
    }

    getActionRange() {
        return this.actionRange;
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
        let centre = this.getCentre();
        let unitCentre = unit.getCentre();
        let dX = unitCentre.x-centre.x;
        let dY = unitCentre.y-centre.y;
        return Math.sqrt( dX*dX + dY*dY);
    }

    isUnitInRange(unit: Unit): boolean {
        let distnace = this.distanceToUnit(unit);

        return distnace < this.actionRange + (unit.size * GameDimensions.grid.tileSize);

    }

    getUnitInfo(): UnitInfo {
        let unitInfo = {
            name: this.name,
            hp: this.hp,
            player: this.player,
            x: this.x,
            y: this.y
        }
        return unitInfo;
    }
}

export { Unit, UnitTypes, GameUnit };