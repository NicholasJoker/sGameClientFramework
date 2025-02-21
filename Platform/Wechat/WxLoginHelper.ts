/**
 * 
 */

import FrameworkHelper from "../../Tool/FrameworkHelper";
import UIHelper from "../../../Game/Module/UIHelper";
import UserInfoMgr from "../../Common/UserInfoMgr";



export default class WxLoginHelper {

    private static mUserInfoButton: any = null;
    private static mIsGetUserInfo: boolean = false //是否已经获得用户授权



    //检查用户登录是否有效
    public static checkIsLogin(callback) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            callback && callback(true);
            return;
        }
        Laya.Browser.window["wx"].checkSession({
            success: callback(true),
            fail: callback(false),
            complete: null,
        });
    }

    //登录
    public static startLoginWX(callback) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            callback && callback(true);
            return;
        }
        var self = this;
        Laya.Browser.window["wx"].login({
            success: function (res) {
                console.log(' 微信授权成功_res:', JSON.stringify(res))
                self.getUserInfo(function (userRes) {
                    // UIHelper.log(' 拿到用户信息成功:', JSON.stringify(userRes))
                    var js_code = res.code;
                    callback(js_code, userRes);
                });
            },
            fail: function () {
                console.log(' in startLoginWX success')
                self.getAuthorize(function (backMsg) {
                    self.startLoginWX(callback);
                });
            },
        });
    }
    public static getUserIsEmpower(callback) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            callback && callback(true);
            return;
        }
        let screenSize = wx.getSystemInfoSync();
        if (screenSize.SDKVersion < '2.0.6') { //不满足显示那个授权的版本直接返回
            callback(true);
            return;
        }
        var time = false;//是否超时
        var timer = setTimeout(function () {//做请求超时操作
            if (timer == null) {
                return;
            }
            time = true;
            callback && callback(false);
        }, 1000);

        Laya.Browser.window["wx"].getSetting({
            success: function (res) {
                if (time)//请求已经超时，忽略中止请求
                {
                    return;
                }
                clearTimeout(timer);//取消等待的超时
                timer = null;
                var authSetting = res.authSetting
                if (authSetting['scope.userInfo'] === true) {
                    // 用户已授权，可以直接调用相关 API
                    callback && callback(true);
                } else if (authSetting['scope.userInfo'] === false) {
                    // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                    callback && callback(false);
                } else {
                    // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                    callback && callback(false);
                }
            },
            fail: function () {
                if (time) {//请求已经超时，忽略中止请求
                    return;
                }
                clearTimeout(timer);//取消等待的超时
                timer = null;
                callback && callback(false);
            },
        });
    }


    public static createUserInfoBT(width, height, top, callback) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            callback && callback(true);
            return;
        }
        let sysInfo = Laya.Browser.window["wx"].getSystemInfoSync();
        //获取微信界面大小
        let sWidth = sysInfo.screenWidth;
        let sHeight = sysInfo.screenHeight;
        var scale = sHeight / 1136;

        var btWidth = width * scale;
        var btHeight = height * scale;
        var btTop = top * scale;
        var btLeft = (sWidth - btWidth) / 2;

        this.destroyUserInfoBt();
        this.mUserInfoButton = Laya.Browser.window["wx"].createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: btLeft,
                top: btTop,
                width: btWidth,
                height: btHeight,
                // 
                // backgroundColor: '#52A065',
                // color: '#FFFFFF',
                // textAlign: 'center',
                // fontSize: 16,
                // borderRadius: 4
            }
        });
        var self = this;
        this.mUserInfoButton.onTap((res) => {
            if (res.rawData) {
                if (self.mIsGetUserInfo) {
                    return;
                }
                self.mIsGetUserInfo = true;
                self.destroyUserInfoBt();
                callback && callback(true);
            }
            else {
                callback && callback(false);
            }
        })
    }

    public static destroyUserInfoBt() {
        if (this.mUserInfoButton) {
            this.mUserInfoButton.destroy();
        }
        this.mUserInfoButton = null;
    }

    public static showUserInfoBt() {
        if (this.mUserInfoButton) {
            this.mUserInfoButton.show();
        }
    }

    public static hideUserInfoBt() {
        if (this.mUserInfoButton) {
            this.mUserInfoButton.hide();
        }
    }

    public static getUserInfoBt() {
        return this.mUserInfoButton;
    }


    //用户授权
    public static getAuthorize(back) {
        let self = this;
        Laya.Browser.window["wx"].authorize({
            scope: 'scope.record',
            success: back(true),
            fail: back(false),
            complete: null,
        });
    }

    //用户拒绝授权之后
    public static noAuthorizeOpenSetting(callback) {
        var self = this;
        Laya.Browser.window["wx"].openSetting({
            success: function (data) {
                self.getUserInfo(callback);
            },
            fail: function () {
                console.info("设置失败返回数据");
            },
        });
    }

    //获取登录用户的信息
    public static getUserInfo(callback) {
        let self = this;
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        Laya.Browser.window["wx"].getUserInfo({
            withCredentials: false,
            lang: "zh_CN",
            success: function (res) {
                // 可以将 res 发送给后台解码出 unionId
                var userInfo = res.userInfo
                // var nickName = userInfo.nickName
                // var avatarUrl = userInfo.avatarUrl
                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country


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




}