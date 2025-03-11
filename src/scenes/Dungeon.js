class Dungeon extends Phaser.Scene {
    constructor() {
        super('dungeonScene')
    }

    create() {
        this.scene.run('gameUIScene')

        //Tilemap Stuff here :)
        const map = this.add.tilemap('dungeonTilemapJSON');
        const dungeonTileset = map.addTilesetImage('DungeonTilesset', 'dungeonTilesetImage');
        const dungeonBackgroundTileset = map.addTilesetImage('DungeonBackgroundTileset', 'dungeonBackgroundImage')

        const bgLayer = map.createLayer("Background", dungeonBackgroundTileset, 0, 0);
        const decorationLayer = map.createLayer("Decoration", dungeonTileset, 0, 0);
        this.floorLayer = map.createLayer("Floor", dungeonTileset, 0, 0);
        const platformLayer = map.createLayer("Platforms", dungeonTileset, 0, 0);

        //Collision with Layers
        this.floorLayer.setCollisionByProperty({ collides: true })
        platformLayer.setCollisionByProperty({ platform: true })


        let playerSpawn = null;

        this.rats = this.add.group();

        //Get the spawn layer
        const spawnLayer = map.getObjectLayer('Spawns');

        spawnLayer.objects.forEach(obj => {
            switch (obj.name) {
                case 'player':
                    playerSpawn = obj;
                    break;
                case 'rat':
                    const rat = new Rat(this, obj.x, obj.y, 'ratIdleLeft', 0, 'Right');
                    this.rats.add(rat);
                    break;

            }
        })

        //Add Hero

        this.hero = new Hero(this, playerSpawn.x, playerSpawn.y, 'heroIdleRight', 0, 'Right');

        //Camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.hero, false);
        this.cameras.main.setZoom(1.5);
        //this.textures.setFilter('linear')


        //World Bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        //Collision
        this.physics.add.collider(this.hero, this.floorLayer);
        this.physics.add.collider(this.rats, this.floorLayer);

        //Overlaps
        this.physics.add.overlap(this.hero, this.rats, this.handleOverlap, null, this);

        //this.physics.add.collider(this.hero, platformLayer)

        // input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        //Music
        this.sound.play('dungeonBackgroundMusic')
    }


    update() {
        this.heroFSM.step();

        this.rats.getChildren().forEach(rat => {
            rat.update();
        });
    }

    handleOverlap(player, rat) {
        console.log('Player and rat overlapped!');
        this.hero.tryTransition(['hurt'])
        //this.heroFSM.transition('hurt')
    }

}

