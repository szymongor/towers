import { CustomSprite } from "../../../engine/units/Unit"
import { MainCamera } from "../MainCamera";

const ANIMATION_RATE = 15;

interface TransitionAnimation {
    sprite: CustomAnimation;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    angle?: number;
    time: number;
    progress: number;
    transient: boolean;
}

interface CustomAnimation {
    move: (x:number, y:number) => void;
    setPosition: (x: number, y: number) => void;
    dispose: () => void;
}

const customAnimationFromCustomSprite = (customSprite: CustomSprite): CustomAnimation => {
    let customAnimation: CustomAnimation = {
        move: (x:number, y:number) => {
            if(customSprite) {
                if(customSprite.rangeHighlight) {
                    customSprite.rangeHighlight.x += x;
                    customSprite.rangeHighlight.y += y;
                }
                if(customSprite.highlight) {
                    customSprite.highlight.update();
                }
                customSprite.x += x;
                customSprite.y += y;
            }
        },
        setPosition: (x:number, y:number) => {
            if(customSprite) {
                if(customSprite.rangeHighlight) {
                    customSprite.rangeHighlight.x = x;
                    customSprite.rangeHighlight.y = y;
                }
                if(customSprite.highlight) {
                    customSprite.highlight.update();
                }
                customSprite.x = x;
                customSprite.y = y;
            }
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
        setPosition: (x:number, y:number) => {
            sprite.x = x;
            sprite.y = y;
        },
        dispose: () => {
            scene.spriteCache.dispose(sprite);
        }
    }

    return customAnimation;
}

export {TransitionAnimation, CustomAnimation, customAnimationFromCustomSprite, customAnimationFromSprite, ANIMATION_RATE }