apiready = function() {
	var header = $api.byId('title');
	var contentB = $api.dom('.content-block')
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
		$api.css(contentB, 'margin-top:20px;');
	};
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		count(urId);

	});
	//总计的方法
	function count(urId) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "queryEggInfo",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.account;
					var list = $api.strToJson(account);
					$("#dotleft").html(list.gold_egg_count);
					$("#dotmidd").html(list.silver_egg_count);
					$("#dotright").html(list.may_buyback);

				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	}

	//我的订单
	$('#myrecord').click(function() {
		api.openWin({
			name : 'myrecord',
			url : '../html/wallet/myrecord.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//我的金蛋
	$('#myegg').click(function() {
		api.openWin({
			name : 'myegg',
			url : '../html/wallet/myegg.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//我要回购
	$('#buyback').click(function() {
		api.openWin({
			name : 'buyback',
			url : '../html/wallet/buyback.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//收益明细跳转
	$('#incomeInfo').click(function() {
		api.openWin({
			name : 'goldCount',
			url : '../html/personal/goldCount.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
};
//扫一扫支付跳转
$('#payMoney').click(function() {
	var scanner = api.require('scanner');
	scanner.open(function(ret, err) {
		if (ret.eventType == 'success') {
			var content = ret.msg.split(",");
			AjaxUtil.exeScript({
				script : "mobile.center.pay.pay",
				needTrascation : true,
				funName : "getMerchantNo",
				form : {
					merchantNo : content[0],
					merchantName : content[1],
				},
				success : function(formset) {
					if (formset.execStatus == "true") {
						var mNo = formset.formDataset.mNo;
						if (mNo == '9999' && (content[2] != '1' || content[2] != '2')) {
							api.alert({
								msg : "扫描信息不正确，请扫描正确的二维码！"
							});
						} else {
							api.openWin({//详情界面
								name : 'myPay',
								url : '../html/personal/myPay.html',
								slidBackEnabled : true,
								animation : {
									type : "push", //动画类型（详见动画类型常量）
									subType : "from_right", //动画子类型（详见动画子类型常量）
									duration : 300 //动画过渡时间，默认300毫秒
								},
								pageParam : {
									merchantNo : content[0],
									merchantName : content[1],
									type : content[2]
								}
							});
						}
					} else {
						api.alert({
							msg : "操作失败，请重新扫描一下试试！"
						});
						return false;
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}
			});

		} else {
		}
	});
});

$('#payRecord').click(function() {
	api.openWin({
		name : 'payRecord',
		url : '../html/personal/payRecord.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	})
});
//我的订单跳转
$('#myDeal').click(function() {
	api.openWin({
		name : 'payRecord',
		url : '../html/personal/mydeal.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	})
});

function goBack() {
	api.closeWin({
	});
}
