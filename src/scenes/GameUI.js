class GameUI extends Phaser.Scene {
    constructor() {
        super('gameUIScene')
    }

    create() {
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })
        
        this.hearts.createMultiple({
            key: 'heart',
            setScale: 0.05,
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 5,
        })

        sceneEvents.on('player-health-change', this.handlePlayerHealthChange,this)
    }

    handlePlayerHealthChange(health) {
        this.hearts.children.each((go, idx) => {
            const heart = go

            if (idx < health) {
                heart.setTexture('heart')
            }
            else {
                heart.setTexture('emptyHeart')
            }
        })
    }

}