import { CustomSprite } from "../engine/units/Unit";


class SpriteCache {

    // scene: Phaser.Scene;

    sprites: Map<string, CustomSprite[]>;

    constructor(scene: Phaser.Scene) {
        this.sprites = new Map();
        // this.scene = scene;
    }

    get(key: string, scene: Phaser.Scene): CustomSprite {
        if(this.sprites.has(key)) {
            let sprites = this.sprites.get(key);
            if(sprites.length <= 0) {
                this.sprites.get(key).push(this.createSprite(key, scene));
                return this.sprites.get(key).pop();

            } else {
                return this.sprites.get(key).pop();
            }
        } else {
            this.sprites.set(key, Array.of(this.createSprite(key, scene)));
            return this.sprites.get(key).pop();
        }
    }

    dispose(sprite: CustomSprite) {
        if(this.sprites.has(sprite.name)) {
            this.sprites.get(sprite.name).push(sprite);
        } 
        sprite.setActive(false).setVisible(false);
    }

    createSprite(key: string, scene: Phaser.Scene): CustomSprite {
        let sprite: CustomSprite = scene.add.sprite(-100, -100, key); 
        sprite.dispose = () => {
            if(sprite.progressBar) {
                sprite.progressBar.destroy();
            }
            
            this.dispose(sprite);
        }
        return sprite;
    }

}

export { SpriteCache }