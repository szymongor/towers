import { GameEvent } from "../../engine/events/GameEvent"
import { GameEngine } from "../../engine/GameEngine"
import { MainCamera } from "./MainCamera"
import { Subscriber, EventChannels } from '../../engine/events/EventsRegistry'
import { ResourceName } from "../../engine/Resources"
import { ANIMATION_RATE, customAnimationFromSprite, TransitionAnimation } from "./animation/Animation";
import { DamageDealtEventData, ResourceCollectedEventData } from "../../engine/events/EventDataTypes"

const registerOnResourceCollect = (scene: MainCamera, engine: GameEngine) => {
    let subscriber: Subscriber = {
        call: animateResourceCollected(scene)
    }
    engine.events.subscribe(EventChannels.RESOURCE_COLLECTED, subscriber);

}

const registerOnProjectileFired = (scene: MainCamera, engine: GameEngine) => {
    let subscriber: Subscriber = {
        call: animateDamageDealt(scene)
    }
    engine.events.subscribe(EventChannels.PROJECTILE_FIRED, subscriber);

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
        let sourceCentre = data.source.getCentre();
        let targetCentre = data.collector.getCentre();

        let collectedResourceSprite = scene.spriteCache.get(respurceSprite, scene);
        
        collectedResourceSprite.setPosition(sourceCentre.x, sourceCentre.y);
        collectedResourceSprite.setScale(0.25);

        let steps = 50;

        let customAnimation = customAnimationFromSprite(collectedResourceSprite, scene);

        let transitionAnimation : TransitionAnimation = {
            sprite: customAnimation,
            sourceX: sourceCentre.x,
            sourceY: sourceCentre.y,
            targetX: targetCentre.x,
            targetY: targetCentre.y,
            // dX: (targetCentre.x - sourceCentre.x)/steps,
            // dY: (targetCentre.y - sourceCentre.y)/steps,
            // steps: steps,
            progress: 0,
            time: 500, //TODO calculate from dist?
            transient: true
        }
        scene.addTransitionAnimation(transitionAnimation);
    }
}

const animateDamageDealt = (scene: MainCamera) => {
    return (event: GameEvent) => {
        
        let data: DamageDealtEventData = event.data;
        let sourceCentre = data.source.getCentre();
        let targetCentre = data.target.getCentre();

        let weaponSprite = scene.spriteCache.createSprite('arrow', scene);
        weaponSprite.setPosition(sourceCentre.x, sourceCentre.y);
        weaponSprite.setScale(0.25);

        let steps = data.time * ANIMATION_RATE;
    

        let customAnimation = customAnimationFromSprite(weaponSprite, scene);
        
        let transitionAnimation : TransitionAnimation = {
            sprite: customAnimation,
            sourceX: sourceCentre.x,
            sourceY: sourceCentre.y,
            targetX: targetCentre.x,
            targetY: targetCentre.y,
            time: 500, //TODO - set time from event
            // dX: (targetCentre.x - sourceCentre.x)/steps,
            // dY: (targetCentre.y - sourceCentre.y)/steps,
            // steps: steps,
            progress: 0,
            transient: true
        }

        transitionAnimation.angle = 
        360*Math.atan2(targetCentre.y - sourceCentre.y, targetCentre.x - sourceCentre.x)/(2*Math.PI);
        weaponSprite.angle = transitionAnimation.angle;
        
        scene.addTransitionAnimation(transitionAnimation);
    }
}

export { registerOnResourceCollect, registerOnProjectileFired as registerOnDamageDealt }