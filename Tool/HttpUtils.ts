import LocalDataMgr from '../../Game/Module/LocalDataMgr';
import UIHelper from '../../Game/Module/UIHelper';
import UserDataMgr from '../../Game/Module/UserDataMgr';
import ViewMgr, { ViewType } from '../../Game/Module/ViewMgr';
import UserInfoMgr from '../Common/UserInfoMgr';
import FrameworkHelper from './FrameworkHelper';

export class RequestData {
    public meth: string = "post";// post ,get
    public data: any = null;
    public url: string = "";
    public onSuccess: Function = null;
    public onFail: Function = null;

    constructor() {
        this.data = {};
    }
}


export default class HttpUtils {


    public static request(req: RequestData) {
        if (req.url.indexOf("https://") > -1 || req.url.indexOf("http://") > -1) {
            req.url = req.url;
        } else {
            req.url = this.getWenleUrl() + req.url;
        }

        var completeFunc = (res) => {
            UIHelper.log("http Success:", res && JSON.stringify(res));
            if (req.onSuccess) {
                req.onSuccess(res);
            }
            req.onSuccess = null;
            req = null;
        };

        var errorFunc = (err) => {
            var errorCode = Number(err.substr(1, 3));
            HttpUtils.showErrorCodeTipsUI(errorCode);
            if (req.onFail) {
                req.onFail(err);
            }
            req.onFail = null;
            req = null;
        };

        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        xhr.http.timeout = 10000;//设置超时时间；
        xhr.once(Laya.Event.COMPLETE, this, completeFunc);
        xhr.once(Laya.Event.ERROR, this, errorFunc);

        var header: any =
            [
                "Content-Type", "application/json",
            ]
        header.push("openid");
        var openId = UserInfoMgr.getInstance().getOpenId();
        if (!openId) {
            openId = this.getYoukeOpenId();
        }
        header.push(openId);
        if (UserInfoMgr.getInstance().getYoukeOpenId()) {
            header.push("youkeOpenid");
            header.push(UserInfoMgr.getInstance().getYoukeOpenId());
        }
        var userGold = UserDataMgr.getInstance().getUserGoldNums();
        if (userGold > 0) {
            header.push("gold");
            header.push(userGold);
        }
        UIHelper.log(' http_header:\n', JSON.stringify(header))
        if (req.meth == 'get') {
            let dataStr: string = FrameworkHelper.getParamsMsgForObj(req.data);
            UIHelper.log(' in request get_dataStr:', dataStr)
            UIHelper.log(' in request get_url:', req.url)
            UIHelper.log(' in request get_meth:', req.meth)
            xhr.send(req.url + "?" + dataStr, '', req.meth, "json", header);
        }
        else {
            let dataStr: string = JSON.stringify(req.data);
            // UIHelper.log(' in request post_dataStr:', dataStr)
            // UIHelper.log(' in request post_url:', req.url)
            // UIHelper.log(' in request post_meth:', req.meth)
            //console.error("HTTP请求测速起始时间:",Laya.systemTimer.currTimer);
            xhr.send(req.url, dataStr, req.meth, "json", header);
        }
    }
    //合作方连接 Get请求
    public static getThridRequest(url, data, onSuccess: Function, onFail: Function)
    {
        var req = new RequestData();
        req.meth = 'get'
        req.url = url;
        req.onSuccess = onSuccess;
        req.onFail = onFail;
        req.data = data;
        HttpUtils.requestGet(req);
    }
    // 合作方Get请求
    public static requestGet(req:RequestData)
    {
        var completeFunc = (res) => {
            UIHelper.log("http Success:", res && JSON.stringify(res));
            if (req.onSuccess) {
                req.onSuccess(res);
            }
            req.onSuccess = null;
            req = null;
        };

        var errorFunc = (err) => {
            var errorCode = Number(err.substr(1, 3));
            HttpUtils.showErrorCodeTipsUI(errorCode);
            if (req.onFail) {
                req.onFail(err);
            }
            req.onFail = null;
            req = null;
        };

        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        xhr.http.timeout = 10000;//设置超时时间；
        xhr.once(Laya.Event.COMPLETE, this, completeFunc);
        xhr.once(Laya.Event.ERROR, this, errorFunc);

        var header: any =
            [
                "Content-Type", "application/json",
            ]
        header.push("openid");
        var openId = UserInfoMgr.getInstance().getOpenId();
        if (!openId) {
            openId = this.getYoukeOpenId();
        }
        header.push(openId);
        if (UserInfoMgr.getInstance().getYoukeOpenId()) {
            header.push("youkeOpenid");
            header.push(UserInfoMgr.getInstance().getYoukeOpenId());
        }
        var userGold = UserDataMgr.getInstance().getUserGoldNums();
        if (userGold > 0) {
            header.push("gold");
            header.push(userGold);
        }
        //UIHelper.log(' http_header:\n', JSON.stringify(header))
        let dataStr: string = FrameworkHelper.getParamsMsgForObj(req.data);
        // UIHelper.log(' in request get_dataStr:', dataStr)
        // UIHelper.log(' in request get_url:', req.url)
        // UIHelper.log(' in request get_meth:', req.meth)
        //console.error("合作方HTTP请求测速开始时间:",Laya.systemTimer.currTimer);
        xhr.send(req.url + "&" + dataStr, '', req.meth, "json", header);
    }
    public static postRequest(url, data, onSuccess: Function, onFail: Function) {
        // UIHelper.log(' postRequest_url:\n', url)
        // UIHelper.log(' postRequest_data:\n', data && JSON.stringify)
        var req = new RequestData();
        req.meth = 'post'
        req.url = url;
        req.onSuccess = onSuccess;
        req.onFail = onFail;
        req.data = data;
        HttpUtils.request(req);
    }

