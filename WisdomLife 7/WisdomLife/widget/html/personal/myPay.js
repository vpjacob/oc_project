var userInfo="";
var oldPwd="";
var userNo;
var nickname;
var telphone;

apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
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
	oldPwd(userNo);
	queryUserAccountByUserNo(userNo);
	var param = api.pageParam;
	$("#merchantName").html(param.merchantName);
	$("#merchantID").html("ID:" + param.merchantNo);
	var fanxiBox = $(".businesses input:checkbox");
    fanxiBox.click(function () {
       if(this.checked || this.checked=='checked'){
           fanxiBox.removeAttr("checked");
           $(this).prop("checked", true);
         }
    });
//  获取二级密码    
    function oldPwd(urId) {
		AjaxUtil.exeScript({
			script : "managers.home.person",
			needTrascation : true,
			funName : "querySecondPwd",
			form : {
				userNo : urId
			},
			success : function(data) {
				//console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.secondPwd;
					oldPwd = account;
				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	}
    //获取剩余金币个数
    function queryUserAccountByUserNo(urId) {
		var data = {
			"userNo" : urId,
		};
		$.ajax({
			url : rootUrls + '/xk/queryUserAccountByUserNo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					$("#residueMoney").html(data.mayBuyback)
				} else {
					alert(result.msg);
				}
			}
		});
	}
    
	//提交支付调用支付宝接口
	$('#apply').click(function() {

		if (userNo == 'userNo' || userNo == null) {
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
		if($("#zfb").prop("checked")==false && $("#xk").prop("checked")==false){
			alert("请选择支付方式");	
			return false;	
		};
		var amount = $("#payMoney").val();
		if (amount <= 0) {
			api.alert({
				msg : "您的金额输对了吗？"
			});
			return false;
		};
		var residueMoney=$("#residueMoney").html();
		if($("#xk").prop("checked")==true){
			if (Number(amount) > Number(residueMoney)) {
				api.alert({
					msg : "您的金额大于剩余金币数，请重新输入！"
				});
				return false;
			}
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
				userNo : userNo,
				userName : nickname,
				userPhone : telphone,
				merchantNo : param.merchantNo,
				merchantName : param.merchantName,
				mount : $("#payMoney").val(),
				type : param.type
			},
			success : function(formset) {
				if (formset.execStatus == "true") {
					var dealNo = formset.formDataset.dealNo;
					//走金币支付
					if ($("#xk").prop("checked") == true) {
						$(".tankuang_box").show();
						$(".black_box").show();
						document.getElementById("agree").onclick=function() {
//						$(".agree").click(function() {
							if ($("#pwd").val() == oldPwd) {
								var data = {
									"amount" : amount,
									"dealNo" : dealNo
								};
								$.ajax({
									type : 'POST',
									url : rootUrls + '/xk/payGoldCoin.do',
									data : JSON.stringify(data),
									dataType : "json",
									contentType : 'application/json;charset=utf-8',
									success : function(data) {
										console.log($api.jsonToStr(data));
										if (data.state == '1') {
											$(".tankuang_box").hide();
											$(".black_box").hide();
											api.toast({
												msg : data.msg
											});
											setTimeout(function() {
												api.closeWin();
												api.execScript({//刷新银行卡列表页面
													name : 'my-qianbao',
													script : 'refresh();'
												});
											}, 500);
										}
									},
									error : function(XMLHttpRequest, textStatus, errorThrown) {
										console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
										api.alert({
											msg : "您的网络是否已经连接上了，请检查一下！"
										});
									}
								});
							} else if ($("#pwd").val() == "") {
								alert('请您输入二级密码');
								return false;
							} else {
								alert('您输入二级密码有误');
								return false;
							}
						};

						$(".noAgree").click(function() {
							$(".tankuang_box").hide();
							$(".black_box").hide();
						})
					}
					//走支付宝支付
					if ($("#zfb").prop("checked") == true) {
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
											AjaxUtil.exeScript({
												script : "mobile.center.pay.pay",
												needTrascation : true,
												funName : "paySendMessage",
												form : {
													phone : userInfo.telphone,
													content : "您在小客有一笔收入" + amount + "元,实际收入" + param.type == 1 ? (amount * 0.85).toFixed(3) : (amount * 0.9).toFixed(3) + "元"
												},
												success : function(data) {

												},
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
					}
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