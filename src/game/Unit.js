
class Unit {

    constructor (xPos, yPos, name, type) {
        this.x = xPos;
        this.y = yPos;
        this.name = name;
        this.type = type;
    }

} 

const UnitTypes = {
    "BUILDING" : "BUILDING",
    "TREE": "TREE"
}

export { Unit, UnitTypes };