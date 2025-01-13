// systems/GameLoop.js
class GameLoop {
    constructor(components) {
        this.components = components; // An array of all updatable components or systems
        this.elapsedTime = 0;
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;
        this.components.forEach((component) => {
            if (component.update) {
                component.update(deltaTime, this.elapsedTime);
            }
        });
    }
    resetClock(){
        this.elapsedTime = 0;
    }
}

export default GameLoop;
