import Sprite = Phaser.GameObjects.Sprite;

export class EndGame extends Phaser.Scene {


    constructor() {
        super({key: 'EndGame'});
    }

    initialize() {
        Phaser.Scene.call(this, { key: 'EndGame' });
    }

    preload(){
        this.load.image('background', 'assets/images/background.png')
        this.load.atlas('replay-button', 'assets/images/replay-button.png', 'assets/images/replay-button.json')
        this.load.atlas('home-button', 'assets/images/home-button.png', 'assets/images/home-button.json')

    }

    create(){
        const bg: Sprite = this.add.sprite(0, 0, 'background').setOrigin(0).setScale(7);
        bg.setDisplaySize(Number(this.game.config.width), Number(this.game.config.height))

        let home = this.add
            .sprite(Number(this.game.config.width) / 2, 300, 'home-button', 0)
            .setScale(2)
            .setInteractive();
        home.on('pointerup', () => {
            this.sound.add('selected', {volume: 0.4}).play();
            home.setFrame(1)
            setTimeout(() => {
                this.scene.start('Menu');
            }, 500)

        }, this)

        let replay = this.add
            .sprite(Number(this.game.config.width) / 2, 600, 'replay-button', 0)
            .setScale(2)
            .setInteractive();
        replay.on('pointerup', () => {
            this.sound.add('selected', {volume: 0.4}).play();
            replay.setFrame(1)
            setTimeout(() => {
                this.scene.start('Game');
            }, 500)

        }, this)
    }
}
