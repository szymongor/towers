import { CampaignInit } from "../../engine/campaign/Campaign";
import { EventChannels } from "../../engine/events/EventsRegistry";
import { GameEvent } from "../../engine/events/GameEvent";
import { GameEngine } from "../../engine/GameEngine";
import { Unit } from "../../engine/units/Unit";
import { UnitName } from "../../engine/units/UnitFactory";

const basicMapInitAddStartBuildings: CampaignInit = (gameEngine: GameEngine) => {
    let unitFactory = gameEngine.unitFactory;
    let p1 = gameEngine.players[0];
    let p2 = gameEngine.players[1];
    let units = [];
    units.push(unitFactory.of(UnitName.CASTLE,720, 720, p2));
    units.push(unitFactory.of(UnitName.CASTLE,100, 100, p1));

    let stones = [{x: 360, y: 140}, {x: 320, y: 320}, {x: 140, y: 360}];

    let trees = [{x: 140, y:460}, {x: 300, y: 460}, {x: 60, y:540}, 
        {x: 500, y:60}, {x: 600, y: 80}, {x: 220, y: 340}, {x: 460, y: 320}];

    let towersP2 = [{x: 540, y: 820}, {x: 600, y: 640}, {x: 760, y: 540}, 
        {x: 200, y: 660}, {x: 760, y: 540}, {x: 800, y: 120},
        {x: 540, y:420}
    ];

    stones.forEach(s => {
        units.push(unitFactory.of(UnitName.STONES,s.x, s.y))
    })

    trees.forEach(s => {
        units.push(unitFactory.of(UnitName.TREE,s.x, s.y))
    })

    towersP2.forEach(s => {
        units.push(unitFactory.of(UnitName.TOWER,s.x, s.y, p2))
    })

    units.map(mapUnitToEvent).forEach(e => gameEngine.events.emit(e));
}

const mapUnitToEvent = (unit: Unit) => {
    return new GameEvent(EventChannels.UNIT_CREATED, {unit: unit})
}

export { basicMapInitAddStartBuildings }