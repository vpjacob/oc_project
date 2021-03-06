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
		
        if (api.screenHeight == 2436){
            $api.css(header, 'margin-top:44px;');
            $api.css(miancss, 'height:78%');
        }else{
            $api.css(header, 'margin-top:22px;');
            $api.css(miancss, 'height:82%');
        }
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
    queryShoppingDeatilAndModelType();
    //获取默认地址
//  queryDefaultAddress(urId);
    //获取二级密码
	oldPwd(urId);
	//获取剩余金币数
	queryEggInfo(urId);
	
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
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.secondPwd;
					oldPwd = account;
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			}
		});
	};
	
	 //获取剩余金蛋个数
	function queryEggInfo(urId) {
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : false,
			funName : "queryEggInfo",
			form : {
				userNo : urId,
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					$("#residueMoney").html(($api.strToJson(data.formDataset.account).gold_egg_count+$api.strToJson(data.formDataset.account).change_egg)+"颗");
				} else {
					api.toast({
						msg : data.formDataset.errorMsg
					});
				}
			},
			error : function() {
				api.hideProgress();
				api.toast({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	}

	// 立即购买后，获取商品部分详情  金蛋
	function queryShoppingDeatilAndModelType() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
			needTrascation : false,
			funName : "queryShoppingDeatilAndModelType",
			        form:{
			           id:busid,
			        },
			success : function(data) {
				console.log("金蛋商品支付详情" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.shopping;
					var list = $api.strToJson(account);
					var lists = $api.strToJson(data.formDataset.modelTypeList);
					$("#businessImg").attr("src",rootUrl+list.img_url);
					$("#content").html(list.name);
					$("#productId").attr("data",list.id);
					goodNum=list.good_no;
//					if(list.price_discount=="" ||list.price_discount==null || list.price_discount==undefined){
						$("#price").html(list.price_discount+'颗');
						$("#busTotal").html(list.price_discount+'颗');
						$("#countAll").html(list.price_discount+'颗');
						showPrice=list.price_discount;
						//获取默认地址
						 queryDefaultAddress(urId);
					var nowList="";
					for(var i=0;i<lists.length;i++){
						nowList+='<div class="chooseColor" >'
							+'<span>'+lists[i].name+'</span>'
							+'<span class="spanModle">请选择</span>'
							+'<select id="'+lists[i].id+'">'	
							+'<option value="0">请选择</option>'
							+'</select></div>'
					}
					$("#modelList").prepend(nowList);
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
			script : "mobile.shopping.shopping",
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

	// 根据商品规格类型，查找规格内容列表信息  金蛋
    function queryModelByModelType(typeId,goodNum,dom){
    	 AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
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
    //购买页显示的地址信息及邮费信息等  金蛋
    function queryDefaultAddress(urId) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
			needTrascation : false,
			funName : "queryDefaultAddress",
			        form:{
			           userNo:urId
			        },
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.address;
					var list = $api.strToJson(account);
					$("#address").html(list.province_name+'&nbsp'+list.city_name+'&nbsp'+list.district_name+'&nbsp'+list.address); 
       				$("#userName").html(list.name); 
      			    $("#userPhone").html(list.phone); 
      			    $("#address").attr("data",list.id); 
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

	//  检查最后一颗金蛋是否有砸出的金蛋
	function checkEggIsMayUse(urId) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
			needTrascation : false,
			funName : "checkEggIsMayUse",
			        form:{
			           userNo:urId
			        },
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.isUse;
					if(String(account)=="0"){
						api.toast({
	                        msg:data.formDataset.errorMsg
                        });
                        api.hideProgress();
                        return false;
					}else if(String(account)=="1"){
						$(".tankuang_box").show();
						$(".black_box").show();
						api.hideProgress();
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
	};
	//数量的增加与减少
	$('#numAdd').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) < 999) {
			amout = parseInt(amout) + 1;
			$("#amout").html(amout);
			var numAdd=(parseInt(amout) * showPrice).toFixed(2);
			$("#busTotal").html(numAdd+"颗");
			$('#countAll').html(numAdd+"颗");
		}
	});
	$('#numSub').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) > 1) {
			amout = parseInt(amout) - 1;
			$("#amout").html(amout);
			var numSub=(parseInt(amout) * showPrice).toFixed(2);
			$("#busTotal").html(numSub+"颗");
			$('#countAll').html(numSub+"颗");
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
		if($("#userName").html()==""){
			 api.alert({
				msg : "亲，请去添加地址"
			}); 
			return false;
		};
		countAll = ($("#countAll").html()).split("颗")[0];
		var price = ($("#price").html()).split("颗")[0];
		var residueMoney=($("#residueMoney").html()).split("颗")[0];
		if (Number(countAll) > Number(residueMoney)) {
			api.toast({
				msg : "您的商品总价值大于您的剩余金蛋数量，请重新选择！"
			});
			return false;
		};
		//判断购买的数量正好为剩余蛋数
		if (Number(countAll) == Number(residueMoney)) {
			checkEggIsMayUse(urId);
		}else{
			$(".tankuang_box").show();
			$(".black_box").show();
		}
		
		//金蛋支付
//			$(".tankuang_box").show();
//			$(".black_box").show();
			document.getElementById("agree").onclick = function() {
				if ($("#pwd").val() == oldPwd) {
					api.showProgress({
						text:'支付中...'
                    });
					AjaxUtil.exeScript({
						script : "mobile.center.pay.pay",
						needTrascation : true,
						funName : "insertShoppingAndGetDealNo",
						form : {
//							userNo : urId,
							productId : $("#productId").attr("data"),
							userName : $("#userName").html(),
							userPhone : $("#userPhone").html(),
							userAddress : $("#address").val(),
							goodName : $("#content").html(),
							num : $("#amout").html(),
							price : price,
							remark : " ",
							goodModel : goodMod,
//							merchantNo : "B000001",
//							merchantName : "北京小客网络科技有限公司",
							mount : countAll,
						},
						success : function(formset) {
							if (formset.execStatus == "true") {
								var dealNo = formset.formDataset.dealNo;
								var data = {
									"userNo" : urId,
									"dealNo" : dealNo
								};
								$.ajax({
									type : 'POST',
									url : rootUrls + '/xk/buyShopPayGoldEgg.do',
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
												api.closeWin()
											}, 500);
											api.hideProgress();
											AjaxUtil.exeScript({
												script : "managers.pushMessage.msg", //推送消息
												needTrascation : false,
												funName : "pushmsg",
												form : {
													userNo : 'V812820',
													msg : "【小客商品】订单号【" + dealNo + "】,商品名称【" + $("#content").html() + "】",
													type : 1
												},
												success : function(data) {
													console.log($api.jsonToStr(data));
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
					api.hideProgress();
				} else if ($("#pwd").val() == "") {
					api.alert({
						msg : '请您输入二级密码'
					});
					return false;
				} else {
					api.alert({
						msg : '您输入二级密码有误'
					});
					return false;
				}
			};
			
			$(".noAgree").click(function() {
				$(".tankuang_box").css("display", "none");
				$(".black_box").css("display", "none");
			})
	});
	
	//添加收货地址	
	$("#address").click(function() {
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
function funcGoto(data){
        $("#address").html(data.province+'&nbsp'+data.city+'&nbsp'+data.district+'&nbsp'+data.address); 
        $("#userName").html(data.name); 
        $("#userPhone").html(data.phone); 
 }
