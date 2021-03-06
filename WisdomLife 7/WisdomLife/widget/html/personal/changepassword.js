var memberid;
var code;
var wait = 60;
var text;
var urId = '';
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.box');
		var dd =$api.dom('.itemSameContent input');
        if (api.screenHeight == 2436){
            $api.css(cc, 'margin-top:4.9rem;');
            $api.css(header, 'padding-top:2.2rem;');
			$api.css(header, 'height:4.4rem;');
        }else{
            $api.css(cc, 'margin-top:3.7rem;');
            $api.css(header, 'padding-top:1rem;');
			$api.css(header, 'height:3.2rem;');
			$(".itemSameContent input").css("height","1.0rem");
			$(".itemSameContent input").css("line-height","1.0rem");
        }
	}
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    getPhone(urId);
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
	$(document).on('touchend', '#next', function() {
		if ($('#vaildCode').val() == '') {
			api.alert({
				msg : '您输入的验证码不能为空'
			}, function(ret, err) {
				//coding...
			});
			$('#vaildCode').val('');
		} else if ($('#vaildCode').val() == code) {
			$(".paddingOne").hide();
			$('.paddingTwo').show();
			$('.changeStep').html("2/2");
		} else {
			api.alert({
				msg : '您输入的验证码不正确，请重新输入'
			}, function(ret, err) {
				//coding...
			});
			$('#vaildCode').val('');
		}
	});

	function settime(o) {
		if (wait == 0) {
			o.removeAttribute("disabled");
			o.innerHTML = "获取验证码";
			o.style.background = "#fff";
			o.style.color = "#38ACFF";
			o.style.border = "1px solid #38ACFF";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.innerHTML = "重新发送(" + wait + ")";
			o.style.background = "#e0e0e0";
			o.style.color = "#fff";
			o.style.border = "none";
			wait--;
			setTimeout(function() {
				settime(o);
			}, 1000)
		}
	}


	$(document).on('click', '#sub', function() {
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
			script : "synchrodata.memeber.memeber",
			needTrascation : true,
			funName : "getUserNo",
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					if (data.formDataset.userNo != '' && data.formDataset.userNo != null && data.formDataset.userNo != "undefinded") {
						userNoNew = data.formDataset.userNo;
						var params = {};
						params.userNo = urId;
						params.password  =$('#num').val();
						$.ajax({
							url : shopPath + "/member/register/modifyMemberPassword",
							type : "GET",
							data : params,
							cache : false,
							dataType : 'jsonp',
							scriptCharset : 'utf-8',
							jsonp : 'callback',
							jsonpCallback : "successCallback",
							crossDomain : true,
							success : function(data) {
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
										console.log($api.jsonToStr(data));
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
						});
					}
				}
			}
		});
		}
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
					console.log($api.jsonToStr(data));
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
