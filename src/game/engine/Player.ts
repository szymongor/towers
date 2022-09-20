import { Resources, ResourcesStorage, ResourceName } from "./Resources";

class Player {
    id: string;
    name: string;
    resourcesSorage: ResourcesStorage;
    
    constructor (id: string, name: string, initResources: Resources) {
        this.id = id;
        this.name = name;
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