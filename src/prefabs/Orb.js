class Orb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics body
        //this.body.setSize(48, 48);
        //this.body.setOffset(0.5, 0.5)
        this.setOrigin(0.5, 1);
        this.body.setCollideWorldBounds(true);
        this.anims.play('bossOrb', true);
        this.moveDirection = this.x < this.scene.hero.x ? 1 : -1;

        this.scene.physics.add.overlap(this.scene.hero, this, this.hitHero, null, this);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) {
            this.destroy();
        }

        this.setVelocityX(100 * this.moveDirection);
    }


    hitHero() {
        console.log("orb hit hero");
        this.scene.hero.damageToTake = 1;
        this.scene.hero.tryTransition(['hurt'])
        this.destroy();
    }
}
