/**
 * 
 */

import FrameworkHelper from "../Tool/FrameworkHelper";
import UIHelper from "../../Game/Module/UIHelper";
import { GameDefine, ShareType } from "../../Game/Module/GameEnum";
import WxApiHelper from "../Platform/Wechat/WxApiHelper";
import UserInfoMgr from "./UserInfoMgr";
import qqPlay from "../Platform/QQ/QQPlay";






export default class ShareHelper {

    private static _instance: ShareHelper = null;

    private mShareQuery: any = null;
    private mShareInfoArray: Array<any> = [];



    public static getInstance(): ShareHelper {
        if (this._instance === null) {
            this._instance = new ShareHelper();
        }
        return this._instance;
    }


    public setShareInfoAarry(infoArray) {
        if (infoArray) {
            this.mShareInfoArray = infoArray;
        }
    }

    public setShareQuery(shareQuery) {
        if (shareQuery) {
            UIHelper.log(' setShareQuery: ', JSON.stringify(shareQuery))
            this.mShareQuery = shareQuery;
            if (shareQuery.launchAppId) {
                // WxApiHelper.setLaunchAppId(shareQuery.launchAppId);
            }
        }
        else {
            this.mShareQuery = shareQuery;
        }
    }

    public getShareQuery() {
        return this.mShareQuery;
    }

    /**
     * 处理从分享进游戏后要做的逻辑
     * 
     * @param {*} isOnShow 是否是从后台回游戏
     */
    doShareQueryLogic(isOnShow) {


    }






    /******************* static *******************/

    public static showShareMenu() {
        if (FrameworkHelper.isWechatGamePlatform()) {
            WxApiHelper.showShareMenu();
        }
    }


    //分享   shareType：四种不同形式的分享 ， shareImgUrl：分享图片的地址 ， callback： 成功与否的回调
    //shareQuery 查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
    public static startShare(shareTitle: string, imgUrl: string, shareQuery: any, callback: Function, aldDes: string) {
        shareTitle = shareTitle || '我枪法特准';
        imgUrl = imgUrl || null // cc.url.raw('resources/Texture/share_icon_1.png');
        callback = callback || null;
        if (!shareQuery) {
            shareQuery = {};
        }
        if (!FrameworkHelper.isHaveKey(shareQuery, 'userId')) {
            shareQuery.userId = UserInfoMgr.getInstance().getUserId();
        }
        if (!FrameworkHelper.isHaveKey(shareQuery, 'type')) {
            shareQuery.type = ShareType.GENERAL;
        }
        var shareQueryMsg = FrameworkHelper.getParamsMsgForObj(shareQuery);
        UIHelper.log(' shareQueryMsg: ' + shareQueryMsg)
        if (FrameworkHelper.isWechatGamePlatform()) {//微信分享
            aldDes = aldDes || null;
            WxApiHelper.shareWX(shareTitle, imgUrl, shareQueryMsg, callback, aldDes);
        }
        //qq 分享
        else if(FrameworkHelper.isShouQPlatform())
        {
            //console.log("是QQ平台的使用QQ分享 shareAppMessage!!!");
            qqPlay.shareAppMessage();
        }
        else {
            callback && callback(true);
        }
    }






}