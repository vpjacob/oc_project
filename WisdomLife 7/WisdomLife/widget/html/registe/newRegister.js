var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
var wait = 60;
var identifyingCode="" 
apiready = function() {
	var header = $api.byId('closePage');
	var closeR = $api.byId('closeR');
	if (api.systemType == 'ios') {
		$api.css(closePage, 'padding: .8rem .1rem;');
		$api.css(closeR, 'padding-top: 0.65rem;');
	};
	$("#registerButton").on('click', function() {
		var verifyCode = $("#vaildCode").val();
		var telphone = $("#telphone").val();
		if (telphone == "") {
			alert("请输入您的手机号！");
			return false;
		}else if (!mobileReg.test(telphone)) {
			alert("您的手机号格式有误,请仔细检查！");
			return false;
		}else if (verifyCode == null || verifyCode == "") {
			alert("您还没有输入验证码！");
			return false;
		} else if (verifyCode != identifyingCode) {
			alert("验证码不正确！");
			return false;
		}else {
			api.openWin({
				name : 'newRegisterTow',
				url : 'newRegisterTow.html',
				reload : true,
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					telphone : telphone
				}
			});
		}
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
	//倒计时效果
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

	//点击发送验证码
	document.getElementById("identifyingCodeBtn").onclick = function() {
		var telphone = $("#telphone").val();
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
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked === "true") {
					identifyingCode = data.formDataset.code;
//					alert(identifyingCode+"******************************");
					if (identifyingCode != "") {
						api.alert({
							title : '系统提示',
							msg : '验证码发送成功!'
						}, function(ret, err) {
							time(document.getElementById("identifyingCodeBtn"));
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
						msg : data.formDataset.errorMsg 
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	}


}

