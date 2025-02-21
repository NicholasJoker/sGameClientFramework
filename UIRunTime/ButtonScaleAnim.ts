import SoundMgr from "../Common/SoundMgr";

export default class ButtonScaleAnim extends Laya.Button {


    constructor() {
        super();

        this.anchorX = this.anchorY = 0.5;
        this.on(Laya.Event.MOUSE_DOWN, this, this.scaleSmall);
        this.on(Laya.Event.MOUSE_UP, this, this.scaleBig);
        this.on(Laya.Event.MOUSE_OUT, this, this.scaleBig);
    }

    private mScaleTime = 50;
    private mScalePercent = 0.8;

    public setScalePercent(percent) {
        this.mScalePercent = percent;
    }

    scaleBig() {
        //变大还原的缓动效果
        Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, this.mScaleTime);
    }

    scaleSmall() {
        SoundMgr.getInstance().playSound('button');
        //缩小至0.8的缓动效果
        Laya.Tween.to(this, { scaleX: this.mScalePercent, scaleY: this.mScalePercent }, this.mScaleTime);
    }

    onDestroy() {
        Laya.Tween.clearAll(this);
    }


}