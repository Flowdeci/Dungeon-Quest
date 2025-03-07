// Code Practice: Slime World
// Name: Cody Karigaca
// Date: 2/16/2025
  
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    width: 480,
    height: 360,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    zoom: 2,
    scene: [ Load, Dungeon ]
}

const game = new Phaser.Game(config)