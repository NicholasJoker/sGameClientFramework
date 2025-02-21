import UIHelper from "../../Game/Module/UIHelper";
import UserInfoMgr from "../Common/UserInfoMgr";
import LocalDataMgr from "../../Game/Module/LocalDataMgr";
import FrameworkHelper from "../Tool/FrameworkHelper";
import HttpUtils from "../Tool/HttpUtils";
import NotificationMgr from "./NotificationMgr";
import { GameDefine } from "../../Game/Module/GameEnum";
import UserDataMgr from "../../Game/Module/UserDataMgr";
import QiandaoMgr from "../../Game/Module/QiandaoMgr";
import ViewMgr, { ViewType } from "../../Game/Module/ViewMgr";
import GuideMgr from "../../Game/Module/GuideMgr";
import ShareVideoMgr from "../../Game/Module/ShareVideoMgr";
import WxLoginHelper from "../Platform/Wechat/WxLoginHelper";
import ThirdGameLinkManager from "../../Game/Module/ThirdGameLinkManager";
import qqPlay from "../Platform/QQ/QQPlay";
import HeadLinesPlay from "../Platform/HeadLines/HeadLinesPlay";
import QGame from "../Platform/QGame/QGamePlay";
import VIVOPlay from "../Platform/VIVO/VivoPlay";





export default class LoginMgr {


    private static mIsSuccessLogin = false;
    private static mIsThirdLogin = false;
    private static mOfflineReward: number = 0;

    public static isLoginSuccess() {
        return this.mIsSuccessLogin;
    }

    public static setIsLoginSuccess(isSuccess) {
        this.mIsSuccessLogin = isSuccess;
    }

    public static setIsThirdLogin(isLogin) {
        this.mIsThirdLogin = isLogin;
    }

    public static getIsThirdLogin() {
        return this.mIsThirdLogin;
    }

    public static setOfflineReward(rewardNum: number) {
        this.mOfflineReward = rewardNum;
    }

    public static getOfflineReward(): number {
        return this.mOfflineReward;
    }




    // 微信
    public static doWechatLogin() {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        var self = this;
        WxLoginHelper.startLoginWX(function (jsCode) {
            console.log("jsCode");
            self.getWechatOpenId(jsCode, function (openId) {
                self.thirdLoginServer();
            });
        });
    }
    //qq 登录
    public static doQQLogin() {
        if (!FrameworkHelper.isShouQPlatform()) {
            return;
        }
        let self = this;
        qqPlay.qqLogin(function (jsCode) {
            self.getQQAuthorizeId(jsCode, (openId) => {
                //console.log("通过qq登录的 发送给服务器");
                self.thirdLoginServer();
            })
        });
    }
    //头条抖音登录
    public static doHeadLineLogin() {
        //console.log("头条抖音登录!!!");
        if (!FrameworkHelper.isHeadLinsPlatform()) {
            return;
        }
        let self = this;
        HeadLinesPlay.headLineLogin(function (jsCode) {
            self.getHeadTAuthorizeId(jsCode, (openId) => {
                //console.log("通过头条登录的,发送给服务器");
                self.thirdLoginServer();
            })
        })
    }
    public static doVivoGameLogin()
    {
        if (!FrameworkHelper.isVivoPlatform()) {
            return;
        }
        let self = this;
        VIVOPlay.qGameLogin(function (jsCode) {
            self.getThridGameOpenId(jsCode, (openID) => {
                //console.log("通过vivo发送给服务器");
                self.thirdLoginServer();
            })
        })
    }
    //快游戏
    public static doQGameLogin() {
        if (!FrameworkHelper.isOppoPlatform()) {
            return;
        }
        let self = this;
        QGame.qGameLogin(function (jsCode) {
            self.getThridGameOpenId(jsCode, (openID) => {
                //console.log("通过oppo快游戏,发送给服务器");
                self.thirdLoginServer();
            })
        })
    }
    public static getPlatformType() {
        // if (FrameworkHelper.isOppoPlatform()) { //oppo
        //     return 2;
        // }
        // else if (FrameworkHelper.isBaiduPlatform()) {//百度
        //     return 3;
        // }
        // else if (FrameworkHelper.isHeadLinsPlatform()) {//今日头条
        //     return 4;
        // }
        // else if (FrameworkHelper.isVivoPlatform()) {//vivo
        //     return 5;
        // }
        // else if (FrameworkHelper.isShouQPlatform()) {//手Q
        //     return 6;
        // }
        // else if (FrameworkHelper.isUCPlatform()) {//UC
        //     return 7;
        // }
        // else if (FrameworkHelper.isQuTouTiaoPlatform()) {//趣头条
        //     return 8;
        // }
        // else if (FrameworkHelper.isTikTokPlatform()) {//趣头条
        //     return 9;
        // }
        // return 1;//微信
        if (FrameworkHelper.isShouQPlatform()) { //oppo
            return 2;
        }
        else if (FrameworkHelper.isOppoPlatform()) { //oppo
            return 3;
        }

        // else if (FrameworkHelper.isBaiduPlatform()) {//百度
        //     return 3;
        // }
        else if (FrameworkHelper.isHeadLinsPlatform()) {//今日头条
            return 5;
        }
        else if (FrameworkHelper.isVivoPlatform()) {//vivo
            return 4;
        }
        else if (FrameworkHelper.isShouQPlatform()) {//手Q
            return 6;
        }
        else if (FrameworkHelper.isUCPlatform()) {//UC
            return 7;
        }
        else if (FrameworkHelper.isQuTouTiaoPlatform()) {//趣头条
            return 8;
        }
        // else if (FrameworkHelper.isTikTokPlatform()) {//趣头条
        //     return 9;
        // }
        return 1;//微信
    }



