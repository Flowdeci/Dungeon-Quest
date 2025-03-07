class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);//call sprite parent class
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);

        this.body.setSize(this.width, this.height);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(800);

        this.direction = direction;
        this.heroVelocity = 100;
        this.hurtTimer = 250;
        this.dashCooldown = 0;
        this.canDoubleJump = true;
        this.attackFrame = 0;
        this.attackReset = 0;//timer for how long since last attack
        this.isAttacking=false;
        this.attackResetTimer=null;

        this.hammerwingSound = scene.sound.add('hammerSwingSound');
        this.swordSwingSound = scene.sound.add('swordSwingSound');
        this.playerHitSound = scene.sound.add('playerHitSound');
        this.playerWalkSound = scene.sound.add('playerWalkSound')
        this.playerWalkSound.rate = 0.5
        this.playerDodgeSound = scene.sound.add('playerDodgeSound')
        this.playerDodgeSound.rate = 1.5;


        scene.heroFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            falling: new FallingState(),
            dash: new DashState(),
            attack: new AttackState(),
            hammer: new HammerState(),
            hurt: new HurtState(),
            doubleJump: new DoubleJumpState()
        }, [scene, this])
    }
}

function resetHeroOffsets(hero) {
    hero.setOrigin(0.5, 1);
    hero.body.setOffset(0, 0);
    hero.hammerwingSound.stop();
    hero.swordSwingSound.stop();
    hero.playerHitSound.stop();
    hero.playerWalkSound.stop();
    hero.playerDodgeSound.stop();
}

function handleTransitions(scene, hero, transitions, stateMachine) {
    const { left, right, up, down, space, shift } = scene.keys;
    const HKey = scene.keys.HKey
    const FKey = scene.keys.FKey

    for (const transition of transitions) {
        switch (transition) {
            case 'idle':
                if (hero.body.onFloor() && (!(left.isDown || right.isDown))) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('idle');
                    return true;
                }
                break;

            case 'move':
                if (hero.body.onFloor() && (left.isDown || right.isDown)) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('move');
                    return true;
                }
                break;

            case 'jump':
                if (Phaser.Input.Keyboard.JustDown(space) && hero.body.onFloor()) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('jump');
                    return true;
                }
                break;
            case 'doubleJump':
                if (Phaser.Input.Keyboard.JustDown(space) && hero.canDoubleJump) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('doubleJump');
                    return true;
                }
                break;
            case 'falling':
                if (hero.body.velocity.y > 0) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('falling');
                    return true;
                }
                break;
            case 'dash':
                if (shift.isDown && hero.body.onFloor() && hero.dashCooldown === 0) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('dash');
                    return true;
                }
                break;
            case 'attack':
                if (FKey.isDown && hero.body.onFloor()) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('attack');
                    return true;
                }
                break;
            case 'hammer':
                if (HKey.isDown && hero.body.onFloor()) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('hammer');
                    return true;
                }
                break;
            case 'hurt':
                if (down.isDown && hero.body.onFloor()) {
                    resetHeroOffsets(hero);
                    stateMachine.transition('hurt');
                    return true;
                }
                break;

            default:
                console.warn(`Unknown transition: ${transition}`);
                break;
        }
    }

    return false;
}

class IdleState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`heroIdle${hero.direction}`);
        hero.anims.stop();
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey


        const transitions = ['move', 'jump', 'falling', 'dash', 'attack', 'hammer', 'hurt'];
        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            return;
        }
    }
}

class MoveState extends State {
    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        const transitions = ['idle', 'jump', 'falling', 'dash', 'attack', 'hammer', 'hurt'];
        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            return;
        }
        if (!hero.playerWalkSound.isPlaying) { hero.playerWalkSound.play(); }


        let moveDirection = 0;
        if (left.isDown) {
            moveDirection = -1
            hero.direction = 'Left'
        } else if (right.isDown) {
            moveDirection = 1
            hero.direction = 'Right'
        }

        hero.setVelocityX(hero.heroVelocity * moveDirection);
        hero.anims.play(`heroRun${hero.direction}`, true)

    }
}

class JumpState extends State {
    enter(scene, hero) {
        hero.setVelocityY(-250);

    }
    execute(scene, hero) {
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        let transitions = ['falling', 'doubleJump', 'idle'];
        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            return;
        }


        let moveDirection = 0;
        if (left.isDown) {
            moveDirection = -1
            hero.direction = 'Left'
        } else if (right.isDown) {
            moveDirection = 1
            hero.direction = 'Right'
        }

        hero.setVelocityX(hero.heroVelocity * moveDirection)
        hero.anims.play(`heroJump${hero.direction}`, true)
    }
}

