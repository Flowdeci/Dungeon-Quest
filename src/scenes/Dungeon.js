class Dungeon extends Phaser.Scene {
    constructor() {
        super('dungeonScene')
    }

    create() {
        //Tilemap Stuff here :)
        const map = this.add.tilemap('dungeonTilemapJSON');
        const dungeonTileset = map.addTilesetImage('DungeonTilesset', 'dungeonTilesetImage');
        const dungeonBackgroundTileset = map.addTilesetImage('DungeonBackgroundTileset', 'dungeonBackgroundImage')

        const bgLayer = map.createLayer("Background", dungeonBackgroundTileset, 0, 0);
        const decorationLayer = map.createLayer("Decoration", dungeonTileset, 0, 0);
        const floorLayer = map.createLayer("Floor", dungeonTileset, 0, 0);
        const platformLayer = map.createLayer("Platforms", dungeonTileset, 0, 0);

        //Collision with Layers
        floorLayer.setCollisionByProperty({ collides: true })
        platformLayer.setCollisionByProperty({ platform: true })
        

        const playerSpawn = map.findObject("Spawns", (obj) => obj.name === 'playerSpawn')

        //Add Hero
        this.hero = new Hero(this, playerSpawn.x, playerSpawn.y, 'heroIdleRight', 0, 'Right');

        //Camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.hero, false);
        this.cameras.main.zoom = 1.5;

        //World Bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        //Collision
        this.physics.add.collider(this.hero, floorLayer);
        //this.physics.add.collider(this.hero, platformLayer)

        // input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        //Music
        this.sound.play('dungeonBackgroundMusic')

    }

    update() {
        this.heroFSM.step()
        //console.log(Phaser.Input.Keyboard.JustDown(this.keys.space));
    }
}