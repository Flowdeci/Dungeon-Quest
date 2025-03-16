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
        const gardenTileset = map.addTilesetImage('GardenTileset', 'gardenTilesetImage');
        const gardenBackgroundTileset = map.addTilesetImage('GardenBackgroundTileset1', 'gardentBackgroundImage1')
        const bossTileset = map.addTilesetImage('BossTileset', 'bossTilesetImage');
        const bossBackgroundTileset = map.addTilesetImage('BossBackgroundTileset1', 'bossBackgroundImage1')

        const bgLayer = map.createLayer("Background", [dungeonBackgroundTileset, gardenBackgroundTileset, bossBackgroundTileset], 0, 0);
        const decorationLayer = map.createLayer("Decoration", [dungeonTileset, gardenTileset, bossTileset], 0, 0);
        this.floorLayer = map.createLayer("Floor", [dungeonTileset, gardenTileset, bossTileset], 0, 0);

        const platformLayer = map.createLayer("Platforms", dungeonTileset, 0, 0);

        //Collision with Layers
        this.floorLayer.setCollisionByProperty({ collides: true })
        platformLayer.setCollisionByProperty({ platform: true })


        let playerSpawn = null;

        this.rats = this.add.group();
        this.potions = this.add.group();
        this.zombies = this.add.group();

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
                case 'potion':
                    const potion = new Potion(this, obj.x, obj.y, 'healthPotion', 0);
                    this.potions.add(potion);
                    break;
                case 'zombie':
                    const zombie = new Zombie(this, obj.x, obj.y, 'zombieIdleLeft', 0, 'Left');
                    this.zombies.add(zombie);
                    break;
                case 'boss':
                    this.boss = new Boss(this, obj.x, obj.y, ' bossIdle', 0, 'Left')
                    break;

            }
        })

        //Add Hero
        this.hero = new Hero(this, playerSpawn.x, playerSpawn.y, 'heroIdleRight', 0, 'Right');

        sceneEvents.emit('player-potion-change', this.hero.potions)
        sceneEvents.emit('player-health-change', this.hero.health)

        //Camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.hero, false);
        this.cameras.main.setZoom(1.5);

        //World Bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        //Collision
        this.physics.add.collider(this.hero, this.floorLayer);
        this.physics.add.collider(this.rats, this.floorLayer);
        this.physics.add.collider(this.zombies, this.floorLayer);
        this.physics.add.collider(this.boss, this.floorLayer);


        //Overlaps

        //Rat collisions
        this.physics.add.overlap(this.hero, this.rats, this.handleEnemyOverlap, null, this);//Rat hits player
        this.physics.add.overlap(this.hero.attackHitbox, this.rats, this.handleSwordHit, null, this)//PLayer can hit rat

        //Zombie collisons
        //this.physics.add.overlap(this.hero, this.zombies, this.handleEnemyOverlap, null, this);//Rat hits player
        this.physics.add.overlap(this.hero.attackHitbox, this.zombies, this.handleSwordHit, null, this)//PLayer can hit zombie
        this.zombies.getChildren().forEach(zombie => {
            this.physics.add.overlap(this.hero, zombie.attackHitbox, this.handleZombieSwordHit, null, this);//zombie swor dhit player
        })

        //Potion collisions
        this.physics.add.overlap(this.hero, this.potions, this.handlePotionPickup, null, this);

        //Boss Collisions
        this.physics.add.overlap(this.hero.attackHitbox, this.boss, this.handleSwordHit, null, this)


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

        this.zombies.getChildren().forEach(zombie => {
            zombie.update();
        })

        this.boss.update();
    }

    spawnEnemies(x, y) {
        let direction = Math.random() > 0.5 ? 'Right' : 'Left';
        let random = Math.random();
        if (random < 0.5) {
            let zombie = new Zombie(this, x, y, `zombieIdle${direction}`, 0, direction);
            this.zombies.add(zombie);
            this.physics.add.overlap(this.hero.attackHitbox, this.zombies, this.handleSwordHit, null, this)//PLayer can hit zombie
            this.zombies.getChildren().forEach(zombie => {
                this.physics.add.overlap(this.hero, zombie.attackHitbox, this.handleZombieSwordHit, null, this);//zombie swor dhit player
            })
        } else {
            let rat = new Rat(this, x, y, `ratIdle${direction}`, 0, direction);
            this.rats.add(rat);
            this.physics.add.overlap(this.hero.attackHitbox, this.rats, this.handleSwordHit, null, this)//PLayer can hit rat
            this.physics.add.overlap(this.hero, this.rats, this.handleEnemyOverlap, null, this);//Rat hits player

        }

    }

    handleSwordHit(hitbox, enemy) {
        //Player hits any enemy
        if (enemy && enemy.health > 0) {
            enemy.handleHurt(hitbox.x, 10);
        }
    }

    handleEnemyOverlap(player, enemy) {
        if (!enemy.isHurt) {
            this.hero.damageToTake = 1;
            this.hero.tryTransition(['hurt'])
        }
    }

    handleZombieSwordHit(player, hitbox) {
        //console.log("zombie sword hit player")
        this.hero.damageToTake = 1;
        this.hero.tryTransition(['hurt'])
    }

    handlePotionPickup(hero, potion) {
        //console.log("Potion picked up!");
        if (this.hero.potions < this.hero.maxPotions) {
            this.hero.potions += 1;
            sceneEvents.emit('player-potion-change', this.hero.potions);
            potion.destroy();
        }
    }

}

