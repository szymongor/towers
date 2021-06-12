
interface Resources {
    wood: number;
    stone: number;
    [key: string]: number //TODO Refactor Resouce type
}

class Player {
    id: string;
    resources: Resources
    constructor (id: string) {
        this.id = id;
        this.resources = {
            wood: 400,
            stone: 100
        }
    }
}

export { Player };