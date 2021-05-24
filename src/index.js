import { MapBoard } from './game/MapBoard';
import { createTowerGame } from './game/TowerGame';
import { Unit, UnitTypes } from './game/Unit';


var buildingsPositions = [
  {x: 50, y: 50},
  {x: 300, y: 350},
  {x: 500, y: 350},
  {x: 600, y: 250},
  {x: 900, y: 900},
  {x: 500, y: 600},
  {x: 800, y: 800},
  {x: 200, y: 150}
];

var units = buildingsPositions.map(p => new Unit(p.x, p.y, 'tower', UnitTypes.BUILDING, 2));
var units = units.concat( MapBoard.randomTrees(200, 2000, 2000));

var mapBoard = new MapBoard(2000, 2000, units);


const towerGame = createTowerGame(mapBoard);