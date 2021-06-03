import 'phaser';
import Sprite = Phaser.GameObjects.Sprite;

export class Game extends Phaser.Scene {

    /*
    Cards example
    https://phaser.io/examples/v3/view/input/pointer/cards
     */
    cardMap: Map<number, any[]> = new Map();

    card1: Sprite = undefined;
    card2: Sprite = undefined;

    soundtrack: Phaser.Sound.BaseSound

    isFlipping = false

    constructor() {
        super({key: 'Game'});
    }

    initialize() {
        Phaser.Scene.call(this, {key: 'Game'});

    }

    preload() {

        this.load.image('background', 'assets/images/background.png')
        this.load.atlas('cards', 'assets/images/cats.png', 'assets/images/cats.json')
        this.load.audio('soundtrack', 'assets/music/soundtrack.wav')
        this.load.audio('matched', 'assets/music/matched.wav')
        this.load.audio('selected', 'assets/music/selected.wav')
        this.load.audio('wrong', 'assets/music/wrong.wav')
    }

    create() {
        const bg: Sprite = this.add.sprite(0, 0, 'background').setOrigin(0).setScale(7);
        bg.setDisplaySize(Number(this.game.config.width), Number(this.game.config.height))
        this.soundtrack = this.sound.add('soundtrack')
        this.soundtrack.play({loop: true})
        let x = 160
        let y = 180

        for (let r = 0; r < 4; r++) {
            for (let i = 0; i < 3; i++) {
                const pickCardIndex = this.randomNumber();
                if (this.cardMap.get(pickCardIndex) === undefined) {
                    this.cardMap.set(pickCardIndex, new Array<any>())
                }
                let sprite = this.add.sprite(x, y, 'cards', pickCardIndex).setInteractive();
                this.cardMap.get(pickCardIndex).push(sprite)
                if (sprite.getData('originalFrame') === undefined) {
                    sprite.setData("originalFrame", sprite.frame.name);
                }
                sprite.setFrame(sprite.frame.name === "0" ? Number(sprite.getData('originalFrame')) : 0);
                sprite.on('pointerdown', (pointer) => {

                    if (!this.isFlipping) {
                        this.isFlipping = true
                        this.flipCard(sprite)
                    }
                })
                x += 160;
            }
            x = 160;
            y += 200;
        }
    }

    flipCard(gameObject: Sprite) {
        this.sound.add('selected', {volume: 0.4}).play();
        return this.flip1(gameObject).play().on('complete', () => {
            gameObject.setFrame(gameObject.frame.name === "0" ? Number(gameObject.getData('originalFrame')) : 0);
            this.flip2(gameObject).play()
                .on('complete', () => {
                    if (this.card1 !== undefined && (gameObject.x !== this.card1.x || gameObject.y !== this.card1.y)) {
                        this.verifyCard1And2Frame(gameObject)
                    } else {
                        this.card1 = gameObject
                        this.isFlipping = false
                    }
                })
        })
    }

    flip1(sprite) {
        return this.tweens.create({
            targets: sprite,
            scaleY: 1,
            scaleX: 0,
            duration: 200,
            ease: 'Linear'
        });
    }

    flip2(sprite) {
        return this.tweens.create({
            targets: sprite,
            scaleY: 1,
            scaleX: 1,
            duration: 200,
            ease: 'Linear'
        });
    }

    update() {
    }

    randomNumber() {
        const min = Math.ceil(1);
        const max = Math.floor(7);
        const random = Math.floor(Math.random() * (max - min)) + min;
        if (this.cardMap.get(random) === undefined) {
            return random
        } else {
            return this.cardMap.get(random).length === 2 ? this.randomNumber() : random
        }
    }

    private verifyCard1And2Frame(sprite: Phaser.GameObjects.Sprite) {
        this.card2 = sprite
        //verifico i frame delle due carte
        //se sono uguali, elimino le carte
        //se sono diversi, le giro di nuovo
        if (Number(this.card1.getData('originalFrame')) === Number(this.card2.getData('originalFrame'))) {
            this.sound.play('matched')
            setTimeout(() => {
                this.cardMap.delete(Number(this.card1.getData('originalFrame')))
                this.card1.destroy()
                this.card2.destroy()
                this.card1 = undefined
                this.card2 = undefined
                this.isFlipping = false

                console.log(this.cardMap.size)

                if (this.cardMap.size === 0) {
                    this.soundtrack.pause()
                    this.scene.start('EndGame');
                }
            }, 1000)
        } else {
            this.sound.add('wrong').play();

            this.flip1(this.card1).play()
                .on('complete', () => {
                    this.card1.setFrame(this.card1.frame.name === "0" ? Number(this.card1.getData('originalFrame')) : 0);
                    this.flip2(this.card1).play().on('complete', () => this.card1 = undefined)
                })
            this.flip1(this.card2).play()
                .on('complete', () => {
                    this.card2.setFrame(this.card2.frame.name === "0" ? Number(this.card2.getData('originalFrame')) : 0);
                    this.flip2(this.card2).play().on('complete', () => {
                        this.card2 = undefined
                        this.isFlipping = false
                    })
                })
        }
    }
}

