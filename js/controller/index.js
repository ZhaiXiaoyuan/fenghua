/**
 * Created by Administrator on 2018/2/4 0004.
 */
$(function () {
    var userInfo=utils.getCookie('userInfo')?JSON.parse(utils.getCookie('userInfo')):null;
    if(!userInfo){
        window.location.href='login.html';
        return;
    }
   /* console.log("userInfo:",userInfo);*/
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
     * 渲染设备呼叫列表
     */
    var $callingList=$('.calling-list ul');
    function renderCallingList(list) {
        console.log('list:',list);
        var listDomStr='';
        $.each(list,function (i,item) {
            listDomStr+=item.name?'<li class="cm-btn"> <a onclick="utils.goAnchor(event,\'#'+item.id+'\')">'+item.name+'</a> </li>':'';
        });
        $callingList.html(listDomStr);
    }

    /**
     * 渲染设备列表（附带任务信息）
     */
    var $entryList=$('.entry-list');
    function renderEntryList(list) {
        var listDomStr='';
        var callingList=[];
        console.log('list0:',list);
        $.each(list,function (i,entry) {
            var item=entry.task;
            if(item.calling=='Y'){
                callingList.push(item);
            }
            listDomStr+=item?'<li class="'+(entry.status=='Working'?'active':'')+(item.calling=='Y'?' calling':'')+'" id="'+entry.id+'">' +
                '<div class="entry-hd">' +
                '<span class="index">'+entry.name+'</span>' +
               /* '<span class="close-btn">&times;</span>' +*/
                '</div>' +
                '<div class="entry-bd">' +
                '<div class="info">' +
                '<p>任务：'+item.code+'<span class="status '+(item.status=='Working'?'active':'')+'">'+item.statusLabel+'</span></p>' +
                '<p>姓名：'+item.username+'</p>' +
                '<p>性别：'+item.genderLabel+'</p>' +
                '<p>年龄：'+item.age+'</p>' +
                '<p>身份证：'+item.idno+'</p>' +
                '<p>处方：'+item.prescription+'</p>' +
                '<p>雾化量：'+item.quantityamt+'cc</p>' +
                '<p>开始时间：'+(item.startedAt&&item.startedAt!=''?item.startedAt:'--:--')+'</p>' +
                '</div>' +
                '<div class="progress-wrap">' +
                '<div class="progress">' +
                '<span class="label">进度</span> <span class="time">'+(utils.secondFormat(item.secondamt-item.seconduse))+'</span>' +
                '<div class="line">' +
                '<div  style="width: '+((item.seconduse/item.secondamt)*100)+'%"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="handle">' +
                '<div class="handle-btn start-btn '+(entry.status=='Working'?'active':'')+'" onclick="setTaskStatus(\''+i+'\')"> <i class="icon"></i> </div>' +
                '<div class="handle-btn call-btn '+(item.calling=='Y'?'active':'cm-disabled')+'" onclick="callNurse(\''+i+'\')"> <i class="icon"></i> </div>' +
                '<span class="status">'+entry.statusLabel+'</span>' +
                '</div> </div> </li>'
                :
            '<li id="'+entry.id+'">' +
            '<div class="entry-hd">' +
            '<span class="index">'+entry.name+'</span>' +
            /* '<span class="close-btn">&times;</span>' +*/
            '</div>' +
            '<div class="entry-bd">' +
            '<div class="info">' +
            '<p>任务：</p>' +
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
            '<div class="handle-btn start-btn" onclick="setTaskStatus(\''+i+'\')"> <i class="icon"></i> </div>' +
            '<div class="handle-btn call-btn cm-disabled"> <i class="icon"></i> </div>' +
            '<span class="status">'+entry.statusLabel+'</span>' +
            '</div> </div> </li>';
        });
        renderCallingList(callingList);
        $entryList.html(listDomStr);
    }

    /**
     * 设置任务状态
     */
    var taskRequesting=false;
     window.setTaskStatus=function(index) {
         if(taskRequesting){
             return;
         }
        var device=deviceList[index];
        var params={
            timestamp:utils.genTimestamp(),
            deviceId:device.id,
            canuse:device.status=='Working'?'N':'Y'
        }
         taskRequesting=true;
       /* var fb=utils.operationFeedback({text:'操作中...'});*/
        api.setTaskStatus(params,function (resp) {
            taskRequesting=false;
            if(resp.status=='success'){
               /* fb.setOptions({type:'complete',text:resp.message});*/
            }else{
              /*  fb.setOptions({type:'warn',text:resp.message});*/
            }
        })
    }

    /**
     * 护士站呼叫
     */
    var isCallRequesting=false;
    window.callNurse=function (index) {
        if(isCallRequesting){
            return;
        }
        var device=deviceList[index];
        var params={
            timestamp:utils.genTimestamp(),
            taskId:device.task.id,
            calling:device.task.calling=='Y'?'N':'Y'
        }
        isCallRequesting=true;
       /* var fb=utils.operationFeedback({text:'操作中...'});*/
        api.callNurse(params,function (resp) {
            isCallRequesting=false;
            if(resp.status=='success'){
               /* device.task.calling=device.task.calling=='Y'?'N':'Y'*/
              /*  fb.setOptions({type:'complete',text:resp.message});*/
            }else{
              /*  fb.setOptions({type:'warn',text:resp.message});*/
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
            number:userInfo.mobilephone,
           /* status:'Queue,Waiting,Working,Pause,Complete'*/
            status:'Queue'
        }
        api.getTaskList(params,function (resp) {
          /*  console.log('resp:',resp);*/
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
               /* console.log('deviceList:',deviceList);*/
                renderEntryList(deviceList);
            }
        })
    }
    getDeviceList();

    /**
     * 添加任务弹窗
     */
    function addTaskModal(options) {
        var $html=$('html');
        var $body=$('body');
        var $modal=$('<div class="add-modal">' +
            '<div class="mask"></div>' +
            '<div class="modal-content">' +
            '<div class="modal-body">' +
            '<div class="input-row"><span class="field">姓名</span> <input type="text" id="username" placeholder="请输入姓名" maxlength="64"> </div>' +
            '<div class="input-row"> <span class="field">性别</span> <input type="text" id="gender" placeholder="请输入性别" maxlength="1"> </div>' +
            '<div class="input-row"> <span class="field">年龄</span> <input type="text" id="age" placeholder="请输入年龄" maxlength="3"> </div>' +
            '<div class="input-row"> <span class="field">身份证</span> <input type="text" id="idno" placeholder="请输入身份证" maxlength="18">' +
            '</div> <div class="input-row"> <span class="field">处方</span> <input type="text" id="prescription" placeholder="请输入处方" maxlength="128"> </div>' +
            '<div class="input-row"> <span class="field">雾化量</span> <input type="text" id="quantityamt" placeholder="请输入雾化量" maxlength="10"> </div>' +
            '<div class="input-row"> <span class="field">雾化总时间</span> <input type="text" id="secondamt" placeholder="请输入雾化总时间" maxlength="10"> </div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<div class="handle-btn ok-btn">确定</div> <div class="handle-btn cancel-btn">取消</div> </div>' +
            '</div></div>');
        $body.append($modal);
        var $modalContent=$modal.find('.modal-content');
        $html.addClass('no-scroll');
        $body.addClass('no-scroll');


        function submit() {
            var params={
                timestamp:utils.genTimestamp(),
                username:$('#username').val(),
                gender:$('#gender').val(),
                age:$('#age').val(),
                idno:$('#idno').val(),
                prescription:$("#prescription").val(),
                quantityamt:$('#quantityamt').val(),
                secondamt:$('#secondamt').val()
            }
            if(!params.username||params.username==''){
                utils.operationFeedback({type:'warn',text:'请输入姓名'});
                return;
            }else if(!params.gender||params.gender==''){
                utils.operationFeedback({type:'warn',text:'请输入性别'});
                return;
            }else if(!utils.regex.pInt.test(params.age)){
                utils.operationFeedback({type:'warn',text:'年龄格式有误，'+utils.regex.pIntAlert});
                return;
            }else if(!utils.regex.idCard.test(params.idno)){
                utils.operationFeedback({type:'warn',text:utils.regex.idCardAlert});
                return;
            }else if(!params.prescription||params.prescription==''){
                utils.operationFeedback({type:'warn',text:'请输入处方'});
                return;
            }else if(!utils.regex.float.test(params.quantityamt)){
                utils.operationFeedback({type:'warn',text:'雾化总量'+utils.regex.floatAlert});
                return;
            }else if(!utils.regex.pInt.test(params.secondamt)){
                utils.operationFeedback({type:'warn',text:'雾化总时间有误，'+utils.regex.pIntAlert});
                return;
            }
            params.gender=params.gender=='男'?1:0;
            var fb=utils.operationFeedback({text:'提交中',mask:true});
            api.addTask(params,function (resp) {
                if(resp.status=='success'){
                    fb.setOptions({type:'complete',text:'任务添加成功'});
                    options&&options.callback&&options.callback();
                    setTimeout(function () {
                        close();
                    },4000);
                }else{
                    fb.setOptions({type:'warn',text:resp.message});
                }
            });
        }
        //
        function ok() {
            submit();
        }
        //
        function close() {
            $html.removeClass('no-scroll');
            $body.removeClass('no-scroll');
            $modal.remove();
        }
        /*绑定事件*/
        //
        $modal.click(function (e) {
          e.stopPropagation()
        });
        //
        $modal.find('.mask,.cancel-btn').click(function (e) {
            close();
        });
        //
        $modal.find('.ok-btn').click(function (e) {
            ok();
        });

    }
    $('.add-btn').click(function () {
        addTaskModal();
    });

    /**
     * 数据实时轮询
     */
    setInterval(function () {
        getTaskList();
        getDeviceList();
    },1000);

})