import { ResourceName } from "../../engine/Resources"
import { ArrowAttack } from "../../engine/units/actions/attack/ArrowAttackAction"
import { changePositionProvider } from "../../engine/units/actions/change_position/ChangePositionAction"
import { soldierProductionProvider } from "../../engine/units/actions/production/SoldierProduction"
import { MineStoneCollect, SawmillWoodCollect } from "../../engine/units/actions/recource_collect/ResourceCollect"
import { canPlaceMine, canPlaceStandard } from "../../engine/units/actions/UnitRules"
import { UnitTypes } from "../../engine/units/Unit"
import { UnitName, UnitsConfig } from "../../engine/units/UnitFactory"

const basicUnitConfig: UnitsConfig = {
    tower: {
        name: "Tower",
        unitName: UnitName.TOWER,
        spriteName: 'tower',
        size: 5,
        type: UnitTypes.BUILDING,
        cost: [
            [
                ResourceName.WOOD,
                50
            ],
            [
                ResourceName.STONE,
                50
            ]
        ],
        canPlace: canPlaceStandard,
        commands: [],
        actions: [ArrowAttack],
        actionInterval: 10,
        actionRange: 300,
        constructionTime: 20,
        maxHP: 800
    },
    sawmill: {
        name: 'Sawmill',
        unitName: UnitName.SAWMILL,
        spriteName: 'sawmill',
        size: 4,
        type: UnitTypes.BUILDING,
        cost: [
            [
                ResourceName.WOOD,
                50
            ],
            [
                ResourceName.STONE,
                25
            ]
        ],
        canPlace: canPlaceStandard,
        constructionTime: 30,
        commands: [],
        actions: [
            SawmillWoodCollect
        ],
        actionInterval: 15,
        actionRange: 200,
        maxHP: 200
    },
    mine: {
        name: 'Mine',
        unitName: UnitName.MINE,
        spriteName: 'mine',
        size: 4,
        type: UnitTypes.BUILDING,
        cost: [
            [
                ResourceName.WOOD,
                50
            ],
            [
                ResourceName.STONE,
                50
            ]
        ],
        canPlace: canPlaceMine,
        constructionTime: 30,
        commands: [],
        actions: [
            MineStoneCollect
        ],
        actionRange: 0,
        actionInterval: 15,
        maxHP: 200
    },
    castle: {
        name: 'Castle',
        unitName: UnitName.CASTLE,
        spriteName: 'castle',
        size: 9,
        type: UnitTypes.BUILDING,
        cost: [
            [
                ResourceName.WOOD,
                50
            ],
            [
                ResourceName.STONE,
                50
            ]
        ],
        actions: [],
        canPlace: canPlaceStandard,
        constructionTime: 30,
        commands: [soldierProductionProvider],
        actionRange: 250,
        maxHP: 2000
    },
    tree: {
        name: "Tree",
        unitName: UnitName.TREE,
        spriteName: 'tree',
        size: 3,
        type: UnitTypes.RESOURCE,
        cost: [],
        commands: [],
        actions: [],
        resources: [[ResourceName.WOOD, 200]],
        actionRange: 0,
        constructionTime: 0
    },
    stones: {
        name: 'Stones',
        unitName: UnitName.STONES,
        spriteName: 'stones',
        size: 4,
        type: UnitTypes.RESOURCE,
        cost: [],
        commands: [],
        actions: [],
        resources: [[ResourceName.STONE, 400]],
        actionRange: 0,
        constructionTime: 0
    },
    soldier: {
        name: 'Soldier',
        unitName: UnitName.SOLDIER,
        spriteName: 'soldier',
        size: 2,
        type: UnitTypes.CREATURE,
        cost: [
            [
                ResourceName.WOOD,
                10
            ],
            [
                ResourceName.STONE,
                10
            ]
        ],
        actions: [ArrowAttack],
        commands: [changePositionProvider],
        actionInterval: 5,
        actionRange: 200,
        constructionTime: 10,
        maxHP: 200
    }
}

export { basicUnitConfig }