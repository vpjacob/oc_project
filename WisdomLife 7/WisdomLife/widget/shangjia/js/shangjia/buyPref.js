var busAmount = 1;
var clickNum = 1;
var goodNum="";
var typeId="";
var selectTypeId="";
var selectDom="";
var isChecked="";
var showPrice="";
var goodMod="";
var urId="";
var Delivery="";
var oldPwd="";
apiready = function() {
	var header = $api.byId('header');
	var miancss = $api.byId('miancss');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:22px;');
		$api.css(miancss, 'height:82%');
	};
	var busid = api.pageParam.id;
	var surplusCount = api.pageParam.surplusCount;//库存剩余量
	$("#back").bind("click", function() {
		api.closeWin();
	});

	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryProductDeatilAndModelType();
//  queryDefaultAddress(urId);
	var fanxiBox = $(".businesses input:checkbox");
    fanxiBox.click(function () {
       if(this.checked || this.checked=='checked'){
           fanxiBox.removeAttr("checked");
           $(this).prop("checked", true);
         }
    });

	// 立即购买后，获取商品部分详情
	function queryProductDeatilAndModelType() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryProductDeatilAndModelType",
			        form:{
			           id:busid,
			        },
			success : function(data) {
				console.log("商品支付详情" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.product;
					var list = $api.strToJson(account);
					var lists = $api.strToJson(data.formDataset.modelTypeList);
					$("#businessImg").attr("src",rootUrl+list.img_url);
					$("#content").html(list.name);
					$("#productId").attr("data",list.id);
					goodNum=list.good_no;
					if(list.price_discount=="" ||list.price_discount==null || list.price_discount==undefined){
						$("#price").html(list.price+'元');
						$("#busTotal").html(list.price);
						$("#countAll").html(list.price+'元');
						showPrice=list.price;
					}else{
						$("#price").html(list.price_discount+'元');
						$("#busTotal").html(list.price_discount);
						$("#countAll").html(list.price_discount+'元');
						showPrice=list.price_discount;
					}
					var nowList="";
					for(var i=0;i<lists.length;i++){
						nowList+='<div class="chooseColor" >'
							+'<span>'+lists[i].name+'</span>'
							+'<span class="spanModle">请选择</span>'
							+'<select id="'+lists[i].id+'">'	
							+'<option value="0">请选择</option>'
							+'</select></div>'
//							selectDom=$('#'+lists[i].id+'');
//							queryModelByModelType(lists[i].id,goodNum);
					}
					$("#modelList").prepend(nowList);
					queryDefaultAddress(urId);
				    for(var j=0;j<lists.length;j++){
					   queryModelByModelType(lists[j].id,goodNum,lists[j].id);
					}
					api.hideProgress();
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			},
			error : function() {
				api.hideProgress();
				api.toast({
	            	msg:"您的网络是否已经连接上了，请检查一下！"
                });
			}
		});
	}
