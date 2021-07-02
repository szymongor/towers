import { GameEvent } from "../../engine/events/GameEvent"
import { GameEngine } from "../../engine/GameEngine"
import { MainCamera } from "./MainCamera"
import { Subscriber, EventChannels } from '../../engine/events/EventsRegistry'
import { ResourceCollectedEventData, DamageDealtEventData } from '../../engine/units/actions/UnitActions'
import { TransitionAnimation } from '../main/MainCamera'
import { ResourceName } from "../../engine/Resources"

const registerOnResourceCollect = (scene: MainCamera, engine: GameEngine) => {
    let subscriber: Subscriber = {
        call: animateResourceCollected(scene)
    }
    engine.events.subscribe(EventChannels.RESOURCE_COLLECTED, subscriber);

}

const registerOnDamageDealt = (scene: MainCamera, engine: GameEngine) => {
    let subscriber: Subscriber = {
        call: animateDamageDealt(scene)
    }
    engine.events.subscribe(EventChannels.DAMAGE_DEALT, subscriber);

}

const animateResourceCollected = (scene: MainCamera) => {
    return (event: GameEvent) => {
        
        let data: ResourceCollectedEventData = event.data;
        let respurceSprite;
        switch(data.resource) {
            case ResourceName.WOOD:
                respurceSprite = 'log';
                break;
            case ResourceName.STONE:
                respurceSprite = 'stone';
        }
        let logSprite = scene.add.sprite(data.source.x, data.source.y, respurceSprite);
        logSprite.setOrigin(0);
        logSprite.setScale(0.25);

        let steps = 50;

        let transitionAnimation : TransitionAnimation = {
            sprite: logSprite,
            sourceX: data.source.x,
            sourceY: data.source.y,
            dX: (data.collector.x - data.source.x)/steps,
            dY: (data.collector.y - data.source.y)/steps,
            steps: steps,
            progress: 0
        }
        scene.addTransitionAnimation(transitionAnimation);
    }
}

const animateDamageDealt = (scene: MainCamera) => {
    return (event: GameEvent) => {
        
        let data: DamageDealtEventData = event.data;
        let respurceSprite = 'arrow';
        let logSprite = scene.add.sprite(data.source.x, data.source.y, respurceSprite);
        logSprite.setOrigin(0);
        logSprite.setScale(0.25);

        let steps = 50;

        let sourceCentre = data.source.getCentre();
        let targetCentre = data.target.getCentre();

        let transitionAnimation : TransitionAnimation = {
            sprite: logSprite,
            sourceX: data.source.x,
            sourceY: data.source.y,
            dX: (targetCentre.x - sourceCentre.x)/steps,
            dY: (targetCentre.y - sourceCentre.y)/steps,
            steps: steps,
            progress: 0
        }
        scene.addTransitionAnimation(transitionAnimation);
    }
}

export { registerOnResourceCollect, registerOnDamageDealt }