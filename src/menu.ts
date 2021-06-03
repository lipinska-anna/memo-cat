import Sprite = Phaser.GameObjects.Sprite;
import {Game} from "./game";

export class Menu extends Phaser.Scene {

    constructor() {
        super({key: 'Menu'});
    }

    initialize() {
        Phaser.Scene.call(this, {key: 'Menu'});

    }

    preload() {

        this.scale.setGameSize(
            this.cameras.main.width,
            this.cameras.main.height,
        )
        this.scale.updateCenter()
        this.load.image('background', 'assets/images/background.png')
        this.load.image('logo', 'assets/images/memo-logo.png')
        this.load.atlas('button-start', 'assets/images/play-button.png', 'assets/images/play-button.json')
        this.load.audio('selected', 'assets/music/selected.wav')
    }

    create() {
        const bg: Sprite = this.add.sprite(0, 0, 'background').setOrigin(0).setScale(7);
        bg.setDisplaySize(Number(this.game.config.width), Number(this.game.config.height))

        const logo = this.add.sprite(Number(this.game.config.width) / 2, 300, 'logo').setScale(2);

        this.tweens.add({targets: logo, angle: logo.angle - 4, duration: 1000, ease: 'Sine.easeInOut'});
        this.tweens.add({
            targets: logo,
            angle: logo.angle + 4,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: 1,
            loop: -1,
            delay: 1000
        });

        let random = this.randomNumber();

        let buttonStart = this.add
            .sprite(Number(this.game.config.width) / 2, 500, 'button-start', random)
            .setScale(2)
            .setInteractive();
        random++
        buttonStart.on('pointerup', () => {
            this.sound.add('selected', {volume: 0.4}).play();
            buttonStart.setFrame(random)
            setTimeout(() => {
                this.scene.start('Game');
            }, 500)

        }, this)
    }

    buttons = [
        '0',
        '3',
        '6',
        '9',
    ]

    randomNumber() {
        const min = Math.ceil(0);
        const max = Math.floor(4);
        const random = Math.floor(Math.random() * (max - min)) + min;
        return Number(this.buttons[random])
    }
}
