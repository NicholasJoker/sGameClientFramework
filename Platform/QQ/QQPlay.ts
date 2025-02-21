import UserInfoMgr from "../../Common/UserInfoMgr";
import FrameworkHelper from "../../Tool/FrameworkHelper";

export default class qqPlay {
  private static userInfoButton; any = null;
  private static mIsGetUserInfo: boolean = false //是否已经获得用户授权
  //授权
  public static authorize(callback) {
    //console.log("未授权,直接授权");
    Laya.Browser.window["qq"].authorize({
      scope: 'scope.userInfo',
      success: callback(true),
      fail: callback(false),
      complete: null,
    });
  }
  //查看授权设置
  public static getSetting(callback) {
    let time = false;
    let timer = setTimeout(() => {//做请求超时操作
      if (timer == null) {
        return;
      }
      time = true;
      callback && callback(false);
    }, 1000);
    Laya.Browser.window["qq"].getSetting({
      success: function (res) {
        clearTimeout(timer);
        timer = null;
        let authSetting = res.authSetting;
        if (authSetting['scope.userInfo'] === true) {
          callback && callback(true);
        }
        else {
          callback && callback(false);
        }
      },
      fail: function () {
        if (time) {
          return;
        }
        clearTimeout(timer);
        timer = null;
        callback && callback(false);
      }
    })
  }
  // 获取用户信息
  public static getUserInfo(callback) {
    let self = this;
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    Laya.Browser.window["qq"].getUserInfo({
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
          self.noAuthorizeOpenSetting(callback);
        }
      }
    });
  }
  //用户拒绝授权之后
  public static noAuthorizeOpenSetting(callback) {
    var self = this;
    Laya.Browser.window["qq"].openSetting({
      success: function (data) {
        self.getUserInfo(callback);
      },
      fail: function () {
        console.info("设置失败返回数据");
      },
    });
  }
  //登录
  public static qqLogin(callback: Function) {
    let self = this;
    Laya.Browser.window["qq"].login({
      success: function (res) {
        var js_code = res.code;
        callback(js_code, null);
        console.log('拿到的登录凭证,开始注册分享监听:', JSON.stringify(res));
        //注册展示按钮   同时注册一下右上角的分享监听
        qqPlay.showShareMenu();
        Laya.Browser.window["qq"].onShareAppMessage(() => ({
          title: '我枪法特准,不信来试试',
          imageUrl: 'https://mmocgame.qpic.cn/wechatgame/JpDwoGfyZ06nLjuj60ZURJ0vZJkavK2PfA07cjr0qhaUzSMs1sMUicRe5ZgnWyI83/0',// 图片 URL
        }));
      },
      fail: function () {
        //console.log(' in QQLoginWX success')
        self.authorize(function (backMsg) {
          self.qqLogin(callback);
        });
      },
    })
  }
  //授权页面相关
  public static creatorQQAuthorButton(width, height, top, callback) {

    //console.log("创建qq用户授权的按钮");
    //宽高位置设置适配
      let res =Laya.Browser.window["qq"].getSystemInfoSync();
        //console.log("sysInfo:",sysInfo);
        //获取QQ界面大小
        let sWidth = res.screenWidth;
        let sHeight = res.screenHeight;
        var scale = sHeight / 1136;

        var btWidth = width * scale;
        var btHeight = height * scale;
        var btTop = top * scale;
        var btLeft = (sWidth - btWidth) / 2;
        qqPlay.destroyUserInfoBt();
        // let self = this;
        this.userInfoButton = Laya.Browser.window["qq"].createUserInfoButton({
          type: 'text',
          text: '',
          style: {
            left: btLeft,
            top: btTop,
            width: btWidth,
            height: btHeight,
            // lineHeight: 40,
            // backgroundColor: '#ff0000',
            // color: '#ffffff',
            // textAlign: 'center',
            // fontSize: 16,
            // borderRadius: 4
          }
        });
        
        this.userInfoButton.onTap((res) => {
          console.log("qq授权的回调:", res);
          if (res.userInfo != null) {
            //self.destroyUserInfoBt();
            if (this.mIsGetUserInfo) {
              return;
          }
          this.mIsGetUserInfo = true;
          callback && callback(true);
          this.destroyUserInfoBt();
          }
          else {
            callback && callback(false);
          }
        })

    // let sysInfo = Laya.Browser.window["qq"].getSystemInfo({
    //   success(res) {

    //   }
    // })
  }
  public static destroyUserInfoBt() {
    if (this.userInfoButton != null) {
      console.log("销毁删除授权按钮!!!");
      this.userInfoButton.destroy();
    }
    this.userInfoButton = null;
  }

  public static showUserInfoBt() {
    if (this.userInfoButton) {
      this.userInfoButton.show();
    }
  }

  public static hideUserInfoBt() {
    if (this.userInfoButton) {
      this.userInfoButton.hide();
    }
  }

  public static getUserInfoBt() {
    return this.userInfoButton;
  }
  public static exitMiniProgram() {
    Laya.Browser.window["qq"].exitMiniProgram({
      success: function (res) {
      },
      fail: function () {

      },
      complete: function () {

      }
    });
  }
  //左上角的分享展示内容
  public static showShareMenu() {
    //console.log("展示QQ微信 等个分享");
    Laya.Browser.window["qq"].showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'],
      withShareTicket: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function () { },
    });
  }
  //领取奖励调用的一般分享接口 只分享到QQ群或者联系人
  public static shareAppMessage(shareType: number = 1) {
    var obj: any = {};
    var query: any = {};
    query.type = 1;
    query.userId = UserInfoMgr.getInstance().getUserId();

    obj.title = "我枪法特准";
    obj.imageUrl = 'https://mmocgame.qpic.cn/wechatgame/JpDwoGfyZ06nLjuj60ZURJ0vZJkavK2PfA07cjr0qhaUzSMs1sMUicRe5ZgnWyI83/0';
    obj.query = {};
    obj.query = FrameworkHelper.getParamsMsgForObj(query);
    obj.success = function () { console.log("分享到QQ成功") };
    obj.fail = function () { console.log("分享到QQ失败") };
    obj.complete = function () { console.log("分享到QQ完成") };
    //console.log("调用分享接口");
    Laya.Browser.window["qq"].shareAppMessage(obj);
  }
  //注册左上角分享的监听
  public static registerOnShareAppMessage() {
    console.log("registerOnShareAppMessage");

  }
  // BANNER_ID = '6afa15752eeef63a54fd7af8ebe4d2e1';
  // VIDEO_ID = 'a6e1095ef456f0853a0c7d8b63c40e68';
  // Box = '0454f8f46fd713060fabbdaece2e54fa';
  // INSERT_Ad = 'd2125a5ebda0b05b4fe185c516426dfe';
  static bannerAd = null;
  static rewardedVideoAd = null;
  static boxAd = null;
  static insertAd = null;
  static systemInfo = null;
  //广告
  public static initAdvertisement() {
    this.systemInfo = Laya.Browser.window["qq"].getSystemInfoSync();
    //初始化广告
    this.initrewardedVideoAdvertisement();
    this.initBannerAdvertisement();
    this.initBoxAdvertisement();
    this.initInsertAdvertisement();
  }
  //banner 广告
  public static initBannerAdvertisement() {

    this.bannerAd = Laya.Browser.window["qq"].createBannerAd({
      adUnitId: '6afa15752eeef63a54fd7af8ebe4d2e1',
      style: {
        left: 0,
        top: 0,
        width: this.systemInfo.screenWidth
      }
    });
    this.bannerAd.onResize(size => {
      // 底部居中显示
      this.bannerAd.style.top =  this.systemInfo.screenHeight - size.height;
      this.bannerAd.style.left = (this.systemInfo.screenWidth - size.width) / 2;
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
      console.log("显示banner广告:",this.bannerAd);
      this.bannerAd.show();
      console.log("宽度高度位置宽高:",this.systemInfo.screenWidth,this.systemInfo.screenHeight,this.bannerAd.style.left,this.bannerAd.style.top);

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
    this.rewardedVideoAd = Laya.Browser.window["qq"].createRewardedVideoAd({ adUnitId: "a6e1095ef456f0853a0c7d8b63c40e68" });
    this.rewardedVideoAd.onError(err => {
      console.log(err);
    });
  }
  //显示激励视频广告
  public static showRewardedVideoAdvertisement(callback) {
    if (this.rewardedVideoAd != null) {
      this.rewardedVideoAd.onClose(function (res) {
        console.log("关闭播放的视频广告:", res);
        if(res.isEnded){
          callback&&callback(true);
        }
        else{
          callback&&callback(false);
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
  //盒子广告
  public static initBoxAdvertisement() {
    this.boxAd = Laya.Browser.window["qq"].createAppBox({
      adUnitId: '0454f8f46fd713060fabbdaece2e54fa'
    })
  }
  // 显示盒子广告
  public static loadBoxAdvertisement() {
    if (this.boxAd != null) {
      this.boxAd.load().then(() => {
        this.boxAd.show()
      })
    }
    else {
      this.boxAd = Laya.Browser.window["qq"].createAppBox({
        adUnitId: '0454f8f46fd713060fabbdaece2e54fa'
      });
      this.boxAd.load().then(() => {
        this.boxAd.show()
      })
    }
  }
  // public static hideBoxAdvertisement(){

  // }
  //插屏广告
  public static initInsertAdvertisement() {
    this.insertAd = Laya.Browser.window["qq"].createInterstitialAd({
      adUnitId: 'd2125a5ebda0b05b4fe185c516426dfe'
    });
    this.insertAd.load().catch((err) => {
      console.error('load', err)
    })
  }
  //显示插屏广告
  public static showInsertAdvertisement() {
    if (this.insertAd != null) {
      console.log("显示插屏广告");
      this.insertAd.show();
    }
    else {
      this.insertAd = Laya.Browser.window["qq"].createInterstitialAd({
        adUnitId: 'd2125a5ebda0b05b4fe185c516426dfe'
      });
      this.insertAd.load().catch((err) => {
        console.error('load', err)
      })
      this.insertAd.show();
    }
  }
}