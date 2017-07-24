/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-11-21
 * Desc     :F7在Apicloud开发环境下新浪微博的封装实现
 * Author   :Spirit
 *******************************************************************************/
/**
 *  @namespace Auto517.weibo
 *  Method:
 *  window.Auto517.weibo.weiboShare();
 */
var _p_weibo = function() {
	var weibo = api.require('weibo');
	/**
	 * 微博登录
	 * @param {Object} callback 回调函数
	 */
	var _weiboLogin = function(callback) {
		weibo.isInstalled(
			function(ret) {
				if(ret.status) {
					weibo.auth(function(ret, err) {
						if(ret.status) {
							var token = ret.token; //字符串类型；从新浪微博服务器获取的 accessToken，接口调用凭证，传给 getUserInfo 接口获取用户信息
							var expire = ret.expire; //字符串类型：token 有效期（时间戳）
							var userId = ret.userId; //字符串类型；从新浪微博服务器获取的 userId，新浪微博分配的用户id，传给 getUserInfo 接口获取用户信息
							weibo.getUserInfo({
								token: token,
								userId: userId
							}, function(ret, err) {
								if(ret.status) {
									eval(callback(ret.userInfo));
								}
							});

						} else {
							if(err.code == -1) {
								toast.show('apiKey 或 registUrl 值非法');
							} else if(err.code == 1) {
								toast.show('用户取消');
							} else if(err.code == 2) {
								toast.show('发送失败');
							} else if(err.code == 3) {
								toast.show('授权失败');
							} else if(err.code == 4) {
								toast.show('不支持的请求');
							} else if(err.code == 5) {
								toast.show('未知错误');
							}
						}
					});
				} else {
					toast.show('未安装新浪微博客户端');
				}
			}
		);
	};

	/**
	 * 注销微博授权
	 */
	var _weiboLogout = function() {
		weibo.cancelAuth(function(ret, err) {
			if(ret.status) {
				toast.show('成功退出微博授权！');
			}
		});
	};

	/**
	 * 微博分享
	 * @param {JSON对象} param
	 * @param {Object} type:text\image\music\video\webpage
	 */
	var _weiboShare = function(param, type) {
		weibo.isInstalled(
			function(ret) {
				if(ret.status) {
					if(type == 'text') {
						weibo.shareText(param, function(ret, err) {
							if(ret.status) {
								toast.show('分享成功');
							}
						});
					} else if(type == 'image') {
						weibo.shareImage(param, function(ret, err) {
							if(ret.status) {
								toast.show('分享成功');
							}
						});

					} else if(type == 'music') {
						weibo.shareMusic(param, function(ret, err) {
							if(ret.status) {
								toast.show('分享成功');
							}
						});
					} else if(type == 'video') {
						weibo.shareVideo(param, function(ret, err) {
							if(ret.status) {
								toast.show('分享成功');
							}
						});
					} else if(type == 'webpage') {
						weibo.shareWebPage(param, function(ret, err) {
							if(ret.status) {
								toast.show('分享成功');
							}
						});
					} else {
						toast.show('不支持此分享类型！');
					}
				} else {
					toast.show('未安装新浪微博客户端');
				}
			}
		);
	};

	return {
		"weiboShare": _weiboShare,
		"weiboLogin": _weiboLogin
	};
}
Auto517.regist(_p_weibo, "weibo");