var urId = "";
var page = 1;
var pageCount = 1;
//交易记录初始值
var pageDeal = 1;
var pageDealCount = 1;
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryOrders(urId, page);
	$(function() {
		$(".Personal_centent").hide().first().show();
		$(".span1").click(function() {
			$('#deal').empty();
			pageDeal = 1;
			queryDealRecord(urId, pageDeal);
			//交易记录滑动加载
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(pageDeal) <= parseInt(pageDealCount)) {
					pageDeal++;
					queryDealRecord(urId, pageDeal);
				} else {
					pageDeal = parseInt(pageDealCount) + 1;
				}
			});
		})
		$(".span0").click(function() {
			$('#order').empty();
			page = 1;
			queryOrders(urId, page);
			//我的订单滑动加载
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(page) <= parseInt(pageCount)) {
					page++;
					queryOrders(urId, page);
				} else {
					page = parseInt(pageCount) + 1;
				}
			});
		})
		$(".Personal_title span").click(function() {
			$(this).addClass("special").siblings().removeClass("special");
			$(".Personal_centent").hide().eq($(this).index()).show();
		});
	});
	//	我的订单方法
	//	function queryOrders(urId, page) {
	//		api.showProgress({
	//		});
	//		AjaxUtil.exeScript({
	//			script : "mobile.myegg.myegg",
	//			needTrascation : true,
	//			funName : "queryOrders",
	//			form : {
	//				userNo : urId,
	//				pageNo : page
	//			},
	//			success : function(data) {
	//				api.hideProgress();
	//				console.log($api.jsonToStr(data));
	//				var listInfo = data.formDataset.orderList;
	//				var list = eval(listInfo);
	//				if (data.formDataset.checked == 'true') {
	//					//     		$('#ul_tab1 ').empty();
	//					if (list == undefined || list == '' || list.length == '' || list.length == 0 || list.length == undefined) {
	//						if (page == 1) {
	//							api.toast({
	//								msg : '亲，您暂时没有订单记录！'
	//							});
	//						} else {
	//							api.toast({
	//								msg : '亲，您无更多订单记录'
	//							});
	//						}
	//					} else {
	//						for (var i = 0; i < list.length; i++) {
	//						var	nowli = '<div class="box">' + '<div class="bottom">' + '<div class="user">' + '<div class="same">' + '<span>商家名称：</span>' + '<span>' + list[i].merchant_name + '</span>' + '</div>' + '</div>' + '<div class="user" style="height:3.25rem;">' + '<div class="same">' + '<span>' + list[i].good_name + '：</span>' + '<span>¥' + list[i].price + '</span>' + '</div>' + '</div>' + '<span class="commodity">共' + list[i].amount + '件商品,实付¥<a style="color:#ff6c00">' + list[i].total + '</a></span>' + '<div class="user">' + '<div class="same">' + '<span>交易总额：</span>' + '<span style="color:#ff6c00">' + list[i].total + '</span>' + '</div>' + '</div>' + '<div class="user">' + '<div class="same">' + '<span>订单号：</span>' + '<span>' + list[i].deal_no + '</span>' + '</div>' + '</div>' + '<div class="user">' + '<div class="same">' + '<span>创建时间：</span>' + '<span>' + list[i].create_datetime + '</span>' + '</div>' + '</div>' + '<div class="user">' + '<div class="same">' + '<span>订单状态：</span>' + '<span>' + list[i].status + '</span>' + '</div>' + '</div>' + '</div>' + '</div>'
	//							$('#order').append(nowli);
	//						}
	////						$('#order').html(nowli);
	//					}
	//					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
	//				} else {
	//					alert(data.formDataset.errorMsg);
	//				}
	//			}
	//		});
	//	};
	function queryOrders(urId, page) {
		api.showProgress({
		});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "queryOrders",
			form : {
				userNo : urId,
				pageNo : page
			},
			success : function(data) {

				api.hideProgress();
				var list = data.datasources[0].rows;

				if (data.formDataset.checked == 'true') {
					if (list == undefined || list == '' || list.length == '' || list.length == 0 || list.length == undefined) {
						if (page == 1) {
							api.toast({
								msg : '亲，您暂时没有订单记录！'
							});
						} else {
							api.toast({
								msg : '亲，您无更多订单记录'
							});
						}
					} else {
						for (var i = 0; i < list.length; i++) {
						var	nowli = '<div class="box">' 
									+ '<div class="bottom">' 
										+ '<div class="user">' 
											+ '<div class="same">' 
												+ '<span>商家名称：</span>' + '<span>' + list[i].merchant_name + '</span>' 
											+ '</div>' 
										+ '</div>' ;
						  nowli = nowli + '<div class="user" style="height:100%;overflow:auto">' 
											+ '<div class="same">'  
												+ '<span>商品 ：</span><span>';
						if(list[i].goods.length>0){
							for( var j=0;j<list[i].goods.length;j++){
						  		nowli = nowli + list[i].goods[j].good_name + '&nbsp;&nbsp;: &nbsp;¥&nbsp;' + list[i].goods[j].price + '&nbsp;*&nbsp;'+ list[i].goods[j].amount +'<br>'; 
							}
						}else{
							nowli = nowli + list[i].source_come;
						}
							nowli = nowli + '</span></div>' 
										+ '</div>' ;
						  nowli = nowli + '<div class="user">' 
											+ '<div class="same">' 
												+ '<span>交易总额：</span>' + '<span style="color:#ff6c00">' + list[i].deal_amount + '</span>' 
											+ '</div>' 
										+ '</div>' 
										+ '<div class="user">' 
											+ '<div class="same">' 
												+ '<span>订单号：</span>' + '<span>' + list[i].deal_no + '</span>' 
											+ '</div>' 
										+ '</div>' 
										+ '<div class="user">' 
											+ '<div class="same">' 
												+ '<span>创建时间：</span>' + '<span>' + list[i].create_time + '</span>' 
											+ '</div>' 
										+ '</div>' 
										+ '<div class="user">' 
											+ '<div class="same">' 
												+ '<span>订单状态：</span>' + '<span>' + list[i].status + '</span>' 
											+ '</div>' 
										+ '</div>' 
									+ '</div>' 
								+ '</div>';
							$('#order').append(nowli);
						}
					}
					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	};
	//我的订单滑动加载
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			queryOrders(urId, page);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});

	//交易记录
	function queryDealRecord(urId, pageDeal) {
		api.showProgress({
		});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "queryDealRecord",
			form : {
				userNo : urId,
				pageNo : pageDeal
			},
			success : function(data) {
				api.hideProgress();
				console.log($api.jsonToStr(data));
				var listInfo = data.formDataset.recordList;
				var list = eval(listInfo);
				if (data.formDataset.checked == 'true') {
					//     		$('#ul_tab1 ').empty();
					if (list == undefined || list == '' || list.length == '' || list.length == 0 || list.length == undefined) {
						if (pageDeal == 1) {
							api.toast({
								msg : '亲，您暂时没有交易记录！'
							});
						} else {
							api.toast({
								msg : '亲，您无更多交易记录'
							});
						}
					} else {
						for (var i = 0; i < list.length; i++) {
							var nowli = '<div class="box">' + '<div class="bottom">' + '<div class="user">' + '<div class="same">' + '<span>商家名称：</span>' + '<span>' + list[i].merchant_name + '</span>' + '</div>' + '</div>' + '<div class="user">' + '<div class="same">' + '<span>交易总额：</span>' + '<span style="color:#ff6c00">' + list[i].deal_amount + '</span>' + '</div>' + '</div>' + '<div class="user">' + '<div class="same">' + '<span>订单号：</span>' + '<span>' + list[i].deal_no + '</span>' + '</div>' + '</div>' + '<div class="user">' + '<div class="same">' + '<span>平台确认时间：</span>' + '<span>' + list[i].deal_date + '</span>' + '</div>' + '</div>' + '</div>' + '</div>'
							$('#deal').append(nowli);
						}
						//						$('#deal').html(nowli);
					}
					pageDealCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	};
	//交易记录的详情查询
	$('.box').on('click', '.other', function() {
		$(".black_box").show();
		$(".tankuang_box").show();

	});
	//我的订单详情查询
	$('.box').on('click', '.otherL', function() {
		$(".black_box").show();
		$(".tankuang_box").show();

	});
	$("#close").click(function() {
		$(".black_box").hide();
		$(".tankuang_box").hide();
	});

}
function goBack() {
	api.closeWin({
	});
}
