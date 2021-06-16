import { Resources, ResourcesStorage, ResourceName } from "./Resources";

class Player {
    id: string;
    resourcesSorage: ResourcesStorage;
    
    constructor (id: string) {
        this.id = id;
        let initResources = new Resources([[ResourceName.WOOD, 200], [ResourceName.STONE, 100]]);
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