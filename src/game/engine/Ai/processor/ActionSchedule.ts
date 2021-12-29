import { GameEngine } from "../../GameEngine";

type ScheduleCondition = (round: number, gameEngine: GameEngine) => boolean;


class ActionSchedule {

    conditions: ScheduleCondition[];

    constructor() {
        this.conditions = []; 
    }

    addCondition(scheduleCondition: ScheduleCondition) {
        this.conditions.push(scheduleCondition);
    }

    isReady(round: number, gameEngine: GameEngine): boolean {
        return this.conditions.every(condition => condition(round, gameEngine));
    }
}

export { ActionSchedule }