//	queryProductDeatilAndModelType();
	//更改相应的图片
	$(".choose").on("change", "select", function() {
		selectTypeId = $(this).attr("id");
		selectDom = $(this);
		isChecked=$("option:selected",this).attr("id");
		var spanDom=$(this).prev();
		 spanDom.html($("option:selected",this).html());
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryModelByModelType",
			form : {
				typeId : selectTypeId,
				goodNo : goodNum
			},
			success : function(data) {
				var account = data.formDataset.modelList;
				var list = $api.strToJson(account);
				if (data.formDataset.checked == 'true') {
					for(var i=0;i<list.length;i++){
						if(list[i].id==isChecked){
							$("#businessImg").attr("src",rootUrl+list[i].img_url);
						}
					}
				} else {
					api.toast({
	            		msg:data.formDataset.errorMsg
                	});
				}
			},
			error : function() {
				api.hideProgress();
				api.toast({
	            	msg:"您的网络是否已经连接上了，请检查一下！"
                });
			}
		});
	}); 

	// 根据商品规格类型，查找规格内容列表信息
    function queryModelByModelType(typeId,goodNum,dom){
    	 AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryModelByModelType",
			        form:{
			           typeId:typeId,
			           goodNo:goodNum
			        },
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.modelList;
					var list = $api.strToJson(account);
					var nowlist='<option value="0">请选择</option>';
					for(var i=0;i<list.length;i++){
						nowlist+='<option id="'+list[i].id+'">'+list[i].property+'</option>'
					}
					$("#"+dom+"").html(nowlist);
				} else {
					api.toast({
	            		msg:data.formDataset.errorMsg
                	});
				}
			},
			error : function() {
				api.hideProgress();
				api.toast({
	            	msg:"您的网络是否已经连接上了，请检查一下！"
                });
			}
		});
    };	
    //购买页显示的地址信息及邮费信息等
    function queryDefaultAddress(urId) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryDefaultAddress",
			        form:{
			           goodId:busid,
			           userNo:urId
			        },
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.address;
					$("#freight").html('+'+data.formDataset.postage);
					Delivery=data.formDataset.isDelivery;
					var list = $api.strToJson(account);
					$("#address").html(list.province_name+'&nbsp'+list.city_name+'&nbsp'+list.district_name+'&nbsp'+list.address); 
       				$("#userName").html(list.name); 
      			    $("#userPhone").html(list.phone); 
      			    $("#address").attr("data",list.id); 
      			    $('#countAll').html(Number(($("#price").html()).split("元")[0])+ Number(($("#freight").html()).split("+")[1])+'元');
				} else {
					api.toast({
	            		msg:data.formDataset.errorMsg
                	});
				}
			},
			error : function() {
				api.hideProgress();
				api.toast({
	            	msg:"您的网络是否已经连接上了，请检查一下！"
                });
			}
		});
	};

	//数量的增加与减少
	$('#numAdd').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) < 999) {
			amout = parseInt(amout) + 1;
			$("#amout").html(amout);
			var numAdd=(parseInt(amout) * showPrice).toFixed(2);
			$('#countAll').html((Number(numAdd)+ Number(($("#freight").html()).split("+")[1])).toFixed(2)+'元');
			$("#busTotal").html(numAdd);
//			$('#countAll').html(parseInt(amout) * 0.01 + '元');
		}
	});
	$('#numSub').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) > 1) {
			amout = parseInt(amout) - 1;
			$("#amout").html(amout);
			var numSub=(parseInt(amout) * showPrice).toFixed(2);
			$('#countAll').html((Number(numSub)+ Number(($("#freight").html()).split("+")[1])).toFixed(2)+'元');
			$("#busTotal").html(numSub);
//			$('#countAll').html(parseInt(amout) * 0.01 + '元');
		}
	});
	//提交支付调用支付宝接口
	$('#apply').click(function() {
		var amoutVal=$("#amout").html();
		goodMod="";
		if (urId == 'userNo' || urId == null) {
			api.alert({
				msg : "您是否登录了？请先去登录吧！"
			});
			return false;
		};
		if(Delivery==2){
      		 api.alert({
				msg : "亲,您选择的地址不在配送范围之内"
			}); 
			return false;		    
      	}	    
		var sel=$('select');
		for(var i=0;i<sel.length;i++){
			if($("option:selected",sel[i]).attr("id")==undefined || $("option:selected",sel[i]).attr("id")=='' || $("option:selected",sel[i]).attr("id")==null){				
				api.alert({
					msg : "请选择商品的规格！"
				});
				return false;
			}else{
				goodMod+=($("option:selected",sel[i]).html()+",");
			}
		};
		if(parseInt(amoutVal)>parseInt(surplusCount)){
			 api.alert({
				msg : "亲，库存量不足,还剩"+surplusCount+"件"
			}); 
			return false;
		};
		if($("#zfb").prop("checked")==false && $("#wxPay").prop("checked")==false){
			api.alert({
				msg : "请选择支付方式"
			}); 
			return false;	
		};
		if($("#userName").html()==""){
			 api.alert({
				msg : "亲，请去添加地址"
			}); 
			return false;
		};
		countAll = ($("#countAll").html()).split("元")[0];
		var price = ($("#price").html()).split("元")[0];
		var residueMoney=$("#residueMoney").html();
		if($("#xk").prop("checked")==true){
			if (Number(countAll) > Number(residueMoney)) {
				api.toast({
					msg : "您的商品总价大于您的剩余金币数，请重新选择！"
				});
				return false;
			}
		}
		//走支付宝支付
			
//		alert(defaultFlag);
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : false,
			funName : "isRepeat",
			form : {
				userNo : urId,
				productId:$("#productId").attr("data"),
				number:$("#amout").html()
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					if ($("#zfb").prop("checked") == true) {
						api.showProgress({
							text:'支付中...'
	                    });
							AjaxUtil.exeScript({
								script : "mobile.center.pay.pay",
								needTrascation : true,
								funName : "insertTempAndGetDealNo",
								form : {
									userNo : urId,
									productId : $("#productId").attr("data"),
									userName : $("#userName").html(),
									userPhone : $("#userPhone").html(),
									userAddress : $("#address").val(),
									goodName : ($("#content").html()).split(" ")[0],
									num : $("#amout").html(),
									postage : $("#freight").html().split("+")[1],
									price : price,
									remark : " ",
									goodModel : goodMod,
									merchantNo : "B000001",
									merchantName : "北京小客网络科技有限公司",
									mount : countAll,
									type : "1"
								},
								success : function(formset) {
									if (formset.execStatus == "true") {
										var dealNo = formset.formDataset.dealNo;
										var data = {
											"subject" : "北京小客网络科技有限公司",
											"body" : "小客智慧生活支付",
											"amount" : countAll,
											"tradeNO" : dealNo
										};
										$.ajax({
											type : 'POST',
											url : rootUrls + '/xk/buyPrefOrderInfo.do',
											data : JSON.stringify(data),
											dataType : "json",
											contentType : 'application/json;charset=utf-8',
											success : function(data) {
												console.log($api.jsonToStr(data));
												if (data.state == '1') {
													var iaf = api.require('aliPay');
													iaf.payOrder({
														orderInfo : data.data
													}, function(ret, err) {
														if (ret.code == '9000') {
															//消息推送
															 api.hideProgress();
															AjaxUtil.exeScript({
																script : "managers.pushMessage.msg", //推送消息
																needTrascation : false,
																funName : "pushmsg",
																form : {
																	userNo : 'V000007',
																	msg : "【小客商品】订单号【" + dealNo + "】,商品名称【" + ($("#content").html()).split(" ")[0] + "】",
																	type : 1
																},
																success : function(data) {
																	console.log($api.jsonToStr(data));
																}
															});
															AjaxUtil.exeScript({
																script : "managers.pushMessage.msg", //推送消息
																needTrascation : false,
																funName : "pushmsg",
																form : {
																	userNo : "V000011",
																	msg : "【小客商品】订单号【" + dealNo + "】,商品名称【" + ($("#content").html()).split(" ")[0] + "】",
																	type : 1
																},
																success : function(data) {
																	console.log($api.jsonToStr(data));
																}
															});
															AjaxUtil.exeScript({
																script : "managers.pushMessage.msg", //推送消息
																needTrascation : false,
																funName : "pushmsg",
																form : {
																	userNo : urId,
																	msg : "【小客商品】订单号【" + dealNo + "】,商品名称【" + ($("#content").html()).split(" ")[0] + "】",
																	type : 1
																},
																success : function(data) {
																	console.log($api.jsonToStr(data));
																}
															});
				
															api.alert({
																msg : "支付成功！"
															});
															api.closeWin();
															api.execScript({//刷新商品详情页
																name : 'buyListInfo',
																script : 'refresh();'
															});
														} else if (ret.code == '6001') {
															api.toast({
																msg : "支付已取消"
															});
															 api.hideProgress();
														} else {
															api.alert({
																title : '支付结果',
																msg : ret.code,
																buttons : ['确定']
															});
															 api.hideProgress();
														}
													});
												}
											},
											error : function(XMLHttpRequest, textStatus, errorThrown) {
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
					//微信支付
					if ($("#wxPay").prop("checked") == true) {
						api.showProgress({
							text:'支付中...'
	                    });
						AjaxUtil.exeScript({
							script : "mobile.center.pay.pay",
							needTrascation : true,
							funName : "insertTempAndGetDealNo",
							form : {
								userNo : urId,
								productId : $("#productId").attr("data"),
								userName : $("#userName").html(),
								userPhone : $("#userPhone").html(),
								userAddress : $("#address").val(),
								goodName : ($("#content").html()).split(" ")[0],
								num : $("#amout").html(),
								postage : $("#freight").html().split("+")[1],
								price : price,
								remark : " ",
								goodModel : goodMod,
								merchantNo : "B000001",
								merchantName : "北京小客网络科技有限公司",
								mount : countAll,
								type : "1"
							},
							success : function(formset) {
								if (formset.execStatus == "true") {
									var dealNo = formset.formDataset.dealNo;
									var data = {
											"totalAmount" : countAll,
											"description" : ($("#content").html()).split(" ")[0],
											"dealNo":dealNo
										}
									$.ajax({
										type : 'POST',
										url : rootUrls+'/pay/wxBuyPrefGetSign.do',
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
														prepayId : result.data.prepayid
													}
												}, function(ret, err) {
													if (ret) {

													} else {

													}
												});
												api.hideProgress();
												}else {
													var wxPay = api.require('wxPay');
													api.hideProgress();
													wxPay.payOrder({
														apiKey : result.data.appid,
														mchId : "1488789472",
														nonceStr : result.data.noncestr,
														timeStamp : result.data.timestamp,
														sign : result.data.paySign,
														orderId : result.data.prepayid
													}, function(ret, err) {
														if (ret.status) {
															alert("支付成功");
															api.closeWin();
														} else {
															if (err.code == '-2') {
																api.toast({
																	msg : "支付已取消"
																});
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
			
			} else {
				alert(data.formDataset.errorMsg);
				api.hideProgress();
			}
		},
		error : function() {
			api.alert({
				msg : "您的网络是否已经连接上了，请检查一下！"
			});
			api.hideProgress();
		}
	});
		
		
	});
	
	//添加收货地址	
	$("#address").click(function() {
//		if ($("#userName").html() == "") {
//			api.openWin({//详情界面
//				name : 'createAddress',
//				url : 'createAddress.html',
//				slidBackEnabled : true,
//				animation : {
//					type : "push", //动画类型（详见动画类型常量）
//					subType : "from_right", //动画子类型（详见动画子类型常量）
//					duration : 300 //动画过渡时间，默认300毫秒
//				},
//
//			});
//		} else {
			api.openWin({//详情界面
				name : 'receiveAddress',
				url : 'receiveAddress.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					id : busid
				} 
			});
//		}

	}); 

};
//阻止底部标签跟随软键盘的位移
$(document).ready(function(){
    var h=$(window).height();
    $(window).resize(function() {
        if($(window).height()<h){
            $('footer').hide();
        }
        if($(window).height()>=h){
            $('footer').show();
        }
    });
});
function  funcGoto(data){
//		alert($api.jsonToStr(data));
//		var data=$api.strToJson(result);
		Delivery=data.isDelivery;
		$('#countAll').html((Number(($("#price").html()).split("元")[0])*parseInt($("#amout").html()).toFixed(2)+ Number(data.postage)).toFixed(2)+"元");
        $("#address").html(data.province+'&nbsp'+data.city+'&nbsp'+data.district+'&nbsp'+data.address); 
        $("#userName").html(data.name); 
        $("#userPhone").html(data.phone); 
        $("#freight").html('+'+data.postage);
 }
