/**
 * 
 */

import FrameworkHelper from "../Tool/FrameworkHelper";
import WxLoginHelper from "../Platform/Wechat/WxLoginHelper";
import qqPlay from "../Platform/QQ/QQPlay";
import HeadLinesPlay from "../Platform/HeadLines/HeadLinesPlay";
import QGame from "../Platform/QGame/QGamePlay";




export default class CommonMgr {


    // 微信，手q
    public static checkIsgetUserIsEmpower(callback) {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxLoginHelper.getUserIsEmpower(callback);
        }
        else if (FrameworkHelper.isShouQPlatform()) {
            qqPlay.getSetting(callback);
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            window['tt'].getSetting(callback);
        }
    }

    public static createUserInfoBT(width, height, top, callback) {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxLoginHelper.createUserInfoBT(width, height, top, callback);
        }
        else if (FrameworkHelper.isShouQPlatform()) {
            //console.log("手机qq登录!!!");
            qqPlay.creatorQQAuthorButton(width, height, top, callback);
        }
        else if(FrameworkHelper.isHeadLinsPlatform())
        {
            HeadLinesPlay.authorize(callback);
        }
    }

    public static destroyUserInfoBt() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxLoginHelper.destroyUserInfoBt();
        }
        else if(FrameworkHelper.isShouQPlatform()){
            qqPlay.destroyUserInfoBt();
        }
    }

    public static showUserInfoBt() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxLoginHelper.showUserInfoBt();
        }
        else if(FrameworkHelper.isShouQPlatform()){
            qqPlay.showUserInfoBt();
        }
    }

    public static hideUserInfoBt() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxLoginHelper.hideUserInfoBt();
        }
        else if(FrameworkHelper.isShouQPlatform())
        {
            qqPlay.hideUserInfoBt();
        }
    }

    public static getUserInfoBt() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxLoginHelper.getUserInfoBt();
        }
        else if(FrameworkHelper.isShouQPlatform())
        {
            qqPlay.getUserInfoBt();
        }
    }


}