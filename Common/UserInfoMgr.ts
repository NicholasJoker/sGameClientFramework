/**
 * 用户基本数据
 * 
 * userId
 * username
 * userImg
 * openId
 * platformType:平台类型: 1: 微信小游戏，2: oppo, 3:百度，4: 头条，5: vivo， 6: 手q, 7: uc, 8: 趣头条
 * youkeOpenId
 * 
 */

import UIHelper from "../../Game/Module/UIHelper";
import FrameworkHelper from "../Tool/FrameworkHelper";



export default class UserInfoMgr {

    private static _instance: UserInfoMgr = null;

    private mUserInfo: any = {};


    public static getInstance(): UserInfoMgr {
        if (this._instance === null) {
            this._instance = new UserInfoMgr();
        }
        return this._instance;
    }

    public setUserInfo(userInfo: object): void {
        if (!userInfo) {
            return;
        }
        for (var key in userInfo) {
            if (userInfo[key] || !FrameworkHelper.isHaveKey(this.mUserInfo, key)) {
                this.mUserInfo[key] = userInfo[key];
            }
        }
    }

    private getUserValueByKey(key) {
        if (!FrameworkHelper.isHaveKey(this.mUserInfo, key)) {
            return null;
        }
        return this.mUserInfo[key];
    }

    public getUserId(): string {
        return this.getUserValueByKey("userId");
    }

    public setUserName(name: string) {
        this.mUserInfo.username = name;
    }

    public getUserName(): string {
        return this.getUserValueByKey("username");
    }

    public setUserImgUrl(imgUrl: string) {
        this.mUserInfo.userImg = imgUrl;
    }

    public getUserImgUrl(): string {
        return this.getUserValueByKey("userImg");
    }

    public setOpenId(openId: string) {
        this.mUserInfo.openId = openId;
    }

    public getOpenId(): string {
        var openId = this.getUserValueByKey("openId");
        if (!openId) {
            openId = this.getYoukeOpenId();
        }
        return openId;
    }

    public getYoukeOpenId(): string {
        // test
        // return "touris-5f6066ec-f4a6-41c3-a210-3959c9fa53c2";

        return this.getUserValueByKey("youkeOpenId");
    }

    public isMineId(userId: string): boolean {
        return this.getUserId() == userId;
    }



}