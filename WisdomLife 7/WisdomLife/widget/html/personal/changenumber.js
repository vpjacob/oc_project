var memberid;
var telphone;
var code;
$.init();
var wait = 60;
//用户信息
var userInfo = {
};
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		telphone=info.telphone;
		$('#username').val(telphone);
	});
//	showPro();
	memberid = api.pageParam.memberid;
//	AjaxUtil.exeScript({
//		script : "managers.home.person",
//		needTrascation : false,
//		funName : "getmemberinfo",
//		form : {
//			memberid : memberid
//		},
//		success : function(data) {
//			console.log($api.jsonToStr(data));
//			alert($api.jsonToStr(data));
//			api.hideProgress();
//			if (data.execStatus == 'true') {
//				var result = data.datasources[0].rows[0];
//				
//				telphone = result.telphone;
//				$("#username").val(telphone);
//			}
//		}
//	});

	//点击获取验证码按钮
	$("#getCaptcha1").click(function() {
		showPro();
		var text = $('#username').val();
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
					console.log($api.jsonToStr(data));
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
	//点击获取验证码2
	$("#getCaptcha2").click(function() {
		var text = $('#num').val();
		var length = text.length;
		var input = /^[\s]*$/;
		
		if (input.test(text)) {
		api.alert({
				msg : "手机号不能为空"
			}, function(ret, err) {
				//coding...
			});
		} else if (length !== 11 ||!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(text)) {
			api.alert({
				msg : "您输入的号码格式不正确"
			}, function(ret, err) {
				//coding...
			});
		}else if (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(text)) {
			showPro();
			settime(this);
			AjaxUtil.exeScript({
				script : "managers.home.person",
				needTrascation : false,
				funName : "getcode",
				form : {
					memberid : memberid,
					telphone : $('#num').val(),
					type : 2
				},
				success : function(data) {
					console.log($api.jsonToStr(data));
					api.hideProgress();
					if (data.execStatus == 'true') {
						if (data.formDataset.checked == 'true') {
							telphone = $('#num').val();
							code = data.formDataset.code;
							console.log('code'+code)
						} else {
						api.alert({
				msg : '该手机号已经被使用，请您输入正确号码。'
			}, function(ret, err) {
				//coding...
			});
						}
					} else {
						api.alert({
							title : '温馨提示：',
							msg : '请求失败！',
						}, function(ret, err) {
						});
					}
				}
			});
		} else {
		api.alert({
				msg : '您输入的号码格式不正确'
			}, function(ret, err) {
				//coding...
			});
		}
	});
	var HEIGHT = $('body').height();
	$(window).resize(function() {
		$('.page').height(HEIGHT);
	});
	$('#next').click(function() {
		if ($('#vaildCode').val() == code) {
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
	$(document).on('touchstart', '.buttong#next', function() {
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
			o.style.background = "#fff";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.value = "重新发送(" + wait + ")";
			o.style.background = "#bfbfbf";
			wait--;
			setTimeout(function() {
				settime(o);
			}, 1000)
		}
	}

	//提交按钮点击
	$('#sub').click(function() {
		if ($('#vCode').val() == code) {
			AjaxUtil.exeScript({
				script : "managers.home.person",
				needTrascation : false,
				funName : "updatememberinfo",
				form : {
					headurl : "",
					nick : "",
					sex : "",
					birthday : "",
					address : "",
					telphone : telphone,
					pwd : "",
					memberid : memberid,
					idCard:""
				},
				success : function(data) {
					api.hideProgress();
					if (data.execStatus == 'true') {
						FileUtils.readFile("info.json", function(info, err) {
							if (info != null) {
								userInfo = info;
							}
							userInfo.telphone = telphone;
							//重新写入文件
							FileUtils.writeFile(userInfo, "info.json");
							api.setPrefs({
								key : 'telphone',
								value : telphone
							});
							api.execScript({//刷新person界面数据
								name : 'content',
								script : 'refresh();'
							});
							closePage();
						});
					}
				}
			});
		} else {
		var text = $('#num').val();
		if (text == null || text == "") {
			alert("手机号不能为空");
			return false;
		} else if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(text)) {
			alert("您输入的号码格式不正确");
			return false;
		}
		api.alert({
				msg : '您输入的验证码不正确，请重新输入'
			}, function(ret, err) {
				//coding...
			});
		}
	});

}
function goback() {
	api.closeWin();
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