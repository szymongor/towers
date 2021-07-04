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

interface ActionProgress extends UnitStateProgress {
    target?: Unit;
}

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
    gameUnit: GameUnit;
    resources?: ResourcesStorage;
    actions: UnitAction[];
    actionRange: number;
    actionInterval: number;
    currentActions: Map<string, ActionProgress>;
    hp: HP;
    eventRegistry: EventRegistry;
    canPlace: CanPlaceRule;


    constructor(xPos: number, yPos: number, config: UnitConfig, eventRegistry: EventRegistry, player?: Player) {
        this.x = xPos;
        this.y = yPos;
        this.name = config.name;
        this.unitName = config.unitName;
        this.spriteName = config.spriteName;
        this.type = config.type;
        this.size = config.size;
        this.player = player;
        
        this.state = {
            construction: false,
            progress: {
                limit:0,
                value: 0
            }
        };
        this.actions = config.actions;
        this.actionRange = config.actionRange;
        this.actionInterval = config.actionInterval ? config.actionInterval : 1;
        this.currentActions = new Map();
        this.hp = new HP(0, config.maxHP);
        this.eventRegistry = eventRegistry;
        this.canPlace = config.canPlace;

    }

    getProgress() {
        return this.state.progress.value / this.state.progress.limit;
    }

    getTexture() {
        if(this.state.construction) {
            return 'construction';
        } else {
            return this.spriteName;
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
            this.hp.value += this.hp.max * 1/progres.limit
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
            name: this.unitName,
            hp: this.hp,
            player: this.player,
            x: this.x,
            y: this.y
        }
        return unitInfo;
    }

    kill() {
        if(this.eventRegistry) {
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
}

export { Unit, UnitTypes, GameUnit, DealtDamage as Damage };