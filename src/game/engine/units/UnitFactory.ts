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
    commands?: UnitCommandProvider[];
    actionRange: number;
    actionInterval?: number;
    maxHP?: number;
    
}

class UnitFactory {

    unitConfig: UnitsConfig;
    gameEngine: GameEngine;
    static Units: { [key: string]: UnitName };

    constructor (gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
        this.unitConfig = {
            tower: {
                name: "Tower",
                unitName: UnitName.TOWER,
                spriteName: 'tower',
                size: 5,
                type: UnitTypes.BUILDING,
                cost: [
                    [
                        ResourceName.WOOD,
                        50
                    ],
                    [
                        ResourceName.STONE,
                        50
                    ]
                ],
                canPlace: canPlaceStandard,
                actions: [ArrowAttack],
                commands: [],
                actionInterval: 10,
                actionRange: 300,
                constructionTime: 20,
                maxHP: 800
            },
            sawmill: {
                name: 'Sawmill',
                unitName: UnitName.SAWMILL,
                spriteName: 'sawmill',
                size: 4,
                type: UnitTypes.BUILDING,
                cost: [
                    [
                        ResourceName.WOOD,
                        50
                    ],
                    [
                        ResourceName.STONE,
                        25
                    ]
                ],
                canPlace: canPlaceStandard,
                constructionTime: 30,
                actions: [
                    SawmillWoodCollect
                ],
                actionInterval: 15,
                commands: [],
                actionRange: 200,
                maxHP: 200
            },
            mine: {
                name: 'Mine',
                unitName: UnitName.MINE,
                spriteName: 'mine',
                size: 4,
                type: UnitTypes.BUILDING,
                cost: [
                    [
                        ResourceName.WOOD,
                        50
                    ],
                    [
                        ResourceName.STONE,
                        50
                    ]
                ],
                canPlace: canPlaceMine,
                constructionTime: 30,
                actions: [
                    MineStoneCollect
                ],
                commands: [],
                actionRange: 0,
                actionInterval: 15,
                maxHP: 200
            },
            castle: {
                name: 'Castle',
                unitName: UnitName.CASTLE,
                spriteName: 'castle',
                size: 9,
                type: UnitTypes.BUILDING,
                cost: [
                    [
                        ResourceName.WOOD,
                        50
                    ],
                    [
                        ResourceName.STONE,
                        50
                    ]
                ],
                canPlace: canPlaceStandard,
                constructionTime: 30,
                actions: [],
                commands: [soldierProductionProvider],
                actionRange: 250,
                maxHP: 2000
            },
            tree: {
                name: "Tree",
                unitName: UnitName.TREE,
                spriteName: 'tree',
                size: 3,
                type: UnitTypes.RESOURCE,
                cost: [],
                resources: [[ResourceName.WOOD, 200]],
                actions: [],
                commands: [],
                actionRange: 0,
                constructionTime: 0
            },
            stones: {
                name: 'Stones',
                unitName: UnitName.STONES,
                spriteName: 'stones',
                size: 4,
                type: UnitTypes.RESOURCE,
                cost: [],
                resources: [[ResourceName.STONE, 400]],
                actions: [],
                commands: [],
                actionRange: 0,
                constructionTime: 0
            },
            soldier: {
                name: 'Soldier',
                unitName: UnitName.SOLDIER,
                spriteName: 'soldier',
                size: 2,
                type: UnitTypes.CREATURE,
                cost: [
                    [
                        ResourceName.WOOD,
                        10
                    ],
                    [
                        ResourceName.STONE,
                        10
                    ]
                ],
                actions: [ArrowAttack],
                commands: [changePositionProvider],
                actionInterval: 5,
                actionRange: 200,
                constructionTime: 10,
                maxHP: 200
            }

        }
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

export { UnitFactory, UnitName, UnitConfig };