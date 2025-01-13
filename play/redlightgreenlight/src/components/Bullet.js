import * as THREE from 'three';

class Bullet {
    constructor(scene, startPosition, targetCharacter) {
        this.scene = scene;
        this.targetCharacter = targetCharacter;

        // Create the bullet mesh
        const geometry = new THREE.SphereGeometry(.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.copy(startPosition);
        this.scene.add(this.mesh);

        this.speed = 100; // Bullet speed (units per second)
        this.isActive = true; // Bullet is active until it collides or exits bounds
    }

    update(deltaTime) {
        if (!this.isActive) return;

        this.direction = new THREE.Vector3().subVectors(this.targetCharacter.mesh.position.clone().add(new THREE.Vector3(0,1.5,0)), this.mesh.position).normalize();

        // Move the bullet
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed * deltaTime));

        // Collision detection
        if (this.checkCollision() || this.isOutOfBounds()) {
            this.destroy();
        }
    }

    checkCollision() {
        // Simple bounding box collision detection
        const characterBoundingBox = new THREE.Box3().setFromObject(this.targetCharacter.mesh);
        const bulletBoundingBox = new THREE.Box3().setFromObject(this.mesh);
        const isIntersect = characterBoundingBox.intersectsBox(bulletBoundingBox);
        if(isIntersect) this.targetCharacter.die();
        return isIntersect;

    }

    isOutOfBounds() {
        // Check if the bullet is outside the game field bounds
        return Math.abs(this.mesh.position.x) > 60 ||
            Math.abs(this.mesh.position.y) > 60 ||
            Math.abs(this.mesh.position.z) > 60; // Adjust bounds as necessary
    }

    destroy() {
        this.isActive = false;
        this.scene.remove(this.mesh);
    }
}

export default Bullet;
