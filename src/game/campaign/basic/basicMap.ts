import { circleOfTerrain } from "../../editor/map/TerrainElements";
import { MapBoardSupplier } from "../../engine/campaign/Campaign";
import { GameEngine } from "../../engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../engine/map/MapBoard";
import { UnitName } from "../../engine/units/UnitFactory";



const basicMapSupplier = (gameEngine: GameEngine): MapBoardSupplier => {
    return () => {
        let terrain: Terrain = basicTerrain;
        var basicMap = new MapBoard(1000 ,1000, gameEngine, terrain);
        basicMapInitAddStartBuildings(gameEngine);
        return basicMap;
    }
}

const basicMapInitAddStartBuildings = (gameEngine: GameEngine) => {
    let unitFactory = gameEngine.unitFactory;
    let unitStorage = gameEngine.unitStorage;
    let p1 = gameEngine.players[0];
    let p2 = gameEngine.players[1];
    let units = [];
    units.push(unitFactory.of(UnitName.CASTLE,720, 720, gameEngine, p2));
    units.push(unitFactory.of(UnitName.CASTLE,100, 100, gameEngine, p1));

    let stones = [{x: 360, y: 140}, {x: 320, y: 320}, {x: 140, y: 360}];

    let trees = [{x: 140, y:460}, {x: 300, y: 460}, {x: 60, y:540}, 
        {x: 500, y:60}, {x: 600, y: 80}, {x: 220, y: 340}, {x: 460, y: 320}];

    let towersP2 = [{x: 540, y: 820}, {x: 600, y: 640}, {x: 760, y: 540}, 
        {x: 200, y: 660}, {x: 760, y: 540}, {x: 800, y: 120},
        {x: 540, y:420}
    ];

    stones.forEach(s => {
        units.push(unitFactory.of(UnitName.STONES,s.x, s.y, gameEngine))
    })

    trees.forEach(s => {
        units.push(unitFactory.of(UnitName.TREE,s.x, s.y, gameEngine))
    })

    towersP2.forEach(s => {
        units.push(unitFactory.of(UnitName.TOWER,s.x, s.y, gameEngine, p2))
    })

    unitStorage.addUnits(units);
}

const basicTerrain = {
    type: (x:number, y: number) => {
        let waterCircle = circleOfTerrain(400, 400, 100, TerrainType.WATER )
        let terrainType = waterCircle(x, y);
        if(terrainType == TerrainType.DEFAULT) {
            return TerrainType.GRASS;
        } else {
            return terrainType;
        }
    }
}

export { basicMapSupplier }