// components/Wall.js
import * as THREE from 'three';

class Wall {
    constructor(width, height, position, rotation) {
        this.texturePath = "../assets/texture/wall-bg.png";
        this.mesh = this.createWall(width, height, this.texturePath);
        this.mesh.position.set(position.x, position.y, position.z);
        if (rotation) {
            this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        }
    }

    createWall(width, height, texturePath) {
        // Create geometry
        const geometry = new THREE.PlaneGeometry(width, height);

        // Create material with or without texture
        let material;
        if (texturePath) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(texturePath);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            material = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            material = new THREE.MeshStandardMaterial({ color: 0x8B8B8B }); // Default gray color
        }

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        return mesh;
    }
}

export default Wall;
