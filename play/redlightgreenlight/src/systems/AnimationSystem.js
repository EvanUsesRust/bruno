// systems/AnimationSystem.js
import {CharacterAnimationEnum, CharacterState} from "../helper/GameEnums.js";
class AnimationSystem {
    constructor(character) {
        this.character = character;
    }

    update(isMoving) {
        switch (isMoving){
            case CharacterAnimationEnum.WALK:
                this.character.playAnimation(CharacterAnimationEnum.WALK);
                break;
            case CharacterAnimationEnum.IDLE:
                this.character.playAnimation(CharacterAnimationEnum.IDLE);
                break;
            case CharacterState.DIE:
                this.character.playAnimation(CharacterAnimationEnum.DIE,false);
                break;
        }
    }
}

export default AnimationSystem;
