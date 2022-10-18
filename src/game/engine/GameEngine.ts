import { MapBoard } from './map/MapBoard';
import { UnitFactory, UnitName } from './units/UnitFactory';
import { Player } from './Player';
import { EventRegistry, EventChannels, Subscriber } from './events/EventsRegistry';
import { GameEvent } from './events/GameEvent';
import { Unit, UnitTypes } from './units/Unit';
import { UnitFilter, UnitStorage } from './units/unit_storage/UnitsStorage';
import { GameRuleConfigurator } from './rules/GameStateRules';
import { getPlayerVision, isUnitInVision } from './map/PlayerVision';
import { AiProcessor } from './Ai/processor/AiProcessor';
import { CampaignFactory, CampaignProvider } from './campaign/CampaignFactory';
import { TraversMap } from './map/TraversMap';
import { CommandLog } from './commands/CommandLog';
import { Command, CommandBuilder, CommandData, CommandDataBuilder, CommandType } from './commands/Command';

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
    commandLog: CommandLog;

    constructor(campaignProvider: CampaignProvider) {

        this.events = new EventRegistry();
        this.commandLog = new CommandLog(this.events);
        this.unitStorage = new UnitStorage(this.events);
        

        let campaign = campaignProvider(this);
        this.unitFactory = new UnitFactory(this, campaign.unitsConfig);
        this.players = campaign.players;
        this.aiProcessor = campaign.aiProcessor;
        this.mapBoard = campaign.mapSupplier();
        this.registerRules(campaign.rulesConfig);
        
        this.traversMap = new TraversMap(this.mapBoard);
        this.round = 0;

        this.registerCommandProcessor();
        
    }

    private registerCommandProcessor() {
        //
        let subCommand : Subscriber = {
            call: (event: GameEvent) => {
                let command: Command = event.data.command;
                if(command.sender.id == '1') {
                    console.log(event.data)
                }
            }
        }
        this.events.subscribe(EventChannels.COMMAND_SENT, subCommand);
        //
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
                unit: unitPrototype
            }
            let orderEvent = new GameEvent(EventChannels.ORDER_BUILDING, data);
            this.events.emit(orderEvent);

            //TODO Command helper?
            //TODO Unit test
            let senderPlayer = unitPrototype.player;
            let commandData = new CommandDataBuilder().targetUnit(unitPrototype).build();
            let command = new CommandBuilder()
                .data(commandData)
                .sender(senderPlayer)
                .type(CommandType.ORDER_BUILDING)
                .build();
            this.commandLog.add(command);

            //TODO invoke by event with box to re-calculate
            this.traversMap.calculateTraversableGrid(0, 0, this.mapBoard.height, this.mapBoard.width);
        }
    }

}

export { GameEngine }