class FallingState extends State {
    execute(scene, hero) {
        let transitions = ['idle', 'move', 'doubleJump'];
        //transition only once on floor

        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            //reset double jump on land
            hero.canDoubleJump = true;
            return;
        }



        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        let moveDirection = 0;
        if (left.isDown) {
            moveDirection = -1
            hero.direction = 'Left'
        } else if (right.isDown) {
            moveDirection = 1
            hero.direction = 'Right'
        }

        hero.setVelocityX(hero.heroVelocity * moveDirection)
        hero.anims.play(`heroFall${hero.direction}`, true)

    }
}

class DashState extends State {
    enter(scene, hero) {
        hero.playerDodgeSound.play()
        hero.anims.play(`heroDash${hero.direction}`, true)

        hero.once('animationcomplete', () => {
            if (hero.body.onFloor()) {
                this.stateMachine.transition('idle');
            } else {
                this.stateMachine.transition('falling');
            }
        });

        // Apply dash velocity
        const dashVelocity = 300;
        if (hero.direction === 'Left') {
            hero.setVelocityX(-dashVelocity);
        } else if (hero.direction === 'Right') {
            hero.setVelocityX(dashVelocity);
        }

        hero.dashCooldown = 1000;

        scene.time.delayedCall(hero.dashCooldown, () => {
            hero.dashCooldown = 0;
        });
    }
}

class AttackState extends State {
    enter(scene, hero) {
        console.log("Entering Attack");
        //hero.setVelocity(0);
        hero.swordSwingSound.play();

        if (hero.attackResetTimer) {
            hero.attackResetTimer.remove();
            hero.attackResetTimer = null;  
        }

        hero.anims.play(`heroAttack${hero.direction}${hero.attackFrame}`, true);
        hero.attackFrame += 1;
        if (hero.attackFrame > 2) {
            hero.attackFrame = 0
        }

        if (hero.direction === 'Left') {
            hero.setOrigin(0.75, 1);
            hero.body.setOffset(16, 0); // Adjust offset for left attack
        } else if (hero.direction === 'Right') {
            hero.setOrigin(0.25, 1);
        }
        hero.once('animationcomplete', () => {
            hero.setOrigin(0.5, 1);
            hero.body.setOffset(0, 0);
            this.stateMachine.transition('idle');
        });

        hero.attackReset = 1000;

        hero.attackReset = 1000;
        hero.attackResetTimer = scene.time.delayedCall(hero.attackReset, () => {
            console.log("resetting attacks");
            hero.attackReset = 0;
            hero.attackFrame = 0;
            hero.attackResetTimer = null; 
        });
    }

    execute(scene, hero) {
        const transitions = ['hurt'];
        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            return;
        }

        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        let moveDirection = 0;
        if (left.isDown) {
            moveDirection = -1
            hero.direction = 'Left'
        } else if (right.isDown) {
            moveDirection = 1
            hero.direction = 'Right'
        }

        hero.setVelocityX(hero.heroVelocity * moveDirection);
    }

}

class HammerState extends State {
    enter(scene, hero) {
        console.log("Entering Hammer Attack");
        hero.hammerwingSound.play()
        hero.setVelocity(0);
        hero.anims.play(`heroHammer${hero.direction}`, true);

        if (hero.direction === 'Left') {
            hero.setOrigin(0.75, 1);
            hero.body.setOffset(16, 0); // Adjust offset for left attack
        } else if (hero.direction === 'Right') {
            hero.setOrigin(0.25, 1);
        }

        hero.once('animationcomplete', () => {
            hero.setOrigin(0.5, 1);
            hero.body.setOffset(0, 0);
            this.stateMachine.transition('idle');
        });
    }

    execute(scene, hero) {
        const transitions = ['hurt'];
        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            return;
        }
    }
}

class HurtState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.playerHitSound.play();
        hero.anims.play(`heroHit${hero.direction}`, true);

        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
    }
}

class DoubleJumpState extends State {
    enter(scene, hero) {
        this.canDoubleJump = false;
        hero.setVelocityY(-250);
        console.log("Double Jumping")
    }
    execute(scene, hero) {
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        let transitions = ['falling', 'idle'];
        if (handleTransitions(scene, hero, transitions, this.stateMachine)) {
            return;
        }


        let moveDirection = 0;
        if (left.isDown) {
            moveDirection = -1
            hero.direction = 'Left'
        } else if (right.isDown) {
            moveDirection = 1
            hero.direction = 'Right'
        }

        hero.setVelocityX(hero.heroVelocity * moveDirection)
        hero.anims.play(`heroDoubleJump${hero.direction}`, true)
    }
}