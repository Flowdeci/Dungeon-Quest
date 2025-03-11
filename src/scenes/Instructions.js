class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionScene')
    }

    create() {
        this.backgrorund = this.add.image(0, 0, 'dungeonBackground').setOrigin(0, 0).setScale(1.6).setAlpha(0.3);
        this.xPadding = 80
        
        this.add.text(this.xPadding, 100, 'Instructions', { fontSize: '24px', fill: 'ivory' })

        let menuButton = this.add.text(this.xPadding, 300, 'Return to Menu', {
            fontSize: '24px',
            fill: 'white'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('menuScene')
        })

        let instructionsButton = this.add.text(this.xPadding, 180, 'Just win lol ', {
            fontSize: '18px',
            fill: 'white'
        })

    }

}