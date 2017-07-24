myApp.onPageInit('login', function(page) {
	var tempuid=0;

	$$('#login_button').on('click', function() {
		$$('#user_login').show();
		$$('#user_findpwd').hide();
		$$('.my_modal_in').hide();
	});

	$$('#findpwd_button').on('click', function() {
		$$('#user_login').hide();
		$$('#user_findpwd').show();
		$$('.my_modal_in').hide();
	});

	$$('.login-screen').on('close', function() {
		$$('#user_login').hide();
		$$('#user_register').hide();
		$$('.my_modal_in').show();
	});
	var mySwiper = myApp.swiper('#login_spwiper', {
		effect: 'fade',
		centeredSlides: true,
		autoplay: 5000,
		speed: 3000,
		loop: true
	});

	$$('#register_button').on('click', function() {
		$$('#user_register').show();
		$$('.my_modal_in').hide();
	});

	$$('#login-button').on('click', function() {
		var l_username = $$('#l_username').val();
		var l_password = $$('#l_password').val();
		if (!/\d{11}/.test(l_username)) {
			myApp.alert('', '用户名填写错误');
		} else if (!/^[a-zA-Z]\w{5,17}$/.test(l_password)) {
			myApp.alert('', '密码填写错误');
		} else {
			var form = $$('#login-form');
			data = new FormData(form[0]);
			var xhr = $$.ajax({
				method: 'post',
				url: server_address + 'index.php/index/Index_ajax/check_login',
				data: data,
				beforeSend: function(xhr) {
					form.trigger('beforeSubmit', {
						data: data,
						xhr: xhr
					});
				},
				error: function(xhr) {
					form.trigger('submitError', {
						data: data,
						xhr: xhr
					});
				},
				success: function(data) {
					form.trigger('submitted', {
						data: data,
						xhr: xhr
					});
				}
			});
		}

	});

	$$('#login-form').on('submitted', function(e) {
		var data = eval('(' + e.detail.data + ')');
		var message = data.message;
		if ('success' == message) {
//			if (bMap != null) {
//				getUserLocation();
//			}
			var user = new Object();
			user.uid = data.uid;
			user.omcode = data.omcode;
			user.username = data.username;
			user.password = data.password;
			user.userImg = data.userImg;

			window.localStorage.setItem("om_app_super", JSON.stringify(user));
			uid = data.uid;
			omcode = data.omcode;
			uname = data.username;
			uimg = data.userImg;
			im_init();
			searchManageForMessaage();
			mainView.router.loadPage('html/nearby/nearbyMain.html');
		} else {
			myApp.alert('', message);
		}
	});
	
		//*********************find pwd begin***************************************
	$$('#renew_btn').on('click', function() {
		var f_username = $$('#f_username').val();
		var new_pwd = $$('#new_pwd').val();
		var renew_pwd = $$('#renew_pwd').val();
		var f_smscode = $$('#f_smscode').val();
		if (!/\d{11}/.test(f_username)) {
			myApp.alert('', '请正确填写手机号');
		} else if (!/\d{6}/.test(f_smscode)) {
			myApp.alert('', '验证码错误');
		} else if (!/^[a-zA-Z]\w{5,17}$/.test(new_pwd)) {
			myApp.alert('', '正确格式为：以字母开头，长度在6-18之间，只能包含字母、数字和下划线。', '请正确填写密码');
		} else if (new_pwd != renew_pwd) {
			myApp.alert('', '两次输入密码的不一致');
		} else {
			var form = $$('#pwd-form');
			data = new FormData(form[0]);
			var xhr = $$.ajax({
				method: 'post',
				url: server_address + 'index.php/index/Index_ajax/findpwd',
				data: data,
				beforeSend: function(xhr) {
					form.trigger('beforeSubmit', {
						data: data,
						xhr: xhr
					});
				},
				error: function(xhr) {
					form.trigger('submitError', {
						data: data,
						xhr: xhr
					});
				},
				success: function(data) {
					form.trigger('submitted', {
						data: data,
						xhr: xhr
					});
				}
			});
		}
	});
	$$('#pwd-form').on('submitted', function(e) {
		var data = eval('(' + e.detail.data + ')');
		var message = data.message;
		if ('success' == message) {
//			if (bMap != null) {
//				getUserLocation();
//			}
			var user = new Object();
			user.uid = data.uid;
			user.omcode = data.omcode;
			user.username = data.username;
			user.password = data.password;
			user.userImg = data.userImg;

			window.localStorage.setItem("om_app_super", JSON.stringify(user));
			uid = data.uid;
			omcode = data.omcode;
			uname = data.username;
			uimg = data.userImg;
			im_init();
			searchManageForMessaage();
			mainView.router.loadPage('html/nearby/nearbyMain.html');
		} else {
			myApp.alert('', message);
		}
	});
	//**********************find pwd end**************************
	
	//********************注册用户第一步begin*******************
	$$('#register_back').on('click', function() {
		$$('#register-form').show();
		$$('#headerImg-form').hide();
		$$('#keyword-form').hide();
	});
	$$('#register-button').on('click', function() {
		var r_username = $$('#r_username').val();
		var r_password = $$('#r_password').val();
		var r_smscode = $$('#r_smscode').val();
		var r_gender = $$('#r_gender').val();
		if (!/\d{11}/.test(r_username)) {
			myApp.alert('', '请正确填写手机号');
		} else if (!/^[a-zA-Z]\w{5,17}$/.test(r_password)) {
			myApp.alert('', '正确格式为：以字母开头，长度在6-18之间，只能包含字母、数字和下划线。', '请正确填写密码');
		} else if (!/\d{6}/.test(r_smscode)) {
			myApp.alert('', '验证码错误');
		} else if (r_gender == 0) {
			myApp.alert('', '请选择性别');
		} else {
			var form = $$('#register-form');
			data = new FormData(form[0]);
			var xhr = $$.ajax({
				method: 'post',
				url: server_address + 'index.php/index/Index_ajax/save_register',
				data: data,
				success: function(data) {
					form.trigger('submitted', {
						data: data,
						xhr: xhr
					});
				}
			});
		}
	});
	$$('#register-form').on('submitted', function(e) {
		var data = eval('(' + e.detail.data + ')');
		var message = data.message;
		if ('success' == message) {
			tempuid = data.tempuid;
			$$('#register-form').hide();
			$$('#headerImg-form').show();
		} else {
			myApp.alert('', message);
		}
	});
	//********************注册用户第一步end***********************************

	//********************注册用户第二步begin*********************************
	$$('#headerImg-button').on('click', function() {
		var imageUrl = $$('#user-real-header').attr('src');
		if (imageUrl.length == 0) {
			myApp.alert('头像需要上传哦！', '哦脉提示');
			return false;
		} else {
			var user64img = $$('#user64img').text();
			$$.ajax({
				url: server_address + 'index.php/index/Index_ajax/save_header',
				dataType: 'json',
				data: {
					tempuid: tempuid,
					imageUrl: user64img
				},
				type: 'post',
				success: function(data) {
					if (data.message == 'error') {
						toast.show("上传头像失败");
					} else {
						$$('#register-form').hide();
						$$('#headerImg-form').hide();
						$$('#keyword-form').show();
					}

				}
			});
		}

	});
	//********************注册用户第二步end*********************************

    //********************注册第三部begin***********************************
	$$('#keyword-button').on('click', function() {
		var keyword1 = $$('#keyword1').val().replace(/(^\s*)|(\s*$)/g, "");
		var keyword2 = $$('#keyword2').val().replace(/(^\s*)|(\s*$)/g, "");
		var keyword3 = $$('#keyword3').val().replace(/(^\s*)|(\s*$)/g, "");
		var keyword4 = $$('#keyword4').val().replace(/(^\s*)|(\s*$)/g, "");
		var keyword5 = $$('#keyword5').val().replace(/(^\s*)|(\s*$)/g, "");
		if (keyword1 == '' && keyword2 == '' && keyword3 == '' && keyword4 == '' && keyword5 == '') {
			myApp.alert('', '至少要填写一个关键词，关键词可以使更多的伙伴发现您哦！');
		} else {
			var form = $$('#keyword-form');
			data = new FormData(form[0]);
			data.append('tempuid', tempuid);
			var xhr = $$.ajax({
				method: 'post',
				url: server_address + 'index.php/index/Index_ajax/save_keyword',
				data: data,
				success: function(data) {
					form.trigger('submitted', {
						data: data,
						xhr: xhr
					});
				}
			});
		}
	});
	$$('#keyword-form').on('submitted', function(e) {
		var data = eval('(' + e.detail.data + ')');
		var message = data.message;
		if ('success' == message) {
//			if (bMap != null) {
//				getUserLocation();
//			}
			var user = new Object();
			user.uid = data.uid;
			user.omcode = data.omcode;
			user.username = data.username;
			user.password = data.password;
			user.userImg = data.userImg;

			window.localStorage.setItem("om_app_super", JSON.stringify(user));
			uid = data.uid;
			omcode = data.omcode;
			uname = data.username;
			uimg = data.userImg;
			mainView.router.loadPage('html/nearby/nearbyMain.html');
		} else {
			myApp.alert('', message);
		}
	});

});

