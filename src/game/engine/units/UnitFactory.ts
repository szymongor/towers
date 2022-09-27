import { Unit, UnitTypes } from "./Unit";
import { Player } from "../Player";
import { ResourceName, Resources, ResourcesStorage } from '../Resources';
import { UnitAction } from './actions/UnitActions';
import { canPlaceMine, CanPlaceRule, canPlaceStandard } from "./actions/UnitRules";
import { UnitCommandProvider } from "./actions/UnitCommands";
import { GameEngine } from "../GameEngine";
import { UnitTask, UnitTaskNames } from "./UnitTask";
import { changePositionProvider } from "./actions/change_position/ChangePositionAction";
import { ArrowAttack } from "./actions/attack/ArrowAttackAction";
import { MineStoneCollect, SawmillWoodCollect } from "./actions/recource_collect/ResourceCollect";
import { soldierProductionProvider } from "./actions/production/SoldierProduction";

enum UnitName {
    TOWER = "tower",
    SAWMILL = "sawmill",
    MINE = "mine",
    CASTLE = "castle",
    TREE = "tree",
    STONES = "stones",
    SOLDIER = "soldier"
}

interface UnitsConfig {
    [key: string]: UnitConfig;
}

interface UnitConfig {
    name: string;
    unitName: UnitName;
    spriteName: string;
    size: number;
    type: UnitTypes;
    cost: [ResourceName, number][];
    canPlace?: CanPlaceRule;
    resources?: [ResourceName, number][];
    constructionTime: number;
    actions: UnitAction[];
    commands: UnitCommandProvider[];
    actionRange: number;
    actionInterval?: number;
    maxHP?: number;
    
}

class UnitFactory {

    unitConfig: UnitsConfig;
    gameEngine: GameEngine;
    static Units: { [key: string]: UnitName };

    constructor (gameEngine: GameEngine, unitConfig: UnitsConfig ) {
        this.gameEngine = gameEngine;
        this.unitConfig = unitConfig;
    }

    addResource(unit: Unit, type: UnitName): Unit {
        let initResources = new Resources(this.unitConfig[type].resources);
        let resources = new ResourcesStorage(initResources);
        unit.resources = resources;
        return unit;
    }

    of(type: UnitName, x: number, y: number, player?: Player): Unit {
        let unit = new Unit(x, y, this.unitConfig[type], this.gameEngine, player);

        if(this.unitConfig[type].type == UnitTypes.RESOURCE) {
            this.addResource(unit, type);
        }
        return unit;
    }

    constructionOf(type: UnitName, x: number, y: number, gameEngine: GameEngine, player: Player) {
        let constructedUnit = this.of(type, x, y, player);
        constructedUnit.state.construction = true;
        constructedUnit.hp.value = 0;

        let constructionTime = this.unitConfig[type].constructionTime;

        let constructionCallback = () => {
            constructedUnit.hp.addHealthValue(constructedUnit.hp.max/constructionTime);
        }

        let constructionFinish = () => {
            constructedUnit.state.construction = false;
            constructedUnit.updateTexture();
        }
        let constructionTask = new UnitTask(UnitTaskNames.CONSTRUCTION, UnitTaskNames.CONSTRUCTION,
            constructionTime,  constructionFinish, constructionCallback);
        constructedUnit.addUnitTask(constructionTask);
        return constructedUnit;
    }

    getConfig(type: UnitName) {
        return this.unitConfig[type];
    }

}

UnitFactory.Units = {
    "TOWER":UnitName.TOWER,
    "TREE":UnitName.TREE,
    "SAWMILL":UnitName.SAWMILL
}

export { UnitFactory, UnitName, UnitConfig, UnitsConfig };