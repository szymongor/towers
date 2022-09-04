import { MapBoard } from './map/MapBoard';
import { UnitFactory, UnitName } from './units/UnitFactory';
import { Player } from './Player';
import { EventRegistry, EventChannels } from './events/EventsRegistry';
import { GameEvent } from './events/GameEvent';
import { Unit, UnitTypes } from './units/Unit';
import { UnitFilter, UnitStorage } from './units/UnitsStorage';
import { GameRuleConfigurator } from './rules/GameStateRules';
import { getPlayerVision, isUnitInVision } from './map/PlayerVision';
import { AiProcessor } from './Ai/processor/AiProcessor';
import { CampaignFactory, CampaignProvider } from './campaign/CampaignFactory';
import { TraversMap } from './map/TraversMap';

class GameEngine {
    unitFactory: UnitFactory;
    unitStorage: UnitStorage;
    mapBoard: MapBoard;
    traversMap: TraversMap;
    players: Player[];
    events: EventRegistry;
    aiProcessor: AiProcessor;
    round: number;
    campaignFactory: CampaignFactory;

    constructor(campaignProvider: CampaignProvider) {

        //TODO UnitConfig from campaign
        this.unitFactory = new UnitFactory(this);

        this.unitStorage = new UnitStorage();
        this.events = new EventRegistry();

        let campaign = campaignProvider(this);
        this.players = campaign.players;
        this.aiProcessor = campaign.aiProcessor;
        this.mapBoard = campaign.mapSupplier();
        this.registerRules(campaign.rulesConfig);

        this.traversMap = new TraversMap(this.mapBoard);
        this.round = 0;
    }

    private registerRules(rulesConfig: GameRuleConfigurator[]) {
        rulesConfig.forEach(rule => {
            rule(this)
        });
    }

    private runUnitActionsAndTasks() {
        let ge = this;
        let events = this.events;
        this.unitStorage.units.forEach(u => {
            u.actions.forEach( action => {
                action(events, ge, u);
            });
            let doneTasksKeys : string[] = [];
            u.currentTasks.forEach((task, key) => {
                let done = task.processTask();
                if(done) {
                    doneTasksKeys.push(key);
                }
            });
            doneTasksKeys.forEach( key => {
                u.clearUnitTask(key);
            })
        })
    }

    update() {
        this.round += 1;
        
        this.runUnitActionsAndTasks();
        this.aiProcessor.run(this.round);
    }

    getPlayer() {
        return this.players[0];
    }

    getMap() {
        return this.mapBoard;
    }

    getPlayerVision() {
        return getPlayerVision(this);
    }

    canBuild(unitType: UnitName, player: Player) {
        let unitCosts = this.unitFactory.getConfig(unitType).cost;
        let owner;
        if(player) {
            owner = player;
        } else {
            owner = this.getPlayer();
        }
        return owner.checkEnoughResources(unitCosts);
    }

    canPlaceUnit(unit: Unit) {
        return isUnitInVision(this, unit) && unit.canPlace(unit, this);
    }
    
    orderBuilding(unitPrototype: Unit) {
        if(this.canPlaceUnit(unitPrototype)) {
            let data = {
                unitPrototype: unitPrototype,
                player: this.getPlayer()
            }
            let orderEvent = new GameEvent(EventChannels.ORDER_BUILDING, data);
            this.events.emit(orderEvent);
            //TODO invoke by event with box to re-calculate
            this.traversMap.calculateTraversableGrid(0, 0, this.mapBoard.height, this.mapBoard.width);
        }
    }

    boxSelect(x:number, y: number, dx: number, dy: number): Unit[] {
        let boxSelect = {leftX: 0, leftY: 0, rightX: 0, rightY: 0};
        if(dx < 0) {
            boxSelect.leftX = x+dx;
            boxSelect.rightX = x;
        } else {
            boxSelect.leftX = x;
            boxSelect.rightX = x+dx;
        }

        if(dy < 0) {
            boxSelect.leftY = y+dy;
            boxSelect.rightY = y;
        } else {
            boxSelect.leftY = y;
            boxSelect.rightY = y+dy;
        }

        let unitFilter: UnitFilter = {
            boxSelect: boxSelect,
            types: [UnitTypes.CREATURE],
            owner: this.getPlayer()
            
        }
        return this.unitStorage.getUnits(unitFilter);
    }

    

}

export { GameEngine }