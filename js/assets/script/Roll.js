window.gLocalAssetContainer["Roll"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const at = require("@akashic-extension/akashic-tile");

const width = 200;
const height = 200;
const srcWidth = 200;
const srcHeight = 200;
const numOfMarks = 6;
const bgMargin = 15;
const bgColor = "white";

class Roll extends g.E {
    constructor(scene, random) {
        super({
            scene: scene,
            width: width,
            height: height,
            anchorX: 0.5,
            anchorY: 0.5
        });

        this._random = random;
        this._markOrder = [];
        for(let i = 0; i < numOfMarks; i++) {
            this._markOrder.push(i);
        }

        this._brake = true;
        this._timer = 0;
        this._intervalNow = 0;
        this._markIndex = 0;

        this._bg = new g.FilledRect({
            scene: scene,
            width: width + bgMargin * 2,
            height: height + bgMargin * 2,
            cssColor: bgColor,
            x: -bgMargin,
            y: -bgMargin
        });
        this.append(this._bg);

        this._marks = new at.Tile({
            scene: scene,
            src: scene.assets["markImage"],
            tileWidth: srcWidth,
            tileHeight: srcHeight,
            tileData: [
                [this._markIndex]
            ],
            scaleX: width / srcWidth,
            scaleY: height / srcHeight
        });
        this.append(this._marks);

        this.update.add( () => {
            if(!this._brake) {
                this._timer -= 1000 / g.game.fps;
                if(this._timer <= 0) {
                    this._timer += this._intervalNow;
                    //描画
                    this._markIndex = (this._markIndex + 1) % numOfMarks;
                    this._marks.tileData = [
                        [this._markOrder[this._markIndex]]
                    ];
                    this._marks.invalidate();
                }
            }
        });
    }

    start(interval) {
        this._timer = interval;
        this._intervalNow = interval;
        this._brake = false;
    }

    stop() {
        this._brake = true;
    }

    get markIndex() {
        return this._markOrder[this._markIndex];
    }

    set rollInterval(val) {
        this._intervalNow = val;
    }

    updateMarkOrder() {
        //シャッフル
        for(let i = 0; i < this._markOrder.length; i++) {
            let j = Math.floor(this._random.generate() * this._markOrder.length);
            let tmp = this._markOrder[i];
            this._markOrder[i] = this._markOrder[j];
            this._markOrder[j] = tmp;
        }
        //描画
        this._marks.tileData = [
            [this._markOrder[this._markIndex]]
        ];
        this._marks.invalidate();
    }
}

module.exports = Roll;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}