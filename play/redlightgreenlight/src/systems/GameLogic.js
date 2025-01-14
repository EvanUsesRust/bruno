// systems/GameLogic.js
import {CharacterAnimationEnum} from "../helper/GameEnums.js"
import * as THREE from './libs/three/build/three.core.js'
import { GLTFLoader } from '../libs/three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from '../libs/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../libs/three/examples/jsm/geometries/TextGeometry.js';


const WALKING_SPEED = 3;
const ROTATION_SPEED = 3;

class GameLogic {
    constructor(character, inputHandler, animationSystem, gunMan, doll, soundManager, gameField, uiManager) {
        this.character = character;
        this.inputHandler = inputHandler;
        this.animationSystem = animationSystem;
        this.gunMan = gunMan;
        this.doll = doll;
        this.soundManager = soundManager;
        this.gameField = gameField;
        this.uiManager = uiManager;


        this.dollRotationToggle = true;
        this.lastDollRotationTime = 0;
        this.rotationSpeed = 20; // Speed for smooth rotation
        this.randomDelay = this.getRandomDelay(); // Initialize the first random delay
        this.isDollRotating = false;
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (4 - 2 + 1) + 2); // Random delay between 3-6 seconds
    }

    getCurrentLight() {
        return this.dollRotationToggle ? "GREEN" : "RED";
    }
    

    updateDollRotation(deltaTime, elapsedTime) {
        // Check if the elapsed time since the last rotation exceeds the random delay
        if (elapsedTime - this.lastDollRotationTime >= this.randomDelay) {
            console.log(`Rotating doll after ${this.randomDelay} seconds`);

            // Toggle rotation state
            this.dollRotationToggle = !this.dollRotationToggle;

            // Update the last rotation time
            this.lastDollRotationTime = elapsedTime;
            this.isDollRotating = true;

            // Generate a new random delay for the next rotation
            this.randomDelay = this.getRandomDelay();

            // Play sound when doll toggles rotation
            this.dollRotationToggle
                ? this.soundManager.playSound('greenLight')
                : this.soundManager.playSound('redLight');
        }

        // Calculate the target rotation angle
        const targetRotation = this.dollRotationToggle ? Math.PI : 0;
        const currentRotation = this.doll.getCurrentRotation();

        // Smoothly interpolate rotation
        const newRotation = currentRotation + (targetRotation - currentRotation) * this.rotationSpeed * deltaTime;
        this.doll.setRotation(newRotation);

        if (Math.abs(newRotation - targetRotation) < 0.01) { // Threshold for completion
           this.isDollRotating = false;
        }
    }

    firByGunMan() {
        this.gunMan.fireBullet(this.character);
        this.soundManager.playSound('gunShot');
        this.fired = true;
    }

    checkIfCharacterIsHit() {
        const redLine = this.gameField.getObjectByName('redLine');
        if (!redLine || !this.character.mesh) {
            console.error('Red line or character mesh is not defined.');
            return false; // Cannot determine
        }

        // Get global positions
        const characterPosition = new THREE.Vector3();
        this.character.mesh.getWorldPosition(characterPosition);

        const redLinePosition = new THREE.Vector3();
        redLine.getWorldPosition(redLinePosition);

        // Define the acceptable threshold (e.g., the distance within which we consider it as a hit)
        const threshold = 1.0; // Adjust as needed for accuracy

        // Check if the character has crossed the red line
        return characterPosition.z <= redLinePosition.z + threshold;

    }

    update(deltaTime, elapsedTime) {
        if (this.character.isDying) {
            this.animationSystem.update(CharacterAnimationEnum.DIE);
            return;
        }

        if (!this.character.isAlive) {
            return;
        }
        if(this.checkIfCharacterIsHit()){
            this.gameWin = true;
        }


        let isMoving = CharacterAnimationEnum.IDLE;

        // Handle character movement
        let walkingSpeed = WALKING_SPEED * deltaTime;
        let rotationSpeed = ROTATION_SPEED * deltaTime;
        if (this.inputHandler.isKeyPressed('ArrowUp')) {
            this.character.mesh.position.z -= walkingSpeed * Math.cos(this.character.mesh.rotation.y);
            this.character.mesh.position.x -= walkingSpeed * Math.sin(this.character.mesh.rotation.y);
            isMoving = CharacterAnimationEnum.WALK;
        }
        if (this.inputHandler.isKeyPressed('ArrowDown')) {
            this.character.mesh.position.z += walkingSpeed * Math.cos(this.character.mesh.rotation.y);
            this.character.mesh.position.x += walkingSpeed * Math.sin(this.character.mesh.rotation.y);
            isMoving = CharacterAnimationEnum.WALK;
        }
        if (this.inputHandler.isKeyPressed('ArrowLeft')) {
            this.character.mesh.rotation.y += rotationSpeed;
            isMoving = CharacterAnimationEnum.WALK;
        }
        if (this.inputHandler.isKeyPressed('ArrowRight')) {
            this.character.mesh.rotation.y -= rotationSpeed;
            isMoving = CharacterAnimationEnum.WALK;
        }
        this.animationSystem.update(isMoving);

        if(this.gameWin)
            return;

        // If the doll is facing forward and character moves, fire gunman
        if (!this.dollRotationToggle && isMoving === CharacterAnimationEnum.WALK && this.character.isAlive  && !this.fired && !this.isDollRotating) {
            this.firByGunMan();
        }


        if(this.gameField.timOut){
            this.firByGunMan();
        }

        // Update doll rotation logic
        this.updateDollRotation(deltaTime, elapsedTime);


    }

    resetGame(){
        this.gameWin = false;
        this.dollRotationToggle = true;
        this.lastDollRotationTime = 0;
        this.character.resetState();
        this.gameField.startClock();
        this.doll.resetStates();
        this.soundManager.playSound('gamePlayMusic');
        this.fired = false;
    }
}

export default GameLogic;
