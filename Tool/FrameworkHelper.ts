
export default class FrameworkHelper {

    public static isOnMac() {
        return Laya.Browser.onMac;
    }
    public static isOnWeb()
    {
        let ret = true;
		for (let name in this) {
			if (name.search(/IS_.*?_GAME$/i) >= 0) {
				ret = ret && !this[name];
			}
			if (!ret) return ret;
		}
		return ret;
    }

    public static isWechatGamePlatform() {
        // 抖音套用的微信 发布的时候直接写死 发微信 注释第一行代码使用第二行  发抖音注释第二行采用第一行
        //return false;
        return Laya.Browser.onMiniGame;
    }

    public static isOppoPlatform() {
        return Laya.Browser.onQGMiniGame;
    }

    public static isShouQPlatform() {
        return Laya.Browser.onQQMiniGame;
    }

    public static isBaiduPlatform() {
        return Laya.Browser.onBDMiniGame;
    }

    public static isVivoPlatform() {
        return Laya.Browser.onVVMiniGame;
    }

    public static isXiaomiPlatform() {
        return Laya.Browser.onKGMiniGame;
    }

    public static isHeadLinsPlatform() {
        //console.log("判断是否是头条平台:",window['tt']);
        return Laya.Browser.onTTMiniGame
    }
    //native 打包
    //android 平台
    public static isAndroidPlatform(){
        if(window['PlatformClass'])
        {
            return true;
        }
        else{
            return false;
        }
    }
    public static isUCPlatform() {
        return false;
    }

    public static isQuTouTiaoPlatform() {
        return false;
    }
    // public static isTikTokPlatform()
    // {
    //     return false;
    // }


















    public static stringToBool(stringValue: any): boolean {
        if (stringValue == 'true' || stringValue == true || stringValue == 1 || stringValue == '1') {
            return true;
        }
        return false;
    }

    public static isHaveKey(jsonData: Object, key: string): boolean {
        if (jsonData && typeof (jsonData[key]) != 'undefined') {
            return true;
        }
        return false;
    }

    //将货数量做处理
    public static setNumsUnit(nums: number, decimalPoint: number = 2): string {
        var numMsg = nums + '';
        if (nums >= Math.pow(10, 21)) { // 
            numMsg = (nums / Math.pow(10, 21)).toFixed(decimalPoint) + "B";
        }
        else if (nums >= Math.pow(10, 18)) { // 穰
            numMsg = (nums / Math.pow(10, 18)).toFixed(decimalPoint) + "E";
        }
        else if (nums >= Math.pow(10, 15)) { // 千兆
            numMsg = (nums / Math.pow(10, 15)).toFixed(decimalPoint) + "P";
        }
        else if (nums >= Math.pow(10, 12)) { // 兆
            numMsg = (nums / Math.pow(10, 12)).toFixed(decimalPoint) + "T";
        }
        else if (nums >= Math.pow(10, 9)) { // 十亿
            numMsg = (nums / Math.pow(10, 9)).toFixed(decimalPoint) + "G";
        }
        else if (nums >= Math.pow(10, 6)) { //百万
            numMsg = (nums / Math.pow(10, 6)).toFixed(decimalPoint) + "M";
        } else if (nums >= 1000) { //万
            numMsg = (nums / 1000).toFixed(decimalPoint) + "K";
        }
        return numMsg;
    }

    public static radianToAngle(radian: number): number {
        return 180 * radian / Math.PI;
    }

    public static getParamsMsgForObj(paramsObj: any): string {
        let res = [];
        for (var key in paramsObj) {
            res.push(key + '=' + paramsObj[key]);
        }
        return res.join('&');
    }

    public static isArray(o: any): boolean {
        return Object.prototype.toString.call(o) == '[object Array]';
    }

    public static isString(str: any): boolean {
        return ((str instanceof String) || (typeof str).toLowerCase() == 'string');
    }

    //判断字符串是否为空（空字符，换行符不算字符）
    public static isStringEmpty(stringMsg: string): boolean {
        let msg = stringMsg.replace(/\r|\n| /ig, '');
        return (msg.length == 0);
    }

    //值是否为数字类型
    public static isNumber(value: any): boolean {
        let patrn = /^\+?[1-9][0-9]*$/;
        return patrn.test(value);
    }

    //是否包含中文
    public static isHaveChinese(targetStr: string): boolean {
        var reg = /[\u4e00-\u9fa5]/g;
        if (reg.test(targetStr)) {
            return true;
        }
        return false;
    }

    //返回 1970 年 1 月 1 日至今的毫秒数（设备系统时间）
    public static getCurTime(): number {
        var myDate = new Date();
        return myDate.getTime();
    }

    //获取guid
    public static getGuid(): string {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }


    //两个2d的node的坐标系转换(srcNode的当前坐标值转换到destNode的父节点坐标系下)
    public static convertToTargetNodeSpace(srcNode: Laya.Sprite, destNode: Laya.Sprite): Laya.Point {
        let worldPos = srcNode.localToGlobal(new Laya.Point(0, 0));
        let nodePost = (destNode.parent as Laya.Sprite).globalToLocal(worldPos);
        return nodePost;
    }

    public static isLiuhaipingWin() {
        var win_h_w_scale = Laya.stage.height / Laya.stage.width;
        if (win_h_w_scale > 1.8) {
            return true;
        }
        return false;
    }




}
