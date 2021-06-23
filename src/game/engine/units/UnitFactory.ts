import { Unit, UnitTypes } from "./Unit";
import { Player } from "../Player";
import { ResourceName, Resources, ResourcesStorage } from '../Resources';
import { UnitAction, SawmillWoodCollect } from './actions/UnitActions';

enum UnitName {
    TOWER = "tower",
    TREE = "tree",
    SAWMILL = "sawmill"
}

interface UnitsConfig {
    [key: string]: UnitConfig;
}

interface UnitConfig {
    name: string;
    size: number;
    type: UnitTypes;
    cost: [ResourceName, number][];
    constructionTime: number;
    actions: UnitAction[];
    actionRange: number;
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
                constructionTime: 20
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
                actionRange: 100
            },
            tree: {
                name: 'tree',
                size: 1,
                type: UnitTypes.TREE,
                cost: [],
                actions: [],
                actionRange: 0,
                constructionTime: 0
            }
        }
    }

    createTower(x: number, y: number, player: Player) {
        let unitName = '';
        return new Unit(x, y, 
            this.unitConfig.tower.name, 
            this.unitConfig.tower.type, 
            this.unitConfig.tower.size, 
            player, unitName, 
            this.unitConfig.tower.actions,
            this.unitConfig.tower.actionRange);
    }

    createTree(x: number, y: number) {
        let name = Math.floor(Math.random() *3) +1;
        let unitName = '';
        let initResources = new Resources([[ResourceName.WOOD, 5]]);
        let resources = new ResourcesStorage(initResources);
        return new Unit(x, y, 
            this.unitConfig.tree.name+name, 
            this.unitConfig.tree.type, 
            this.unitConfig.tree.size, 
            null, unitName,
            this.unitConfig.tree.actions,
            this.unitConfig.tree.actionRange,
            resources);
    }

    of(type: UnitName, x: number, y: number, player: Player) {
        return new Unit(x, y, 
            this.unitConfig[type].name, 
            this.unitConfig[type].type, 
            this.unitConfig[type].size,
            player,
            type,
            this.unitConfig[type].actions,
            this.unitConfig[type].actionRange
            );
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

export { UnitFactory, UnitName };