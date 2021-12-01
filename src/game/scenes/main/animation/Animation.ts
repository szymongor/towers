import { CustomSprite } from "../../../engine/units/Unit"
import { MainCamera } from "../MainCamera";


interface TransitionAnimation {
    sprite: CustomAnimation;
    sourceX: number;
    sourceY: number;
    dX: number;
    dY: number;
    angle?: number;
    steps: number;
    progress: number;
    transient: boolean;
}

interface CustomAnimation {
    move: (x:number, y:number) => void;
    dispose: () => void;
}

const customAnimationFromCustomSprite = (customSprite: CustomSprite): CustomAnimation => {
    let customAnimation: CustomAnimation = {
        move: (x:number, y:number) => {
            customSprite.rangeHighlight.x += x;
            customSprite.rangeHighlight.y += y;


            customSprite.x += x;
            customSprite.y += y;
        },
        dispose: () => {
            customSprite.dispose();
        }
    }

    return customAnimation;
}

const customAnimationFromSprite = (sprite: Phaser.GameObjects.Sprite, scene: MainCamera): CustomAnimation => {
    let customAnimation: CustomAnimation = {
        move: (x:number, y:number) => {
            sprite.x += x;
            sprite.y += y;
        },
        dispose: () => {
            scene.spriteCache.dispose(sprite);
        }
    }

    return customAnimation;
}

export {TransitionAnimation, CustomAnimation, customAnimationFromCustomSprite, customAnimationFromSprite }