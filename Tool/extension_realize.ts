export { }

(function () {

    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    }

    String.prototype.format = function () {
        let args: any = arguments;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        let msg = this;
        for (let count = 0; ; ++count) {
            if (msg.indexOf("%s") >= 0 && count < args.length) {
                msg = msg.replace("%s", args[count]);
            }
            else {
                return msg;
            }
        }

        // return this.replace(/{(\d+)}/g, function (match, number) {
        //     return typeof args[number] != 'undefined' ? args[number] : match;
        // });
    }

    Date.prototype.format = function (geshi) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(geshi)) {
            geshi = geshi.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(geshi)) {
                geshi = geshi.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return geshi;
    }


})();