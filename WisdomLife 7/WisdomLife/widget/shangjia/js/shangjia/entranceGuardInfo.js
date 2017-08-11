var busAmount = 1;
var clickNum = 1;
var goodNum="";
var typeId="";
var selectTypeId="";
var selectDom="";
var isChecked="";
var showPrice="";
var goodMod="";
apiready = function() {
	var header = $api.byId('header');
	var miancss = $api.byId('miancss');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:22px;');
		$api.css(miancss, 'height:82%');
	};

	$("#back").bind("click", function() {
		api.closeWin();
	});
	FileUtils.readFile("info.json", function(info, err) {
		userInfo = info;
	});
	var busid = api.pageParam.id;
	var surplusCount = api.pageParam.surplusCount;//库存剩余量
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
						$("#countAll").html(list.price+'元');
						showPrice=list.price;
					}else{
						$("#price").html(list.price_discount+'元');
						$("#countAll").html(list.price_discount+'元');
						showPrice=list.price_discount
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
				    for(var j=0;j<lists.length;j++){
					   queryModelByModelType(lists[j].id,goodNum,lists[j].id);
					}
					api.hideProgress();
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	}
	queryProductDeatilAndModelType();
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
				console.log("商品规格相册" + $api.jsonToStr(data));
				var account = data.formDataset.modelList;
				var list = $api.strToJson(account);
				if (data.formDataset.checked == 'true') {
					for(var i=0;i<list.length;i++){
						if(list[i].id==isChecked){
							$("#businessImg").attr("src",rootUrl+list[i].img_url);
						}
					}
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
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
				console.log("商品规格初始化" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.modelList;
					var list = $api.strToJson(account);
					var nowlist='<option value="0">请选择</option>';
					for(var i=0;i<list.length;i++){
						nowlist+='<option id="'+list[i].id+'">'+list[i].property+'</option>'
					}
					$("#"+dom+"").html(nowlist);
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
    
    }	
	//数量的增加与减少
	$('#numAdd').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) < 999) {
			amout = parseInt(amout) + 1;
			$("#amout").html(amout);
			var numAdd=(parseInt(amout) * showPrice).toFixed(2);
			$('#countAll').html(numAdd+ '元');
//			$('#countAll').html(parseInt(amout) * 0.01 + '元');
		}
	});
	$('#numSub').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) > 1) {
			amout = parseInt(amout) - 1;
			$("#amout").html(amout);
			var numSub=(parseInt(amout) * showPrice).toFixed(2);
			$('#countAll').html(numSub + '元');
//			$('#countAll').html(parseInt(amout) * 0.01 + '元');
		}
	});
	//提交支付调用支付宝接口
	$('#apply').click(function() {
		goodMod=""
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (userInfo.userNo == '' || userInfo.userNo == null) {
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
		if($("#amout").html()>surplusCount){
			api.alert({
				msg : "亲，库存量不足,还剩"+surplusCount+"件"
			});
			return false;
		};
		if($("#userName").val()==""){
			api.alert({
				msg : "请输入收货人的姓名"
			});
			return false;
		};
		if($("#userPhone").val()==""){
			api.alert({
				msg : "请输入收货人的手机号！"
			});
			return false;
		};
		if(!mobileReg.test($("#userPhone").val())){
			api.alert({
				msg : "您输入的手机号格式不对！"
			});
			return false;
		};
		if($("#address").val()==""){
			api.alert({
				msg : "请输入详细地址！"
			});
			return false;
		};
		 countAll = ($("#countAll").html()).split("元")[0];
		var price = parseInt($("#price").html());
		AjaxUtil.exeScript({
			script : "mobile.center.pay.pay",
			needTrascation : true,
			funName : "insertTempAndGetDealNo",
			form : {
				userNo : userInfo.userNo,
				productId:$("#productId").attr("data"),
				userName : $("#userName").val(),
				userPhone : $("#userPhone").val(),
				userAddress:$("#address").val(),
				goodName:($("#content").html()).split(" ")[0],
				num:$("#amout").html(),
				price:price,
				remark:" ",
				goodModel:goodMod,
				merchantNo : "B000001",
				merchantName : "北京小客网络科技有限公司",
				mount : countAll,
				type : "1"
			},
			success : function(formset) {
				console.log($api.jsonToStr(formset));
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
						url : rootUrls + '/xk/onlineOrderInfo.do',
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
//				console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
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
