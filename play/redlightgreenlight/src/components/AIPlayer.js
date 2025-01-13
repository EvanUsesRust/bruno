// components/AIPlayer.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

class AIPlayer {
    constructor(name = "AI_Player", position, scene, onLoadCallback) {
        this.loader = new GLTFLoader();
        this.mesh = null;
        this.mixer = null;
        this.animations = {};
        this.currentAction = null;
        this.loaded = false;
        this.isAlive = true;
        this.isDying = false;
        this.name = name;
        this.scene = scene;
        this.position = position;

        this.nameLabel = null;
        this.onLoadCallback = onLoadCallback;
        this.loadModel();
    }

    loadModel() {
        this.loader.load('../assets/model/die.glb', async (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(1, .8, 1);
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

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
                    this.onLoadCallback();
                }
            });

            this.scene.add(this.mesh); // Add AI player to the scene
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

        this.nameLabel.position.y = 2;

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
        if (!this.isAlive) return;

        this.playAnimation('die', false);
        this.isDying = true;
        setTimeout(() => {
            this.isAlive = false;
            this.isDying = false;
        }, 1000);
    }

    update(deltaTime, light) {
        if (this.mixer) this.mixer.update(deltaTime);

        if (this.isAlive) {
            if (light === "GREEN") {
                this.mesh.position.z -= Math.random() * 0.1;
            } else if (light === "RED" && Math.random() < 0.01) {
                this.die();
            }
        }
    }
}

export default AIPlayer;
