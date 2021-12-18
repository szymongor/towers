import { UnitFactory } from "../units/UnitFactory";
import { UnitStorage } from "../units/UnitsStorage";
import { MapBoard } from "./MapBoard";


class MapFactory {

    maps: Map<string, MapBoard>;

    constructor() {
        this.maps = new Map();
    }

    get(name: string) {
        return this.maps.get(name);
    }

    initBasicMap(unitStorage: UnitStorage, unitFactory: UnitFactory) {
        var basicMap = new MapBoard(1000 ,1000, unitStorage, unitFactory);
        this.maps.set('basic', basicMap);

        return basicMap;
    }
    
}

export { MapFactory }