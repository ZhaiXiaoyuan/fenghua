/**
 * Created by Administrator on 2018/2/4 0004.
 */
$(function () {
   /* var params={
        timestamp:utils.genTimestamp(),
        number:'13751839133',
        password:'123456'
    }
    api.login(params,function (resp) {

    })*/

    /**
     *渲染等待队列列表
     */
   var $waitList=$('.wait-list .list-win ul');
   function renderWaitingList(list) {
       var listDomStr='';
       $.each(list,function (i,item) {
           listDomStr+='<li>'+item.username+'·'+item.genderLabel+'·'+item.age+'岁</li>';
       });
       $waitList.html(listDomStr);
   }

    /**
     * 渲染设备列表（附带任务信息）
     */
    var $entryList=$('.entry-list');
    function renderEntryList(list) {
        var listDomStr='';
        $.each(list,function (i,entry) {
            var item=entry.task;
            listDomStr+=item?'<li class="'+(item.status=='Working'?'active':'')+'">' +
                '<div class="entry-hd">' +
                '<span class="index">'+item.id+'</span>' +
               /* '<span class="close-btn">&times;</span>' +*/
                '</div>' +
                '<div class="entry-bd">' +
                '<div class="info">' +
                '<p>姓名：'+item.username+'</p>' +
                '<p>性别：'+item.genderLabel+'</p>' +
                '<p>年龄：'+item.age+'</p>' +
                '<p>身份证：'+item.idno+'</p>' +
                '<p>处方：'+item.prescription+'</p>' +
                '<p>雾化量：'+item.quantityamt+'</p>' +
                '<p>开始时间：'+(item.startedAt&&item.startedAt!=''?item.startedAt:'--:--')+'</p>' +
                '</div>' +
                '<div class="progress-wrap">' +
                '<div class="progress">' +
                '<span class="label">进度</span> <span class="time">'+(utils.secondFormat(item.secondamt-item.seconduse))+'</span>' +
                '<div class="line">' +
                '<div  style="width: '+((item.quantityuse/item.quantityamt)*100)+'%"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="handle">' +
                '<div class="handle-btn start-btn '+(item.status=='Working'?'active':'')+'" onclick="setTaskStatus(\''+i+'\')"> <i class="icon"></i> </div>' +
                '<div class="handle-btn call-btn '+(item.calling=='Y'?'active':'')+'"> <i class="icon"></i> </div>' +
                '<span class="status">'+item.statusLabel+'</span>' +
                '</div> </div> </li>'
                :
            '<li class="">' +
            '<div class="entry-hd">' +
            '<span class="index"></span>' +
            /* '<span class="close-btn">&times;</span>' +*/
            '</div>' +
            '<div class="entry-bd">' +
            '<div class="info">' +
            '<p>姓名：</p>' +
            '<p>性别：</p>' +
            '<p>年龄：</p>' +
            '<p>身份证：</p>' +
            '<p>处方：</p>' +
            '<p>雾化量：</p>' +
            '<p>开始时间：--:--</p>' +
            '</div>' +
            '<div class="progress-wrap">' +
            '<div class="progress">' +
            '<span class="label">进度</span> <span class="time">--:--</span>' +
            '<div class="line">' +
            '<div  style="width:0%"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="handle">' +
            '<div class="handle-btn start-btn cm-disabled"> <i class="icon"></i> </div>' +
            '<div class="handle-btn call-btn cm-disabled"> <i class="icon"></i> </div>' +
            '<span class="status">'+entry.statusLabel+'</span>' +
            '</div> </div> </li>';
        });
        $entryList.html(listDomStr);
    }

    /**
     * 设置任务状态
     */
     window.setTaskStatus=function(index) {
        var device=deviceList[index];
        var params={
            timestamp:utils.genTimestamp(),
            deviceId:device.id,
            canuse:device.task.status=='Working'?'N':'Y'
        }
        api.setTaskStatus(params,function (resp) {
            if(resp.status=='success'){

            }
        })
    }

    /**
     * 查询任务列表
     */
    var taskData=null;
    function getTaskList() {
        var params={
            timestamp:utils.genTimestamp(),
            number:'13751839133',//临时测试
            status:'Queue,Waiting,Working,Pause,Complete'
          /*  status:'Queue'*/
        }
        api.getTaskList(params,function (resp) {
            console.log('resp:',resp);
            if(resp.status=='success'){
                taskData=resp.message;
                renderWaitingList(taskData.Queue);
            }
        })
    }
    getTaskList();

    /**
     * 获取设备列表
     */
    var deviceList=[];
    function getDeviceList() {
        api.getDeviceList({timestamp:utils.genTimestamp()},function (resp) {
            if(resp.status=='success'){
                deviceList=resp.message;
                console.log('deviceList:',deviceList);
                renderEntryList(deviceList);
                console.log('sdfsa:',resp);
            }
        })
    }
    getDeviceList();

})