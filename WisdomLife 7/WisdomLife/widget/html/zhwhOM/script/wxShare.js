function weixin_bind() {
	om_wx.auth(function(ret, err) {
		if (ret.status) {
			//换取 accessToken
			weixin_token(ret.code);
			$$('#bind_weixin_link').find('img').attr('src', 'image/setting/ic_setting_weixin.png');
			$$('#bind_weixin_link').find('.item-text').text('已绑定');
		} else {
			//什么都不提示
		}
	});
}

function weixin_token(code) {
	om_wx.getToken({
		code : code
	}, function(ret, err) {
		if (ret.status) {
			//接口调用凭证，传给 getUserInfo 接口 获取用户信息；有效期2小时
			var accessToken = ret.accessToken;
			//当 accessToken 过期时把该值传给 refreshToken 接口刷新 accessToken 的有效期。dynamicToken 的有效期为30天
			var dynamicToken = ret.dynamicToken;
			var openId = ret.openId;

			$$.ajax({
				url : server_address + 'index.php/user/user_info/saveWeiXinBind',
				data : {
					uid : uid,
					dynamicToken : dynamicToken,
					openid : openId
				},
				dataType : 'json',
				method : 'post',
				error : function(xhr, status) {
					alert(xhr + "&&" + status);
				},
				success : function(data) {
					myApp.alert('', '微信账号绑定成功！');
				}
			});

		} else {
			if (err.code == 1) {
				myApp.alert('', '取消');
			}
		}
	});
}

function weixin_refreshToken(dynamicToken) {
	om_wx.refreshToken({
		dynamicToken : ''
	}, function(ret, err) {
		if (ret.status) {
			//接口调用凭证，传给 getUserInfo 接口 获取用户信息；有效期2小时
			var accessToken = ret.accessToken;
			//当 accessToken 过期时把该值传给 refreshToken 接口刷新 accessToken 的有效期。dynamicToken 的有效期为30天
			var dynamicToken = ret.dynamicToken;
			var openId = ret.openId;
			$$.ajax({
				url : server_address + 'index.php/user/user_info/saveWeiXinBind',
				dataType : 'json',
				data : {
					uid : uid,
					dynamicToken : dynamicToken,
					openid : openid
				},
				type : 'post',
				success : function(data) {
					myApp.alert('', '微信账号绑定成功！');
				}
			});

		} else {
			if (err.code == 1) {
				myApp.alert('', '取消');
			}
		}
	});
}