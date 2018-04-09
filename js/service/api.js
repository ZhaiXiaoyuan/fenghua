/**
 * Created by Designer on 2018/2/5.
 */
$(function () {
    //jQuery请求公共方法
    function sendRequest(url, method, data, callback, contentType, async) {
        var options = {
            url:  url,
            type: method,
            dataType:'json',
            data: data,
            success: function (result) {
                try{
                    result.message=JSON.parse(result.message);
                }catch(e){

                }
                if(result.code=='430000'){

                }else{
                   /* alert(result.message);*/
                }
                callback&&callback(result);
            },
            timeout: 20000,
            error: function (xhr, textStatus) {

            }
        };
        if (typeof async != 'undefined') {
            options.async = async;
        }
        if ((method.toUpperCase() == 'PUT' || method.toUpperCase() == 'POST') && contentType == "json") {
            options.data = JSON.stringify(data);
            options.dataType = 'json';
            options.contentType = 'application/json';
        } else {
            options.data = data;
        }
        $.ajax(options);
    }

    /*数据接口定义*/
    var basicUrl='http://sandbox.insoho.cn:8080';
    window.api={
        //登录
        login:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/admin/login','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //查询任务列表
        getTaskList:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/task/list','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //设置任务状态
        setTaskStatus:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/task/usedev','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //获取设备列表
        getDeviceList:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/task/devs','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //护士站呼叫
        callNurse:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/task/call','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //新增任务
        addTask:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/task/add','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //管理员设置默认雾化量
        setDefaultAmt:function (data,callback) {
            sendRequest(basicUrl+'/fhwhs/admin/udsamt','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        
    }
})