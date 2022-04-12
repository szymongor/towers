import { TerrainType } from "../../engine/map/MapBoard"

type TerrainTypeMap = (x: number, y: number) => TerrainType;

const circleOfTerrain = (xCenter: number, yCenter: number, r: number, terrain: TerrainType): TerrainTypeMap => {
    return (x: number, y: number) => {
        if(isInCircle(xCenter, yCenter, x, y, r)) {
            return terrain
        } else {
            return TerrainType.DEFAULT
        }
        
    }
}

const isInCircle = (xCenter: number, yCenter: number, x: number, y: number, r: number): boolean => {
    return Math.sqrt(Math.pow(xCenter-x,2)+Math.pow(yCenter-y,2)) < r
}

export { circleOfTerrain }