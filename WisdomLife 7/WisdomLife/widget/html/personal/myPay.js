apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	//获取用户信息
	FileUtils.readFile("info.json", function(info, err) {
		userInfo = info;
	});

	var param = api.pageParam;
	$("#merchantName").html(param.merchantName);
	$("#merchantID").html("ID:" + param.merchantNo);

	//提交支付调用支付宝接口
	$('#apply').click(function() {
		if (userInfo.userNo == '' || userInfo.userNo == null) {
			api.alert({
				msg : "您是否登录了？请先去登录吧！"
			});
			return false;
		}

		if (param.merchantNo == '' || param.merchantNo == null || param.merchantNo == 'undefined') {
			api.alert({
				msg : "没有获取到商家信息，要不重新扫一下试试？"
			});
			return false;
		}

		var amount = $("#payMoney").val();
		if (amount <= 0) {
			api.alert({
				msg : "您的金额输对了吗？"
			});
			return false;
		}
		if(!/^[0-9]+.?[0-9]*$/.test(amount)){
			api.alert({
				msg : "非金额格式，请重新检查一下！"
			});
			return false;
		}
		var str = amount.split(".");
		if(str.length>=2){
			if (amount.split(".")[1].length > 1) {
			api.alert({
				msg : "金额最低精度为角，不能为分！"
			});
			return false;
		}
		}
		
		AjaxUtil.exeScript({
			script : "mobile.center.pay.pay",
			needTrascation : true,
			funName : "getDealNo",
			form : {
				userNo : userInfo.userNo,
				userName : userInfo.nickname,
				userPhone : userInfo.telphone,
				merchantNo : param.merchantNo,
				merchantName : param.merchantName,
				mount : $("#payMoney").val(),
				type : param.type
			},
			success : function(formset) {
				if (formset.execStatus == "true") {
					var dealNo = formset.formDataset.dealNo;
					var data = {
						"subject" : param.merchantName,
						"body" : "小客智慧生活支付",
						"amount" : amount,
						"tradeNO" : dealNo
					};
					$.ajax({
						type : 'POST',
						url : rootUrls + '/xk/getOrderInfo.do',
						data : JSON.stringify(data),
						dataType : "json",
						contentType : 'application/json;charset=utf-8',
						success : function(data) {
							if (data.state == '1') {
								var iaf = api.require('aliPay');
								iaf.payOrder({
									orderInfo : data.data
								}, function(ret, err) {
									if (ret.code == '9000') {
										api.alert({
											msg : "支付成功！"
										});
										api.closeWin();
									} else if (ret.code == '6001') {
										api.toast({
											msg : "支付已取消"
										});

									} else {
										api.alert({
											title : '支付结果',
											msg : ret.code,
											buttons : ['确定']
										});
									}
								});
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
							api.alert({
								msg : "您的网络是否已经连接上了，请检查一下！"
							});
						}
					});
				} else {
					api.alert({
						msg : "操作失败，请联系管理员！"
					});
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	});
}
function goBack() {
	api.closeWin({
	});
}