import { TowerGame } from "./TowerGame";


class KeyboardListener {

    scene: TowerGame;
    keysState: Map<number, boolean>;
    
    constructor(scene: TowerGame) {
        this.scene = scene;
        this.keysState = new Map();
        this.initKeysListeners();
    }

    private initKeysListeners() {
        this.initCTRL();
    }

    private initCTRL() {
        var ctrlKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        ctrlKey.on('down', switchKey(this.keysState, Phaser.Input.Keyboard.KeyCodes.CTRL, true));
        ctrlKey.on('up', switchKey(this.keysState, Phaser.Input.Keyboard.KeyCodes.CTRL, false));
    }

    isKeyPressed(code: number): boolean {
        return this.keysState.has(code) && this.keysState.get(code);
    }
}

export { KeyboardListener }

const switchKey = (keysState: Map<number, boolean>, code: number, value: boolean) => {
    return () => {
        keysState.set(code, value);
    }
}