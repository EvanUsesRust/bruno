import * as THREE from 'three';

class SoundManager {
    constructor(camera, callback) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.onLoadCallback = callback;

        // Sounds dictionary
        this.sounds = {
            loadingScreen: null,
            gameplayMusic: null,
            gunShot: null,
            greenLight: null,
            redLight: null,
            victory: null,
        };

        // Default priorities
        this.soundPriorities = {
            loadingScreen: 1,
            gameplayMusic: 5,
            gunShot: 2,
            greenLight: 10,
            redLight: 10,
            victory: 10,
        };
    }

    loadSounds() {
        const soundPromises = [];

        // Helper to load a sound with a promise
        const loadSound = (path, soundKey, isPositional = false) => {
            return new Promise((resolve, reject) => {
                this.audioLoader.load(
                    path,
                    (buffer) => {
                        const sound = isPositional
                            ? new THREE.PositionalAudio(this.listener)
                            : new THREE.Audio(this.listener);
                        sound.setBuffer(buffer);
                        this.sounds[soundKey] = sound;
                        resolve();
                    },
                    undefined,
                    (error) => reject(error)
                );
            });
        };

        // Add loading tasks
        soundPromises.push(loadSound('../assets/sound/greenLight.mp3', 'greenLight'));
        soundPromises.push(loadSound('../assets/sound/shot.mp3', 'gunShot'));
        soundPromises.push(loadSound('./assets/sound/redLightF.mp3', 'redLight'));
        soundPromises.push(loadSound('../assets/sound/gamePlay.mp3', 'gamePlayMusic'));
        soundPromises.push(loadSound('../assets/sound/victory.mp3', 'victory'));

        // Return a promise that resolves when all sounds are loaded
        Promise.all(soundPromises).then(() => {
            this.onLoadCallback();
        });
    }

    setSoundPriority(soundName, priority) {
        this.soundPriorities[soundName] = priority;
    }

    playSound(soundName, loop = false) {
        const sound = this.sounds[soundName];
        if (sound) {
            // Adjust volume based on priority
            const priority = this.soundPriorities[soundName] || 1; // Default priority is 1
            const maxPriority = Math.max(...Object.values(this.soundPriorities));
            const normalizedVolume = priority / maxPriority; // Normalize volume based on priority
            sound.setVolume(normalizedVolume);
            sound.setLoop(loop);

            // Play the sound
            if (!sound.isPlaying) {
                sound.play();
            }
        }
    }

    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }

    stopAllSounds() {
        Object.values(this.sounds).forEach((sound) => {
            if (sound && sound.isPlaying) {
                sound.stop();
            }
        });
    }
}

export default SoundManager;
