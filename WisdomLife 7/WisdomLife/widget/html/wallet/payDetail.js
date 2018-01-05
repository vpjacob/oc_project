var dealNo="";
apiready = function() {
	var header = $api.byId('title');
	var changeShow= $api.dom(".box");
	dealNo = api.pageParam.dealNo;
//	alert(dealNo);
	if (api.systemType == 'ios') {
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:2.2rem;');
            $api.css(changeShow, 'margin-top:4.4rem;');
            $api.css(header, 'height:4.2rem;');
        }else{
            $api.css(header, 'padding-top:1rem;');
            $api.css(changeShow, 'margin-top:3.2rem;');
            $api.css(header, 'height:3.2rem;');
//          $(".addressInfo .left img").css("top","0");
        }
	};
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    function queryOrderDetail(dealNo) {
		api.showProgress({
		});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "queryOrderDetail",
			form : {
				dealNo:dealNo
			},
			success : function(data) {
				console.log("我的订单详情"+$api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var result=data.datasources[0].rows[0];
					var goods=data.datasources[0].rows[0].goods[0];
					var busInfo=data.datasources[0].rows[0].goods;
					//收货状态
					dealNullOrUndefined(result.status, ".dealResult","暂无","");
					//收货人姓名
					dealNullOrUndefined(goods.user_name, ".name","收货人 : 暂无","收货人 : ");
					//收货人电话
					dealNullOrUndefined(goods.user_phone, ".tel","电话 : 暂无","");
					//收货地址
					dealNullOrUndefined(goods.user_address, ".test_box","收货地址 : 暂无","收货地址 :");
					//商家名称
					dealNullOrUndefined(result.merchant_name, ".sameName","商家 : 暂无","");
					//收货状态  货物
					if(String(result.status) == "null" || String(result.status) == "undefined" || String(result.status) == ""){
						$(".sameStatus").html("暂无");
					}else{
						$(".sameStatus").html(result.status);
						if (result.status == "待支付") {
							$(".sameStatus").addClass("obligation");
						} else if (result.status == "已撤销") {
							$(".sameStatus").addClass("undone");
						} else if (result.status == "待收货") {
							$(".sameStatus").addClass("finished");
						} else if (result.status == "已完成") {
							$(".sameStatus").addClass("finished");
						};
					};
					var model="";
					for(var i=0;i<busInfo.length;i++){
						model+='<div class="sameContent">'
							+'<div class="sameContentBox">'
								+'<img src="'+rootUrl + busInfo[i].img_url+'" alt="" />'
								+'<div class="commodityName">'+busInfo[i].good_name+'</div>'
								+'<span class="modle">规格  : '+busInfo[i].norm+'</span>'
								+'<span class="modle">数量  : '+busInfo[i].amount+'</span>'  
							+'</div>'
						+'</div>'
					}
					$("#goodsId").html(model);
					//商品图片
//					$("#goodsImg").attr("src",rootUrl + goods.img_url);
//					//商品信息
//					dealNullOrUndefined(goods.good_name, ".commodityName","商品信息暂无","");
//					//规格
//					dealNullOrUndefined(goods.norm, "#norm","规格  : 暂无","规格  : ");
//					//数量
//					dealNullOrUndefined(goods.amount, "#amount","数量  : 暂无","数量  : ");
					
					//配送方式
					dealNullOrUndefined(goods.express_name, "#deliveryType","暂无","");
					//物流单号
					dealNullOrUndefined(goods.express_no, "#deliveryDeal","暂无","");
					//运费
					dealNullOrUndefined(goods.postage, "#freightType","暂无","");
					//实付款
					dealNullOrUndefined(result.deal_amount, "#payCost","暂无","¥ ");
					//订单编号
					$("#dealNum").html(dealNo);
					//支付方式
					dealNullOrUndefined(result.pay_type, "#payType","暂无","");
					//支付时间
					dealNullOrUndefined(result.pay_time, "#pay_time","暂无","");
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			}
		});
	};
	queryOrderDetail(dealNo);
	
	function dealNullOrUndefined(source, target,defaultWord,holderWord) {
		if (String(source) == "null" || String(source) == "undefined" || String(source) == "") {
			$(target).html(defaultWord);
		} else {
			$(target).html(holderWord+source);
		}
	}	
} 
function goback() {
	api.closeWin({
	});
}


