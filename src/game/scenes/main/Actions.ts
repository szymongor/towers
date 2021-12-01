import { GameEvent } from "../../engine/events/GameEvent"
import { GameEngine } from "../../engine/GameEngine"
import { MainCamera } from "./MainCamera"
import { Subscriber, EventChannels } from '../../engine/events/EventsRegistry'
import { ResourceCollectedEventData, DamageDealtEventData } from '../../engine/units/actions/UnitActions';
import { ResourceName } from "../../engine/Resources"
import { CustomAnimation, customAnimationFromSprite, TransitionAnimation } from "./animation/Animation";

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
            dX: (targetCentre.x - sourceCentre.x)/steps,
            dY: (targetCentre.y - sourceCentre.y)/steps,
            steps: steps,
            progress: 0,
            transient: true
        }
        scene.addTransitionAnimation(transitionAnimation);
    }
}

const animateDamageDealt = (scene: MainCamera) => {
    return (event: GameEvent) => {
        
        let data: DamageDealtEventData = event.data;
        let respurceSprite = 'arrow';
        let sourceCentre = data.source.getCentre();
        let targetCentre = data.target.getCentre();

        
        let arrowSprite = scene.add.sprite(sourceCentre.x, sourceCentre.y, respurceSprite);
        arrowSprite.setScale(0.25);

        let steps = 50;

        let customAnimation = customAnimationFromSprite(arrowSprite, scene);
        
        let transitionAnimation : TransitionAnimation = {
            sprite: customAnimation,
            sourceX: sourceCentre.x,
            sourceY: sourceCentre.y,
            dX: (targetCentre.x - sourceCentre.x)/steps,
            dY: (targetCentre.y - sourceCentre.y)/steps,
            steps: steps,
            progress: 0,
            transient: true
        }

        transitionAnimation.angle = 
        360*Math.atan2(targetCentre.y - sourceCentre.y, targetCentre.x - sourceCentre.x)/(2*Math.PI);
        arrowSprite.angle = transitionAnimation.angle;
        
        scene.addTransitionAnimation(transitionAnimation);
    }
}

export { registerOnResourceCollect, registerOnDamageDealt }