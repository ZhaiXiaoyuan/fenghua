/**
 * Created by Administrator on 2016/8/23 0023.
 */

(function(){
    window.utils = {
        /*获取地址栏参数*/
        getRequest : function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            url=decodeURI(url);
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        //格式化时间
        formatDate:function(date,fmt){
            console.log(32444,date);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        getCurTime:function(format,date){
            var formatStr="yyyy-MM-dd hh:mm:ss";
            var dateObj=new Date();
            if(format){
                formatStr=format;
            }
            if(date){
                dateObj=date;
            }
            return this.formatDate(dateObj,formatStr);
        },
        /*获取url的参数，并转化成json对象*/
        getUrlParam: function(url){
            var url = url || window.location.href;
            var pos, param_str, param, tmp_str;
            var data = {};
            pos = url.indexOf("?");
            param_str = decodeURI(url.substring(pos+1));
            param = param_str.split("&");
            for(var i=0; i<param.length; i++){
                tmp_str = param[i];
                pos = tmp_str.indexOf("=");
                var k = tmp_str.substring(0, pos);
                if(k.length != 0){
                    data[k] = tmp_str.substring(pos+1)
                }
            }
            return data;
        },
        /*生成请求时间戳*/
        genTimestamp:function () {
            return Math.ceil(new Date().getTime()/1000)
        },
        /*
         * 将秒数格式化时间
         * @param {Number} seconds: 整数类型的秒数
         * @return {String} time: 格式化之后的时间
         */
        secondFormat:function (seconds) {
            var min = Math.floor(seconds / 60),
                second = seconds % 60,
                hour, newMin, time;

            if (min > 60) {
                hour = Math.floor(min / 60);
                newMin = min % 60;
            }

            if (second < 10) { second = '0' + second;}
            if (min < 10) { min = '0' + min;}

            return time = hour? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
        }
    }
})();