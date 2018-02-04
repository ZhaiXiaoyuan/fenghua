/**
 * Created by Administrator on 2016/8/23 0023.
 */

(function(){
    window.utils = {
        /*配置微信接口,data为获取到的token，callBack成功的回调*/
        configWX: function(data, callBack){
            var config = data.config;
            var share = data.share;
            share.link = window.location.href;
            //share.desc = share.description;
            setTimeout(function(){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: config.appId, // 必填，公众号的唯一标识
                    timestamp: config.timestamp, // 必填，生成签名的时间戳
                    nonceStr: config.nonceStr, // 必填，生成签名的随机串
                    signature: config.signature,// 必填，签名，见附录1
                    jsApiList: ['hideMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function(){
                    var shareData = $.extend({}, {
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            callBack && callBack();
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    }, share);

                    wx.onMenuShareTimeline(shareData);  //分享微信朋友圈
                    wx.onMenuShareAppMessage(shareData);    //分享给朋友
                    wx.onMenuShareQQ(shareData);    //分享到QQ
                    wx.onMenuShareWeibo(shareData); //分享到腾讯微博
                });

                wx.error(function(res) {
                    console.log('error', res)
                });

            }, 100);
        },

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

        /*校验注册表单*/
        checkRegisterForm:function (Number,Name,Password,Resource0) {
            //判断是否为手机号码,姓名不为空且小于15个字符,密码不为空且大于等于6位,Resource0不为空且小于15个字符

            var result=null;
            var type=null;


            if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(Number)) || !Number)
            {
                type='phone';
                result= '请填写正确的手机号';
            }
            else if(Name==""||!Name)
            {
                type='name';
                result= '请填写尊姓大名';
            }
            else if( Name.length>15)
            {
                type='name';
                result= '名字这么长,人家不好记,请小于15个字符';
            }
            else if(Password==""||!Password)
            {
                type='pwd';
                result= '密码不能为空啊';
            }
            else if(Password.length<6)
            {
                type='pwd'
                result= '请输入6位以上密码';
            }
            else if(Resource0=="" ||!Resource0)
            {
                type='resource';
                result= '告诉大伙你是?可以填写你的职业,技能等';
            }
            else if(Resource0.length>15)
            {
                type='resource';
                result= '你是限定15个字符以内哦';
            }
            return {
                type:type,
                result:result
            };
        },
        /**
         * 操作反馈提示框
         * @param options
         * @returns {{setOptions: Function}}
         */
        operationFeedback:function(options){
            var defaults={
                parentEle:$('body'),//添加提示框的容器,该容器的position属性值须是'relative'
                tipsElePosition:'fixed',//添加提示框的position属性值须是'absolute'或者fixed
                type:'operating',//提示类型，operating:正在处理,complete:处理完成,tips:纯提示
                text:'正在处理',//要提示的文本,
                delayForDelete:2500,//提示框消失延时,
                alertType:'success',//提示类型，success:操作成功,warn:警告,err:错误
                mask:false//是否显示蒙版
            };
            var maskEle=$('<div class="operation-feedback-mask"></div>');
            var tipsEle=$('<div class="operation-feedback"> <span class="icon"></span> <span class="text"></span> </div>');
            var delEle=function () {
                var timeout=setTimeout(function(){
                    tipsEle.remove();
                    var maskEle=$('.operation-feedback-mask');
                    if(maskEle){
                        maskEle.remove();
                    }
                },defaults.delayForDelete);
            }
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
                    obj.parentEle.css({'position':'relative'}).append(handleEle.css({'position':options.tipsElePosition}));
                }
                if(obj.type){
                    if(obj.type=='operating'){
                        tipsEle.find('.icon').removeClass('complete-icon').addClass('loading-icon');
                    }else if(obj.type=='complete'){
                        if(obj.alertType=='success'){
                            tipsEle.addClass('success');
                        }else if(obj.alertType=='warn'){
                            tipsEle.addClass('warn');
                        }else if(obj.alertType=='err'){
                            tipsEle.addClass('err');
                        }
                        delEle();
                    }else if(obj.type='tips'){
                        tipsEle.addClass('tips');
                        delEle();
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
    }
})();