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
     * 查询任务列表
     */
    var taskData=null;
    function getTaskList() {
        var params={
            timestamp:utils.genTimestamp(),
            number:'13751839133',
            status:'Queue,Waiting,Working,Pause,Complete'
        }
        api.getTaskList(params,function (resp) {
            console.log('resp:',resp);
            if(resp.status=='success'){
            }
        })
    }
    getTaskList();
})