    public static getRequest(url, data, onSuccess: Function, onFail: Function) {
        var req = new RequestData();
        req.meth = 'get'
        req.url = url;
        req.onSuccess = onSuccess;
        req.onFail = onFail;
        req.data = data;
        HttpUtils.request(req);
    }

    public static getYoukeOpenId(): string {
        var youkeOpenId = LocalDataMgr.getTourisOpenId();//HttpUtils.getCocosUrlParameter('openId');
        if (FrameworkHelper.isWechatGamePlatform()
            || FrameworkHelper.isHeadLinsPlatform()
            || FrameworkHelper.isShouQPlatform()
            || FrameworkHelper.isOppoPlatform()||FrameworkHelper.isVivoPlatform()){
            youkeOpenId = LocalDataMgr.getTourisOpenId();
        }
        return youkeOpenId;
    }



    //url
    public static getWenleUrl() {
        // test
        return 'http://1.14.249.84:8886';
        //return 'http://127.0.0.1:8886';
        // 测试线上
        //return 'http://159.75.231.148:8886';
        // 雅清
        //return 'https://st.kaka28.com';
        // boss
        // return 'https://st2.kaka28.com';
    }

    /**
     * 获取当前页面URL中的参数
     * @param name：URL中携带的数据参数名
     * @returns {*}
     */
    public static getCocosUrlParameter(name): string {
        let reg = new RegExp(name + "=([^&]*)(&|$)", "i");
        let r = window.location.href.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[1]);
        }
        return 'test_af0451611231a331';
    }

    public static showErrorCodeTipsUI(errorCode) {
        var tipsMsg = null;
        switch (errorCode) {
            case 403:
                tipsMsg = '无效的openid';
                break;
            case 410:
                tipsMsg = 'jsCode不能为空';
                break;
            case 514:
                tipsMsg = '无此游客';
                break;
            case 515:
                tipsMsg = '数量不足，操作失败';
                break;
            case 516:
                tipsMsg = '购买的商品不存在';
                break;
            case 517:
                tipsMsg = '用户没有此物品';
                break;
            case 518:
                tipsMsg = '空投箱数量不足';
                break;
            case 519:
                tipsMsg = '当前合成格子已满，无法获得空投箱中的武器！';
                break;
            case 520:
                tipsMsg = '用户金币数量不足';
                break;
        }
        if (tipsMsg != null) {
            ViewMgr.getInstance().openView(ViewType.MsgTipsView, tipsMsg);
        }
    }

}
