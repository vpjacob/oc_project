var userInfo="";
var userNo;
var nickname;
var telphone;
var merchantName="";
var merchantNo="";
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		document.body.addEventListener('touchstart', function () { });//兼容ios点击buttonactive不生效
        if (api.screenHeight == 2436){
            $api.css(header, 'margin-top:2.2rem;');
//          $api.css($api.dom('.box'),'margin-top:4.4rem;');
        }else{
            $api.css(header, 'margin-top:0.5rem;');
        }
	}else{
            $api.css($api.dom('.main'),'top:43%;');
            $('body').height($('body')[0].clientHeight);
		//处理安卓端的软键盘收起时的相应数量及价钱
		var winHeight = $(window).height();   //获取当前页面高度
		$(window).resize(function(){
		   var thisHeight=$(this).height();
		    if(winHeight - thisHeight >50){
		         //当软键盘弹出，在这里面操作
		    }else{
		        var amoutVal=$("#amout").val();
				if(amoutVal== "" || String(amoutVal)=="null" || String(amoutVal)=="undefined" || amoutVal==1){
					$("#amout").val(2);
					$("#amout").css("width","50px");
					$('#countAll').html(Number(150)+'元');
				}else{
					 var reg = /^[1-9]\d*$/;
					 if(!reg.test(amoutVal)){
					 	$("#amout").val(2);
					 	alert("只能输入正整数");
					 	$("#amout").css("width","50px");
					 }else{		 
						$('#countAll').html(Number(75*amoutVal)+'元');
					 }
				}
		
		    }
		});
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
//	merchantName=api.pageParam.name;
	var fanxiBox = $(".businesses input:checkbox");
	fanxiBox.click(function () {
       if(this.checked || this.checked=='checked'){
           fanxiBox.removeAttr("checked");
           $(this).prop("checked", true);
         }
    });
    //处理输入框动态宽度和最大长度提示
	$('#amout').bind('input propertychange', function() {
		var $this = $(this);
		var text_length = $this.val().length;
		if (text_length >= 6) {
			api.toast({
	            msg:'最多输入六位数哦，亲'
            });
			return false;
		} else {
			var current_width = parseInt(text_length) * 16+34;
			$this.css("width", current_width + "px");
		}
	}); 
	$('#amout').blur(function(){
		var amoutVal=$(this).val();
		if(amoutVal== "" || String(amoutVal)=="null" || String(amoutVal)=="undefined" || amoutVal==1){
			$("#amout").val(2);
			$("#amout").css("width","50px");
			$('#countAll').html(Number(150)+'元');
		}else{
			 var reg = /^[1-9]\d*$/;
			 if(!reg.test(amoutVal)){
			 	$("#amout").val(2);
			 	alert("只能输入正整数");
			 	$("#amout").css("width","50px");
			 }else{		 
				$('#countAll').html(Number(75*amoutVal)+'元');
			 }
		}
	});

    //数量的增加与减少
	$('#numAdd').click(function() {
		var amout = $("#amout").val();
		if (parseInt(amout) < 999999) {
			amout = parseInt(amout) + 1;
			$("#amout").val(amout);
			var numAdd=parseInt(amout) * 75;
			$('#countAll').html(Number(numAdd)+'元');
			
			var text_length = $("#amout").val().length;
			var current_width = parseInt(text_length) * 16+34;
			$("#amout").css("width", current_width + "px");
		}
	});
	$('#numSub').click(function() {
		var amout = $("#amout").val();
		if (parseInt(amout) > 2) {
			amout = parseInt(amout) - 1;
			$("#amout").val(amout);
			var numSub=parseInt(amout) * 75;
			$('#countAll').html(Number(numSub)+'元');
			
			var text_length = $("#amout").val().length;
			var current_width = parseInt(text_length) * 16+34;
			$("#amout").css("width", current_width + "px");
		}else{
			api.toast({
	            msg:'亲，不能再减了！'
            });
		}
	});
	//提交支付调用支付宝接口
	$('#goBuyEgg').click(function() {
//		$("#goBuyEgg").css("background","#2097fb");
		var countAll=Number($("#countAll").html().split("元")[0]);
		if (userNo == 'userNo' || userNo == null) {
			api.alert({
				msg : "您是否登录了？请先去登录吧！"
			});
			return false;
		}
		if($("#zfb").prop("checked")==false &&  $("#wxPay").prop("checked")==false){
			api.alert({
				msg : "请选择支付方式"
			}); 
			return false;	
		};
		//微信支付
		if ($("#wxPay").prop("checked") == true) {
			var wxPay = api.require('wxPay');
			AjaxUtil.exeScript({
				script : "mobile.center.pay.pay",
				needTrascation : true,
				funName : "buyEggInsertTemp",
				form : {
					userNo : userNo,
					userName : nickname,
					userPhone : telphone,
					mount : countAll,
					merchantNo : "B000001",
					merchantName : "北京小客网络科技有限公司",
					type : 1
				},
				success : function(formset) {
					console.log($api.jsonToStr(formset))
					if (formset.execStatus == "true") {
						var dealNo = formset.formDataset.dealNo;
						var data = {
								"totalAmount" : countAll,
								"description" : "小客智慧生活-购买金蛋",
								"dealNo":dealNo
							}
						$.ajax({
							type : 'POST',
							url : rootUrls +'/pay/wxBuyEggGetSign.do',
							data : JSON.stringify(data),
							dataType : "json",
							contentType : 'application/json;charset=utf-8',
							success : function(result) {
                                  console.log($api.jsonToStr(result));
                               if (api.systemType == 'ios'){
									api.accessNative({
										name : 'wxpay',
										extra : {
											apiKey : result.data.appid,
											mchId : "1488789472",
											nonceStr : result.data.noncestr,
											timeStamp : result.data.timestamp,
											paySign : result.data.paySign,
											prepayId : result.data.prepayid,
                                                     iosMsg:"金蛋购买"
										}
									}, function(ret, err) {
										if (ret) {

										} else {

										}
									});
									api.hideProgress(); 
                               }else{
                                   wxPay.payOrder({
                                           apiKey: result.data.appid,
                                           mchId: "1488789472",
                                           nonceStr: result.data.noncestr,
                                           timeStamp: result.data.timestamp,
                                           sign: result.data.paySign,
                                           orderId: result.data.prepayid
                                       }, function(ret, err) {
                                           if (ret.status) {
                                               alert("支付成功");
                                               api.closeWin();
                                           } else {
                                               if(err.code=='-2'){
                                                   api.toast({
                                                           msg : "支付已取消"
                                                       });
                                                   api.hideProgress();    
                                               };
                                           }
                                       });
                               }
                               
							},
							error : function(XMLHttpRequest, textStatus, errorThrown) {
								console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
								api.toast({
									msg : "您的网络是否已经连接上了，请检查一下！"
								});
								api.hideProgress();
							}
						});
					} else {
						api.toast({
							msg : "操作失败，请联系管理员！"
						});
						api.hideProgress();	
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					api.toast({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				api.hideProgress();	
				}
			});
		};
			//或去订单号及临时数据	
		if ($("#zfb").prop("checked") == true) {	
			AjaxUtil.exeScript({
				script : "mobile.center.pay.pay",
				needTrascation : true,
				funName : "buyEggInsertTemp",
				form : {
					userNo : userNo,
					userName : nickname,
					userPhone : telphone,
					mount :countAll,
					merchantNo : "B000001",
					merchantName : "北京小客网络科技有限公司",
					type : 1
				},
				success : function(formset) {
					console.log($api.jsonToStr(formset));
					if (formset.execStatus == "true") {
						var dealNo = formset.formDataset.dealNo;
						var data = {
							"subject" : "北京小客网络科技有限公司",
							"body" : "小客智慧生活-购买金蛋",
							"amount" : countAll,
							"tradeNO" : dealNo
						};
						$.ajax({
							type : 'POST',
							url : rootUrls +'/xk/buyEggGetSign.do',
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
												script : "managers.pushMessage.msg", //推送消息
												needTrascation : false,
												funName : "pushmsg",
												form : {
													userNo : userNo,
													msg : "您有一笔消费,消费总计为"+countAll+"元",
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
					} else {
						api.alert({
							msg : "操作失败，请联系管理员！"
						});
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
					api.log({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}
			});
		}	
	});
}
function goBack() {
	api.closeWin({
	});
}
