
import UserInfoMgr from "../../Common/UserInfoMgr";

import CommonMgr from "../../Common/CommonMgr";
import AskTipsUI from "../../../Game/view/UI/AskTipsUI";
import ViewMgr, { ViewType } from "../../../Game/Module/ViewMgr";
const BANNER = '41flhrjlh8h3vp53sb';
const REWARDVIDEO = '1j2je24hnecck397rb';
const INSERTVIDEO = '9qq9771jmd2b27egjh';
export default class HeadLinesPlay {
  // private static userInfoButton; any = null;
  private static tapePath = null;
  private static tapeStartTime = 0;
  private static tapeMaxTime = 90;
  private static recorder: any = null;
  private static timeOut: any = null;
  //private static canPlayInsertVideo:boolean = true;
  //获取授权设置
  public static getSetting(callback) {
    //超时处理
    let timeOut = false;
    let timer = setTimeout(() => {
      if (timer == null)
        return;
      timeOut = true;
      this.call && callback(false);
    }, 1000);
    window['tt'].getSetting({
      success: function (res) {
        clearTimeout(timer);
        timer = null;
        if (res.authSetting['scope.userInfo'] === true) {
          callback && callback(true);
        }
        else {
          callback && callback(false);
        }
        console.log(``);
      },
      complete: function (res) {
        console.log("完成Window['tt'].login调用");
      },
      fail: function (res) {
        if (timeOut) {
          return;
        }
        clearTimeout(timer);
        timer = null;
        callback && callback(false);
        console.log(`login调用失败:`, res);
      },
    })
  }
  //打开授权设置 (在授权拒绝的情况下 唤起打开授权设置页面)
  public static noAuthorOpenSetting(callback: Function) {
    let self = this;
    window['tt'].openSetting({
      success: function (data) {
        self.getUserInfo(callback);
      }
    });
  }
  //授权
  public static authorize(callback) {
    //console.log("未授权,直接授权");
    window['tt'].authorize({
      scope: 'scope.userInfo',
      success: callback(true),
      fail: callback(false),
      complete: null,
    });
  }
  //获取用户信息
  public static getUserInfo(callback: Function) {
    let self = this;
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    window['tt'].getUserInfo({
      withCredentials: false,
      lang: "zh_CN",
      success: function (res) {
        // 可以将 res 发送给后台解码出 unionId
        var userInfo = res.userInfo
        UserInfoMgr.getInstance().setUserName(userInfo.nickName);
        UserInfoMgr.getInstance().setUserImgUrl(userInfo.avatarUrl);
        callback(JSON.parse(JSON.stringify(res)));
      },
      fail: function (res) {
        // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
        if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
          // 处理用户拒绝授权的情况
          self.noAuthorOpenSetting(callback);
        }
      }
    });
  }
  //登录
  public static headLineLogin(callback: Function) {
    let self = this;
    console.log("headLineLogin!!!!!");
    window['tt'].login({
      force: true,
      success: function (res) {
        var js_code = res.code;
        callback(js_code, null);
        console.log(`login调用成功${res.code} ${res.anonymousCode}`);
      },
      complete: function (res) {
        console.log("完成Window['tt'].login调用");
      },
      fail: function (res) {
        console.log(`login调用失败`);
        self.authorize(function (backMsg) {
          self.headLineLogin(callback);
        });
      },
    });
  }
  //录屏分享
  //初始化录屏功能 
  public static iniTape() {
    //录屏的保存路径
    this.tapePath = null;
    this.tapeStartTime = 0;
    this.tapeMaxTime = 9000;
    this.recorder = window['tt'].getGameRecorderManager();
  }
  //手动触发录屏
  public static onTapeButtonClick() {
    //开始后大于3秒才能关闭
    let nowTime = new Date().getTime();
    let tapeTime = nowTime - this.tapeStartTime;
    if (tapeTime < 3000) {
      console.log("录屏时间小于3秒");
    } else {
      this.stopTape();
    };
  }
  //录屏时间控制
  public static tapeTimeControl() {
    this.timeOut = setTimeout(() => {
      this.stopTape();
    }, this.tapeMaxTime);
    //超时处理 改成timeout
    // let callback = function () {
    //     timeCount++;
    //     //超过了最大时长或者录制状态为未开启
    //     if (timeCount >= this.tapeMaxTime) {
    //         this.unschedule(callback);
    //         timeCount = 0;
    //         this.stopTape();
    //     };
    // };
    //  Laya.stage.timerLoop(1,this,callback);
  }
  //开始游戏录屏
  public static startTape() {
    //记录一个时间戳
    this.tapeStartTime = new Date().getTime();
    if (window['tt'] != "undefined") {
      this.recorder.onStart(res => {
        console.log("录屏开始");
        this.tapeTimeControl();
      });
      this.recorder.start({
        duration: this.tapeMaxTime,
      });
    };
  }
  //结束游戏录屏
  public static stopTape() {

    if (this.timeOut != null) {
      clearTimeout(this.timeOut);
    }
    if (window['tt'] != "undefined") {
      this.recorder.onStop(res => {
        console.log(res.videoPath, "录屏结束");
        // do something;
        this.tapePath = res.videoPath;
        // //分享
        // this.tapeShare();
      });
      this.recorder.stop();
    };
  }
  //录屏分享
  public static tapeShare() {
    console.log("头条抖音视频分享tapeShare");
    if (window['tt'] != "undefined") {
      //获取分享导语
      window['tt'].shareAppMessage({
        channel: 'video',  //指定为视频分享
        title: '我枪法特准',
        extra: {
          videoPath: this.tapePath,//this.game_rules_js.tapePath,// 设置视频路径
          videoTopics: ["来啊快活啊", "把子弹全部射光"]
        },
        success: () => {
          //分享回调
          console.log('录屏分享成功');
          //分享奖励，仅一次
          this.tapeShareSucces();
        },
        fail: () => {
          console.log('录屏分享失败', this.tapePath);
          this.tapeShareFail();
        }
      });
    };
  }
  //录屏分享成功
  public static tapeShareSucces() {
    //do something
    console.log("分享成功!!!");
  }
  //录屏分享失败
  public static tapeShareFail() {
    //do something;
    console.log("分享失败!!!");
    let tipsMsg = "分享失败!"
    ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);
  }
  //广告
  static bannerAd = null;
  static rewardedVideoAd = null;
  static boxAd = null;
  static insertAd = null;
  static systemInfo = null;
  public static initAdvertisement() {
    this.systemInfo = window['tt'].getSystemInfoSync();
    //初始化广告
    this.initrewardedVideoAdvertisement();
    this.initBannerAdvertisement();
    this.initInsertAdvertisement();
  }
  //banner 广告
  public static initBannerAdvertisement() {
    this.bannerAd = window['tt'].createBannerAd({
      adUnitId: BANNER,
      adIntervals:30,
      style: {
        left: 0,
        top: 0,
        width: this.systemInfo.windowWidth
      }
    });
    this.bannerAd.onResize((size) => {
      // 底部居中显示
      console.log("重新设置窗口大小");
      this.bannerAd.style.top = this.systemInfo.windowHeight - size.height;
      this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2;
      console.log("bannerAd.onResize:",this.systemInfo,size);
      console.log(" this.bannerAd.style.left",this.bannerAd.style.left,this.bannerAd.style.top);
      // this.bannerAd
      //   .show()
      //   .then(() => {
      //     console.log("show ok");
      //   })
      //   .catch(res => {
      //     console.log("show error", res);
      //   });
    });
    this.bannerAd.onLoad(() => {
      console.log("banner 广告加载成功");
    });
    this.bannerAd.onError(err => {
      console.log(err);
    });
  }
  public static showBannerAdvertisement() {
    if (this.bannerAd) {
      console.log("显示banner广告:", this.bannerAd);
      this.bannerAd.show();
      console.log("宽度高度位置宽高:", this.systemInfo.screenWidth, this.systemInfo.screenHeight, this.bannerAd.style.left, this.bannerAd.style.top);

    }
  }
  public static hideBannerAdvertisement() {
    if (this.bannerAd) {
      this.bannerAd.hide();
    }
  }
  //激励视频广告
  public static initrewardedVideoAdvertisement() {
    //创建拉取广告
    this.rewardedVideoAd = window['tt'].createRewardedVideoAd({ adUnitId: REWARDVIDEO });
    this.rewardedVideoAd.onError(err => {
      console.log(err);
    });
  }
  //显示激励视频广告
  public static showRewardedVideoAdvertisement(callback) {
    if (this.rewardedVideoAd != null) {
      this.rewardedVideoAd.onClose(function (res) {
        console.log("关闭播放的视频广告:", res);
        if (res.isEnded) {
          callback && callback(true);
        }
        else {
          callback && callback(false);
        }
      })
      this.rewardedVideoAd.show().catch(err => {
        this.rewardedVideoAd.load().then(() => this.rewardedVideoAd.show()
        );
      });
    }
    else {
      // this.rewardedVideoAd = Laya.Browser.window["qq"].createRewardedVideoAd({ adUnitId: "a6e1095ef456f0853a0c7d8b63c40e68" });
      // this.rewardedVideoAd.show().catch(err => {
      //   this.rewardedVideoAd.load().then(() => this.rewardedVideoAd.show());
      // });
    }
  }
  //插屏广告
  public static initInsertAdvertisement() {
    console.log("创建插屏广告!!!");
    if(this.systemInfo.platform =="android"&&this.systemInfo.appName=="Toutiao")
    {
      this.insertAd = window['tt'].createInterstitialAd({
        adUnitId: INSERTVIDEO
      });

      this.insertAd.onLoad(()=>
      {
        console.log("视频广告加载:",this.insertAd);
      })
      this.insertAd.load().catch((err) => {
        console.error('load', err);
        // this.canPlayInsertVideo = false;
      });
      this.insertAd.onError(()=>
      {
        // let tipsMsg = '视频未加载好，请稍后~';
        // //console.log("插屏广告信息this.insertAd:",this.insertAd);
        // ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);
      })
      
    }
  }
  //显示插屏广告
  public static showInsertAdvertisement() {
    if (this.insertAd != null) {
      //console.log("显示插屏广告");
      try{
        //console.log("this.insertAd.errCode:",this.insertAd.errCode);
        this.insertAd.show();
      }
      catch(error){
        console.log("error:",error);
      }
    }
    else {
      this.insertAd = window['tt'].createInterstitialAd({
        adUnitId: INSERTVIDEO
      });
      this.insertAd.load().catch((err) => {
        console.error('load', err)
      })
      this.insertAd.show();
    }
  }
}