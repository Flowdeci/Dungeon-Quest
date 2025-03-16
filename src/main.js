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
            debug: true
        }
    },
    zoom: 2,
    scene: [Load, Menu, Dungeon, GameUI, Instructions]
}


let game = new Phaser.Game(config);


const centerX = game.config.width / 2
const centerY = game.config.height / 2
let cursors = null

//set ui sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;