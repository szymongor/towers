import { GameDimensions } from  './GameDimensions';

class Unit {

    constructor (xPos, yPos, name, type, size) {
        this.x = xPos;
        this.y = yPos;
        this.name = name;
        this.type = type;
        this.size = size;
    }

    getScale() {
        return (GameDimensions.grid.tileSize/GameDimensions.grid.buildingSize)*this.size
    }
} 

const UnitTypes = {
    "BUILDING" : "BUILDING",
    "TREE": "TREE"
}

export { Unit, UnitTypes };