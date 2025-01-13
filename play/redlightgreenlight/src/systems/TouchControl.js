// components/MobileControls.js
class MobileControls {
    constructor(character, inputHandler) {
        // check if from mobile device

        this.character = character;
        this.inputHandler = inputHandler; // Pass the InputHandler instance
        this.buttons = {};
        if(this.isMobileDevice()) this.addTouchHandler();
    }
    // write a function to check if the device is mobile
    isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
    addTouchHandler(){
        document.addEventListener('touchstart', (event) => {
            this.onButtonPress('ArrowUp');
        });
        document.addEventListener('touchend', (event) => {
            this.onButtonRelease('ArrowUp');
        });

    }
    createControlButtons() {
        const controlSize = 50; // Size of the buttons
        const buttonStyle = 'position: absolute; width: 50px; height: 50px; background-color: rgba(0, 0, 0, 0.5); color: white; border-radius: 25px; display: flex; justify-content: center; align-items: center;';

        // Create the movement buttons
        this.buttons.left = this.createButton('←', 'ArrowLeft', buttonStyle, 50, window.innerHeight - controlSize - 50);
        this.buttons.right = this.createButton('→', 'ArrowRight', buttonStyle, 110, window.innerHeight - controlSize - 50);
        this.buttons.up = this.createButton('↑', 'ArrowUp', buttonStyle, 80, window.innerHeight - controlSize - 110);
        // this.buttons.down = this.createButton('↓', 'ArrowDown', buttonStyle, 80, window.innerHeight - controlSize - 170);
    }

    createButton(label, keyCode, style, left, top) {
        const button = document.createElement('div');
        button.style = `${style} left: ${left}px; top: ${top}px;`;
        button.innerHTML = label;
        button.addEventListener('touchstart', () => this.onButtonPress(keyCode));
        button.addEventListener('touchend', () => this.onButtonRelease(keyCode));
        document.body.appendChild(button);
        return button;
    }

    onButtonPress(keyCode) {
        // Simulate key press
        this.inputHandler.keys[keyCode] = true;
    }

    onButtonRelease(keyCode) {
        // Simulate key release
        this.inputHandler.keys[keyCode] = false;
    }

    cleanup() {
        for (const button in this.buttons) {
            document.body.removeChild(this.buttons[button]);
        }
        this.buttons = {};
    }
}

export default MobileControls;
