import { Unit, UnitTypes } from "./Unit";
import { Cost } from './GameEngine';
import { Player } from "./Player";

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
    cost: Cost[];
    constructionTime: number;
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
                    {
                        name: "wood",
                        value: 200
                    },
                    {
                        name: "stone",
                        value: 20
                    }
                ],
                constructionTime: 20
            },
            sawmill: {
                name: 'sawmill',
                size: 1,
                type: UnitTypes.BUILDING,
                cost: [
                    {
                        name: "wood",
                        value: 50
                    },
                    {
                        name: "stone",
                        value: 25
                    }
                ],
                constructionTime: 15
            },
            tree: {
                name: 'tree',
                size: 1,
                type: UnitTypes.TREE,
                cost: [],
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
            player, unitName);
    }

    createTree(x: number, y: number) {
        let name = Math.floor(Math.random() *3) +1;
        let unitName = '';
        return new Unit(x, y, 
            this.unitConfig.tree.name+name, 
            this.unitConfig.tree.type, 
            this.unitConfig.tree.size, 
            null, unitName);
    }

    of(type: UnitName, x: number, y: number, player: Player) {
        return new Unit(x, y, 
            this.unitConfig[type].name, 
            this.unitConfig[type].type, 
            this.unitConfig[type].size,
            player,
            type
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

export { UnitFactory };