window.gLocalAssetContainer["gameConfig"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strcit";

const config = {
    //制限時間
    timeLimit: 60,
    //初期所持金
    defaultScore: 1000,
    //チャレンジ回数
    numOfChallenges: 10,
    //ロール設定
    roll: {
        scores: [ //画像の左から順番のスコア apple,banana,watermelon,grape,melon,durian
            300,
            350,
            400,
            450,
            700,
            -1000
        ],
        penalty: 100,
        intervals: [80, 200, 400] //ボタンを押すごとに変わる出目の間隔
    }
}

module.exports = config;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}