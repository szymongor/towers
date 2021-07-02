import { Unit, UnitTypes } from "./Unit";
import { Player } from "../Player";
import { ResourceName, Resources, ResourcesStorage } from '../Resources';
import { UnitAction, SawmillWoodCollect, MineStoneCollect } from './actions/UnitActions';

enum UnitName {
    TOWER = "tower",
    SAWMILL = "sawmill",
    MINE = "mine",
    TREE = "tree",
    STONES = "stones"
}

interface UnitsConfig {
    [key: string]: UnitConfig;
}

interface UnitConfig {
    name: string;
    size: number;
    type: UnitTypes;
    cost: [ResourceName, number][];
    resources?: [ResourceName, number][];
    constructionTime: number;
    actions: UnitAction[];
    actionRange: number;
    maxHP?: number;
}

class UnitFactory {

    unitConfig: UnitsConfig;
    static Units: { [key: string]: UnitName };

    constructor () {
        this.unitConfig = {
            tower: {
                name: 'tower',
                size: 2,
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
                actions: [],
                actionRange: 50,
                constructionTime: 20,
                maxHP: 400
            },
            sawmill: {
                name: 'sawmill',
                size: 1,
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
                constructionTime: 15,
                actions: [
                    SawmillWoodCollect
                ],
                actionRange: 200,
                maxHP: 200
            },
            mine: {
                name: 'mine',
                size: 1,
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
                constructionTime: 15,
                actions: [
                    MineStoneCollect
                ],
                actionRange: 200,
                maxHP: 200
            },
            tree: {
                name: 'tree',
                size: 1,
                type: UnitTypes.RESOURCE,
                cost: [],
                resources: [[ResourceName.WOOD, 5]],
                actions: [],
                actionRange: 0,
                constructionTime: 0
            },
            stones: {
                name: 'stones',
                size: 2,
                type: UnitTypes.RESOURCE,
                cost: [],
                resources: [[ResourceName.STONE, 5]],
                actions: [],
                actionRange: 0,
                constructionTime: 0
            }

        }
    }

    createTower(x: number, y: number, player: Player) {
        let unitName = '';
        return new Unit(x, y,
            this.unitConfig.tower);
    }

    addResource(unit: Unit, type: UnitName): Unit {
        let initResources = new Resources(this.unitConfig[type].resources);
        let resources = new ResourcesStorage(initResources);
        unit.resources = resources;
        return unit;
    }

    of(type: UnitName, x: number, y: number, player?: Player): Unit {
        let unit = new Unit(x, y, this.unitConfig[type], player);

        if(this.unitConfig[type].type == UnitTypes.RESOURCE) {
            this.addResource(unit, type);
        }
        return unit;
    }

    constructionOf(type: UnitName, x: number, y: number, player: Player) {
        let constructedUnit = this.of(type, x, y, player);
        constructedUnit.state.construction = true;
        constructedUnit.state.progress = {
            limit: this.unitConfig[type].constructionTime,
            value: 0
        }
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