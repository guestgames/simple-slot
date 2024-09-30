window.gLocalAssetContainer["Button"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const at = require("@akashic-extension/akashic-tile");

const width = 200;
const height = 200;
const srcWidth = 200;
const srcHeight = 200;

class Button extends g.E {
    constructor(scene) {
        super({
            scene: scene,
            width: width,
            height: height,
            anchorX: 0.5,
            anchorY: 0.5,
            touchable: true
        });

        this._buttonImage = new at.Tile({
            scene: scene,
            src: scene.assets["buttonImage"],
            tileWidth: srcWidth,
            tileHeight: srcHeight,
            tileData: [
                [0]
            ],
            anchorX: 0,
            anchorY: 0,
            scaleX: width / srcWidth,
            scaleY: height / srcHeight
        });
        this.append(this._buttonImage);

        this._pushed = false;
    }

    get pushed() {
        return this._pushed;
    }

    push() {
        this._pushed = true;
        this._buttonImage.tileData = [
            [1]
        ];
        this._buttonImage.invalidate();
    }

    reset() {
        this._pushed = false;
        this._buttonImage.tileData = [
            [0]
        ];
        this._buttonImage.invalidate();
    }
}

module.exports = Button;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}