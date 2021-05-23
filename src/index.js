

import { MapBoard } from './game/MapBoard';
import { createTowerGame } from './game/TowerGame';
import { Unit, UnitTypes } from './game/Unit';
import { GameDimensions } from  './game/GameDimensions';


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

var treesPositions = [];

for(let i = 0 ; i < 200 ; i ++) {
  let x = getRandomPosition(2000);
  let y = getRandomPosition(2000);
  let name = Math.floor(Math.random() *3) +1;
  treesPositions.push({x: x, y: y, name: name});
}

var units = buildingsPositions.map(p => new Unit(p.x, p.y, 'tower', UnitTypes.BUILDING));
var units = units.concat( treesPositions.map(p => new Unit(p.x, p.y, 'tree'+p.name, UnitTypes.TREE)));

var mapBoard = new MapBoard(2000, 2000, units);


const towerGame = createTowerGame(mapBoard);

function getRandomPosition(max) {
  return ((Math.floor(Math.random() * max/GameDimensions.grid.tileSize))*GameDimensions.grid.tileSize)+GameDimensions.grid.tileSize/2
}