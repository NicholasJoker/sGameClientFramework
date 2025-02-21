/**
 * 
 */

import FrameworkHelper from "../Tool/FrameworkHelper";
import WxApiHelper from "../Platform/Wechat/WxApiHelper";
import QQPlay from "../Platform/QQ/QQPlay";
import HeadLinesPlay from "../Platform/HeadLines/HeadLinesPlay";
import QGame from "../Platform/QGame/QGamePlay";
import VIVOPlay from "../Platform/VIVO/VivoPlay";


export default class AdsMgr {

    private static _instance: AdsMgr = null;



    public static getInstance(): AdsMgr {
        if (this._instance === null) {
            this._instance = new AdsMgr();
        }
        return this._instance;
    }



    /****************** 分平台广告逻辑 ***************/
    public initAds() {
        //console.log("FrameworkHelper.isWechatGamePlatform:",FrameworkHelper.isWechatGamePlatform);
        if (FrameworkHelper.isWechatGamePlatform()) {
            //console.log("是微信平台初始花微信广告");
            WxApiHelper.initAds();
        }
        else if(FrameworkHelper.isShouQPlatform())
        {
            QQPlay.initAdvertisement();
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            //console.log("头条平台暂时未接入广告!!!");
            HeadLinesPlay.initAdvertisement();
        }
        else if(FrameworkHelper.isOppoPlatform())
        {
            console.log("OPPO小游戏审核暂时没有通过暂无广告");
            return;
            QGame.initAdvertisement();
        }
        else if(FrameworkHelper.isVivoPlatform())
        {
            console.log("OPPO小游戏审核暂时没有通过暂无广告");
            return;
            VIVOPlay.initAdvertisement();
        }
    }

    //显示Baner广告
    public showBanerAd(isLeft: boolean = false, isTop: boolean = false, isAll: boolean = false) {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxApiHelper.showBanerAd(isLeft, isTop, isAll);
        }
        else if(FrameworkHelper.isShouQPlatform())
        {
            qqPlay.showBannerAdvertisement();
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            HeadLinesPlay.showBannerAdvertisement();
        }
        else if(FrameworkHelper.isOppoPlatform())
        {
            QGame.showBannerAdvertisement();
        }
        else if(FrameworkHelper.isVivoPlatform())
        {
            VIVOPlay.showBannerAdvertisement();
        }
    }

    public hideBannerAd() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxApiHelper.hideBannerAd();
        }
        else if(FrameworkHelper.isShouQPlatform())
        {
            qqPlay.hideBannerAdvertisement();
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            HeadLinesPlay.hideBannerAdvertisement();
        }
        else if(FrameworkHelper.isOppoPlatform())
        {
            QGame.hideBannerAdvertisement();
        }
        else if(FrameworkHelper.isOppoPlatform())
        {
            VIVOPlay.hideBannerAdvertisement();
        }
    }

    //播放视频广告
    public showVideo(callback) {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxApiHelper.showVideo(callback);
        }
        else if(FrameworkHelper.isShouQPlatform())
        {
            qqPlay.showRewardedVideoAdvertisement(callback);
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            HeadLinesPlay.showRewardedVideoAdvertisement(callback);
        }
        else if(FrameworkHelper.isOppoPlatform())
        {
            QGame.showRewardVideoAdvertisement(callback);
        }
        else if(FrameworkHelper.isVivoPlatform())
        {
            VIVOPlay.showRewardVideoAdvertisement(callback);
        }
        else {
            callback && callback(true);
        }
    }
    //盒子广告
    public showBoxAdvertisement()
    {
        if (FrameworkHelper.isShouQPlatform()) {
            qqPlay.loadBoxAdvertisement();
        }
    }
    // 插屏广告
    public showInterstitialAd() {
        if (FrameworkHelper.isShouQPlatform()) {
            qqPlay.showInsertAdvertisement();
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            HeadLinesPlay.showInsertAdvertisement();
        }
    }
    public showNativeVideoAd()
    {
        if(FrameworkHelper.isOppoPlatform())
        {
            QGame.showNativeVideoAdvertisement();
        }
        else if(FrameworkHelper.isVivoPlatform())
        {
            VIVOPlay.showNativeVideoAdvertisement();
        }
    }
    //格子广告
    public showGridAd()
    {
        //console.log("显示格子广告!!!!!!");
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxApiHelper.showGridAd();
        }
    }

}