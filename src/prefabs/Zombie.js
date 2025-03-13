class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);

        // Add the Zombie to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics body
        this.body.setSize(this.width, this.height);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(800);

        // Zombie properties
        this.scene = scene;
        this.health = 3;
        this.speed = 40;
        this.damage = 1;
        this.direction = direction;
        this.isHurt = false; // Tracks whether the Zombie is currently hurt
        this.hurtTimer = 0;

        // Patrol behavior flags
        this.isTurning = false;
        this.isDead = false; // Tracks whether the Zombie is dead

        // Add an attack hitbox
        this.attackHitbox = scene.add.rectangle(this.x, this.y, 20, 20, 0xff0000, 0.3); // Invisible red rectangle
        scene.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.setAllowGravity(false);
        this.attackHitbox.body.enable = false; // Initially disabled
        this.attackReset = Math.floor(Math.random() * 3000);//timer for next attack
        this.isAttacking = false;
        this.attackTimer = null;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Update the hitbox position to follow the Hero
        if (this.direction === 'Right') {
            this.attackHitbox.x = this.x + 15;
        } else {
            this.attackHitbox.x = this.x - 15;
        }
        this.attackHitbox.y = this.y - 10;
    }

    update() {
        if (this.isHurt || this.isDead || this.isAttacking) {
            // If hurt or dead, skip patrol behavior
            return;
        }

        //Start attack timer if there isnt one 
        if (this.attackTimer == null) {
            this.attackTimer = this.scene.time.delayedCall(this.attackReset, () => {
                this.attack();
                this.attackReset = Math.floor(Math.random() * 5000);
                this.attackTimer = null;
            })
        }

        // Patrol behavior
        this.patrol();
    }

    attack() {
        //console.log("zombie begining attack")
        this.isAttacking = true;

        this.setVelocity(0);
        this.anims.play(`zombieAttack${this.direction}`)

        if (this.direction === 'Left') {
            this.setOrigin(0.75, 1);
            this.body.setOffset(16, 0); // Adjust offset for left attack
        } else if (this.direction === 'Right') {
            this.setOrigin(0.25, 1);
        }

        this.on('animationupdate', (animation, frame) => {
            if (frame.index === 4 && (this.anims.currentAnim.key === ('zombieAttackRight') || this.anims.currentAnim.key === ('zombieAttackLeft'))){
            this.attackHitbox.body.enable = true;
            //console.log("sword comming out")
        }
    }, this)

this.once('animationcomplete', () => {
    this.setOrigin(0.5, 1);
    this.body.setOffset(0, 0);
    this.attackHitbox.body.enable = false;
    this.isAttacking = false;
});

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
    this.anims.play(`zombieRun${this.direction}`, true);

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
    // Check for a platform below the Zombie
    const groundCheckX = this.x;
    const groundCheckY = this.y + this.height / 2 + 5;
    const tile = this.scene.floorLayer.getTileAtWorldXY(groundCheckX, groundCheckY);
    return !!tile;
}

turnAround(newDirection) {
    if (this.isTurning) return;

    this.isTurning = true;

    // Stop movement briefly
    this.setVelocityX(0);
    this.anims.play(`zombieIdle${newDirection}`, true);
    this.direction = newDirection;

    // Wait before resuming patrol
    this.scene.time.delayedCall(500, () => {
        this.isTurning = false;
    });
}

handleHurt(hitX) {
    if (this.isHurt || this.isDead) return; // Avoid overlapping hurt states or processing if dead

    console.log("Zombie hit!");
    this.isHurt = true;


    // Calculate knockback direction based on hit position
    const knockbackDirection = hitX < this.x ? 1 : -1; // If hit from the left, knockback to the right

    //Make the zombie face whichever way it was hit 
    if (knockbackDirection == -1) {
        this.turnAround("Right")
    } else {
        this.turnAround("Left")
    }

    // Play hurt animation
    this.anims.play(`zombieHurt${this.direction}`, true);

    // Apply knockback
    this.setVelocityX(knockbackDirection * 50);

    // Reduce health
    this.health -= 1;
    if (this.health <= 0) {
        this.handleDeath();
        return;
    }

    this.once("animationcomplete", () => {
        console.log("Zombie recovered from hurt");
        this.isHurt = false;
    });

}

handleDeath() {
    console.log("Zombie is dying!");

    this.isDead = true; // Mark the Zombie as dead

    // Disable all collison on the zombie so it cant hurt the player
    this.body.checkCollision.none = true;
    this.body.setEnable(false);

    this.anims.play("zombieDeath", true);

    // Destroy the zombie after animation
    this.once("animationcomplete", () => {
        console.log("Zombie destroyed!");
        this.destroy();
    });
}
}