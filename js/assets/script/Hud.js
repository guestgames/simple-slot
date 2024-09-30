window.gLocalAssetContainer["Hud"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const tl = require("@akashic-extension/akashic-timeline");

const timeBarHeight = 30;
const presetChars = "01234567789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -+¥🕹️⏲️"

const gameConfig = require("./gameConfig");

class Hud extends g.E {
    constructor(scene) {
        super({
            scene: scene
        });
        this._scene = scene;

        //タイムバー
        this._timeBar = new g.FilledRect({
            scene: scene,
            width: g.game.width,
            height: timeBarHeight,
            cssColor: "orange"
        });
        this.append(this._timeBar);

        //フォント
        this._font = new g.DynamicFont({
            game: g.game,
            fontFamily: g.FontFamily.Monospace,
            fontColor: "white",
            //strokeColor: "black",
            //strokeWidth: 5,
            fontWeight: "bold",
            size: 40,
            hint: {
                presetChars: presetChars
            }
        });

        //ラベル郡
        this._timeLabel = new g.Label({
            scene: scene,
            text: "00:00",
            font: this._font,
            fontSize: this._font.size,
            x: g.game.width / 2,
            y: 40,
            anchorX: 0.5
        });
        this.append(this._timeLabel);

        this._lifeLabel = new g.Label({
            scene: scene,
            text: "0",
            font: this._font,
            fontSize: this._font.size * 1.5,
            x: 100,
            y: g.game.height / 2 - 40
        });
        this.append(this._lifeLabel);

        this._scoreLabel = new g.Label({
            scene: scene,
            text: "0¥",
            font: this._font,
            fontSize: this._font.size * 1.5,
            x: 100,
            y: g.game.height / 2 - 120
        });
        this.append(this._scoreLabel);

        //スコアボード表示
        this._scoreBoard = this._createScoreBoard();
        this._scoreBoard.x = 200;
        this._scoreBoard.y = 110;
        this.append(this._scoreBoard);

        //タイムライン設定
        this._tl = new tl.Timeline(scene);

        //初期設定
        this.timeBarProgress = 1;
        this.time = 90;
        this.life = 999;
        this.score = 9999;
    }

    //[0,1]
    set timeBarProgress(tmp) {
        this._timeBar.width = tmp * g.game.width;
        this._timeBar.modified();
    }

    set time(tmp) {
        let str = "";
        let min = Math.floor(tmp / 60);
        let second = Math.floor(tmp % 60);
        str += "⏲️ " + ("00" + min).slice(-2) + ":" + ("00" + second).slice(-2);
        if(this._timeLabel.text !== str) {
            this._timeLabel.text = str;
            this._timeLabel.invalidate();
        }
    }

    set life(tmp) {
        let str = "";
        str += ("🕹️ " + tmp);
        if(this._lifeLabel.text !== str) {
            this._lifeLabel.text = str;
            this._lifeLabel.invalidate();
        }
    }

    set score(tmp) {
        let str = "";
        str += "¥" + tmp.toLocaleString();
        if(this._scoreLabel.text !== str) {
            this._scoreLabel.text = str;
            this._scoreLabel.invalidate();
        }
    }

    scoreEffect(val, color) {
        let label = new g.Label({
            scene: this._scene,
            text: "" + val,
            font: this._font,
            fontSize: this._font.size * 1.5,
            textColor: color,
            x: 100,
            y: g.game.height / 2 - 170,
            anchorX: 0
        });
        this.append(label);

        this._tl.create(label, {loop:false})
            .moveY(label.y - 30, 1000)
            .con()
            .fadeOut(1500, tl.Easing.easeInQuad)
            .call( () => {
                label.destroy();
        });
    }

    _createScoreBoard() {
        let board = new g.E ({
            scene: this._scene
        });
        gameConfig.roll.scores.forEach((score, i) => { //todo
            let sprite = new g.Sprite({
                scene: this._scene,
                src: this._scene.assets["markImage"],
                srcX: 0 + i * 200,
                srcY: 0,
                width: 200,
                height: 200,
                x: i * 150,
                y: 0,
                scaleX: 40 / 200,
                scaleY: 40 / 200
            });
            board.append(sprite);

            let label = new g.Label({
                scene: this._scene,
                text: "" + score,
                font: this._font,
                fontSize: this._font.size,
                x: 50 + i * 150,
                y: 0,
                scaleX: 0.8,
                scaleY: 0.8
            });
            board.append(label);
        });
        return board;
    }
}

module.exports = Hud;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}