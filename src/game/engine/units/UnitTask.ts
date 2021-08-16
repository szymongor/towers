
interface TaskProgress {
    limit: number;
    value: number;
}

class UnitTask {
    name: string;
    progress: TaskProgress;
    callback: () => void;

    constructor(name: string, limit: number, callback: () => void) {
        this.name;
        this.progress = {
            limit: limit,
            value: 0
        };
        this.callback = callback;
    }

    processTask(): boolean {
        this.progress.value++;
        if(this.progress.value < this.progress.limit) {
            return false;
        } else {
            this.callback();
            return true;
        }

    }
}

export { TaskProgress, UnitTask }