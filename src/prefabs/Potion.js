class Potion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);


        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        this.anims.play('healthPotion', true)
    }
}