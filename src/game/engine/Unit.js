import { GameDimensions } from  '../GameDimensions';

class Unit {

    constructor (xPos, yPos, name, type, size, player, unitName) {
        this.x = xPos;
        this.y = yPos;
        this.name = name;
        this.type = type;
        this.size = size;
        this.player = player;
        this.unitName = unitName
    }

    getScale() {
        return (GameDimensions.grid.tileSize/GameDimensions.grid.imgSize)*this.size
    }
} 

const UnitTypes = {
    "BUILDING" : "BUILDING",
    "TREE": "TREE"
}

export { Unit, UnitTypes };