//用户注册选择头像或拍照
$$(document).on('click', '.user-header', function() {
	var buttons1 = [{
		text: '拍照',
		onClick: function() {
			api.getPicture({
				sourceType: 'camera',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: true
			}, function(ret, err) {
				if (ret) {
					imageUrl = ret.data;
					imageUrlBase64 = ret.base64Data;
					var imageUrlInfo = '<div style="display: none" id="user64img">' + imageUrlBase64 + '</div>';
					$$('#headerImg-form').append(imageUrlInfo);
					$$('#user-real-header').attr('src', imageUrl);
					$$('#user-defalt-img').hide();
					$$('#user-real-header').show();
					//发送个事件
					api.sendEvent({
						name: 'newPicUser',
						extra: {
							fileName: 'waiting'
						}
					});

				} else {
					
				}
			});
		}
	}, {
		text: '从手机相册选择',
		onClick: function() {
			api.getPicture({
				sourceType: 'library',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: false
			}, function(ret, err) {
				if (ret) {
					imageUrl = ret.data;
					imageUrlBase64 = ret.base64Data;
					var imageUrlInfo = '<div style="display: none" id="user64img">' + imageUrlBase64 + '</div>';
					$$('#headerImg-form').append(imageUrlInfo);
					$$('#user-real-header').attr('src', imageUrl);
					$$('#user-defalt-img').hide();
					$$('#user-real-header').show();

					//发送个事件
					api.sendEvent({
						name: 'newPicUser',
						extra: {
							fileName: 'waiting'
						}
					});

				} else {
					
				}
			});
		}
	}];
	var buttons2 = [{
		text: '取消',
		color: 'red'
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});

//function getUserLocation() {
//	user_lat = '';
//	user_lon = '';
//	user_address = '';
//	user_province = '';
//	user_city = '';
//	user_district = '';
//	user_streetName = '';
//	user_streetNumber = '';
//	Auto517.bMap._bmap_open('41.6','42.5');
////	bMap.getLocation({
////		accuracy: '100m',
////		autoStop: true,
////		filter: 1
////	}, function(ret, err) {
////		if (ret.status) {
////			user_lat = ret.lat;
////			user_lon = ret.lon;
////			//ajax插入表中
////			$$.ajax({
////				url: server_address + 'index.php/user/user_info/saveUpdateUserInfoLon',
////				dataType: 'json',
////				data: {
////					userID: uid,
////					userLon: user_lon,
////					userLat: user_lat
////				},
////				type: 'post',
////				success: function(data) {
////					bMap.getNameFromCoords({
////						lon: user_lon,
////						lat: user_lat
////					}, function(ret, err) {
////						if (ret.status) {
////							user_address = ret.address; //字符串类型；地址信息
////							user_province = ret.province; //字符串类型；省份
////							user_city = ret.city; //字符串类型；城市
////							user_district = ret.district; //字符串类型；县区
////							user_streetName = ret.streetName; //字符串类型；街道名
////							user_streetNumber = ret.streetNumber; //字符串类型；街道号
////						}
////					});
////				}
////			});
////		} else {
////			alert('定位失败');
////		}
////	});
//}

var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function sendMessage(flag) {
	if (flag == 1) {
		var r_username = $$('#r_username').val();
	} else {
		var r_username = $$('#f_username').val();
	}

	if (!/\d{11}/.test(r_username)) {
		myApp.alert('请正确填写手机号');
	} else {
		curCount = count;　　 //设置button效果，开始计时
		$$("#btnSendCode").attr("disabled", "true");
		$$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
		InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
		　　 //向后台发送处理数据
		$$.ajax({　　
			type: "POST",
			　　dataType: "json",
			url: server_address + 'index.php/sms/SendTemplateSMS/send_message',
			　　data: {
				username: r_username
			},
			　　error: function(XMLHttpRequest, textStatus, errorThrown) {},
			　　success: function(msg) {}
		});
	}　
}

//timer处理函数
function SetRemainTime() {
	if (curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$$("#btnSendCode").removeAttr("disabled"); //启用按钮
		$$("#btnSendCode").val("重新发送验证码");
	} else {
		curCount--;
		$$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	}
}