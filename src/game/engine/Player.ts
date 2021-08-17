import { Resources, ResourcesStorage, ResourceName } from "./Resources";

class Player {
    id: string;
    name: string;
    resourcesSorage: ResourcesStorage;
    
    constructor (id: string, name: string) {
        this.id = id;
        this.name = name;
        let initResources = new Resources([[ResourceName.WOOD, 2000], [ResourceName.STONE, 1000]]);
        this.resourcesSorage = new ResourcesStorage(initResources);
    }

    
    checkEnoughResources(cost: [ResourceName, number][]): boolean {
        return this.resourcesSorage.checkEnoughResources(cost);
    }

    addResources(resources: [ResourceName, number][]) {
        this.resourcesSorage.addResources(resources);
    }

    chargeResources(resources: [ResourceName, number][]) {
        this.resourcesSorage.chargeResources(resources);
    }

    getResourcesString() {
        return this.resourcesSorage.getResourcesString();
    }

}

export { Player };