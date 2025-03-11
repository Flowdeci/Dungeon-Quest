class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame)//call the paraent sprite class

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(this.width, this.height);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(800);

        this.health = 2;
        this.speed = 50;
        this.damage = 1;
        this.direction = direction;
        this.isTurning = false;
        this.hurtTimer = null;

        this.stateMachine = new StateMachine('patrol', {
            patrol: new RatPatrolState(),
            hurt: new RatHurtState(),
        }, [scene, this])

    }

    update() {
        this.stateMachine.step();
    }


    isOnPlatform() {
        // Define the area to check below the rat
        const groundCheckX = this.x;
        const groundCheckY = this.y + this.height / 2 + 10; // Slightly below the rat

        // Check if there's a tile in the floor layer beneath the rat
        const tile = this.scene.floorLayer.getTileAtWorldXY(groundCheckX, groundCheckY);
        return !!tile; // Return true if a tile exists, false otherwise
    }


    turnAround(newDirection) {
        if (this.isTurning) return;

        this.isTurning = true;

        // Stop movement briefly
        this.setVelocityX(0);
        this.anims.play(`ratIdle${newDirection}`, true);
        this.direction = newDirection;
        // Wait a moment before turning around
        this.scene.time.delayedCall(500, () => {

            this.isTurning = false;
        });
    }
}

function handleTransitions(scene, rat, transitions, stateMachine) {
    for (const transition of transitions) {
        switch (transition) {
            case 'idle':
                if (enemy.body.onFloor() && enemy.getVelocity == 0) {
                    stateMachine.transition('idle');
                    return true;
                }
                break;

            case 'move':
                if (enemy.body.onFloor() && enemy.getVelocity == 0) {
                    stateMachine.transition('move');
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

class RatPatrolState extends State {
    enter(scene, rat) {
        rat.anims.play(`ratRun${rat.direction}`, true);
    }
    execute(scene, rat) {
        let moveDirection = 0;
        if (rat.direction === "Right") {
            moveDirection = 1
        } else if (rat.direction === "Left") {
            moveDirection = -1
        }
        rat.setVelocityX(rat.speed * moveDirection);
        rat.anims.play(`ratRun${rat.direction}`, true);

        if (rat.body.blocked.right || rat.body.touching.left) {
            rat.turnAround('Left')
        } else if (rat.body.blocked.left || rat.body.touching.left) {
            rat.turnAround('Right');
        } else if (!rat.isOnPlatform()) {
            //Turn around at end of platform
            rat.turnAround(rat.direction === 'Left' ? 'Right' : 'Left');
        }
    }
}

class RatHurtState extends State {
    enter(scene, rat) {
        console.log("rat hit")
        rat.setVelocityX(moveDirection * -1 * 200);
        rat.anims.play(`ratHurt${rat.direction}`, true);
        rat.health -= 1;

        rat.once('animationcomplete', () => {
            this.stateMachine.transition('move');
        })
    }
}
