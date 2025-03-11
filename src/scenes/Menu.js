class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    init() {
        console.log("Menu: init");
    }

    create() {
        this.backgrorund = this.add.image(0, 0, 'dungeonBackground').setOrigin(0, 0).setScale(1.6).setAlpha(0.3);
        this.xPadding = 80
        
        this.add.text(this.xPadding, 100, 'Dungeon Quest', { fontSize: '24px', fill: 'ivory' })

        let playButton = this.add.text(this.xPadding, 140, 'Start Game', {
            fontSize: '24px',
            fill: 'white'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('dungeonScene')
        })

        let instructionsButton = this.add.text(this.xPadding, 180, 'Insutrcitons', {
            fontSize: '24px',
            fill: 'white'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('instructionScene')
        })

    }

}