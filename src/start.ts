import {Game} from "./game";
import {Menu} from "./menu";
import {EndGame} from "./end-game";

const config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 960,
    transparent: true,
    pixelArt: true,
    // width: window.innerWidth,
    // height: window.innerHeight,
    scene: [Menu, Game, EndGame],
    scale: {
        mode: Phaser.Scale.FIT,
    }
};

const game = new Phaser.Game(config);
