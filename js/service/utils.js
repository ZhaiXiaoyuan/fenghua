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
        },
        /**
         * 操作反馈提示框
         * @param options
         * @returns {{setOptions: Function}}
         */
        operationFeedback:function(options){
        var defaults={
            parentEle:$('body'),//添加提示框的容器,该容器的position属性值须是'relative'
            parentElePosition:'relative',//父元素属性值须是'relative'或者fixed
            tipsElePosition:'fixed',//添加提示框的position属性值须是'absolute'或者fixed
            type:'operating',//提示类型，operating:正在处理,complete:处理完成,warn:错误警告,tips:提示
            text:'正在处理',//要提示的文本,
            delayForDelete:3000,//提示框消失延时,
            mask:false//是否显示蒙版
        };
        var maskEle=$('<div class="operation-feedback-mask"></div>');
        var tipsEle=$('<div class="operation-feedback"> <span class="icon"></span> <p class="text"></p> </div>');
        var handleEle=null;
        options= $.extend(defaults,options);
        var setOptions=function(obj){
            if(obj){
                options= $.extend(options,obj);
            }else{
                obj=options;
            }

            if(obj.mask){
                handleEle=maskEle.html(tipsEle);
            }else{
                handleEle=tipsEle;
            }

            if(obj.parentEle){
                var oldTipsEle=obj.mask?$('.operation-feedback-mask'):$('.operation-feedback');
                if(oldTipsEle){
                    oldTipsEle.remove();
                }
                obj.parentEle.css({'position':options.parentElePosition}).append(handleEle.css({'position':options.tipsElePosition}));
            }
            if(obj.type){
                if(obj.type=='operating'){
                    tipsEle.find('.icon').removeClass('complete-icon').addClass('loading-icon');
                }else{
                    if(obj.type=='complete'){
                        tipsEle.find('.icon').removeClass('loading-icon').addClass('complete-icon');
                        tipsEle.find('.text').addClass('success');
                    }else if(obj.type=='clear'){
                        tipsEle.find('.icon').removeClass('loading-icon').addClass('clear-icon');
                        tipsEle.find('.text').addClass('success');
                    }else if(obj.type=='warn'){
                        tipsEle.find('.icon').removeClass('loading-icon').addClass('warn-icon');
                        tipsEle.find('.text').addClass('success');
                    }
                    if(options.delayForDelete==0){
                        tipsEle.remove();
                        if(maskEle){
                            maskEle.remove();
                        }
                    }else{
                        var timeout=setTimeout(function(){
                            tipsEle.remove();
                            if(maskEle){
                                maskEle.remove();
                            }
                        },defaults.delayForDelete);
                    }
                }
            }
            if(obj.text){
                tipsEle.find('.text').html(obj.text);
            }

        }
        setOptions();

        return{
            setOptions:setOptions
        };
    },
        /**
         * 常用正则
         */
        regex:{
            illegal :new RegExp("((?=[\x21-\x7e]+)[^A-Za-z0-9])"),
            illegalAlert:'请勿输入非法字符',
            pNum:/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,//正数
            pNumAlert:'请输入大于0的数值，限制2位小数',
            pInt:/^[1-9]*[1-9][0-9]*$/,//正整数
            pIntAlert:'请输入大于0的整数',
            nNum:/^(0|[1-9][0-9]*)$/,//自然数
            nNumAlert:'请输入大于等于0的整数',
            chn:/^[\u4e00-\u9fa5]{0,}$/,
            chnAlert:'请输入纯中文字符串',

            float:/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
            floatAlert:'数值格式有误，请输入小数点前不多于8位、小数点后不多于2位的数值！',

            percent:/^((100(\.00|\.0)?)|((\d|[1-9]\d)(\.\d{1,2})?))$/,
            percentAlert:'百分数格式错误，请输入0~100间数值，可保留两位小数！',

            contact:/^(0\d{2,3}-?\d{7,8})|(1\d{10})$/,
            contactAlert:'请输入正确格式的手机号码或电话号码！',

            phone:/^1\d{10}$/,
            phoneAlert:'请输入正确格式的手机号！',

            mail:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            mailAlert:'请输入正确格式的邮箱！',

            idCard:/^[a-zA-Z0-9]{1,20}$/,
            idCardAlert:'身份证号码格式错误！',

            shortCode:/^(?![0-9]+$)[0-9A-Za-z]{7,20}$/,
            shortCodeAlert:'域名格式有误，请输入7到20位字母或数字，不可为纯数字！'
        },
        getCookie:function(c_name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length
                    }
                    return unescape(document.cookie.substring(c_start, c_end))
                }
            }
            return ""
        },
        setCookie:function(c_name, value, expiredays) {
        var expDate = new Date();
            expDate.setDate(expDate.getDate() + expiredays);
            document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + expDate.toGMTString()) + ";path=/"
        }
    }
})();