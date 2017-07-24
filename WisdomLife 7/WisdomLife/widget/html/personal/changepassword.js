var memberid;
var code;
$.init();
var wait = 60;
var text;
var urId = '';
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		getPhone(urId);
	});
	showPro();
	memberid = api.pageParam.memberid;
	function getPhone(urId) {
		AjaxUtil.exeScript({
			script : "managers.home.person",
			needTrascation : false,
			funName : "getmemberinfo",
			form : {
				//			memberid : memberid
				userNo:urId
			},
			success : function(data) {
				api.hideProgress();
				if (data.execStatus == 'true') {
					var result = data.datasources[0].rows[0];
					phone = result.phone;
					$("#username").val(phone);
				}
			}
		});
	}

	var HEIGHT = $('body').height();
	$(window).resize(function() {
		$('.page').height(HEIGHT);
	});
	$(document).on('touchend', ' .buttong', function() {
		if ($('#vaildCode').val() == '') {
			api.alert({
				msg : '您输入的验证码不能为空'
			}, function(ret, err) {
				//coding...
			});
			$('#vaildCode').val('');
		} else if ($('#vaildCode').val() == code) {
			$(this).css({
				"background-color" : "#1fb8f0",
				"color" : "#fff"
			});
			$(".paddingOne").hide();
			$("#next").hide();
			$('.paddingTwo').show();
			$(".sub").show();
			$(".step span").eq(0).removeClass("focusBlue").addClass('focusGray');
			$(".step span").eq(1).removeClass("focusGray").addClass('focusBlue');
		} else {
			api.alert({
				msg : '您输入的验证码不正确，请重新输入'
			}, function(ret, err) {
				//coding...
			});
			$('#vaildCode').val('');
		}
	});
	$(document).on('touchstart', '.buttong', function() {
		$(this).css({
			"background-color" : "#fff",
			"color" : "#1fb8f0",
			"border" : "2px solid #0fb8f3"
		});
	});

	function settime(o) {
		if (wait == 0) {
			o.removeAttribute("disabled");
			o.value = "获取验证码";
			o.style.background = "#1fb8f0";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.value = "重新发送(" + wait + ")";
			o.style.background = "#fff";
			wait--;
			setTimeout(function() {
				settime(o);
			}, 1000)
		}
	}


	$(document).on('click', '.sub', function() {
		var reg = /^[0-9a-zA-Z]+$/
		var str = $('#num').val();
		var str2 = $('#vCode').val();
		if (str.length <= 6) {
			api.alert({
				msg : '密码格式错误'
			}, function(ret, err) {
				//coding...
			});
		} else if (!reg.test(str)) {
			api.alert({
				msg : "你输入的字符不是数字或者字母"
			}, function(ret, err) {
				//coding...
			});
		} else if (str != str2) {
			api.alert({
				msg : '您两次输入不一致，请检查后重新输入'
			}, function(ret, err) {
				//coding...
			});
		} else {
			AjaxUtil.exeScript({
				script : "managers.home.person",
				needTrascation : false,
				funName : "updatapwd",
				form : {
					fid : memberid,
					pwd : $.md5($('#oldpwd').val()),
					newpwd : $.md5($('#num').val()),
					tel : $('#username').val()
				},
				success : function(data) {
					api.hideProgress();
					if (data.execStatus == 'true') {
						if (data.formDataset.checked == 'true') {//旧密码输入正确
							api.closeWin();
						} else {
							api.alert({
								msg : '您的旧密码输入错误'
							}, function(ret, err) {
								//coding...
							});
						}
					}
				}
			});
		}
		//      $(".tips").fadeIn(500).delay("fast").fadeOut(500);
	});
	//点击获取验证码按钮
	$("#getCaptcha").click(function() {
		showPro();
		text = $('#username').val();
		var input = /^[\s]*$/;
		if (input.test(text)) {
			api.alert({
				msg : "手机号不能为空"
			}, function(ret, err) {
				//coding...
			});
		} else {
			settime(this);
			AjaxUtil.exeScript({
				script : "managers.home.person",
				needTrascation : false,
				funName : "getcode",
				form : {
					memberid : memberid,
					telphone : text,
					type : 1
				},
				success : function(data) {
					api.hideProgress();
					if (data.execStatus == 'true') {
						code = data.formDataset.code;
						api.alert({
							title : '温馨提示：',
							msg : '请求成功！',
						}, function(ret, err) {
						});
					} else {
						api.alert({
							title : '温馨提示：',
							msg : '请求失败！',
						}, function(ret, err) {
						});
					}
				}
			});
		}
	});

}
function goback() {
	closePage();
}

function closePage() {
	api.closeWin();
}

function showPro() {
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...'
	});
}