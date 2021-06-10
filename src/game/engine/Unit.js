import { GameDimensions } from  '../GameDimensions';

class Unit {

    constructor (xPos, yPos, name, type, size, player, unitName) {
        this.x = xPos;
        this.y = yPos;
        this.name = name;
        this.type = type;
        this.size = size;
        this.player = player;
        this.unitName = unitName;
        this.state = {
            construction: false,
            progress: {
                limit:0,
                value: 0
            }
        };
    }

    getProgress() {
        return this.state.progress.value / this.state.progress.limit;
    }

    getTexture() {
        if(this.state.construction) {
            return 'construction';
        } else {
            return this.name;
        }
    }

    updateTexture() {
        if(this.gameUnit) {
            this.gameUnit.setTexture(this.getTexture());
            if(this.gameUnit.progressBar) {
                this.gameUnit.progressBar.destroy();
                this.gameUnit.progressBar = null;
            }
        }
    }

    getScale() {
        return (GameDimensions.grid.tileSize/GameDimensions.grid.imgSize)*this.size
    }

    processTasks() { 
        let progres = this.state.progress;
        if(progres.limit == progres.value) {
            this.state.construction = false;
            return true;
        } else {
            this.state.progress.value++;
            return false;
        }
    }
} 

const UnitTypes = {
    "BUILDING" : "BUILDING",
    "TREE": "TREE"
}

export { Unit, UnitTypes };