import { GameEvent } from "../../engine/events/GameEvent"
import { GameEngine } from "../../engine/GameEngine"
import { MainCamera } from "./MainCamera"
import { Subscriber, EventChannels } from '../../engine/events/EventsRegistry'
import { ResourceCollectedEventData } from '../../engine/units/actions/UnitActions'
import { TransitionAnimation } from '../main/MainCamera'

const registerOnResourceCollect = (scene: MainCamera, engine: GameEngine) => {
    let subscriber: Subscriber = {
        call: animateResourceCollected(scene)
    }


    engine.events.subscribe(EventChannels.RESOURCE_COLLECTED, subscriber);

}

const animateResourceCollected = (scene: MainCamera) => {
    return (event: GameEvent) => {
        
        let data: ResourceCollectedEventData = event.data;
        let logSprite = scene.add.sprite(data.source.x, data.source.y, 'log');
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

export { registerOnResourceCollect }