//其中，IOS状态栏高度为20px，Android为25px
var headerH;
//footer高度为css样式中声明的30px
var footerH;
//frame的高度为当前window高度减去header和footer的高度
var frameH;
//用户信息
var userInfo = {
};
//用户的手机唯一标示
var deviceId;

apiready = function() {
	api.addEventListener({
		name : 'swiperight'
	}, function(ret, err) {
		api.closeWin({
			name : 'login',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_left", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	var closePage = $api.byId('closePage');
	if (api.systemType == 'ios') {
		$api.css(closePage, 'padding: .8rem .1rem;');
	};
	//跳转到注册页面
	$("#regist").bind("click", function() {
		nowRegist();
	});
	//关闭页面
	$("#closePage").bind("click", function() {
//		api.execScript({
//			name : 'root',
//			script : 'openmain()'
//		});
		setTimeout(function() {
			api.closeWin();
		}, 500);
	});

	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
//		api.execScript({
//			name : 'root',
//			script : 'openmain()'
//		});
		setTimeout(function() {
			api.closeWin();
		}, 500);
	});
	//忘记密码第一个页面
	$("#forgetPassword").bind("click", function() {
		forgetPasswordOne();
	});

	$("#login").bind("click", function() {
		if($('#username').val()==""){
			alert("请输入ID号或手机号");
			return false;
		}else{
			login();
		}
	});

	//同步返回结果：
	headerH = api.getPrefs({
		sync : true,
		key : 'headerH'
	});
	footerH = api.getPrefs({
		sync : true,
		key : 'footerH'
	});
	frameH = api.getPrefs({
		sync : true,
		key : 'frameH'
	});

	//获取手机的唯一标识
	deviceId = api.getPrefs({
		sync : true,
		key : 'deviceId'
	});

	/**
	 * 登录
	 */
	function login() {
		api.showProgress({
			style : 'default',
			animationType : 'fade',
			title : '努力加载中...',
			text : '先喝杯茶...',
			modal : false
		});
		var account = $('#username').val();
		var pwd = $('#pwd').val();
		//		var validCode = $('#validCode').val();
		var registrationId = api.getPrefs({
			sync : true,
			key : 'registrationId'
		});
		if (account == "") {
			api.alert({
				msg : '请填写登录账号!'
			});
			return;
		}
		if (pwd == "") {
			api.alert({
				msg : '请填写登录密码!'
			});
			return;
		}

		
	AjaxUtil.exeScript({
      script : "login.login",
      needTrascation : false,
      funName : "getUserRole",
      form : {
        account : account
      },
      success : function(data) {
        if (data.execStatus === "true" && data.formDataset.checked === "true") {
          if (data.formDataset.userRole == '5' || data.formDataset.userRole == '6' || data.formDataset.userRole == '8' || data.formDataset.userRole == '9') {
            	pwd = $.md5(pwd);
          }
          AjaxUtil.exeScript({
            script : "login.login", //need to do
            needTrascation : false,
            funName : "checkMemberAccount",
            form : {
              account : account,
              password : pwd,
              deviceId : deviceId,
              registrationId : registrationId
            },
            success : function(data) {
              if (data.execStatus === "true" && data.formDataset.checked === "true") {
                updateUserInfoAndKeyInfo(data);
              } else if (data.execStatus === "true" && data.formDataset.checked === "false") {
                var failureReason = data.formDataset.failureReason;
                var msg = "登录失败!";
                if (failureReason && failureReason == "pwdError") {
                  msg = "密码错误!";
                } else if (failureReason && failureReason == "noAccount") {
                  msg = "账号错误,先去注册吧!";
                }
                api.hideProgress();
                api.toast({
                  msg : msg,
                  duration : 4000,
                  location : 'bottom',
                  global : true
                });
              }
            },
            error : function(xhr, type) {
              api.hideProgress();
              alert("您的网络不给力啊，检查下是否连接上网络了！");
            }
          });
        } else if (data.execStatus === "true" && data.formDataset.checked === "false") {
          api.hideProgress();
          api.toast({
            msg : "账号错误,先去注册吧!",
            duration : 4000,
            location : 'bottom',
            global : true
          });
        }
      },
      error : function(xhr, type) {
        api.hideProgress();
        alert("您的网络不给力啊，检查下是否连接上网络了！");
      }
    });

	}

	function updateUserInfoAndKeyInfo(data) {
		var token = data.formDataset.token;
		api.setPrefs({
			key : 'token',
			value : token
		});

		userInfo.location = {
			"lon" : 0,
			"lat" : 0,
			"address" : ""
		};
		//获取用户ID 不在从文件中读取ID
		api.setPrefs({
			key : 'userNo',
			value : data.formDataset.userNo
		});
		//获取用户创建时间
		api.setPrefs({
			key : 'createTime',
			value : data.formDataset.createTime
		});
		api.setPrefs({
			key : 'hasRegist',
			value : true
		});
		api.setPrefs({
			key : 'hasLogon',
			value : true
		});
		api.setPrefs({
			key : 'memberid',
			value : data.formDataset.mid
		});
		api.setPrefs({
			key : 'account',
			value : data.formDataset.account
		});
		api.setPrefs({
			key : 'nickname',
			value : data.formDataset.nickname
		});
		api.setPrefs({
			key : 'telphone',
			value : data.formDataset.telphone
		});
		api.hideProgress();
		
		api.toast({
			msg : '登录成功!',
			location : 'middle',
			global : true
		}); 

		//更新钥匙信息
		refreshUserKeyInfo(data.formDataset.mid);
		
		api.closeWin();
		//登录获取设备信息以及登录音视频服务器
		api.accessNative({
			name : 'loginAccount',
			extra : {
				account : data.formDataset.telphone,
				pwd : '123456'
			}
		}, function(ret, err) {
			if (ret) {
				//                                     api.hideProgress();
				//                                     alert(JSON.stringify(ret));
			} else {
				//                                     api.hideProgress();
				//                                     alert(JSON.stringify(err));
			}
		}); 

		
//		FileUtils.writeFile(userInfo, "info.json", function(info, err) {
//			api.hideProgress();
//			api.toast({
//				msg : '登录成功!',
//				location : 'middle',
//				global : true
//			});
//			refreshUserKeyInfo(data.formDataset.mid);
//			var isnew = api.getPrefs({
//				sync : true,
//				key : 'isnew'
//			});
//			var isnearby = api.getPrefs({
//				sync : true,
//				key : 'isnearby'
//			});
//			console.log("------" + isnew == '' || isnew == "false");
//			console.log(isnearby == 'false' || isnearby == '');
//			if ((isnew == '' || isnew == "false") && (isnearby == 'false' || isnearby == '')) {//正常进入的界面
//				api.execScript({
//					sync : true,
//					name : 'root',
//					script : 'openCenterPage();'
//				});	
//
//			} else if (isnew == "true") {//从新闻进来的界面
//				console.log('是从新闻进来的啊');
//				api.setPrefs({
//					key : 'isnew',
//					value : false
//				});
//				api.execScript({
//					name : 'newsinfo',
//					script : 'refresh();'
//				});
//				api.closeWin({
//					name : 'login'
//				});
//			}
//			
//			api.closeWin();
//			//登录获取设备信息以及登录音视频服务器
//          api.accessNative({
//                   name: 'loginAccount',
//                   extra: {
//                          account: data.formDataset.telphone,
//                          pwd:'123456'
//                   }
//                   }, function(ret, err) {
//                          if (ret) {
////                                     api.hideProgress(); 
////                                     alert(JSON.stringify(ret));
//                          } else {
////                                     api.hideProgress();
////                                     alert(JSON.stringify(err));
//                          }
//           });
//		});
	}

	/**
	 *从后台重新获取钥匙信息
	 */
	function refreshUserKeyInfo(memberid) {
		//从后台获取钥匙信息
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "refreshPageInitInfo",
			form : {
				userId : memberid
			},
			success : function(data) {
				if (data.execStatus === "true" && data.datasources[0].rows.length > 0) {
					var keyInfos = '{"keyinfos":' + $api.jsonToStr(data.datasources[0].rows) + '}';
					userKeyInfos = $api.strToJson(keyInfos);
					FileUtils.writeFile(userKeyInfos, "userkeyinfo.json", function() {
					
					});
				} else {
					userKeyInfos = {};
					FileUtils.writeFile(userKeyInfos, "userkeyinfo.json");
					$('.key').hide();
				}
			}
		});

	}

	//跳转到注册页面
	function nowRegist() {
		var reqUrl = "../registe/newRegister.html";
		api.openWin({
			name : 'register',
			url : reqUrl,
			bounces : false,
			rect : {
				x : 0,
				y : headerH,
				w : 'auto',
				h : frameH
			},
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300
			}
		});
		setTimeout(function() {
			api.closeWin({
				name : 'login'
			});
		}, 800);
	}

	//打开忘记密码第一页面
	function forgetPasswordOne() {
		var reqUrl = "../registe/forgetone.html";
		api.openWin({
			name : 'forgetone',
			url : reqUrl,
			bounces : false,
			rect : {
				x : 0,
				y : headerH,
				w : 'auto',
				h : frameH
			},
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300
			}
		});
	}

}