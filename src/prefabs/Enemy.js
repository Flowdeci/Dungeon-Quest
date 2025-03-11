class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame)//call the paraent sprite class

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = 2;
        this.speed = 50;
        this.damage = 1;
        this.direction = direction

        this.stateMachine = new StateMachine('move', {
            move: new MoveState()
        })
    }

    update() {
        this.stateMachine.step();
    }
}

class MoveState extends State {
    enter(scene, Enemy) {

    }
}