    public static getWechatOpenId(jsCode, callback) {
        var url = '/api/user/weChatAuthorize';
        let loginData: any = {};
        loginData.code = jsCode;
        let self = this;
        HttpUtils.postRequest(url, loginData, function (data) {
            var openId = data.openid;
            UserInfoMgr.getInstance().setOpenId(openId);
            callback && callback(openId);
        }, function (err) {
            ViewMgr.getInstance().closeView(ViewType.LoadingView);
            NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_FAIL);
        });
    }

    public static getHeadTAuthorizeId(jsCode, callback) {
        var url = '/api/user/headTAuthorize';
        let loginData: any = {};
        loginData.code = jsCode;
        let self = this;
        //console.log("getThridGameOpenId,URL,data:",url);
        HttpUtils.postRequest(url, loginData, function (data) {
            var openId = data.openid;
            UserInfoMgr.getInstance().setOpenId(openId);
            callback && callback(openId);
        }, function (err) {
            ViewMgr.getInstance().closeView(ViewType.LoadingView);
            NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_FAIL);
        });
    }


    public static getQQAuthorizeId(jsCode, callback) {
        var url = '/api/user/qqAuthorize';
        let loginData: any = {};
        loginData.code = jsCode;
        let self = this;
        //console.log("getThridGameOpenId,URL,data:",url);
        HttpUtils.postRequest(url, loginData, function (data) {
            var openId = data.openid;
            UserInfoMgr.getInstance().setOpenId(openId);
            callback && callback(openId);
        }, function (err) {
            ViewMgr.getInstance().closeView(ViewType.LoadingView);
            NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_FAIL);
        });
    }
    public static getThridGameOpenId(jsCode, callback) {
        var url = '/api/user/weChatAuthorize';
        let loginData: any = {};
        loginData.code = jsCode;
        let self = this;
        //console.log("getThridGameOpenId,URL,data:",url);
        HttpUtils.postRequest(url, loginData, function (data) {
            var openId = data.openid;
            UserInfoMgr.getInstance().setOpenId(openId);
            callback && callback(openId);
        }, function (err) {
            ViewMgr.getInstance().closeView(ViewType.LoadingView);
            NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_FAIL);
        });
    }

    public static thirdLoginServer() {
        var url = '/api/user/channelLogin';
        let loginData: any = {};
        loginData.platformType = this.getPlatformType();
        loginData.headImg = UserInfoMgr.getInstance().getUserImgUrl();
        loginData.username = UserInfoMgr.getInstance().getUserName();
        let self = this;
        HttpUtils.postRequest(url, loginData, function (data) {
            // AldMgr.aldSendOpenid();
            LocalDataMgr.setIsThirdLogined(true);
            self.setIsThirdLogin(true);
            self.doLoginSuccess(data);
        }, function (err) {
            NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_FAIL);
        });
    }


    public static pullYoukeLogin() {
        var url = '/api/user/login';
        let loginData: any = {};
        loginData.platformType = this.getPlatformType();
        let self = this;
        HttpUtils.postRequest(url, loginData, function (data) {
            //console.error("游客登录模式下获取到的游客ID ",HttpUtils.getYoukeOpenId());
            HttpUtils.getYoukeOpenId();
            //LocalDataMgr.setTourisOpenId(HttpUtils.getYoukeOpenId());
            self.doLoginSuccess(data);
        }, function (err) {
            NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_FAIL);
        });
    }



    private static doLoginSuccess(loginData) {
        UIHelper.log(" doLoginSuccess");
        this.setIsLoginSuccess(true);
        UserDataMgr.getInstance().setUserPackInfo(loginData.userPack);
        UserInfoMgr.getInstance().setUserInfo(loginData.user);
        QiandaoMgr.getInstance().setSevenGiftData(loginData.loginGiftPack);
        //console.log("登录服务器设置引导数据:",loginData.guide);
        GuideMgr.getInstance().setGuideData(loginData.guide);
        ShareVideoMgr.getInstance().setShareVideoData(loginData.shareVideoCfg);
        //登录成功马上去第三方获取数据
        if (FrameworkHelper.isWechatGamePlatform()) {
            ThirdGameLinkManager.getInstance().requestGetData();
        }
        if (loginData.offlineRevenue > 0) {
            this.setOfflineReward(loginData.offlineRevenue);
        }
        NotificationMgr.emit(GameDefine.NOTIFICATION_LOGIN_SUCCESS);
    }
    public getThirdGameList() {

    }
}
