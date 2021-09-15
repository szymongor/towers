enum UnitTaskNames {
    CONSTRUCTION = 'CONSTRUCTION',
    PRODUCTION = 'PRODUCTION',
    CHANGE_POSITION = 'CHANGE_POSITION',
    TOWER_ATTACK = "TOWER_ATTACK"
}

class TaskProgress {
    limit: number;
    value: number;

    constructor(limit: number) {
        this.limit = limit;
        this.value = 0;
    }

    getProgress(): number {
        return this.value/this.limit;
    }
}

class UnitTask {
    name: string;
    type: UnitTaskNames;
    progress: TaskProgress;
    done: () => void;
    callback?: () => void;

    constructor(name: string, type: UnitTaskNames, limit: number, done: () => void, callback?: () => void) {
        this.name = name;
        this.type = type;
        this.progress = new TaskProgress(limit);
        this.done = done;
        this.callback = callback;
    }

    processTask(): boolean {
        this.progress.value++;
        if(this.callback) {
            this.callback();
        }
        if(this.progress.value < this.progress.limit) {
            return false;
        } else {
            this.done();
            return true;
        }

    }
}

export { UnitTaskNames, TaskProgress, UnitTask }