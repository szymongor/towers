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
import { Vector } from '../map/PlayerVision';
import { UnitCommand } from './actions/UnitCommands';
import { GameEngine } from '../GameEngine';
import { UnitTask, UnitTaskNames } from './UnitTask';
import { UIElement } from '../../scenes/ui/UiScene';

const TILE_SIZE = GameDimensions.grid.tileSize;

enum UnitTypes {
    BUILDING = "BUILDING",
    RESOURCE = "RESOURCE",
    CREATURE = "CREATURE"
}

class UnitTarget {
    target: Vector|Unit
}

interface UnitState {
    destroyed: boolean;
    construction: boolean;
    target?: UnitTarget;
}

interface CustomSprite extends Phaser.GameObjects.Sprite, Selectable {
    progressBar?: Bar;
    unit?: Unit;
    highlight?: UIElement;
    rangeHighlight?: Phaser.GameObjects.Arc;
    dispose?: () => void;
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

class Unit {
    x: number;
    y: number;
    name: string;
    unitName: UnitName;
    spriteName: string; //TODO separate Model/View
    type: UnitTypes;
    size: number;
    player: Player;
    state: UnitState;
    sprite: CustomSprite; //TODO separate Model/View
    resources?: ResourcesStorage;
    actions: UnitAction[];
    commands: UnitCommand[];
    actionRange: number;
    actionInterval: number;
    currentTasks: Map<string, UnitTask>;
    hp: HP;
    eventRegistry: EventRegistry;
    canPlace: CanPlaceRule;


    constructor(xPos: number, yPos: number, config: UnitConfig, gameEngine: GameEngine, player?: Player) {
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
            construction: false,
            target: null
        };
        this.actions = config.actions;
        this.eventRegistry = gameEngine.events;
        this.commands = config.commands.map(commandProvider => commandProvider(this, gameEngine, player));
        this.actionRange = config.actionRange;
        this.actionInterval = config.actionInterval ? config.actionInterval : 1;
        this.currentTasks = new Map();
        this.hp = new HP(config.maxHP, config.maxHP);
        
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

    //TODO emit event?
    updateTexture() {
        if(this.sprite) {
            this.sprite.setTexture(this.getTexture());
            this.sprite.setPosition(this.x, this.y);
        }
    }

    //TODO separate model from view
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

    //TODO emit event?
    destroy() {
        if(this.sprite) {
            this.sprite.dispose();
        }
    }

    distanceToUnit(unit: Unit): number {
        let centre = this.getCentre();
        let unitCentre = unit.getCentre();
        let dX = unitCentre.x-centre.x;
        let dY = unitCentre.y-centre.y;
        return Math.sqrt( dX*dX + dY*dY);
    }

    distanceToVector(tile: Vector): number {
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

    getLocation(): Vector {
        return new Vector(this.x, this.y);
    }
 
    setLocation(loc: Vector) {
        this.x = loc.x;
        this.y = loc.y;
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
        if(this.sprite && this.sprite.progressBar) {
            this.sprite.progressBar.hide();
            this.sprite.progressBar = null;
        }
    }

    clearUnitTaskByType(taskType: UnitTaskNames) {
        let currentMovementTask = Array.from(this.currentTasks.values())
            .filter(task => task.type == taskType)
            .map(task => task.name);
        currentMovementTask.forEach(name => this.clearUnitTask(name));
    }

    containsCoord(x: number, y: number) {
        return Math.abs(x - this.x) < this.size * GameDimensions.grid.tileSize/2
        &&
        Math.abs(y - this.y) < this.size * GameDimensions.grid.tileSize/2;
    }

    getUnitTiles(): Vector[] {
        let tiles : Vector[] = [];
        for(let i = this.x; i < this.x + this.size*TILE_SIZE ; i += TILE_SIZE ) {
            for(let j = this.y; j < this.y +  this.size*TILE_SIZE ; j += TILE_SIZE ) {
                tiles.push(new Vector(i,j));
            }
        }
        return tiles;
    }
}

export { Unit, UnitTypes, CustomSprite, DealtDamage };