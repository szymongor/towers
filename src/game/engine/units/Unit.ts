import { GameDimensions } from  '../../GameDimensions';
import { Selectable } from '../../scenes/main/MainCamera';
import { Player } from '../Player';
import { ResourcesStorage } from '../Resources';
import { UnitAction } from './actions/UnitActions';
import { UnitConfig, UnitName } from './UnitFactory';
import { Bar } from '../../scenes/utils/bars';
import { EventChannels, EventRegistry } from '../events/EventsRegistry';
import { GameEvent } from '../events/GameEvent';
import { CanPlaceRule } from './actions/UnitRules';
import { Tile } from '../map/PlayerVision';
import { UnitActionUI } from './actions/UnitActionsUI';
import { GameEngine } from '../GameEngine';
import { TaskProgress, UnitTask } from './UnitTask';

const TILE_SIZE = GameDimensions.grid.tileSize;

enum UnitTypes {
    BUILDING = "BUILDING",
    RESOURCE = "RESOURCE",
    CREATURE = "CREATURE"
}

interface UnitState {
    destroyed: boolean;
    construction: boolean;
}

interface CustomSprite extends Phaser.GameObjects.Sprite, Selectable {
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

interface DealtDamage {
    value: number;
    source: Unit;
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

// interface ActionProgress extends TaskProgress {
//     target?: Unit;
//     callback?: () => void;
// }

class Unit {
    x: number;
    y: number;
    name: string;
    unitName: UnitName;
    spriteName: string;
    type: UnitTypes;
    size: number;
    player: Player;
    state: UnitState;
    sprite: CustomSprite;
    resources?: ResourcesStorage;
    actions: UnitAction[];
    actionUI: UnitActionUI[];
    actionRange: number;
    actionInterval: number;
    currentTasks: Map<string, UnitTask>;
    hp: HP;
    eventRegistry: EventRegistry;
    canPlace: CanPlaceRule;


    constructor(xPos: number, yPos: number, config: UnitConfig, gameEngine: GameEngine, eventRegistry: EventRegistry, player?: Player) {
        this.x = xPos;
        this.y = yPos;
        this.name = config.name;
        this.unitName = config.unitName;
        this.spriteName = config.spriteName;
        this.type = config.type;
        this.size = config.size;
        this.player = player;
        
        this.state = {
            destroyed: false,
            construction: false
        };
        this.actions = config.actions;
        this.actionUI = config.uiActions.map(actionProvider => actionProvider(this, gameEngine, eventRegistry));
        this.actionRange = config.actionRange;
        this.actionInterval = config.actionInterval ? config.actionInterval : 1;
        this.currentTasks = new Map();
        this.hp = new HP(config.maxHP, config.maxHP);
        this.eventRegistry = eventRegistry;
        this.canPlace = config.canPlace;

    }

    getProgress(): Map<string, number> {
        var taskNameToProgress = new Map();

        this.currentTasks.forEach(({progress}, key) => {
            taskNameToProgress.set(key, progress.value/progress.limit);
        });

        return taskNameToProgress;
    }

    getTexture() {
        if(this.state.construction) {
            return 'construction';
        } else {
            return this.spriteName;
        }
    }

    updateTexture() {
        if(this.sprite) {
            this.sprite.setTexture(this.getTexture());
            this.sprite.setPosition(this.x, this.y);
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

    destroy() {
        this.sprite.destroy();
    }

    distanceToUnit(unit: Unit): number {
        let centre = this.getCentre();
        let unitCentre = unit.getCentre();
        let dX = unitCentre.x-centre.x;
        let dY = unitCentre.y-centre.y;
        return Math.sqrt( dX*dX + dY*dY);
    }

    distanceToTile(tile: Tile): number {
        let centre = this.getCentre();
        let dX = tile.x+TILE_SIZE/2-centre.x;
        let dY = tile.y+TILE_SIZE/2-centre.y;
        return Math.sqrt( dX*dX + dY*dY);
    }

    isUnitInRange(unit: Unit): boolean {
        let distnace = this.distanceToUnit(unit);
        return distnace < this.actionRange + (unit.size * GameDimensions.grid.tileSize);
    }

    getUnitInfo(): UnitInfo {
        let unitInfo = {
            name: this.unitName,
            hp: this.hp,
            player: this.player,
            x: this.x,
            y: this.y
        }
        return unitInfo;
    }

    kill() {
        if(this.eventRegistry && !this.state.destroyed) {
            this.state.destroyed = true;
            let data = {
                unit: this
            };
            let event: GameEvent = new GameEvent(EventChannels.UNIT_DESTROYED, data)
            this.eventRegistry.emit(event);
        }
    }

    dealDamage(damage: DealtDamage) {
        this.hp.value -= damage.value;
        if(this.hp.value <= 0) {
            this.kill();
        }
    }

    addUnitTask(unitTask: UnitTask) {
        this.currentTasks.set(unitTask.name, unitTask);
    }

    clearUnitTask(unitTaskName: string) {
        this.currentTasks.delete(unitTaskName);
        if(this.sprite.progressBar) {
            this.sprite.progressBar.destroy();
            this.sprite.progressBar = null;
        }
    }

    containsCoord(x: number, y: number) {
        return Math.abs(x - this.x) < this.size * GameDimensions.grid.tileSize/2
        &&
        Math.abs(y - this.y) < this.size * GameDimensions.grid.tileSize/2;
    }

    getUnitTiles(): Tile[] {
        let tiles : Tile[] = [];
        for(let i = this.x; i < this.x + this.size*TILE_SIZE ; i += TILE_SIZE ) {
            for(let j = this.y; j < this.y +  this.size*TILE_SIZE ; j += TILE_SIZE ) {
                tiles.push({ x : i, y : j});
            }
        }
        return tiles;
    }
}

export { Unit, UnitTypes, CustomSprite, DealtDamage as Damage };