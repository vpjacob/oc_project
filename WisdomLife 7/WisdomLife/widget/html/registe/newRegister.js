var identifyingCode = "";
var wait = 60;
var checkRecommendedPersonId = false;
var recommendedPersonId = '8888';
//用户信息
var userInfo = {
};

var referrer;
var referrerType = 1;
var referrerName;
apiready = function() {
	var header = $api.byId('closePage');
	var closeR = $api.byId('closeR');
	if (api.systemType == 'ios') {
		$api.css(closePage, 'padding: .8rem .1rem;');
		$api.css(closeR, 'padding-top: 0.65rem;');
	};
	$("#registerButton").on('click', function() {
		registerUserInfo();
	});
	$("#closePage").bind("click", function() {
		api.closeWin();
	});
	//二维码扫描注册
	$("#scannerEvm").click(function(){
		var scanner = api.require('scanner');
		scanner.open(function(ret, err) {
   		 if (ret) {
   		 	console.log(JSON.stringify(ret));
   		 	//alert(JSON.stringify(ret.msg));
   		 	api.openWin({
			name : 'referer',
			url : ret.msg,
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
    	} else {
       	 alert(JSON.stringify(err));
    	}
		});
	});
	
	//注册服务协议
	$('.protocol').click(function() {
		api.openWin({//打开导航界面
			name : 'serverP',
			url : 'serverP.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				name : $('#name').html(),
				id : $('.container').attr('id')
			}
		});

	})

	function time(o) {
		if (wait == 0) {
			o.removeAttribute("disabled");
			o.innerHTML = "获取验证码";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.innerHTML = "重新发送(" + wait + ")";
			wait--;
			setTimeout(function() {
				time(o)
			}, 1000)
		}
	}


	document.getElementById("identifyingCodeBtn").onclick = function() {
		var telphone = $("#telphone").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (telphone == "") {
			api.alert({
				title : '系统提示',
				msg : '请输入您的手机号!'
			}, function(ret, err) {
				//coding...
			});
		} else if (!mobileReg.test(telphone)) {
			alert("手机号格式有误");
			return false;
		}else {
			sendIdentifyingCode();//后台发送验证码
			time(this);
		}
	};

	/**
	 * 发送验证码
	 */
	function sendIdentifyingCode() {
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "sendIdentifyingCode",
			form : {
				telphone : $("#telphone").val()
			},
			success : function(data) {
				if (data.formDataset.checked === "true") {
					identifyingCode = data.formDataset.code;
					console.log(identifyingCode+"******************************");
					if (identifyingCode != "") {
						api.alert({
							title : '系统提示',
							msg : '验证码发送成功!'
						}, function(ret, err) {

						});
					} else {
						api.alert({
							title : '系统提示',
							msg : '验证码发送失败!'
						}, function(ret, err) {
							//coding...
						});
					}
				} else {
					api.alert({
						title : '系统提示',
						msg : '您的账号是不是注册过了,要不....换个试试?'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	}

	//立即注册
	function registAccount() {
		var phoneId = api.deviceId;
		var registrationId = api.getPrefs({
			sync : true,
			key : 'registrationId'
		});

		var telphone = $("#telphone").val();
		//密码MD5加密
		var pwd = $.md5($("#pwd").val());
		var identiCode = $("#vaildCode").val();

		var vaildCode = $("#pwd").val();
		var userName = $("#username").val();

		reg = /^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;

		if (recommendedPersonId == "8888") {
			checkRecommendedPersonId = true;
		}

		if (!checkRecommendedPersonId) {
			api.alert({
				title : '系统提示',
				msg : '您的推荐人id有误，请填写正确的推荐人id！'
			}, function(ret, err) {
				//coding...
			});
			return false;
		}
		if (telphone != "" && pwd != "" && reg.test(vaildCode) && identiCode != "" && (identiCode == identifyingCode)) {
			registerExe(telphone, pwd, recommendedPersonId, phoneId, registrationId, userName);
			//注册智慧生活
		} else if (telphone == "") {
			api.alert({
				title : '系统提示',
				msg : '手机号不可以为空!'
			}, function(ret, err) {
				//coding...
			});
		} else if (!reg.test(vaildCode)) {
			api.alert({
				title : '系统提示',
				msg : '密码必须是6-16位的数字小写字母组合!'
			}, function(ret, err) {
				//coding...
			});
		} else if (identiCode == "" || (identiCode != identifyingCode)) {
			api.alert({
				title : '系统提示',
				msg : '验证码不正确!'
			}, function(ret, err) {
				//coding...
			});
		}
	}

	//智慧生活注册
	function registerExe(telphone, pwd, recommendedPersonId, phoneId, registrationId, userName) {
		api.showProgress({
			style : 'default',
			animationType : 'fade',
			title : '努力加载中...',
			text : '先喝杯茶...',
			modal : false
		});
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "registAccount",
			form : {
				telphone : telphone,
				pwd : pwd,
				recommendedpersonid : recommendedPersonId,
				phoneid : phoneId,
				registrationid : registrationId,
				userName : userName
			},
			success : function(data) {
				if (data.execStatus === "true" && data.formDataset.checked === "true") {
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
					//准备更新的用户数据
					userInfo.hasRegist = true;
					userInfo.hasLogon = true;
					userInfo.memberid = data.formDataset.mid;
					userInfo.account = data.formDataset.account;
					userInfo.telphone = data.formDataset.telphone;
					userInfo.nickname = userName;
					
					userInfo.userNo = data.formDataset.userNo;
					userInfo.createTime = data.formDataset.createTime;
					userInfo.location = {
						"lon" : 0,
						"lat" : 0,
						"address" : ""
					};
					FileUtils.writeFile(userInfo, "info.json", function() {
						//刷新
						api.execScript({
							sync : true,
							name : 'root',
							script : 'saveInfos();'
						});
					});
					//刷新
					api.execScript({
						sync : true,
						name : "root",
						frameName : 'weather',
						script : 'setUserKeyInfos();'
					});

					api.toast({
						msg : '注册成功!',
						location : 'middle',
						global : true
					});
					//加入圈子
					
					
					joinIn(data.formDataset.mid, telphone);//用户id 用户名
					
					api.hideProgress();
					api.closeWin({
						name : 'login'
					});
					var isnew = api.getPrefs({
						sync : true,
						key : 'isnew'
					});
					var isnearby = api.getPrefs({
						sync : true,
						key : 'isnearby'
					});
					api.setPrefs({
						key : 'isSjFirst',
						value : 'YES'
					});
					if (isnew == '' || isnew == "false" && isnearby == 'false' || isnearby == '') {//正常进入的界面
						api.execScript({
							sync : true,
							name : 'root',
							script : 'openWeatherPage();'
						});
//					} else if (isnearby == "true") {
//						console.log('邻里');
//						api.setPrefs({
//							key : 'isnearby',
//							value : false
//						});
//						api.execScript({
//							sync : true,
//							name : 'root',
//							script : 'openNeighboursPage();'
//						});

					} else if (isnew == 'true') {//从新闻进来的界面
						api.setPrefs({
							key : 'isnew',
							value : false
						});
						api.execScript({
							name : 'newsinfo',
							script : 'refresh();'
						});
					}
					api.ajax({
						    url: 'https://www.jwlkeji.com/JWLSystem/xkzn/user/register',
						    method: 'post',
						    cache: false,
						    timeout: 30,
						    dataType: 'json',
						    data: {
						        values: {
						            phoneNumber: telphone,
						            password: $("#pwd").val(),
						            userName: telphone
						        }
						    }
						},
						function(ret,err){
						    if(ret){
//						        api.alert({
//						            msg: JSON.stringify(ret)
//						        });
						    }else{
//						        api.alert({
//						            msg: ('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
//						        });
						    };
						});
					setTimeout(function() {
						api.closeWin();
					}, 800);
				} else {
					api.hideProgress();
					api.alert({
						title : '系统提示',
						msg : '注册失败,要不....换个试试?'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	}

	////加入圈子
	function joinIn(userId, username) {
		AjaxUtil.exeScript({
			script : "login.login",
			needTrascation : false,
			funName : "getToken",
			form : {
				userId : userId,
				username : username,
				avatar : '/default/defalutHeader.png',
				password : $.md5($("#pwd").val()),
				name:$("#username").val()				
			},
			success : function(data) {
				console.log('圈子。。。。。。。' + $api.jsonToStr(data));
				if (data.execStatus == 'true') {
					//					api.alert({
					//						msg : '成功加入圈子'
					//					});
				} else {
//					api.alert({
//						msg : '未成功加入圈子'
//					});
				}
			}
		})

	}

	//一点公益注册用户信息
	function registerUserInfo() {
		var phoneId = api.deviceId;
		var registrationId = api.getPrefs({
			sync : true,
			key : 'registrationId'
		});
		var userpwd = $.md5($("#pwd").val());
		var mobilenumber = $("#telphone").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		var verifyCode = $("#vaildCode").val();
		if (mobilenumber == null || mobilenumber == "") {
			alert("手机号不能为空");
			return false;
		} else if (!mobileReg.test(mobilenumber)) {
			alert("手机号格式有误");
			return false;
		}
		else if (verifyCode == null || verifyCode == "") {
			alert("验证码不能为空");
			return false;
		}
		else if (userpwd == null || userpwd == "") {
			alert("密码不能为空");
			return false;
		} else if ($("#pwd").val().length < 6 || $("#pwd").val().length > 16) {
			alert("密码长度为6-16位");
			return false;
		} else if (verifyCode != identifyingCode) {
			api.alert({
				title : '系统提示',
				msg : '验证码不正确!'
			}, function(ret, err) {
				//coding...
			});
		}else {
			registerExe(mobilenumber, userpwd, '8888', phoneId, registrationId, mobilenumber);
						
		}
	}

}

