import { circleOfTerrain } from "../../editor/map/TerrainElements";
import { MapBoardSupplier } from "../../engine/campaign/Campaign";
import { GameEngine } from "../../engine/GameEngine";
import { MapBoard, Terrain, TerrainType } from "../../engine/map/MapBoard";



const basicMapSupplier = (gameEngine: GameEngine): MapBoardSupplier => {
    return () => {
        let terrain: Terrain = basicTerrain;
        var basicMap = new MapBoard(2000 ,2000, gameEngine, terrain);
        return basicMap;
    }
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

export { basicMapSupplier };
