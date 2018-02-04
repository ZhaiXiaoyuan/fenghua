/**
 * Created by Administrator on 2017/1/10.
 */
$(function () {
    /*初始化Bmob*/
    Bmob.initialize("4cf1008ec9c76e6f7dab4304f33b0c4f", "aeef2c96503ed0fdedc61f5f8afbf961");
    //
    var userStore=Bmob.Object.extend("Maxbro_User");
    var contStore=Bmob.Object.extend("User_ContactList");
    var applyStore=Bmob.Object.extend("User_WantKnow");
    
    /*检测用户是否已经注册*/
    var checkUser=function (options) {
         var query=new Bmob.Query(userStore);
        query.equalTo('Number',options.phone);
        //
        var defer=$.Deferred();
        query.find({
            success:function (resp) {
                console.log("resp:",resp);
                if(resp.length==0){
                    defer.resolve({
                        code:200,
                        msg:'该账号不存在，可用。'
                    })
                }else{
                    defer.resolve({
                        code:300,
                        msg:'该账号已存在！'
                    })
                }
                return defer.promise();
            },
            error:function (error) {
                defer.resolve({
                    code:500,
                    error:error
                })
                console.log("check_error:",error);
            }
        });
        return defer.promise();
    }

    /*创建用户记录*/
    var createUser=function (options) {
        //
        var userInstance=new userStore();
        userInstance.set('Number',options.phone);
        userInstance.set('Password',options.pwd);
        userInstance.set('Name',options.name);
        userInstance.set('Head_Pic',options.avatar);
        userInstance.set('Resource0',options.resource?JSON.stringify(
            {"Resource_title":options.resource,
                "Resource_content":"偷懒了,啥都没写~",
                "res0_pic0_uri":"",
                "res0_pic1_uri":"",
                "res0_pic2_uri":"",
                "who_cansee":"朋友"}):"");
        userInstance.set('Constellation',options.constellation);
        userInstance.set('Stranger_Msg','No');
        userInstance.set('Industry','其他');
        userInstance.set('Who_Can_See_MyRes','Friend');
        userInstance.set('Who_Can_See_Around','Friend');

        //
        var defer=$.Deferred();
        userInstance.save(null,{
            success:function (resp) {

                defer.resolve({
                    code:200,
                    data:$.extend({},options,{id:resp.id})
                });
            },
            error:function (resp,error) {
                defer.reject({
                    code:500,
                    error:error
                })
            }
        });
        return defer.promise();
    }

    /*更新用户记录*/
    var updateUser=function (options) {
        var query=new Bmob.Query(userStore);
        var defer=$.Deferred();
        query.get(options.id,{
            success:function (object) {
                for(var key in options){
                    if(key!='id'){
                        object.set(key,options[key]);
                    }
                }
                object.save(null, {
                    success: function(objectUpdate) {
                        defer.resolve({
                            code:200
                        })
                    },
                    error: function(model, error) {
                        defer.resolve({
                            code:500
                        })
                    }
                });
            },
            error:function (object,error) {
                defer.resolve({
                    code:401
                })
            }
        })
        return defer.promise();
    }
    
    /*查询用户信息*/
    var getUser=function (options) {
        var query=new Bmob.Query(userStore);
        for(var key in options){
            query.equalTo(key,options[key]);
        }
        var defer=$.Deferred();
        query.find({
            success:function (resp) {
               if(resp.length>0){
                   defer.resolve({
                       code:200,
                       data:resp[0]
                   })
               }else{
                   defer.resolve({
                       code:404,
                       data:null,
                   })
               }
            },
            error:function (error) {
                defer.resolve({
                    code:500,
                    error:error
                })
            }
        })
        return defer.promise();
    }

    /*用户登录*/
    var login=function (options) {
        var query=new Bmob.Query(userStore);
        query.equalTo('Number',options.phone);
        query.equalTo('Password',options.pwd);
        var defer=$.Deferred();
        query.find({
            success:function (resp) {
                console.log("resp:",resp);
                if(resp.length>0){
                    var user=$.extend({},resp[0].attributes,{id:resp[0].id});
                    sessionStorage.setItem("maxbroUser",JSON.stringify(user));
                    defer.resolve({
                        code:200,
                        data:user
                    })
                }else{
                    defer.resolve({
                        code:404,
                        msg:'账号或密码有误'
                    })
                }
            },
            error:function (error) {
                defer.resolve({
                    code:500,
                    error:error
                })
            }
        })
        return defer.promise();
    }
    

    /*创建关联记录*/
    var createContactList=function (options) {
        var contInstance=new contStore();
        contInstance.set('Number',options.phone);
        contInstance.set('ResCount',0);
        var defer=$.Deferred();
        contInstance.save(null,{
            success:function (resp) {
                defer.resolve({
                    code:200
                })
            },
            error:function (resp,error) {
                defer.reject({
                    code:500,
                    error:error
                })
            }
        });
        return defer.promise();
    }

    /*获取关联记录*/
    var getContactList=function (options) {
        var query=new Bmob.Query(contStore);
        for(var key in options){
            query.equalTo(key,options[key]);
        }
        var defer=$.Deferred();
        query.find({
            success:function (resp) {
                if(resp.length>0){
                    var list=resp[0].attributes.ContactList;
                    defer.resolve({
                        code:200,
                        data:{
                            id:resp[0].id,
                            list:list&&list!=''?JSON.parse(list):[]
                        }
                    })
                }else{
                    defer.resolve({
                        code:404,
                        data:null,
                    })
                }
            },
            error:function (error) {
                defer.resolve({
                    code:500,
                    error:error
                })
            }
        })
        return defer.promise();
    }

    /*更新关联记录*/
    var updateConctList=function (id,data) {
        var defer=$.Deferred();
        var query=new Bmob.Query(contStore);
        query.get(id,{
            success:function (instance) {
                instance.set('ContactList',data);
                instance.save(null,{
                    success:function (objUpdate) {
                        defer.resolve({
                            code:200,
                            msg:'更新成功'
                        })
                    },
                    error:function (model,error) {
                        defer.resolve({
                            code:500,
                            msg:'更新失败',
                            error:error
                        })
                    }
                });
            },
            error: function(obj, error) {
                defer.resolve({
                    code:500,
                    msg:'更新失败',
                    error:error
                })
            }
        });
        return defer.promise();
    }

    /*创建交友申请记录*/
    var createApply=function (options) {
        var applyInstance=new applyStore();
        applyInstance.set('Number',options.phone);
        applyInstance.set('Data','');
        var defer=$.Deferred();
        applyInstance.save(null,{
            success:function (resp) {
                defer.resolve({
                    code:200
                })
            },
            error:function (resp,error) {
                defer.reject({
                    code:500,
                    error:error
                })
            }
        });
        return defer.promise();
    }

    /*获取交友申请记录*/
    var getApply=function (options) {
        var query=new Bmob.Query(applyStore);
        for(var key in options){
            query.equalTo(key,options[key]);
        }
        var defer=$.Deferred();
        query.find({
            success:function (resp) {
                if(resp.length>0){
                    var list=resp[0].attributes.Data;
                    console.log("applyData:",list);
                    defer.resolve({
                        code:200,
                        data:{
                            id:resp[0].id,
                            list:list&&list!=''?JSON.parse(list):[]
                        }
                    })
                }else{
                    defer.resolve({
                        code:404,
                        data:null,
                    })
                }
            },
            error:function (error) {
                defer.resolve({
                    code:500,
                    error:error
                })
            }
        })
        return defer.promise();
    }

    /*更新交友申请记录*/
    var updateApply=function (id,data) {
        var defer=$.Deferred();
        var query=new Bmob.Query(applyStore);
        query.get(id,{
            success:function (instance) {
                instance.set('Data',data);
                instance.save(null,{
                    success:function (objUpdate) {
                        defer.resolve({
                            code:200,
                            msg:'更新成功'
                        })
                    },
                    error:function (model,error) {
                        defer.resolve({
                            code:500,
                            msg:'更新失败',
                            error:error
                        })
                    }
                });
            },
            error: function(obj, error) {
                defer.resolve({
                    code:500,
                    msg:'更新失败',
                    error:error
                })
            }
        });
        return defer.promise();
    }

    /*获取短信验证码*/
    var getSMS=function(phone) {
        var result = new Object();
        var defer=$.Deferred();
        Bmob.Sms.requestSmsCode({"mobilePhoneNumber": phone} ).then(
            function(obj) {
                console.log("obj:",obj);
                defer.resolve({
                    code:200,
                    data:obj.smsId
                })
            },
            function(err)
            {
                console.log('error:',err);
                defer.resolve({
                    code:500,
                    error:err
                })
            });
        return defer.promise();
    }

    /*验证短信验证码*/
    var verifySMS=function(Number,code) {
        var result = new Object();
        var defer=$.Deferred();
        Bmob.Sms.verifySmsCode(Number, code).then(function(obj)
            {
                defer.resolve({
                    code:200,
                    msg:obj.msg
                });
            },
            function(err)
            {
                console.log('error:',err);
                defer.resolve({
                    code:207,
                    error:err
                })
            });
        return defer.promise();
    }

    /*上传头像*/
    var uploadAvatarByUrl=function(img,canvas) {
        /*  var img=document.getElementById('image1');*/
        console.log("canvas:",canvas.length);
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        console.log("ext:",ext);
        var dataURL = canvas.toDataURL("image/"+ext);
        $('#image1-view').attr('src',dataURL)
        //console.log("dataUrl:",dataURL);
        //上传文件
        var file = new Bmob.File("test1.png",dataURL.split(',')[1]);
        file.save({type:'base64'}).then(function(obj) {
            console.log("uploadEnd");
            console.log(obj.url());
        }, function(error) {
            console.error(error);
            // the save failed.
        });
    }

    /*上传base64数据*/
    var uploadBase64=function (fileName,base64Data) {
        var uploader = new Bmob.File(fileName,base64Data);
        var defer=$.Deferred();
        uploader.save({type:'base64'}).then(function(obj) {
            defer.resolve({
                code:200,
                data:obj.url()
            })
        }, function(error) {
           defer.resolve({
               code:500,
               error:error
           })
        });
        return defer.promise();
    }
    
    /*组合型函数：发送短信验证码*/
    var sendCode=function (options) {
        var defer=$.Deferred();
        checkUser(options).then(function (data) {
            if(data.code==200){
                return getSMS(options.phone);
            }else{
                defer.resolve(data);
            }
        }).then(function (data) {
            if(data){
                defer.resolve(data);
            }
        })
        return defer.promise();
    }

    /*组合型函数：注册*/
    var register=function (options) {
        var defer=$.Deferred();
        var resultData;
        verifySMS(options.phone,options.verifyCode).then(function (data) {
            if(data.code==200){
                return checkUser(options);
            }else{
                defer.resolve(data);
            }
        }).then(function (data) {
           /* console.log("data2:",data);*/
            if(data){
                if(data.code==200){
                    return createUser(options);
                }else{
                    defer.resolve(data);
                }
            }
        }).then(function (data) {
            console.log("rgData:",data);
            if(data){
                if(data.code==200){
                    resultData=data.data;
                    return createContactList(options);
                }else{
                    defer.resolve(data)
                }
            }
        }).then(function (data) {
           /* console.log("data4:",data);*/
           if(data){
               if(data.code==200){
                   return createApply(options);
               }else{
                   defer.resolve(data);
               }
           }
        }).then(function (data) {
            console.log("233:",data)
            if(data){
                if(data.code==200){
                    defer.resolve({
                        code:data.code,
                        data:resultData
                    })
                }else{
                    defer.resolve(data);
                }
            }
        });
        return defer.promise();
    }

    /*组合型函数获取登录状态*/
    var getCustomer=function () {
        var sessionUser=sessionStorage.getItem('maxbroUser');
        var defer=$.Deferred();
        if(sessionUser&&sessionUser!=''){
            sessionUser=JSON.parse(sessionUser);
            defer.resolve({
                code:200,
                data:sessionUser
            })
        }else{
            defer.resolve({
                code:301,
                msg:'用户未登录'
            })
        }
        return defer.promise();
    }
    
    /*组合型函数：上传头像*/
    var uploadAvatar=function (options,fileName,base64Data) {
        var defer=$.Deferred();
        uploadBase64(fileName,base64Data).then(function (data) {
            if(data.code==200){
                options.Head_Pic=data.data;
                return updateUser(options);
            }else{
                defer.resolve({
                    code:400,
                    msg:'上传头像失败'
                })
            }
        }).then(function (data) {
            if(data){
                defer.resolve(data);
            }
        });
        return defer.promise();
    }

    /*组合型函数：获取好友列表*/
    var getFriendList=function (phone) {
        var defer=$.Deferred();
        getContactList({Number:phone}).then(function (data) {
            if(data.code==200){
                var phoneList=[];
                $.each(data.data.list,function (i,item) {
                    phoneList.push(item.Number);
                })
                //
                var query=new Bmob.Query(userStore);
                query.containedIn('Number',phoneList);
                query.find({
                    success:function (resp) {
                        defer.resolve({
                            code:200,
                            data:resp
                        })
                    },
                    error:function (error) {
                        defer.resolve({
                            code:500,
                            error:error
                        })
                    }
                })
            }else{
                defer.resolve({
                    code:data.code,
                    msg:data.msg,
                    error:data.error
                })
            }
        })
        return defer.promise();
    }

    /*组合型函数：获取交友申请列表*/
    var getApplyList=function (phone) {
        var defer=$.Deferred();
        getApply({Number:phone}).then(function (data) {
            console.log();
            if(data.code==200){
                var phoneList=[];
                $.each(data.data.list,function (i,item) {
                    phoneList.push(item.WhoNumber);
                })
                var query=new Bmob.Query(userStore);
                query.containedIn('Number',phoneList);
                query.find({
                    success:function (resp) {
                        defer.resolve({
                            code:200,
                            data:resp
                        })
                    },
                    error:function (error) {
                        defer.resolve({
                            code:500,
                            error:error
                        })
                    }
                })
            }else{
                defer.resolve({
                    code:data.code,
                    msg:data.msg,
                    error:data.error
                })
            }
        });
        return defer.promise();
    }
   /* getApplyList('15915152842');*/

   /*组合型函数：提价交友申请*/
   var addApply=function (options) {
       var defer=$.Deferred();
       getApply({Number:options.targetPhone}).then(function (data) {
           if(data.code==200){
               var flag=true;
               var list=data.data.list;
               for(var i in list){
                   var item=list[i];
                   if(item.WhoNumber==options.whoPhone){
                       flag=false;
                       defer.resolve({
                           code:302,
                           msg:'您已经提交了申请'
                       })
                       break;
                   }
               }
               if(flag){
                   list.push({
                       FromName:options.fromName,
                       FromNumber:options.fromPhone,
                       WhoName:options.whoName,
                       WhoNumber:options.whoPhone,
                       WhoData:options.whoData
                   });
                   updateApply(data.data.id,JSON.stringify(list)).then(function (data) {
                       if(data.code==200){
                           defer.resolve({
                               code:200,
                               msg:'交友申请提交成功'
                           })
                       }else{
                           defer.resolve({
                               code:500,
                               msg:'交友申请提交失败'
                           })
                       }
                   });
               }

           }else{
               defer.resolve({
                   code:data.code,
                   msg:data.msg,
                   error:data.error
               })
           }
       });
       return defer.promise();
   }


   /*组合型函数：创建用户关联*/
   var createRelation=function (user1,user2) {
       /*操作用户1*/
       var defer=$.Deferred();
       console.log("user1:",user1);
       console.log("user2:",user2);
       getContactList({Number:user1.Number}).then(function (data) {
           console.log("user1Data:",data);
           if(data.code==200){
               //如果user1的好友列表中没有user2,则把user2添加进去
               var user1FList=data.data.list;
               var user1Flag=true;
               for(var i in user1FList){
                   if(user1FList[i].Number==user2.Number){
                       user1Flag=false;
                       break;
                   }

               }
               if(user1Flag){
                   user1FList.push({
                       Name:user2.Name,
                       Number:user2.Number,
                       relation:'friend',
                       ResCount:0
                   })
                   updateConctList(data.data.id,JSON.stringify(user1FList)).then(function (data) {
                       console.log("user1Fb:",data);
                       if(data.code==200){
                           defer.resolve({
                               code:200,
                               msg:'关联成功'
                           });
                           /*操作用户2*/
                           /*getContactList({Number:user2.Number}).then(function (data) {
                               console.log("user2Data:",data);
                               if(data.code==200){
                                   var user2FList=data.data.list;
                                   user2FList.push({
                                       Name:user1.Name,
                                       Number:user1.Number,
                                       relation:'friend',
                                       ResCount:0
                                   })
                                   updateConctList(data.data.id,JSON.stringify(user2FList)).then(function (data) {
                                       if(data.code==200){
                                           defer.resolve({
                                               code:200,
                                               msg:'关联成功'
                                           });
                                       }else{
                                           defer.resolve({
                                               code:500,
                                               msg:'将user1添加到user2的用户列表中失败'
                                           });
                                       }
                                   })
                               }else{
                                   defer.resolve({
                                       code:500,
                                       msg:'user2的用户好友列表查询失败'
                                   });
                               }
                           })*/
                       }else{
                           defer.resolve({
                               code:500,
                               msg:'将user2添加到user1的用户列表中失败'
                           });
                       }
                   })
               }else{
                   defer.resolve({
                       code:400,
                       msg:'已是对方好友'
                   })
               }
           }else{
               defer.resolve({
                   code:500,
                   msg:'user1的用户好友列表查询失败'
               });
           }
       });
       return defer.promise();
   }
    /*createRelation({
        Number:'15915152843',
        Name:'宅小猿'
    },{
        Number:'18825162417',
        Name:'卡卡西'
    }).then(function (data) {
        console.log("relateResult:",data);
    })*/
    

  window.httpApi={
      sendCode:sendCode,
      uploadAvatar:uploadAvatar,
      register:register,
      login:login,
      getUser:getUser,
      getFriendList:getFriendList,
      getCustomer:getCustomer,
      addApply:addApply,
      getApplyList:getApplyList,
      createRelation:createRelation
  }
})