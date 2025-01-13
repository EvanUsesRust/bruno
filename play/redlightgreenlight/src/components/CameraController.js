// components/CameraController.js
import * as THREE from 'three';

class CameraController {
    constructor(camera, target, distance = 10, height = 5) {
        this.camera = camera;
        this.target = target;  // The character to follow
        this.distance = distance;  // Distance behind the character
        this.height = height;  // Height of the camera above the character
        // this.camera.position.x = 3;
        // this.camera.position.y = 2;
        // this.camera.position.z = 35;
    }

    update() {
        if (!this.target) return;

        // Calculate the offset position behind the target
        const offset = new THREE.Vector3(0, this.height, this.distance);
        // offset.applyQuaternion(this.target.quaternion); // Rotate offset based on character's orientation
        offset.add(this.target.position); // Position relative to the target

        // Set camera position
        this.camera.position.copy(offset);

        // Make the camera look at the target position
        this.camera.lookAt(this.target.position.clone().add(new THREE.Vector3(0, 1, 0)));
    }
}

export default CameraController;
