import { GameEngine } from "../GameEngine";
import { UnitName } from "../units/UnitFactory";
import { MapBoard } from "./MapBoard";
import { initBasicMap } from "./maps/basic/basicMap";

class MapFactory {

    maps: Map<string, MapBoard>;

    constructor() {
        this.maps = new Map();
    }

    get(name: string) {
        return this.maps.get(name);
    }

    basicMapInit(gameEngine: GameEngine) {
        var basicMap = initBasicMap(gameEngine);
        this.maps.set('basic', basicMap);

        return basicMap;
    }

    



    
    
}

export { MapFactory }