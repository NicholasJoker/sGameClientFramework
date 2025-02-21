/**
 * 
 */

import FrameworkHelper from "../../Tool/FrameworkHelper";
import UserInfoMgr from "../../Common/UserInfoMgr";
import UIHelper from "../../../Game/Module/UIHelper";
import { ShareType } from "../../../Game/Module/GameEnum";
import ViewMgr, { ViewType } from "../../../Game/Module/ViewMgr";
import SoundMgr from "../../Common/SoundMgr";


var BANNER_ID = 'adunit-ca3a17bb4ca08d60';
var VIDEO_ID = 'adunit-bbc97790bfbfd07f';


export default class WxApiHelper {



    /******************** 分享 start ******************/

    // 分享转发
    private static mStartShareTime: number = 0;
    private static mShareCallback: Function = null;
    private static mIsWaitingShare: boolean = false;


    public static showShareMenu() {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }

        // AldMgr.aldShareMenu();

        Laya.Browser.window["wx"].showShareMenu({
            withShareTicket: true
        });

        Laya.Browser.window["wx"].onShareAppMessage(function (res) {
            var shareQueryObj: any = {};
            shareQueryObj.type = ShareType.MENU;
            shareQueryObj.userId = UserInfoMgr.getInstance().getUserId();
            var shareQueryMsg = FrameworkHelper.getParamsMsgForObj(shareQueryObj);
            var imgUrl = 'https://mmocgame.qpic.cn/wechatgame/JpDwoGfyZ06nLjuj60ZURJ0vZJkavK2PfA07cjr0qhaUzSMs1sMUicRe5ZgnWyI83/0';
            var imgUrlId = '8SE3nvNKSgOkxfzQDMY0Qg==';
            return {
                title: '火力全开，僵尸完蛋',
                imageUrl: imgUrl,
                query: shareQueryMsg,
                imageUrlId: imgUrlId,
                success(res) {
                    UIHelper.log("转发成功!!!")
                },
                fail(res) {
                    UIHelper.log("转发失败!!!")
                }
            }
        });
    }



    /**
     * 微信渠道的分享，
     * 如果分享到群，返回的res中会携带shareTickets数据
     */
    public static shareWX(shareTitle: String = '', shareImgUrl: string = '', shareQuery: any = null, callback: Function = null, aldDes: string = '') {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        //开始分享
        this.mIsWaitingShare = true;
        this.mShareCallback = callback || null;
        var inShareDate = new Date();
        this.mStartShareTime = inShareDate.getTime();
        var imgUrl = 'https://mmocgame.qpic.cn/wechatgame/JpDwoGfyZ06nLjuj60ZURJ0vZJkavK2PfA07cjr0qhaUzSMs1sMUicRe5ZgnWyI83/0';
        var imgUrlId = '8SE3nvNKSgOkxfzQDMY0Qg==';
        Laya.Browser.window["wx"].shareAppMessage({
            title: shareTitle,
            imageUrl: imgUrl,
            query: shareQuery,
            imageUrlId: imgUrlId,
        });

        // AldMgr.aldShare(shareTitle, imgUrl, imgUrlId, shareQuery, aldDes);
    }


    public static doWeChatonShow() {
        if (!this.mIsWaitingShare) {
            return;
        }
        this.mIsWaitingShare = false;

        var backDate = new Date();
        var backTime = backDate.getTime();
        var isSuccess = (backTime - this.mStartShareTime) >= 2000;
        if (isSuccess) {
            UIHelper.log(' 分享结果：成功')
            this.mShareCallback && this.mShareCallback(true);
        }
        else {
            UIHelper.log(' 分享结果：失败')
            this.mShareCallback && this.mShareCallback(false);
        }
    }


    /******************** 分享 end ******************/




    /******************** ads **********************/


    private static mBannerAd = null;
    private static mVideoAd = null;
    private static gridAd = null;
    private static gamePortal: null;

    public static initAds() {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }

        this.initVideoAds();
        this.initBannerAd();
        this.initGridAd();
    }


    public static initBannerAd(isLeft: boolean = false, isTop: boolean = false) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }

        let screenSize = Laya.Browser.window["wx"].getSystemInfoSync();
        if (screenSize.SDKVersion < '2.0.4') { //不满足显示广告的SDK版本
            return;
        }
        if (this.mBannerAd) {
            return;
        }

        var showWidth = screenSize.screenWidth// isAll ? screenSize.screenWidth : 300;
        this.mBannerAd = Laya.Browser.window["wx"].createBannerAd({
            adUnitId: BANNER_ID,
            style: {
                left: 0,
                top: 0,
                width: showWidth,
            },
            adIntervals: 30,
        });

        var self = this;
        this.mBannerAd.onResize(res => {
            let left = isLeft ? 0 : (screenSize.screenWidth - res.width) / 2;
            let top = isTop ? 0 : screenSize.screenHeight - res.height;
            self.mBannerAd.style.top = top;
            self.mBannerAd.style.left = left;
        });
    }

    //显示Baner广告
    public static showBanerAd(isLeft: boolean = false, isTop: boolean = false, isAll: boolean = false) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }

        if (this.mBannerAd) {
            UIHelper.log("===========有bannerAd显示 直接显示");
            this.mBannerAd.show();
            return;
        }

        this.showBanerAd();
        this.mBannerAd.show();
    }

    public static hideBannerAd() {
        if (this.mBannerAd) {
            this.mBannerAd.hide();
        }
    }

    public static destroyBannerAd() {
        if (this.mBannerAd) {
            this.mBannerAd.hide();
        }
    }
    
    //播放视频广告是需要把banner隐藏的，isShowBannerAd为播放完成之后是否需要显示bannerAd
    public static showVideo(callback) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            callback && callback(true);
            return;
        }
        this.hideBannerAd();
        if (!this.mVideoAd) {
            this.initVideoAds();
            console.log("this.mVideoAd:",this.mVideoAd,"视频没加载");
            let tipsMsg = '视频还没加载好，请稍后~';
            ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);
            callback && callback(false);
            return;
        }
        SoundMgr.getInstance().stopMusic();
        var self = this;
        this.mVideoAd.load()
            .then(() => self.mVideoAd.show())
            .catch(err => {
                callback && callback(false);
                let tipsMsg = '视频还没加载好，请稍后~';
                console.log("广告加载出错视频还没加载好");
                ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);

                self.mVideoAd.load()
                    .then(() => self.mVideoAd.show())
            })

        var thisCallback = function (res) {
            UIHelper.log(" ---------------------- res:" + JSON.stringify(res));
            SoundMgr.getInstance().playMusic();
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                callback && callback(true);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                callback && callback(false);
            }
            self.mVideoAd.offClose(thisCallback);
        };

        this.mVideoAd.onClose(thisCallback);
    }

    //请在登录成功之后调用，缓存一下广告
    public static initVideoAds() {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        let screenSize = Laya.Browser.window["wx"].getSystemInfoSync();
        if (screenSize.SDKVersion < '2.0.6') { //不满足显示那个授权的版本直接返回

            let tipsMsg = '当前微信版本不支持视频广告播放';
            ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);
            return;
        }
        UIHelper.log('===========初始化视频广告!');
        this.mVideoAd = Laya.Browser.window["wx"].createRewardedVideoAd({
            adUnitId: VIDEO_ID
        });
        console.log("初始化广告this.mVideoAd:",this.mVideoAd);
        var self = this;
        this.mVideoAd.onError(err => {
            UIHelper.log(' ========== 视频播放出错 onError')
            self.mVideoAd = null;
        })
    }
    //格子广告
    public static initGridAd()
    {
        let systemInfoSync = wx.getSystemInfoSync();
        //console.log("初始化格子广告!!!!微信版本",systemInfoSync.SDKVersion);
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        if (systemInfoSync.SDKVersion < '2.0.6') { //不满足显示广告的SDK版本
            let tipsMsg = '当前微信版本不支持视频广告播放';
            ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);
            return;
        }
        if (this.gridAd) {
            return;
        }
        var showWidth = systemInfoSync.screenWidth
        this.gridAd = Laya.Browser.window["wx"].createGridAd({
            adUnitId: 'adunit-b526163e93590d0b',
            adTheme: 'white',
            gridCount: 5,
            style: {
              left: 0,
              top: 0,
              width: showWidth/2,
              opacity: 0.8
            }
          });
        //console.log("格子广告初始化完成:",this.gridAd);
        this.gridAd.onLoad(() => {
            //console.log('Grid 广告加载成功')
            this.gridAd.show();
          })
          var self = this;
          this.gridAd.onResize(res => {
              let left = 0;
              let top =  0;
              self.mBannerAd.style.top = top;
              self.mBannerAd.style.left = left;
          });
    }
    // //推荐组件 
    // public static GamePortal() {
    //     // if (this.systemInfoSync.SDKVersion >= '2.7.5') {
    //     //     // let object ={adUnitId: 'PBgAAMm4IUsbISgQ'};
    //     //     // this.gamePortal = Laya.Browser.window["wx"].createGamePortal(object)
    //     // }
    // // 创建格子广告实例，提前初始化
    // let gridAd = Laya.Browser.window["wx"].createGridAd({
    //     adUnitId: 'adunit-b526163e93590d0b',
    //     adTheme: 'white',
    //     gridCount: 5,
    //     style: {
    //       left: 0,
    //       top: 0,
    //       width: 330,
    //       opacity: 0.8
    //     }
    //   })
    // }
    //显示格子广告
    public static showGridAd()
    {
        if(this.gridAd)
        {
            this.gridAd.show();
        }
    }
    // public static CreateGameIcon() {
    //     if (!WeChatAd.CanShowCreateGameIcon()) {
    //         return;
    //     }
    //     if (WeChatAd.s_SystemInfo == null) {
    //         return;
    //     }
    //     console.log("CreateGameIcon=======");
    //     // 在适合的场景显示推荐位 if (iconAd) { iconAd.load().then(() => { iconAd.show() }).catch((err) => { console.error(err) }) }
    //     WeChatAd.s_GameIconInterstitialLoaded = false;
    //     let iconAd = wx.createGameIcon(
    //         {
    //             adUnitId: 'PBgAAfog4YE7G7sw',
    //             count: 2,
    //             style: [],
    //         },
    //         {
    //         }
    //     );

    //     iconAd.onLoad(() => {
    //         console.log('CreateGameIcon 广告加载成功')
    //         WeChatAd.s_GameIcon = iconAd;
    //         WeChatAd.s_GameIconInterstitialLoaded = true;
    //     })
    //     iconAd.onResize(size => {
    //         iconAd.icons[0].appNameHidden = true;
    //         iconAd.icons[1].appNameHidden = true;
    //         iconAd.icons[0].left = 0;
    //         iconAd.icons[0].top = WeChatAd.SyncSystemInfo.screenHeight / 2 - 100;
    //         iconAd.icons[1].left = WeChatAd.SyncSystemInfo.screenWidth - 70;
    //         iconAd.icons[1].top = WeChatAd.SyncSystemInfo.screenHeight / 2 - 100;
    //     }
    //     );

    //     iconAd.onError(err => {
    //         WeChatAd.s_GameIconInterstitialLoaded = false;
    //         console.error("CreateGameIcon " + err.errMsg + " code=" + err.errCode);
    //     })

    // }
    //跳转小游戏
    public static turnOtherGame(appid: String, path: string, gameId: number) {
        //console.log("FrameworkHelper.isWechatGamePlatform:", FrameworkHelper.isWechatGamePlatform());
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        var obj: any = {
            appId: appid,
            path: '',
            extraData: {
                act: 'game',
                id: gameId,
            },
            envVersion: 'release',
            success(res) {
                // 打开成功
                //console.log("打开成功:",res);
            },
            fail(error)
            {
                //console.log("打开失败",error);
            }
        };
        console.log("wx:",wx);
        wx.navigateToMiniProgram(obj);
    }
}