// systems/InputHandler.js
class InputHandler {
    constructor() {
        this.keys = {};

        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }

    isKeyPressed(key) {
        return !!this.keys[key];
    }
}

export default InputHandler;
