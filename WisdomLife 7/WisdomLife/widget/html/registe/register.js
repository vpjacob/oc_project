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
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$(document).on('touchend', ' .buttong', function() {
		$(this).css({
			"background-color" : "#1fb8f0",
			"color" : "#fff"
		});
	});
	$(document).on('touchstart', '.buttong', function() {
		$(this).css({
			"background-color" : "#fff",
			"color" : "#1fb8f0",
			"border" : "2px solid #0fb8f3"
		});
	});
	$(document).on('touchstart', '.again', function() {
		$('#vaildCode').val("");
	});

	$("#registerButton").on('click', function() {
		//		registAccount();
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
	
	//从服务器获取用户验证码
//	getCheckCode();
//	serachCommWealInfoByMembId();  
//	$("#CreateCheckCode").on('click', function() {
//		getCheckCode();
//	});
	//注册服务协议
	$('#serverP').click(function() {
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
			o.value = "获取验证码";
			o.style.background = "#1fb8f0";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.value = "重新发送(" + wait + ")";
			o.style.background = "#bfbfbf";
			wait--;
			setTimeout(function() {
				time(o)
			}, 1000)
		}
	}

//	$("#pwd").bind("change", function() {
//		var vaildCode = $("#pwd").val();
//		reg = /^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
//		if (!reg.test(vaildCode)) {
//			api.alert({
//				msg : '密码必须是6-16位的数字小写字母组合'
//			}, function(ret, err) {
//				$("#vaildCode").val("").focus();
//			});
//		}
//	});

//	$("#indro").bind("change", function() {
//		recommendedPersonId = $("#indro").val();
//		reg = /^(?=.{6})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
//
//		if (recommendedPersonId != "") {
//			if (!reg.test(recommendedPersonId)) {
//				api.alert({
//					msg : '推荐人id必须是6位的数字小写字母组合'
//				}, function(ret, err) {
//					$("#indro").val("").focus();
//					recommendedPersonId = '8888';
//				});
//				return false;
//			} else {
//				AjaxUtil.exeScript({
//					script : "login.login", //need to do
//					needTrascation : false,
//					funName : "checkRecommendedPersonId",
//					form : {
//						recommendedpersonid : recommendedPersonId
//					},
//					success : function(data) {
//						if (data.formDataset.checked === "true") {
//							checkRecommendedPersonId = true;
//
//						}
//						//						else {
//						//							api.alert({
//						//								title : '系统提示',
//						//								msg : '请您填写正确的推荐人id或者不填！'
//						//							}, function(ret, err) {
//						//								//coding...
//						//							});
//						//						}
//					}
//				});
//			}
//		} else {
//			recommendedPersonId = '8888';
//			checkRecommendedPersonId = true;
//		}
//	});

	document.getElementById("identifyingCodeBtn").onclick = function() {
		var telphone = $("#telphone").val();
		if (telphone != "") {
						sendIdentifyingCode();//后台发送验证码
//			sendMsg();
			//一点公益短信验证码
			time(this);
		} else {
			api.alert({
				title : '系统提示',
				msg : '手机号不可以为空!'
			}, function(ret, err) {
				//coding...
			});
		}
	};

	//从数据库获取默认的推荐人
	function serachCommWealInfoByMembId() {
		//从数据库获取推荐人信息====start
		AjaxUtil.exeScript({
			script : "mobile.share.appshare",
			needTrascation : true,
			funName : "serachCommWealInfoByMembId",
			form : {
				memberid : '176f3fb1ed20251fccf5f2e8d2424ab622fd884671774f'
			},
			success : function(data) {
				if (data.execStatus == 'true' && data.formDataset.checked == 'true') {
					referrer = data.formDataset.referrer;
					referrerName = data.formDataset.username;
					$('#indro').val(referrerName);
					$("#referrer").val(referrer);
				} else {
					alert("获取一点公益信息失败!");
				}
			}
		});
		//从数据库获取推荐人信息====end
	}

	/**
	 * 从一点公益获取信息
	 */
	function sendMsg() {
		var sendMobile = $("#telphone").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		var referrer = $("#referrer").val();
		var referrerType = $("#referrerType").val();
		var imgCode = $("#validPicCode").val();

		if (sendMobile == null || sendMobile == "") {
			alert("手机号不能为空")
			return false;
		}
//		if (imgCode == null || imgCode == "") {
//			alert("图片验证码不能为空")
//			return false;
//		}
		if (referrer == null || referrer == "") {
			alert("推荐人不存在");
			return false;
		}
		if (referrerType == null || referrerType == "") {
			alert("推荐人不存在");
			return false;
		}
		if (mobileReg.test(sendMobile)) {
			param = "imgCode=" + imgCode + "&sendMobile=" + sendMobile + "&referrer=" + referrer + "&usertype=1";
			$.ajax({
				type : "POST",
				url : rootUrl + "/api/toSendMsg",
				data : param,
				async : true,
				success : function(data) {
					var json = eval("(" + data + ")");
					if (json.execStatus === "true" && json.formDataset.checked === "true") {
						var xmlContent = json.formDataset.xmlContent;
						if (xmlContent.code == "0") {
							alert(xmlContent.msg);
						} else if (xmlContent.code == "3" || xmlContent.code == "20" || xmlContent.code == "24") {
							//错误:手机号码错误提示
							alert(xmlContent.msg);
						} else if (xmlContent.code == "13") {
							alert(xmlContent.msg);
						} else {
							//错误:其他错误
							alert(xmlContent.msg);
						}
					} else {
						alert("短信发送失败，请重试！");
					}
				}
			});
		} else {
			alert("手机号格式错误");
			return false;
		}

	}

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

//	function getCheckCode() {
//		$.ajax({
//			type : "POST",
//			url : rootUrl + "/api/toRegisterPage",
//			async : true,
//			success : function(data) {
//				console.log("data:" + data + "-----------------------------");
//				var json = eval("(" + data + ")");
//				if (json.execStatus === "true" && json.formDataset.checked === "true") {
//					$("#CreateCheckCode").attr("src", rootUrl + json.formDataset.imagePath);
//				}
//			}
//		});
//	}

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
//					api.setPrefs({
//						key : 'isFirst',
//						value : 'YES'
//					});
					
//					api.openWin({
//						name : 'changeRealname',
//						url : '../personal/personal.html',
//						reload : true,
//						
//			slidBackEnabled : true,
//			animation : {
//				type : "push", //动画类型（详见动画类型常量）
//				subType : "from_right", //动画子类型（详见动画子类型常量）
//				duration : 300 //动画过渡时间，默认300毫秒
//			}
//		});
					
					
					if (isnew == '' || isnew == "false" && isnearby == 'false' || isnearby == '') {//正常进入的界面
						api.execScript({
							sync : true,
							name : 'root',
							script : 'openCenterPage();'
						});
					} else if (isnearby == "true") {
						console.log('邻里');
						api.setPrefs({
							key : 'isnearby',
							value : false
						});
						api.execScript({
							sync : true,
							name : 'root',
							script : 'openNeighboursPage();'
						});

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

//		var username = $("#username").val();
//		var usernameReg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;

		var userpwd = $.md5($("#pwd").val());
//		var password = $.md5($("#newpwd").val());
		var mobilenumber = $("#telphone").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		var verifyCode = $("#vaildCode").val();
//		var referrer = $("#referrer").val();
//		var usertype = $("#referrerType").val();
//		var referrerName = $("#recommendedpersonid").val();
//		var referrerMobile = $("#tel").text();
//		var imgCode = $("#validPicCode").val();

//		if (username == null || username == "") {
//			alert("用户名不能为空");
//			return false;
//		} else if (username.length < 2 || username.length > 16) {
//			alert("用户名长度为2-16位");
//			return false;
//		} else if (!usernameReg.test(username)) {
//			alert("用户名格式有误,只允许输入中文、数字与英文");
//			return false;
//		} else 
		if (mobilenumber == null || mobilenumber == "") {
			alert("手机号不能为空");
			return false;
		} else if (!mobileReg.test(mobilenumber)) {
			alert("手机号格式有误");
			return false;
		}
//		else if (imgCode == null || imgCode == "") {
//			alert("图文验证码不能为空");
//			return false;
//		}
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
		}else if ($('#serv').attr('checked') !== true) {
			alert("请您阅读并同意小客智慧生活注册服务协议");
			return false;
		} 
//		else if (userpwd != password) {
//			alert("密码不一致");
//			return false;
//		}
		 else {
//			var data_ = {
//				username : username,
//				userpwd : userpwd,
//				password : password,
//				mobilenumber : mobilenumber,
//				verifyCode : verifyCode,
//				referrer : referrer,
//				usertype : usertype,
//				referrerName : referrerName,
//				referrerMobile : referrerMobile,
//				isReg : 0,
//				imgCode : imgCode
//			};
//			$.ajax({
//				type : "POST",
//				url : rootUrl + "/api/toRegister",
//				data : $.param(data_),
//				async : true,
//				success : function(ret) {
//					var jsonData = eval("(" + ret + ")");
//					if (jsonData.execStatus === "true" && jsonData.formDataset.checked === "true") {
//						var xmlContent = jsonData.formDataset.xmlContent;
//						if (xmlContent.code == "0") {

							//一点公益注册成功开始注册小客app
							registerExe(mobilenumber, userpwd, '8888', phoneId, registrationId, mobilenumber);
							//注册智慧生活
//						} else if (xmlContent.code == "1" || xmlContent.code == "2" || xmlContent.code == "3" || xmlContent.code == "4" || xmlContent.code == "5") {
//							alert(xmlContent.msg);
//						} else if (xmlContent.code == "8") {
//							alert(xmlContent.msg);
//						} else {
//							//错误:其他错误
//							alert(xmlContent.msg);
//						}
//					} else {
//						alert('注册失败，要不......再试一次！');
//					}
//				} //成功方法
//			});
		}
	}

}

