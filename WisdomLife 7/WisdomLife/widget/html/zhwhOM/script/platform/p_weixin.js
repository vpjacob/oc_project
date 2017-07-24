/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-07-02
 * Desc     :Apicloud开发环境下微信相关接口
 * Author   :Spirit
 *******************************************************************************/
/**
 *  @namespace Auto517.Weixin
 *  Method:
 *  var weixin = Auto517.Weixin();
 *  weixin.wxPay();
 */
var _p_weixin = function() {
	var wxPay = api.require('wxPay');
	var wx = api.require('wx');
	/**
	 * 微信支付
	 * @param {Object} params
	 * 支付需要的JSON对象，根据api规范和实际业务需要组装。
	 *
	 * @param {Object} callback
	 * 回调函数名称 ，回调函数用于处理支付后的相关业务操，
	 * 执行回调函数时回传两个参数：
	 * 参数1、是调用支付函数时传的params，回调时原封不动返回
	 * 参数2、是支付结果，成功：true，失败：false
	 */
	var _wxPay = function(params, callback) {
		wx.isInstalled(function(rets, err) {
			if (rets.installed) {
				//	var params={description: 'iPad mini 16G 白色',totalFee: '888',tradeNo: '1217752501201407033233368018'};
				wxPay.config({}, function(ret, err) {
					if (ret.status) {
						wxPay.pay(params, function(ret, err) {
							if (ret.status) {
								toast.show('支付成功！');
								//执行回调函数
								eval(callback(params, true));
							} else {
								if (err.msg == 'NOAUTH') {
									toast.show('支付失败：商户无此接口权限');
								} else if (err.msg == 'NOTENOUGH') {
									toast.show('支付失败：余额不足');
								} else if (err.msg == 'ORDERPAID') {
									toast.show('支付失败：商户订单已支付');
								} else if (err.msg == 'ORDERCLOSED') {
									toast.show('支付失败：订单已关闭');
								} else if (err.msg == 'SYSTEMERROR') {
									toast.show('支付失败：系统错误');
								} else if (err.msg == 'APPID_NOT_EXIST') {
									toast.show('支付失败：APPID不存在');
								} else if (err.msg == 'MCHID_NOT_EXIST') {
									toast.show('支付失败：MCHID不存在');
								} else if (err.msg == 'APPID_MCHID_NOT_MATCH') {
									toast.show('支付失败：appid和mch_id不匹配');
								} else if (err.msg == 'LACK_PARAMS') {
									toast.show('支付失败：缺少参数');
								} else if (err.msg == 'OUT_TRADE_NO_USED') {
									toast.show('支付失败：商户订单号重复');
								} else if (err.msg == 'SIGNERROR') {
									toast.show('支付失败：签名错误');
								} else if (err.msg == 'XML_FORMAT_ERROR') {
									toast.show('支付失败：XML格式错误');
								} else if (err.msg == 'REQUIRE_POST_METHOD') {
									toast.show('支付失败：请使用post方法');
								} else if (err.msg == 'POST_DATA_EMPTY') {
									toast.show('支付失败：post数据为空');
								} else if (err.msg == 'NOT_UTF8') {
									toast.show('支付失败：编码格式错误');
								} else {
									if (err.code == -2) {
										toast.show('支付失败：用户取消');
									} else if (err.code == 1) {
										toast.show('支付失败：必传参数缺失');
									} else {
									    console.log('weixin back:'+JSON.stringify(ret)+' err:'+JSON.stringify(err));
										toast.show('支付失败：可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等');
									}

								}
								//执行回调函数
								eval(callback(params, false));
							}
						});
					} else {
						if (err.code == 1) {
							toast.show('支付失败：apiKey 值非法');
						} else if (err.code == 2) {
							toast.show('支付失败：mchId 值非法');
						} else if (err.code == 3) {
							toast.show('支付失败：partnerKey 值非法');
						} else if (err.code == 4) {
							toast.show('支付失败：notifyUrl 值非法');
						} else {
							toast.show('支付失败：未知错误');
						}
						//执行回调函数
						eval(callback(params, false));

					}
				});
			} else {
				toast.show('当前设备未安装微信客户端');
			}
		});

	};
	/**
	 * 微信分享
	 * @param {Object} params
	 */
	_wxShare = function(params) {
		wx.isInstalled(function(ret, err) {
			if (ret.installed) {
				wx.shareWebpage(params, function(ret, err) {
					if (ret.status) {
						toast.show('分享成功');
					} else {
						var errcode = err.code;

						if (errcode == 1) {
							toast.show('apiKey非法');
						} else if (errcode == 2) {
							toast.show('用户取消');
						} else if (errcode == 3) {
							toast.show('发送失败');
						} else if (errcode == 4) {
							toast.show('授权拒绝');
						} else if (errcode == 5) {
							toast.show('微信服务器返回的不支持错误');
						} else if (errcode == 6) {
							toast.show('当前设备未安装微信客户端');
						} else if (errcode == 7) {
							toast.show('注册SDK失败');
						} else {
							toast.show('未知错误');
						}

					}
				});

			} else {
				toast.show('当前设备未安装微信客户端');
			}
		});
	}

	return {
		"wxPay" : _wxPay,
		"wxShare" : _wxShare
	};
}
Auto517.regist(_p_weixin, "Weixin");
