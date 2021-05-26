import { GameDimensions } from  '../GameDimensions';

class Unit {

    constructor (xPos, yPos, name, type, size, player) {
        this.x = xPos;
        this.y = yPos;
        this.name = name;
        this.type = type;
        this.size = size;
        this.player = player;
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