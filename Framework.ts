
/**
 * 物品管理
 * 
 * id 物品id
 * goodsName: 物品id
 * 
 */

import GoodsMgr from "../Game/Module/GoodsMgr";
import ZombieMgr from "../Game/Module/ZombieMgr";
import LevelMgr from "../Game/Module/LevelMgr";
import GunMgr from "../Game/Module/GunMgr";
import BuffMgr from "../Game/Module/BuffMgr";
import ZhuanpanMgr from "../Game/Module/ZhuanpanMgr";
import FrameworkHelper from "./Tool/FrameworkHelper";
import NotificationMgr from "./Common/NotificationMgr";
import { GameDefine } from "../Game/Module/GameEnum";
import UIHelper from "../Game/Module/UIHelper";
import ShareHelper from "./Common/ShareHelper";
import WxApiHelper from "./Platform/Wechat/WxApiHelper";
import LoginMgr from "./Common/LoginMgr";



export default class Framework {

    private static _instance: Framework = null;


    public static getInstance(): Framework {
        if (this._instance === null) {
            this._instance = new Framework();
            this._instance.init();
        }
        return this._instance;
    }


    private init(): void {
        GoodsMgr.getInstance();
        ZombieMgr.getInstance();
        LevelMgr.getInstance();
        GunMgr.getInstance();
        BuffMgr.getInstance();
        ZhuanpanMgr.getInstance();

        this.setOnHide(function () {
            NotificationMgr.emit(GameDefine.NOTIFICATION_DID_ENTERBACKGROUND);
        });

        this.setOnShow(function () {
            NotificationMgr.emit(GameDefine.NOTIFICATION_WILL_ENTERFOREGROUND);
        });
    }

    private setOnHide(callback) {
        if (FrameworkHelper.isWechatGamePlatform()) {
            this.weChatOnHide(callback);
        }
    }

    private setOnShow(callback) {
        if (FrameworkHelper.isWechatGamePlatform()) {
            this.weChatOnShow(callback);
        }
    }

    //wechat
    private weChatOnHide(callback: Function = null) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        Laya.Browser.window["wx"].onHide(function () {
            callback && callback();
        });
    }

    private weChatOnShow(callback: Function = null) {
        if (!FrameworkHelper.isWechatGamePlatform()) {
            return;
        }
        Laya.Browser.window["wx"].onShow(function (res) {
            UIHelper.log(' onShow_res: ' + JSON.stringify(res))
            ShareHelper.getInstance().setShareQuery(res.query || null);
            WxApiHelper.doWeChatonShow();
            if (LoginMgr.isLoginSuccess()) {
                ShareHelper.getInstance().doShareQueryLogic(true);
            }
            callback && callback();
        });
    }





}