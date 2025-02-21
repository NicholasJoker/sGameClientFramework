/**
 * 
 */

import LocalDataMgr from "../../Game/Module/LocalDataMgr";
import ResMgr from "../../Game/Module/ResMgr";
import FrameworkHelper from "../Tool/FrameworkHelper";


export default class SoundMgr {

    private static _instance: SoundMgr = null;

    private bgm: any = null;
    private mLastMusicName = '';


    public static getInstance(): SoundMgr {
        if (this._instance === null) {
            this._instance = new SoundMgr();
        }
        return this._instance;
    }


    private isSoundOn() {
        return LocalDataMgr.getSoundIsOn();
    }

    private isMusicOn() {
        return LocalDataMgr.getMusicIsOn();
    }

    public getSoundUrl(name: string): string {
        let url = 'remoteRes/sound/' + name;
        if (name.indexOf('.') == -1) {
            url += '.ogg';
        }
        if (FrameworkHelper.isWechatGamePlatform()||FrameworkHelper.isShouQPlatform()||FrameworkHelper.isHeadLinsPlatform()||FrameworkHelper.isOppoPlatform()||FrameworkHelper.isVivoPlatform()) {
            url = ResMgr.baseURL + url;//Laya.URL.basePath + url;
        }

        return url;
    }

    public playSound(name: string): void {
        // test
        // return
        if (!this.isSoundOn())
            return;
        var url = this.getSoundUrl(name);
        if (FrameworkHelper.isWechatGamePlatform()) {
            var sound = Laya.Pool.getItem(name);
            if (sound == null) {
                sound = wx.createInnerAudioContext();
                sound.src = this.getSoundUrl(name);
                sound.onEnded(() => {
                    Laya.Pool.recover(name, sound);
                    sound.offEnded();
                })
            }
            sound.play();
        } else {
            Laya.SoundManager.playSound(url, 1);
        }
    }

    public playMusic(name: string = null) {
        // test
        // return
        if (!this.isMusicOn())
            return;

        if (name == null) {
            name = this.mLastMusicName;
        }
        this.mLastMusicName = name;
        let url = this.getSoundUrl(name);
        if (FrameworkHelper.isWechatGamePlatform()) {
            if (!this.bgm) {
                this.bgm = wx.createInnerAudioContext();
            }
            this.bgm.pause();
            this.bgm.src = url;
            this.bgm.loop = true;
            this.bgm.play();
        } else {
            Laya.SoundManager.playMusic(url, 0, new Laya.Handler(this, this.onComplete));
        }
    }

    public stopMusic() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            if (this.bgm) {
                this.bgm.pause();
            }
        } else {
            Laya.SoundManager.stopMusic();
        }
    }


    private onComplete() {

    }


}