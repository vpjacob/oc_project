var identifyingCode = "";
var wait = 60;
//其中，IOS状态栏高度为20px，Android为25px
var headerH;
//footer高度为css样式中声明的30px
var footerH;
//frame的高度为当前window高度减去header和footer的高度
var frameH;
//用户信息
var userInfo = {
};
apiready = function() {
    var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
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

	$("#closePage").bind("click", function() {
		api.closeWin();
	});

	$("#nextPage").bind("click", function() {
		nextPage();
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


	document.getElementById("identifyingCodeBtn").onclick = function() {
		var telphone = $("#telphone").val();
		if (telphone != "") {
			sendIdentifyingCode();
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
	/**
	 * 发送验证码
	 */
	function sendIdentifyingCode() {
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "sendIdentifyingCodeByForgetPwd",
			form : {
				telphone : $("#telphone").val()
			},
			success : function(data) {
				if (data.formDataset.checked == "true") {
					identifyingCode = data.formDataset.code;
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
						msg : '您的账号没有注册,要不要换个试试或者注册一下!'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	}

	/**
	 * 跳转到第三个设置密码页面
	 */
	function nextPage() {
		var telphone = $("#telphone").val();
		var identiCode = $("#vaildCode").val();
		if (telphone != "" && identiCode != "" && (identiCode == identifyingCode))
		//if (telphone != "" && identiCode != "" && (123 == 123))
		{
			var reqUrl = "../registe/forgetthree.html";
			api.openWin({
				name : 'forgetthree',
				url : reqUrl,
				bounces : false,
				pageParam : {
					'telphone' : telphone
				},
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
					name : 'forgetone'
				});
			}, 500);
		} else if (telphone == "") {
			api.alert({
				title : '系统提示',
				msg : '手机号不可以为空!'
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

}

