/**
 * Created by Designer on 2018/2/5.
 */
$(function () {
    function login() {
        var params={
            timestamp:utils.genTimestamp(),
            number:$('#account').val(),
            password:$('#password').val()
        }
        if(!utils.regex.phone.test(params.number)){
            utils.operationFeedback({type:'warn',text:utils.regex.phoneAlert});
        }else if(!params.password||params.password==''){
            utils.operationFeedback({type:'warn',text:'请输入密码'});
        }
        var fb=utils.operationFeedback({text:'登录中',mask:true});
        api.login(params,function (resp) {
            if(resp.status=='success'){
                fb.setOptions({type:'complete',text:'登录成功'});
                utils.setCookie('userInfo',JSON.stringify(resp.message),7);
                window.location.href='index.html';
            }else{
                fb.setOptions({type:'warn',text:resp.message});
            }
        })
    }
    $('.submit_btn').click(function () {
        login();
    });
})
