class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);

        // Add the Rat to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics body
        this.body.setSize(48, 48);
        this.body.setOffset(0.5, 0.5)
        this.body.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        this.body.setGravityY(800);

        // Rat properties
        this.scene = scene;
        this.hiding = false;
        this.direction = direction;
        this.speed = 100;
        this.hurt = false;
        this.health = 100;
        this.attacking = false;


        this.anims.play('bossIdle', true)


        setInterval(() => {
            if (this.hiding || this.hurt || this.attacking) {
                return;
            }
            this.hideRun();
        }, 7000)

        setInterval(() => {
            if (this.hiding || this.hurt || this.attacking) {

                return;
            }
            this.attack();
        }, 3000);
    }

    update() {

    }

    hideRun() {
        if (this.hiding) {
            return;
        }
        this.direction = Math.random() > 0.5 ? 'Left' : 'Right';
        this.speed = Math.random() * 200 + 100;
        this.hiding = true;
        console.log("hiding")
        this.anims.play(`bossHiding${this.direction}`, true)

        this.once('animationcomplete', () => {
            console.log("running")

            this.body.setSize(48, 8)
            this.body.setOffset(0.5, 0.5)

            this.anims.play(`bossRun${this.direction}`, true);
            setTimeout(() => {
                console.log("spawning enmies")
                this.scene.spawnEnemies(this.x, this.y);
            }, 500)
            let moveDirection = this.direction === 'Left' ? -1 : 1;
            this.setVelocityX(moveDirection * this.speed);
        })

        setTimeout(
            () => {

                console.log("emeriging")
                this.setVelocityX(0);
                this.body.setSize(48, 48);
                this.body.setOffset(0.5, 0.5)


                this.anims.play(`bossEmerging${this.direction}`, true);
                this.once('animationcomplete', () => {
                    this.anims.play('bossIdle', true)
                    this.hiding = false;
                })
            }, 2500)
    }

    handleHurt(hitbox, damage) {
        if (this.hurt || this.hiding) {
            return;
        }
        this.hurt = true;
        this.health -= damage;
        this.scene.sound.play('bossHit');

        if (this.health <= 0) { //if health is less than 0
            this.anims.play(`bossDeath`, true);
            this.once(
                'animationcomplete', () => {
                    win = true;
                    this.scene.endGame();
                }
            )
            return;
        }

        console.log("boss health", this.health)
        this.anims.play(`bossHit${this.direction}`, true);

        this.once('animationcomplete', () => {
            this.hurt = false;
            this.hideRun();
        })
    }

    attack() {
        this.attacking = true;

        this.direction = this.scene.hero.x < this.x ? 'Left' : 'Right';

        this.setVelocity(0);
        this.anims.play(`bossAttack${this.direction}`)

        let attackOrb = new Orb(this.scene, this.x, this.y - 10, 'bossOrb', 0, this.direction);

        this.scene.physics.add.collider(attackOrb, this.scene.floorLayer, () => {
            attackOrb.destroy();
        });

        this.once('animationcomplete', () => {
            this.attacking = false;
            this.hideRun();
        })
    }
}