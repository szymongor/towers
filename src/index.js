

import { MapBoard } from './game/MapBoard';
import { createTowerGame } from './game/TowerGame';
import { Unit, UnitTypes } from './game/Unit';


var unitsPositions = [
  {x: 50, y: 50},
  {x: 300, y: 350},
  {x: 500, y: 350},
  {x: 600, y: 250},
  {x: 900, y: 900},
  {x: 500, y: 600},
  {x: 800, y: 800},
  {x: 200, y: 150}
];

var mapBoard = new MapBoard(2000, 2000, unitsPositions.map(p => new Unit(p.x, p.y, 'tower', UnitTypes.BUILDING)));


const towerGame = createTowerGame(mapBoard);



