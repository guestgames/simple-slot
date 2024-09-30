window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

exports.main = void 0;
const MainScene = require("./MainScene");
const gameConfig = require("./gameConfig");

function main(param) {
    //ニコニコ上判定
    let niconico = false; //todo

    //セッションパラメータが送られてこないときのデフォルト値
    let time = gameConfig.timeLimit;
    let random = g.game.random;
    let mode = "ranking";

    //セッションパラメータが送られてきた場合
    if(param) {
        //time = param.sessionParameter.totalTimeLimit;
        random = param.random;
        mode = param.sessionParameter.mode;
    }

    //スコア初期化
    g.game.vars.gameState = {score: 0};

    //シーン遷移
    g.game.pushScene(
        new MainScene(time, random, mode, niconico)
    );
}

exports.main = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}