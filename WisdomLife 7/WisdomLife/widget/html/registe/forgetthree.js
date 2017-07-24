//用户信息
var userInfo = {
};
var telphone = "";
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	//获取上页传过来的手机号
	telphone = api.pageParam.telphone;

	$("#closePage").bind("click", function() {
		api.closeWin();
	});

	$("#login").bind("click", function() {
		var vaildCode = $("#vaildCode").val();
		var pwd = $("#pwd").val();
		reg = /^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
		if (!reg.test(vaildCode)) {
			api.alert({
				msg : '密码必须是6-16位的数字小写字母组合'
			}, function(ret, err) {
			});
		} else if (pwd != "" && vaildCode == pwd) {
			api.showProgress({
				style : 'default',
				animationType : 'fade',
				title : '努力加载中...',
				text : '先喝杯茶...',
				modal : false
			});
			findPassword();
		} else if (pwd == "" || vaildCode == "") {
			api.alert({
				msg : '请输入密码!'
			}, function(ret, err) {
				$("#pwd").val("").focus();
			});
		} else {
			api.alert({
				msg : '两次密码输入不同,请重新输入'
			}, function(ret, err) {
				$("#pwd").val("").focus();
			});
		}
	});

	//"/^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/"

	$("#vaildCode").bind("change", function() {
		var vaildCode = $("#vaildCode").val();
		reg = /^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
		if (!reg.test(vaildCode)) {
			api.alert({
				msg : '密码必须是6-16位的数字小写字母组合'
			}, function(ret, err) {
				$("#vaildCode").val("").focus();
			});
		}
	});
}
/**
 * 修改密码
 */
function findPassword() {
	AjaxUtil.exeScript({
		script : "login.login", //need to do
		needTrascation : false,
		funName : "updatePassword",
		form : {
			account : telphone,
			password : $.md5($("#pwd").val())
		},
		success : function(data) {
			if (data.formDataset.checked == "true") {
				api.hideProgress();
				api.alert({
					title : '系统提示',
					msg : '密码修改成功,去登陆吧!'
				}, function(ret, err) {
					api.openWin({//打开登录界面
						name : 'login',
						url : 'logo.html',
						//						pageParam : {
						//							memberid : memberid
						//						},
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
					//					api.closeWin({
					//						name : 'login'
					//					});
					api.closeWin({
						name : 'forgetone'
					});

					setTimeout(function() {
						api.closeWin();
					}, 800);
				});
			} else {
				api.hideProgress();
				api.alert({
					title : '系统提示',
					msg : '密码修改失败!'
				}, function(ret, err) {
					api.closeWin();
				});
			}
		}
	});
}
