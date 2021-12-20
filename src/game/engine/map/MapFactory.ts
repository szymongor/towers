import { GameEngine } from "../GameEngine";
import { UnitFactory, UnitName } from "../units/UnitFactory";
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

    basicMapInit(gameEngine: GameEngine) {
        var basicMap = new MapBoard(1000 ,1000, gameEngine);
        this.maps.set('basic', basicMap);
        this.basicMapInitAddStartBuildings(gameEngine);

        return basicMap;
    }

    basicMapInitAddStartBuildings(gameEngine: GameEngine) {
        let unitFactory = gameEngine.unitFactory;
        let unitStorage = gameEngine.unitStorage;
        let eventRegistry = gameEngine.events;
        let p1 = gameEngine.players[0];
        let p2 = gameEngine.players[1];
        let units = [];
        units.push(unitFactory.of(UnitName.CASTLE,720, 720, eventRegistry, p2));
        units.push(unitFactory.of(UnitName.CASTLE,100, 100, eventRegistry, p1));

        let stones = [{x: 360, y: 140}, {x: 320, y: 320}, {x: 140, y: 360}];

        let trees = [{x: 140, y:460}, {x: 300, y: 460}, {x: 60, y:540}, {x: 500, y:60}, {x: 600, y: 80}];

        let towersP2 = [{x: 540, y: 820}, {x: 600, y: 640}, {x: 760, y: 540}, 
            {x: 200, y: 660}, {x: 760, y: 540}, {x: 800, y: 120},
            {x: 540, y:420}
        ];

        stones.forEach(s => {
            units.push(unitFactory.of(UnitName.STONES,s.x, s.y, eventRegistry))
        })

        trees.forEach(s => {
            units.push(unitFactory.of(UnitName.TREE,s.x, s.y, eventRegistry))
        })

        towersP2.forEach(s => {
            units.push(unitFactory.of(UnitName.TOWER,s.x, s.y, eventRegistry, p2))
        })

        unitStorage.addUnits(units);
    }



    
    
}

export { MapFactory }