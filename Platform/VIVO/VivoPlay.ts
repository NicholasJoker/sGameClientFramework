//VIVO小游戏
const BANNERAD = "";
const REWARDVIDEOAD = "";
const NATIVEAD = "";

export default class VIVOPlay {
    private static bannerAdvertisement = null;
    private static rewardVideoAdvertisement = null;
    private static nativeAdvertisement = null;
    public  static systemInfo = null;
    private static adId = "";

    // public static setLoadingProgress(progress:number)
    // {
    //     Laya.Browser.window['qg'].setLoadingProgress({
    //         progress: progress    
    //     });
    // }
    public static qGameLogin(callback: Function) {
        Laya.Browser.window['qg'].login({
            success: function (res) {
                var data = JSON.stringify(res.data)
                callback(res.data.token, null);
                //console.log(data);
            },
            fail: function (res) {
                // errCode、errMsg
                //console.log(JSON.stringify(res))
            },
            complite: function () {

            }
        })
    }
    public static initAdvertisement() {
        this.systemInfo = Laya.Browser.window['qg'].getSystemInfoSync();
        //banner广告初始化
        this.bannerAdvertisement = Laya.Browser.window['qg'].createBannerAd({
            adUnitId: BANNERAD,
            style: {
                top: 300,
                left: 0,
                width: 900,
                height: 300
            }
        });
        this.bannerAdvertisement.style = {
            top: 300,
            left: 0,
            width: 900,
            height: 300
        }
        this.bannerAdvertisement.onResize(function (obj) {
            //console.log('banner 宽度：' + obj.width + ', banner 高度：' + obj.height)
        });
        this.bannerAdvertisement.onLoad(function () {
            //console.log('banner 广告加载成功')
        })
        this.bannerAdvertisement.onError(function (err) {
            //console.log(err);
        })
        //激励广告初始化
        this.rewardVideoAdvertisement = Laya.Browser.window['qg'].createRewardedVideoAd({
            adUnitId: REWARDVIDEOAD,
        })
        this.rewardVideoAdvertisement.load();
        this.rewardVideoAdvertisement.onLoad(function () {
            console.log('激励视频加载成功')
        })
        this.nativeAdvertisement = Laya.Browser.window['qg'].createNativeAd({
            adUnitId: NATIVEAD,
          })
        this.nativeAdvertisement.load();
        let self = this;
        this.nativeAdvertisement.onLoad(function(res) {
            self.adId = res.adId;
            //console.log('原生广告加载', res.adList)
          })
        //曝光
        // this.nativeAdvertisement.reportAdShow({
        //     adId: this.adId
        //   })
        // //有效点击
        // this.nativeAdvertisement.reportAdClick({
        //     adId: this.adId
        //   })
        this.nativeAdvertisement.onError(function(err) {
            //console.log(err)
          })

    }
    public static showBannerAdvertisement() {
        if (this.bannerAdvertisement != null) {
            try {
                this.bannerAdvertisement.show();
            }
            catch (e) {
                //console.log("error:", e);
                this.bannerAdvertisement.onLoad(function () {
                    //console.log('banner 广告加载成功')
                })
            }
        }
    }
    public static hideBannerAdvertisement()
    {
        if(this.bannerAdvertisement!=null)
        {
            this.bannerAdvertisement.hide();
        }
    }
    public static showRewardVideoAdvertisement(callback: Function) {
        if (this.rewardVideoAdvertisement != null) {
            this.rewardVideoAdvertisement.onClose(function (res) {
                if (res.isEnded) {
                    //console.log('激励视频广告完成，发放奖励')
                    callback&&callback(true);
                } else {
                    callback&&callback(false);
                    //console.log('激励视频广告取消关闭，不发放奖励')
                }
            })
            this.rewardVideoAdvertisement.show().catch(error => {
                this.rewardVideoAdvertisement.load().then(() => this.rewardVideoAdvertisement.show());
            })
        }
    }
    // 原生广告
    public static showNativeVideoAdvertisement()
    {
        if(this.nativeAdvertisement!=null)
        {
        this.nativeAdvertisement.reportAdShow({
            adId: this.adId
          })
        }
    }
}