import { Unit, UnitTypes } from "./Unit";

class UnitFactory {

    constructor () {
        this.unitConfig = {
            tower: {
                name: 'tower',
                size: 2,
                type: UnitTypes.BUILDING
            },
            tree: {
                name: 'tree',
                size: 1,
                type: UnitTypes.TREE
            }
        }
    }

    createTower(x, y, player) {
        return new Unit(x, y, 
            this.unitConfig.tower.name, 
            this.unitConfig.tower.type, 
            this.unitConfig.tower.size, 
            player)
    }

    createTree(x, y) {
        let name = Math.floor(Math.random() *3) +1;
        return new Unit(x, y, 
            this.unitConfig.tree.name+name, 
            this.unitConfig.tree.type, 
            this.unitConfig.tree.size, 
            null, )
    }

    of(type) {
        return new Unit(null, null, 
            this.unitConfig[type].name, 
            this.unitConfig[type].type, 
            this.unitConfig[type].size
            );
    }

}

UnitFactory.Units = {
    "TOWER":"tower",
    "TREE":"tree"
}

export { UnitFactory };