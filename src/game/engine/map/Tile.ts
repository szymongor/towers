import { BoxSelect } from "../units/unit_storage/UnitFilter";
import { Terrain, TerrainType } from "./MapBoard";

class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    equal(vector: Vector): boolean {
        if(this.x != vector.x) {
            return false
        } else if( this.y != vector.y) {
            return false
        }
        return true;
    }

    static zeroVector(): Vector {
        return new Vector(0, 0);
    }

    boundaryBox(size: number): BoxSelect {
        let searchBox = {
            leftX: this.x - size,
            leftY: this.y - size,
            rightX: this.x + size,
            rightY: this.y + size,
        }
        return searchBox;
    }

    distanceTo(v: Vector): number {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }

}

class Tile extends Vector {
    terrain: TerrainType;
    id: string;

    constructor(x: number, y: number, terrain: TerrainType) {
        super(x, y);
        this.id = Tile.getTileId(x,y);
        this.terrain = terrain;
    }

    static fromVector(vector: Vector, terrain: Terrain) {
        return new Tile(vector.x, vector.y, terrain.type(vector.x, vector.y));
    }

    static getTileId(x: number, y: number): string {
        return x+':'+y;
    }
    
}

export {Vector, Tile}