class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        //Dungeon Map Load 
        this.load.path = './assets/'

        this.load.image("dungeonTilesetImage", "dungeonTileset.png")
        this.load.image("dungeonBackgroundImage", "dungeonBackgroundTileset.png")
        this.load.tilemapTiledJSON("dungeonTilemapJSON", "dungeon.json");

        //Hud
        this.load.image('heart', 'ui_heart_full.png')
        this.load.image('emptyHeart', 'ui_heart_empty.png')
        this.load.image('dungeonBackground', 'dungeonBackground.png')

        this.load.spritesheet('healthPotion', 'health_potion_idle.png', {
            frameWidth: 8,
            frameHeight: 8
        })

        // load bitmap font
        this.load.bitmapFont('fresh_font', 'font/FreshPalm.png', 'font/FreshPalm.xml')


        //Sound Loads
        this.load.path = './assets/sounds/'
        this.load.audio('swordSwingSound', 'swordSwing.wav');
        this.load.audio('hammerSwingSound', 'hammerSwing.mp3')
        this.load.audio('playerHitSound', 'playerHit.wav')
        this.load.audio('dungeonBackgroundMusic', 'dungeonBackground.mp3')
        this.load.audio('playerWalkSound', 'playerWalk.wav')
        this.load.audio('playerDodgeSound', 'playerDodge.wav')
        this.load.audio('playerJumpSound', 'playerJump.wav')
        this.load.audio('playerDoubleJumpSound', 'playerDoubleJump.wav')
        this.load.audio('playerHealSound', 'playerHeal.wav')

        //Hero loads
        this.load.path = './assets/hero/'

        this.load.spritesheet('heroIdleLeft', 'char_idle_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('heroRunLeft', 'char_run_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('heroIdleRight', 'char_idle_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('heroRunRight', 'char_run_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('heroJumpRight', 'char_jump_up_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        })

        this.load.spritesheet('heroJumpLeft', 'char_jump_up_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        })

        this.load.spritesheet('heroFallLeft', 'char_jump_falling_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        })

        this.load.spritesheet('heroFallRight', 'char_jump_falling_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        })

        this.load.spritesheet('heroDashRight', 'char_dash_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        })

        this.load.spritesheet('heroDashLeft', 'char_dash_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        })

        this.load.spritesheet('heroAttackRight0', 'char_attack_00_right_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })
        this.load.spritesheet('heroAttackRight1', 'char_attack_01_right_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })
        this.load.spritesheet('heroAttackRight2', 'char_attack_02_right_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })

        this.load.spritesheet('heroAttackLeft0', 'char_attack_00_left_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })
        this.load.spritesheet('heroAttackLeft1', 'char_attack_01_left_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })
        this.load.spritesheet('heroAttackLeft2', 'char_attack_02_left_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })

        this.load.spritesheet('heroHammerLeft', 'char_attack_hammer_left_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })

        this.load.spritesheet('heroHammerRight', 'char_attack_hammer_right_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })

        this.load.spritesheet('heroHitLeft', 'char_hit_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('heroHitRight', 'char_hit_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet('heroDoubleJumpLeft', 'char_double_jump_roll_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet('heroDoubleJumpRight', 'char_double_jump_roll_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        //Rat loads
        this.load.path = './assets/enemy/rat/'

        this.load.spritesheet('ratRunLeft', 'ratto_run_left_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })

        this.load.spritesheet('ratRunRight', 'ratto_run_right_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })

        this.load.spritesheet('ratIdleRight', 'ratto_idle_right_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })
        this.load.spritesheet('ratIdleLeft', 'ratto_idle_left_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })

        this.load.spritesheet('ratHurtLeft', 'ratto_hit_with_knockback_left_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })
        this.load.spritesheet('ratHurtRight', 'ratto_hit_with_knockback_right_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })
        this.load.spritesheet('ratDeath', 'ratto_death_anim.png', {
            frameWidth: 16,
            frameHeight: 8
        })

        //Zombie Loads
        this.load.path = './assets/enemy/zombie/'
        this.load.spritesheet('zombieIdleRight', 'zombie_idle_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('zombieIdleLeft', 'zombie_idle_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('zombieHitLeft', 'zombie_hit_left_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('zombieHitRight', 'zombie_hit_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('zombieAttackLeft', 'zombie_attack_left_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })

        this.load.spritesheet('zombieAttackRight', 'zombie_attack_right_anim.png', {
            frameWidth: 32,
            frameHeight: 16
        })

        this.load.spritesheet('zombieRunRight', 'zombie_run_right_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('zombieDeath', 'zombie_death_anim.png', {
            frameWidth: 16,
            frameHeight: 16
        })
    }

    create() {
        this.anims.create({
            key: 'zombieDeath',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('zombieDeath', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'zombieIdleLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('zombieIdleLeft', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'zombieIdleRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('zombieIdleRight', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'zombieHurtRight',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('zombieHitRight', { start: 0, end: 4 })
        })

        this.anims.create({
            key: 'zombieHurtLeft',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('zombieHitLeft', { start: 0, end: 4 })
        })


        this.anims.create({
            key: 'zombieAttackRight',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('zombieAttackRight', { start: 0, end: 7 })
        })

        this.anims.create({
            key: 'zombieAttackLeft',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('zombieAttackLeft', { start: 0, end: 7 })
        })

        this.anims.create({
            key: 'zombieRunLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('zombieRunRight', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'zombieRunRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('zombieRunRight', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'healthPotion',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('healthPotion', { start: 0, end: 4 })
        })

        this.anims.create({
            key: 'ratDeath',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('ratDeath', { start: 0, end: 11 })
        })

        this.anims.create({
            key: 'ratHurtLeft',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('ratHurtLeft', { start: 0, end: 4 })
        })
        this.anims.create({
            key: 'ratHurtRight',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('ratHurtRight', { start: 0, end: 4 })
        })
        this.anims.create({
            key: 'ratIdleRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('ratIdleRight', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'ratIdleLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('ratIdleLeft', { start: 0, end: 5 })
        })
        this.anims.create({
            key: 'ratRunLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('ratRunLeft', { start: 0, end: 3 })
        })
        this.anims.create({
            key: 'ratRunRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('ratRunRight', { start: 0, end: 3 })
        })

        this.anims.create({
            key: 'heroIdleLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroIdleLeft', { start: 0, end: 5 })
        })

        this.anims.create({
            key: 'heroRunLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroRunLeft', { start: 0, end: 7 })
        })
        this.anims.create({
            key: 'heroIdleRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroIdleRight', { start: 0, end: 5 })
        })
        this.anims.create({
            key: 'heroRunRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroRunRight', { start: 0, end: 7 })
        })

        this.anims.create({
            key: 'heroJumpRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroJumpRight', { start: 0, end: 2 })
        })

        this.anims.create({
            key: 'heroJumpLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroJumpLeft', { start: 0, end: 2 })
        })

        this.anims.create({
            key: 'heroFallLeft',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroFallLeft', { start: 0, end: 2 })
        })
        this.anims.create({
            key: 'heroFallRight',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('heroFallRight', { start: 0, end: 2 })
        })

        this.anims.create({
            key: 'heroDashRight',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroDashRight', { start: 0, end: 3 })
        })

        this.anims.create({
            key: 'heroDashLeft',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroDashLeft', { start: 0, end: 3 })
        })

        this.anims.create({
            key: 'heroAttackLeft0',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroAttackLeft0', { start: 0, end: 4 },

            )
        })
        this.anims.create({
            key: 'heroAttackLeft1',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroAttackLeft1', { start: 0, end: 4 },

            )
        })
        this.anims.create({
            key: 'heroAttackLeft2',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroAttackLeft2', { start: 0, end: 4 },

            )
        })

        this.anims.create({
            key: 'heroAttackRight0',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroAttackRight0', { start: 0, end: 4 })
        })
        this.anims.create({
            key: 'heroAttackRight1',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroAttackRight1', { start: 0, end: 4 })
        })
        this.anims.create({
            key: 'heroAttackRight2',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroAttackRight2', { start: 0, end: 4 })
        })

        this.anims.create({
            key: 'heroHammerLeft',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroHammerLeft', { start: 0, end: 6 })
        })

        this.anims.create({
            key: 'heroHammerRight',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroHammerRight', { start: 0, end: 6 })
        })

        this.anims.create({
            key: 'heroHitLeft',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroHitLeft', { start: 0, end: 2 })
        })

        this.anims.create({
            key: 'heroHitRight',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroHitRight', { start: 0, end: 2 })
        })
        this.anims.create({
            key: 'heroDoubleJumpLeft',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroDoubleJumpLeft', { start: 0, end: 3 })
        })
        this.anims.create({
            key: 'heroDoubleJumpRight',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNames('heroDoubleJumpRight', { start: 0, end: 3 })
        })



        //start the dungeon scene nce everything loads
        this.scene.start('menuScene');
    }
}