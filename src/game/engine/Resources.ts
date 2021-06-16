
enum ResourceName {
    WOOD = "Wood",
    STONE = "Stone"
}

class Resources {

    resourcesMap: Map<ResourceName, number>;

    constructor(initial: [ResourceName, number][]){

        this.resourcesMap = new Map<ResourceName, number> (initial);
        Object.values(ResourceName).forEach(this.initResource(this.resourcesMap));

    }

    get(resourceName: ResourceName): number {
        return this.resourcesMap.get(resourceName);
    }

    set(resourceName: ResourceName, value: number) {
        this.resourcesMap.set(resourceName, value);
    }

    initResource(resources: Map<ResourceName, number>) {
        return (resourceName: ResourceName) => {
            if(!resources.get(resourceName)) {
                resources.set(resourceName, 0);
            }
        }
    }

    addResource(resourceName: ResourceName, value: number) {
        let current = this.get(resourceName);
        this.set(resourceName, current+value);
    }

    chargeResource(resourceName: ResourceName, value: number) {
        this.addResource(resourceName, -value);
    }
}

class ResourcesStorage {
    resources: Resources;

    constructor(resources: Resources) {
        this.resources= resources;
    }

    getResource(resourceName: ResourceName): number {
        let value = this.resources.get(resourceName);
        return value? value : 0;
    }

    addResources(resourcesAdd: [ResourceName, number][]) {
        let res = this.resources;

        resourcesAdd.forEach(function(cost) {
            res.addResource(cost[0], cost[1]);
        });
    }

    chargeResources(resourcesCost: [ResourceName, number][]) {
        let res = this.resources;

        resourcesCost.forEach((cost) => {
            res.addResource(cost[0], -cost[1]);
        });
    }

    checkEnoughResources(requiredResources: [ResourceName, number][]): boolean {
        let result = true;
        let res = this.resources;
        requiredResources.forEach((cost) => {
            if(cost[1] > res.get(cost[0])) {
                console.log("Not enough "+cost[0]);
                result = false;
            }
        });
        return result;
    }

    getResourcesString() {
        let str = '';
        this.resources.resourcesMap.forEach((value, resource) => {
            str += resource+ ": "+ value+ ' ';
        })
        return str;
    }
}

export { Resources, ResourceName, ResourcesStorage }