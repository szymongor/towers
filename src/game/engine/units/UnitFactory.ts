import { Unit, UnitTypes } from "./Unit";
import { Player } from "../Player";
import { ResourceName, Resources, ResourcesStorage } from '../Resources';
import { UnitAction, SawmillWoodCollect, MineStoneCollect, TowerAttack } from './actions/UnitActions';
import { EventRegistry } from "../events/EventsRegistry";
import { canPlaceMine, CanPlaceRule, canPlaceStandard } from "./actions/UnitRules";

enum UnitName {
    TOWER = "tower",
    SAWMILL = "sawmill",
    MINE = "mine",
    CASTLE = "castle",
    TREE = "tree",
    STONES = "stones"
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
    actionRange: number;
    actionInterval?: number;
    maxHP?: number;
    
}

class UnitFactory {

    unitConfig: UnitsConfig;
    static Units: { [key: string]: UnitName };

    constructor () {
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
                actions: [TowerAttack],
                actionInterval: 5,
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
                constructionTime: 15,
                actions: [
                    SawmillWoodCollect
                ],
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
                constructionTime: 15,
                actions: [
                    MineStoneCollect
                ],
                actionRange: 0,
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
                actionRange: 500,
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
                actionRange: 0,
                constructionTime: 0
            }

        }
    }

    createTower(x: number, y: number, eventRegistry: EventRegistry, player: Player): Unit {
        let tower = new Unit(x, y,
            this.unitConfig.tower, eventRegistry, player);
        
        tower.hp.value = tower.hp.max;
        return tower;
    }

    addResource(unit: Unit, type: UnitName): Unit {
        let initResources = new Resources(this.unitConfig[type].resources);
        let resources = new ResourcesStorage(initResources);
        unit.resources = resources;
        return unit;
    }

    of(type: UnitName, x: number, y: number, eventRegistry: EventRegistry, player?: Player): Unit {
        let unit = new Unit(x, y, this.unitConfig[type], eventRegistry, player);

        if(this.unitConfig[type].type == UnitTypes.RESOURCE) {
            this.addResource(unit, type);
        }
        return unit;
    }

    constructionOf(type: UnitName, x: number, y: number, eventRegistry: EventRegistry, player: Player) {
        let constructedUnit = this.of(type, x, y, eventRegistry, player);
        constructedUnit.state.construction = true;
        constructedUnit.state.progress = {
            limit: this.unitConfig[type].constructionTime,
            value: 0
        }
        constructedUnit.hp.value = 0;
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