// components/Character.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js'
import {Constant} from "../helper/Constant.js";

class Character {
    constructor(name = "Player1", onLoadCallback) {
        this.loader = new GLTFLoader();
        this.mesh = null;
        this.mixer = null;
        this.animations = {};
        this.currentAction = null;
        this.loaded = false;
        this.isAlive = true;
        this.isDying = false;
        this.name = name;  // The name of the character

        this.nameLabel = null;  // Store the name label (3D text)
        this.onLoadCallback = onLoadCallback;
    }

    loadModel() {
        this.loader.load('../assets/model/die.glb', async (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(1, .8, 1);
            this.mesh.position.set(0, 1, 10);

            // Set up the animation mixer
            this.mixer = new THREE.AnimationMixer(this.mesh);
            gltf.animations.forEach((clip) => {
                this.animations[clip.name] = this.mixer.clipAction(clip);
            });

            // Create and add the 3D name label after the model is loaded
            const fontLoader = new FontLoader();
            fontLoader.load('../assets/font/helvetiker_regular.typeface.json', (font) => {
                this.createNameLabel(font);
                this.loaded = true;
                this.isAlive = true;
                if (this.onLoadCallback) {
                    this.onLoadCallback();  // Notify when all assets are loaded
                }
            });

        });
    }

    createNameLabel(font) {
        const geometry = new TextGeometry(this.name, {
            font: font,
            size: 0.1,
            depth: 0.001,
            curveSegments: 12,
            bevelEnabled: true,
            bevelSize: 0.0005,
            bevelThickness: 0.0001,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.nameLabel = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        this.nameLabel.position.sub(center);

        this.nameLabel.position.y = 2;  // Position the label above the character

        if (this.mesh) {
            this.mesh.add(this.nameLabel);
        }
    }


    playAnimation(name, loop = true) {
        if (this.isAlive && this.currentAction !== this.animations[name]) {

            if (this.currentAction) {
                this.currentAction.fadeOut(0.2);
            }
            this.currentAction = this.animations[name];
            if (this.currentAction) {
                this.currentAction.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
                this.currentAction.clampWhenFinished = true;
                this.currentAction.reset().fadeIn(0.2).play();
            }
        }
    }

    die() {
        if (!this.isAlive) return;  // If already dead, do nothing

        this.playAnimation('die', false);  // Play death animation if available
        this.isDying = true;
        // Optional: Add other death logic, like removing the character from the scene
        setTimeout(() => {
            this.isAlive = false;
            this.isDying = false;

        }, 1000);
        console.log(`${this.name} has died.`);
    }

    update(deltaTime) {
        if (this.mixer) this.mixer.update(deltaTime);
    }

    resetState(){
        this.isAlive = true;
        this.mesh.position.set(3, 0, (Constant.floorHeight / 2) - 4 )
        this.playAnimation('idle', true);
    }
}

export default Character;
