var userInfo="";
var userNo;
var nickname;
var telphone;
var communityName="";
var merchantNo="";
var estateId="";
var estateName="";
var dealNo="";
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'margin-top:44px;');
        }else{
            $api.css(header, 'margin-top:20px;');
        }
	}
	//获取用户信息
	
	userNo = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    nickname = api.getPrefs({
	    sync:true,
	    key:'nickname'
    });
    telphone = api.getPrefs({
	    sync:true,
	    key:'telphone'
    });
	communityName=api.pageParam.communityName;
	merchantNo=api.pageParam.id;
	estateId=api.pageParam.estateId;
	$("#merchantName").html('您向'+communityName+'物业缴纳');
	
//	$("#merchantID").html("ID:" + merchantNo);
	//9.获取物业名字
//	function queryEstateCommunity() {
//		var data = {
//			"estateId" : estateId
//		};
//		$.ajax({
//			url : rootUrls + '/estate/queryEstateCommunity.do',
//			type : 'post',
//			dataType : 'json',
//			data : JSON.stringify(data),
//			contentType : "application/json;charset=utf-8",
//			success : function(result) {
//				console.log($api.jsonToStr(result));
//				var data = result.data;
//				if (result.state == 1) {
//					estateName=data.estateName;
//				} else {
//					
//				}
//			}
//		});
//	}
// 	queryEstateCommunity();
 	//获取金额
 	function queryCommunityServiceMoney() {
// 		alert(1)
		var data = {
			"tenementId" : merchantNo
		};
		$.ajax({
			url : rootUrls + '/estate/queryCommunityServiceMoney.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
//					alert(data.tenementSum);
					$("#payMoney").val(data.tenementSum);
					dealNo=data.dealNo;
				} else {
					
				}
			}
		});
	}
   	queryCommunityServiceMoney();
 	//发放钥匙
 	function grantElectronKey() {
// 		alert(merchantNo);
		var data = {
			"tenementId" : merchantNo
		};
		$.ajax({
			url : rootUrls + '/tenement/grantElectronKey.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					api.toast({
	                    msg:result.msg
                    });				
				} else {
					api.toast({
	                    msg:result.msg
                    });	
				}
			}
		});
	}
 	
	//提交支付调用支付宝接口
	$('#apply').click(function() {
		var amount=$("#payMoney").val();
		if (userNo == 'userNo' || userNo == null) {
			api.alert({
				msg : "您是否登录了？请先去登录吧！"
			});
			return false;
		}
		var data = {
			"subject" : communityName,
			"body" : "小客智慧生活物业维修费支付",
			"amount" : amount,
			"tradeNO" : dealNo
		};
		$.ajax({
			type : 'POST',
			url : rootUrls + '/xk/wyPayInfo.do',
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
							grantElectronKey();
							api.alert({
								msg : "支付成功！"
							});
							api.execScript({//刷新银行卡列表页面
								name : 'myhouse',
								script : 'refresh();'
							});
								AjaxUtil.exeScript({
								script : "managers.pushMessage.msg", //推送消息
								needTrascation : false,
								funName : "pushmsg",
								form : {
									userNo : userNo,
									msg : "您有一笔消费,消费总计为" + amount + "元",
									type : 1
								},
								success : function(data) {
									console.log($api.jsonToStr(data));
								}
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
				api.toast({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		}); 

		
//		if (merchantNo == '' || merchantNo == null || merchantNo == 'undefined') {
//			api.alert({
//				msg : "没有获取到商家信息，要不重新扫一下试试？"
//			});
//			return false;
//		}
//		var amount = $("#payMoney").val();
//		if (amount <= 0) {
//			api.alert({
//				msg : "您的金额输对了吗？"
//			});
//			return false;
//		};
//		if(!/^[0-9]+.?[0-9]*$/.test(amount)){
//			api.alert({
//				msg : "非金额格式，请重新检查一下！"
//			});
//			return false;
//		}
//		var str = amount.split(".");
//		if(str.length>=2){
//			if (amount.split(".")[1].length > 1) {
//				api.alert({
//					msg : "金额最低精度为角，不能为分！"
//				});
//				return false;
//			}
//		}
		//走支付宝支付
			//或去订单号及临时数据	
//			AjaxUtil.exeScript({
//				script : "mobile.center.pay.pay",
//				needTrascation : true,
//				funName : "fastEnterBill",
//				form : {
//					userNo : userNo,
//					userName : nickname,
//					userPhone : telphone,
//					merchantNo : merchantNo,
//					merchantName : merchantName,
//					mount : $("#payMoney").val(),
//				},
//				success : function(formset) {
//					if (formset.execStatus == "true") {
//						var dealNo = formset.formDataset.dealNo;
//						var data = {
//							"subject" : communityName,
//							"body" : "小客智慧生活物业维修费支付",
//							"amount" : amount,
//							"tradeNO" : dealNo
//						};
//						$.ajax({
//							type : 'POST',
//							url : rootUrls + '/xk/wyPayInfo.do',
//							data : JSON.stringify(data),
//							dataType : "json",
//							contentType : 'application/json;charset=utf-8',
//							success : function(data) {
//								if (data.state == '1') {
//									var iaf = api.require('aliPay');
//									iaf.payOrder({
//										orderInfo : data.data
//									}, function(ret, err) {
//										if (ret.code == '9000') {
//											api.alert({
//												msg : "支付成功！"
//											});
//											AjaxUtil.exeScript({
//												script : "managers.pushMessage.msg", //推送消息
//												needTrascation : false,
//												funName : "pushmsg",
//												form : {
//													userNo : userNo,
//													msg : "您有一笔消费,消费总计为"+amount+"元",
//													type : 1
//												},
//												success : function(data) {
//													console.log($api.jsonToStr(data));
//												}
//											});
//											api.closeWin();
//										} else if (ret.code == '6001') {
//											api.toast({
//												msg : "支付已取消"
//											});
//										} else {
//											api.alert({
//												title : '支付结果',
//												msg : ret.code,
//												buttons : ['确定']
//											});
//										}
//									});
//								}
//							},
//							error : function(XMLHttpRequest, textStatus, errorThrown) {
//								console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
//								api.toast({
//									msg : "您的网络是否已经连接上了，请检查一下！"
//								});
//							}
//						});
//					} else {
//						api.alert({
//							msg : "操作失败，请联系管理员！"
//						});
//					}
//				},
//				error : function(XMLHttpRequest, textStatus, errorThrown) {
//					console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
//					api.log({
//						msg : "您的网络是否已经连接上了，请检查一下！"
//					});
//				}
//			});
	});
}
function goBack() {
	api.closeWin({
	});
}
