class End extends Phaser.Scene {
    constructor() {
        super('endScene')
    }

    create() {
        this.backgrorund = this.add.image(0, 0, 'dungeonBackground').setOrigin(0, 0).setScale(1.6).setAlpha(0.3);
        this.xPadding = 80
        this.yPadding = 100

        if (win) {
            this.add.text(this.xPadding, this.yPadding, 'You Win!', { fontSize: '24px', fill: 'ivory' })
            this.yPadding += 40;
            this.add.text(this.xPadding, this.yPadding, 'Congrats your actualy the', { fontSize: '24px', fill: 'ivory' })
            this.yPadding += 40;
            this.add.text(this.xPadding, this.yPadding, 'GOAT, just like MESSI!', { fontSize: '24px', fill: 'ivory' })
            this.yPadding += 40;
        }
        else {
            this.add.text(this.xPadding, 100, 'You Lose!', { fontSize: '24px', fill: 'ivory' })
            this.yPadding += 40;

            this.add.text(this.xPadding, 140, 'Better Luck Next Time :)', { fontSize: '24px', fill: 'ivory' })
            this.yPadding += 40;
        }

        let playButton = this.add.text(this.xPadding, this.yPadding, 'Play Again', {
            fontSize: '24px',
            fill: 'white'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('dungeonScene')
        })
        this.yPadding += 40;


        let instructionsButton = this.add.text(this.xPadding, this.yPadding, 'Insutrcitons', {
            fontSize: '24px',
            fill: 'white'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('instructionScene')
        })
        this.yPadding += 40;

    }
}
