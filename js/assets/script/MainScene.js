window.gLocalAssetContainer["MainScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const gameConfig = require("./gameConfig");
const Button = require("./Button");
const Lever = require("./Lever");
const Roll = require("./Roll");
const Hud = require("./Hud");

class MainScene extends g.Scene {
    constructor(timeLimit, random, mode, niconico) {
        super({
            game: g.game,
            assetIds: [
                "buttonImage", "leverImage", "markImage",
                "buzzerSound", "buttonSound", "scoreSound", "leverSound"
            ]
        });
        this._timeLimit = timeLimit;
        this._random = random;
        this._mode = mode;
        this._niconico = niconico;

        this.loaded.addOnce( () => {
            this._setup();
        });

        this.update.add( () => {
            this._mainLoop();
        });
    }

    _setup() {
        //レイヤー生成
        this._bg = new g.FilledRect({
            scene: this,
            width: g.game.width,
            height: g.game.height,
            cssColor: "black"
        });
        this._mainLayer = new g.E({
            scene: this
        });
        this._hudLayer = new g.E({
            scene: this
        });
        this.append(this._bg);
        this.append(this._mainLayer);
        this.append(this._hudLayer);

        //ゲームステート
        this._gameState = "ready";
        this._score = gameConfig.defaultScore;
        this._time = this._timeLimit;
        this._remainingChallenges = gameConfig.numOfChallenges;

        //HUD
        this._hud = new Hud(this);
        this._hudLayer.append(this._hud);

        //ボタン
        this._buttons = [];
        for(let i = 0; i < 3; i++) {
            let button = new Button(this);
            button.x = g.game.width / 2 - 280 * (i - 1) + 90;
            button.y = g.game.height / 2 + 170;
            this._mainLayer.append(button);
            this._buttons.push(button);
        }

        //ボタン挙動
        this._buttons.forEach((button, i) => {
            button.pointDown.add( (ev) => {
                if(
                    !button.pushed &&
                    this._gameState !== "finished" &&
                    this._lever.pushed
                ) {
                    //ボタンが押された
                    button.push();
                    this.assets["buttonSound"].play().changeVolume(1);
                    this._rolls[i].stop();

                    //ボタンの回転速度変更
                    this._rolls.forEach((roll, i) => {
                        roll.rollInterval = gameConfig.roll.intervals[
                            this._buttons.filter((button) => {
                                return button.pushed
                            }).length
                        ];
                    });

                    //スコア判定
                    if(
                        this._buttons.every( (button) => {
                            return button.pushed;
                        })
                    ) {
                        //レバーリセット
                        if(this._remainingChallenges > 0) {
                            this._lever.reset();
                        }
                        //スコア計算
                        if(
                            //全一致時
                            this._rolls[0].markIndex === this._rolls[1].markIndex &&
                            this._rolls[1].markIndex === this._rolls[2].markIndex
                        ) {
                            let markIndex = this._rolls[0].markIndex;
                            let score = gameConfig.roll.scores[markIndex];
                            this._score += score;
                            //エフェクト
                            if(score > 0) {
                                this._hud.scoreEffect(score, "blue");
                                this.assets["scoreSound"].play().changeVolume(1);
                            } else if(score < 0) {
                                this._hud.scoreEffect(score, "red");
                                this.assets["buzzerSound"].play().changeVolume(1);
                            }
                        }
                        else if(
                            //全不一致時
                            this._rolls[0].markIndex !== this._rolls[1].markIndex &&
                            this._rolls[1].markIndex !== this._rolls[2].markIndex &&
                            this._rolls[2].markIndex !== this._rolls[0].markIndex
                        ) {
                            let score = gameConfig.roll.penalty;
                            this._score -= score;
                            //エフェクト
                            this._hud.scoreEffect(-score, "red");
                            this.assets["buzzerSound"].play().changeVolume(1);
                        }
                    }
                }
            });
        });

        //レバー
        this._lever = new Lever(this, this.assets["leverImage"]);
        this._mainLayer.append(this._lever);
        this._lever.x = 0 + 180;
        this._lever.y = g.game.height / 2 + 150;
        this._lever.modified();

        //レバー挙動
        this._lever.pointDown.add( (ev) => {
            //非ニコニコ上では特別に初期状態に戻る
            if(this._gameState === "finished" && !this._niconico) {
                this._initialize();
                return;
            }
            //レバーが正常に押された
            if(
                !this._lever.pushed &&
                this._gameState !== "finished" &&
                this._remainingChallenges > 0
            ) {
                //初回レバー操作時
                if(this._gameState === "ready") {
                    this._gameState = "playing";
                    this._score += gameConfig.defaultScore;
                }

                this._lever.push();
                this.assets["leverSound"].play().changeVolume(1);
                this._buttons.forEach((button, i) => {
                    button.reset();
                });
                this._rolls.forEach((roll, i) => {
                    roll.updateMarkOrder();
                    roll.start(gameConfig.roll.intervals[0]);
                    roll.rollInterval = gameConfig.roll.intervals[0];
                });
                this._remainingChallenges--;
            }
        });

        //ロール
        this._rolls = [];
        for(let i = 0; i < 3; i++) {
            let roll = new Roll(
                this,
                this._random
            );
            roll.x = g.game.width / 2 - 280 * (i - 1) + 90;
            roll.y = 290;
            this._mainLayer.append(roll);
            this._rolls.push(roll);
        }

        //初期化
        this._initialize();
    }

    _initialize() {
        //ゲーム状態初期化
        this._gameState = "ready";
        this._score = 0;
        this._time = this._timeLimit;
        this._remainingChallenges = gameConfig.numOfChallenges;
        //ボタン初期化
        this._buttons.forEach((button, i) => {
            button.push();
        });
        //レバー初期化
        this._lever.reset();
        //ロール初期化
        this._rolls.forEach((roll, i) => {
            roll.stop();
            roll.updateMarkOrder();
        });

        //初回描画のため
        this._mainLoop();
    }

    _mainLoop() {
        //時間更新
        if(this._gameState === "playing") {
            this._time -= 1 / g.game.fps;
            if(this._time <= 0) {
                this._time = 0;
                this._gameState = "finished";
            }
        }

        //HUD更新
        this._hud.timeBarProgress = this._time / this._timeLimit;
        this._hud.time = this._time;
        this._hud.life = this._remainingChallenges;
        this._hud.score = this._score;

        //ニコ生用スコア更新
        if(this._score < 0) {
            g.game.vars.gameState.score = 0;
        }
        else {
            g.game.vars.gameState.score = this._score;
        }
    }
}

module.exports = MainScene;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}