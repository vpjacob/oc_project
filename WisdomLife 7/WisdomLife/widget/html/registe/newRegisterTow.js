var checkRecommendedPersonId = false;
var recommendedPersonId = '8888';
//用户信息
var userInfo = {};
var regId=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;  //正则身份证
var referrer;
var referrerType = 1;
var referrerName;
var telphone="";
apiready = function() {
	var header = $api.byId('closePage');
	var closeR = $api.byId('closeR');
	if (api.systemType == 'ios') {
		$api.css(closePage, 'padding: .8rem .1rem;');
		$api.css(closeR, 'padding-top: 0.65rem;');
	};
	telphone=api.pageParam.telphone;
	$("#registerButton").on('click', function() {
		registerUserInfo();
	});
	$("#closePage").bind("click", function() {
		api.closeWin();
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

	});
	//一点公益注册用户信息
	function registerUserInfo() {
		var phoneId = api.deviceId;
		var registrationId = api.getPrefs({
			sync : true,
			key : 'registrationId'
		});
		var name = $("#name").val();
		var idcard = $("#idcard").val();
		var pwd = $.md5($("#pwd").val());
		var sex = $("#sex option:selected").html();
		if (name == null || name == "") {
			alert("请您输入姓名");
			return false;
		}else if ($("#sex option:selected").val() == 0) {
			alert("请您选择性别");
			return false;
		}else if (idcard == null || idcard == "") {
			alert("请您输入身份证号码");
			return false;
		} else if (!regId.test(idcard)) {
			alert("您输入的身份证号格式有误");
			return false;
		}else if(!checkCard(idcard)){
			alert("请您输入真实的身份证号");
			return false;
		}else if ($("#pwd").val().length < 6 || $("#pwd").val().length > 16) {
			alert("密码长度为6-16位");
			return false;
		}else if ($("#pwdSec").val().length < 6 || $("#pwdSec").val().length > 16) {
			alert("确认密码应为长度为6-16位");
			return false;
		}else if ($("#pwdSec").val()!= $("#pwd").val()) {
			alert("您的两次密码不一致");
			return false;
		}else if (String($('#serv').prop('checked')) != "true") {
			alert("请您阅读并同意小客智慧生活注册服务协议");
			return false;
		}else {
			registerExe(telphone, pwd, '8888', phoneId, registrationId, name,idcard,sex);					
		}
	}
	//智慧生活注册
	function registerExe(telphone, pwd, recommendedPersonId, phoneId, registrationId, userName,idcard,sex) {
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
				userName : userName,
				idcard:idcard,
				sex:sex
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
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
					api.setPrefs({
						key : 'telphone',
						value : data.formDataset.telphone
					});
					
					api.setPrefs({
						key : 'userNo',
						value : data.formDataset.userNo
					});
					
					api.setPrefs({
						key : 'nickname',
						value : userName
					});
					api.setPrefs({
						key : 'createTime',
						value : data.formDataset.createTime
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
//						api.execScript({
//							sync : true,
//							name : 'root',
//							script : 'openWeatherPage();'
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
						api.closeToWin({
							    name: 'root'
							});
						api.execScript({
							sync : true,
							name : 'root',
							script : 'openWeatherPage();'
						});
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

	

}

