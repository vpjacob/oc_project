var memberid;
var code;
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
	$("#next").click(function() {
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


	$("#apply").click(function() {
		var num=$('#num').val();
		var vCode=$('#vCode').val();
		var zg=/^\d{6}$/
		 if(num==''){
			alert('亲， 请输入您的新密码');
			return false;
		}else if(!zg.test(num)){
			alert('亲，您的新密码应为六位纯数字');
			return false;
		}else if(vCode==''){
			alert('亲，输入您的确认密码');
			return false;
		}else if(!zg.test(vCode)){
			alert('亲，您的确认新密码应为六位纯数字');
			return false;
		}else if( num!=vCode){
			alert('亲，您输入的两次密码不一致');
			return false;
		}else{
			sub(urId);
		}
		
	});
	function sub(urId) {
		var vCode = $('#vCode').val();
		AjaxUtil.exeScript({
			script : "managers.home.person",
			needTrascation : true,
			funName : "updateSecondPwd",
			form : {
				userNo : urId,
				secondPwd : vCode
			},
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					api.toast({
						msg : "亲，您提交成功！"
					});
					setTimeout(function() {
						api.closeWin();
						api.execScript({//刷新个人中心页面
							name : 'content',
							script : 'refresh()'
						});
					}, 1000);
				}
			},
			error : function() {
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}

		});
	}

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
