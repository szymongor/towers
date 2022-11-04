import { GameDimensions } from "../../GameDimensions";
import { UnitCreatedEventData } from "../events/EventDataTypes";
import { EventChannels, EventRegistry, Subscriber } from "../events/EventsRegistry";
import { GameEvent } from "../events/GameEvent";
import { unitIntersect } from "../units/actions/UnitRules";
import { Unit, UnitTypes } from "../units/Unit";
import { UnitFilter } from "../units/unit_storage/UnitsStorage";
import { MapBoard, TerrainType } from "./MapBoard";
import { Vector } from "./PlayerVision";

const TILE_SIZE = GameDimensions.grid.tileSize;
const MAX_UNIT_SIZE = 10;
const UNIT_TILES_SIZE = MAX_UNIT_SIZE*TILE_SIZE;

class TraversMap {

    events: EventRegistry
    mapBoard: MapBoard
    traversableGrid: Map<number, Map<number, number>>

    constructor(mapBoard: MapBoard, events: EventRegistry) {
        this.mapBoard = mapBoard;
        this.initTraversableGrid();
        this.events = events;
        this.registerRecalculateMap(events, this);
    }

    private registerRecalculateMap(events: EventRegistry, traversMap: TraversMap) {
        let sub : Subscriber = {
            call: (event: GameEvent) => {
                let eventData: UnitCreatedEventData = event.data;
                let unit = eventData.unit;
                let unitType = unit.type;
                
                if(unitType == UnitTypes.BUILDING || unitType == UnitTypes.RESOURCE ) {
                    
                    let tile_size = GameDimensions.grid.tileSize;
                    let x1 = unit.x - unit.size*tile_size;
                    let x2 = unit.x + unit.size*tile_size;
                    let y1 = unit.y - unit.size*tile_size;
                    let y2 = unit.y + unit.size*tile_size;
                    traversMap.calculateTraversableGrid(x1, y1, x2, y2);
                }
            }
        }

        events.subscribe(EventChannels.UNIT_CREATED, sub);

    }

    private getTraversableGridValue(vector: Vector): number {
        let traversRow = this.traversableGrid.get(vector.x);
        if(traversRow!= undefined) {
            let traversValue = traversRow.get(vector.y);
            if(traversValue != undefined) {
                return traversValue;
            } else {
                this.traversableGrid.get(vector.x).set(vector.y, 0);
            }
        } else {
            this.traversableGrid.set(vector.x, new Map());
        }
        console.log("Cant get travers value for vector:",vector);
        
        return 0;
    }

    private initTraversableGrid() {
        this.traversableGrid = new Map();
        for(let i = 0; i < this.mapBoard.width ; i += TILE_SIZE) {
            this.traversableGrid.set(i, new Map())
            for(let j = 0; j < this.mapBoard.height ; j += TILE_SIZE) {
                this.traversableGrid.get(i).set(j, MAX_UNIT_SIZE)
            }
        }
    }

    private calculateTraversableGrid(x0: number, y0: number, x1: number, y1: number) {
        let mapX0 = x0 < 0 ? 0 : x0;
        let mapY0 = y0 < 0 ? 0 : y0;
        let mapX1 = x1 > this.mapBoard.width ? this.mapBoard.width : x1;
        let mapY1 = y1 > this.mapBoard.height ? this.mapBoard.height : y1;

        for(let i = mapX0; i < mapX1 ; i += TILE_SIZE) {
            for(let j = mapY0; j < mapY1 ; j += TILE_SIZE) {
                let vector = new Vector(i, j);
                this.calculateTraversableForUnits(vector, MAX_UNIT_SIZE);
            }
        }
    }

    private calculateTraversableForUnits(vector: Vector, maxSize: number) {
        let traversableForSize = 0;
        for(let i = 1; i < maxSize; i++) {
            let borderTiles = sideBorderVectors[i].map(border => border.add(vector));
            
            let isTraversable = borderTiles.every(tile => this.isTileTraversable(tile));

            if(isTraversable) {
                traversableForSize = i
            } else {
                break;
            }
        }
        let vec = this.traversableGrid.get(vector.x)
        if(vec) {
            vec.set(vector.y, traversableForSize);
        } else {
            console.log("ERROR?",vector);
        }
    }

    private getColidingUnitsFilter(vector: Vector): UnitFilter {
        let searchBox = vector.boundaryBox(UNIT_TILES_SIZE);
        
        let colidingUnitsFilter: UnitFilter = {
            types: [UnitTypes.BUILDING, UnitTypes.RESOURCE],
            boxSelect: searchBox
        }

        return colidingUnitsFilter;
    }

    private isTileTraversable(vector: Vector): boolean {
        let isTerrainTraversable = this.mapBoard.terrain.type(vector.x, vector.y) == TerrainType.GRASS;

        let colidingUnitsFilter = this.getColidingUnitsFilter(vector);
        let colidingUnits = this.mapBoard.unitStorage.getUnits(colidingUnitsFilter);

        let isNotOccupiedByOtherUnit = colidingUnits.every(u => !unitIntersect(u, vector.x, vector.y, 1));


        return isTerrainTraversable && isNotOccupiedByOtherUnit;
    }

    isTileTraversableForUnit(tile: Vector, unit: Unit): boolean {
        let traversableForSize = this.getTraversableGridValue(tile);
        let isTraversable =  traversableForSize >= unit.size;

        if(!isTraversable) {
            return isTraversable;
        }

        let boxSelect = tile.boundaryBox(UNIT_TILES_SIZE);

        let filter: UnitFilter = {
            types: [UnitTypes.CREATURE],
            boxSelect: boxSelect
        }
        
        let units = this.mapBoard.unitStorage.getUnits(filter);
        let isOccupiedByOtherUnit = units.some(u => (u != unit)&&(unitIntersect(u, tile.x, tile.y, unit.size )));

        if(isOccupiedByOtherUnit) {
            return false;
        }
        //TODO Test
        //TODO Query Unit if cant trespass this TerrainType
        let isTraversableForUnit = this.mapBoard.terrain.type(tile.x, tile.y) != TerrainType.WATER;
       
        return isTraversableForUnit;
    }
}

const getSideBorderVectors = (size: number): Vector[] => {
    let sidesBorder = [];

    let borderLayer = size -1;

    for(let i = 0; i < borderLayer ; i ++ ) {
        sidesBorder.push(new Vector(borderLayer*TILE_SIZE, i*TILE_SIZE));
        sidesBorder.push(new Vector(i*TILE_SIZE, borderLayer*TILE_SIZE));
    }

    sidesBorder.push(new Vector(borderLayer*TILE_SIZE, borderLayer*TILE_SIZE));

    return sidesBorder;
}

const sideBorderVectors = Array.from(Array(MAX_UNIT_SIZE).keys()).map(i => getSideBorderVectors(i));

export { TraversMap };
