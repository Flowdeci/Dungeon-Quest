class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);

        // Add the Rat to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics body
        this.body.setSize(this.width, this.height);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(800);

        // Rat properties
        this.scene = scene;
        this.health = 20;
        this.speed = 40;
        this.damage = 1;
        this.direction = direction;
        this.isHurt = false;
        this.hurtTimer = 0;

        // Patrol behavior flags
        this.isTurning = false;
        this.isDead = false;
    }

    update() {
        if (this.isHurt || this.isDead) {
            return;
        }

        // Patrol behavior
        this.patrol();
    }

    patrol() {
        let moveDirection = 0;

        // Determine patrol direction
        if (this.direction === "Right") {
            moveDirection = 1;
        } else if (this.direction === "Left") {
            moveDirection = -1;
        }

        // Set velocity based on direction
        this.setVelocityX(this.speed * moveDirection);
        this.anims.play(`ratRun${this.direction}`, true);

        // Check for collisions or end of platform
        if (this.body.blocked.right || this.body.touching.right) {
            this.turnAround("Left");
        } else if (this.body.blocked.left || this.body.touching.left) {
            this.turnAround("Right");
        } else if (!this.isOnPlatform()) {
            // Turn around at the end of a platform
            this.turnAround(this.direction === "Right" ? "Left" : "Right");
        }
    }

    isOnPlatform() {
        // Check for a platform below the Rat
        const groundCheckX = this.x;
        const groundCheckY = this.y + this.height / 2 + 10;
        const tile = this.scene.floorLayer.getTileAtWorldXY(groundCheckX, groundCheckY);
        return !!tile;
    }

    turnAround(newDirection) {
        if (this.isTurning) return;

        this.isTurning = true;

        // Stop movement briefly
        this.setVelocityX(0);
        this.anims.play(`ratIdle${newDirection}`, true);
        this.direction = newDirection;

        // Wait before resuming patrol
        this.scene.time.delayedCall(500, () => {
            this.isTurning = false;
        });
    }

    handleHurt(hitX, damage) {
        if (this.isHurt || this.isDead) return; // Avoid overlapping hurt states or processing if dead

        console.log("Rat hit!");
        this.isHurt = true;
        //if (this.scene.sound.get('ratasfasfHit')) { this.scene.sound.play("ratHit"); }



        // Calculate knockback direction based on hit position
        const knockbackDirection = hitX < this.x ? 1 : -1; // If hit from the left, knockback to the right

        //Make the rat face whichever way it was hit 
        if (knockbackDirection == -1) {
            this.turnAround("Right")
        } else {
            this.turnAround("Left")
        }

        // Play hurt animation
        this.anims.play(`ratHurt${this.direction}`, true);

        // Apply knockback
        this.setVelocityX(knockbackDirection * 50);

        // Reduce health
        this.health -= damage;
        if (this.health <= 0) {
            this.handleDeath();
            return;
        }

        this.once("animationcomplete", () => {
            console.log("Rat recovered from hurt");
            this.isHurt = false;
        });

    }

    handleDeath() {
        console.log("Rat is dying!");

        this.isDead = true; // Mark the Rat as dead

        // Disable all collison on the rat so it cant hurt the player
        this.body.checkCollision.none = true;
        this.body.setEnable(false);

        this.anims.play("ratDeath", true);

        // Destroy the rat after animation
        this.once("animationcomplete", () => {
            console.log("Rat destroyed!");
            this.destroy();
        });
    }
}