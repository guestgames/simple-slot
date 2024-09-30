window.gLocalAssetContainer["Lever"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const width = 250;
const height = 250;

class Lever extends g.E {
    constructor(scene, imageAsset) {
        super({
            scene: scene,
            width: width,
            height: height,
            anchorX: 0.5,
            anchorY: 0.5,
            touchable: true
        });

        this._imageAsset = imageAsset;

        this._leverImage = new g.Sprite({
            scene: scene,
            src: this._imageAsset,
            x: width / 2,
            y: height / 2,
            srcX: 0,
            srcY: 0,
            width: this._imageAsset.width / 2,
            height: this._imageAsset.height,
            scaleX: width / this._imageAsset.width * 2,
            scaleY: height / this._imageAsset.height,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.append(this._leverImage);

        this._pushed = false;
    }

    get pushed() {
        return this._pushed;
    }

    push() {
        this._pushed = true;
        this._leverImage.srcX = this._imageAsset.width / 2;
        this._leverImage.modified();
    }

    reset() {
        this._pushed = false;
        this._leverImage.srcX = 0;
        this._leverImage.modified();
    }
}

module.exports = Lever;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}