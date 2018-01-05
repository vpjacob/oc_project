var urId = "";
var page = 1;
var pageCount = 1;
//交易记录初始值
var pageDeal = 1;
var pageDealCount = 1;
apiready = function() {
	var header = $api.byId('title');
	var changeShow= $api.dom(".changeShow")
	if (api.systemType == 'ios') {
		$(".showSame .sameTitle .sameName").css('line-height: 2.4rem;');
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:2.2rem;');
            $api.css(changeShow, 'margin-top:4.4rem;');
            $api.css(header, 'height:4.2rem;');
             $(".showList").css("margin-top","6.9rem");
        }else{
            $api.css(header, 'padding-top:1rem;');
            $api.css(changeShow, 'margin-top:3.2rem;');
            $api.css(header, 'height:3.2rem;');
            $(".showList").css("margin-top","5.9rem");
        }
	}
    
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryOrders(urId, page,0);


	function queryOrders(urId, page, oStatus) {
		api.showProgress({
		});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "queryOrders",
			form : {
				userNo : urId,
				pageNo : page,
				oStatus:oStatus
			},
			success : function(data) {
				console.log("我的订单"+$api.jsonToStr(data));
				api.hideProgress();
				var list = data.datasources[0].rows;

				if (data.formDataset.checked == 'true') {
					if (list == undefined || list == '' || list.length == '' || list.length == 0 || list.length == undefined) {
						if (page == 1) {
							api.toast({
								msg : '亲，您暂时没有相关记录！'
							});
						} else {
							api.toast({
								msg : '亲，您无更多相关记录'
							});
						}
					} else {
						for (var i = 0; i < list.length; i++) {
							var colorStatus="";
							var statusGo="";
							var moreDeal=""
							if(list[i].status=="待支付"){
								colorStatus="obligation";
								statusGo='<span class="moreDeal">去付款</span>'
							}else if(list[i].status=="已撤销"){
								colorStatus="undone";
								statusGo='<span class="moreDeal">再来一单</span>'
							}else if(list[i].status=="待收货"){
								colorStatus="finished";
								statusGo='<span class="moreDeal">再来一单</span>'
							}else if(list[i].status=="已完成"){
								colorStatus="finished";
								statusGo='<span class="moreDeal">再来一单</span>'
							};
							if(String(list[i].source_come)=="购买金蛋" || String(list[i].source_come)=="快速补单" || String(list[i].source_come)=="小客商品" || String(list[i].source_come)=="优选商品"){
								moreDeal='<div class="orderDeal">'+statusGo+'</div>'
							}
							var	nowli = '<div class="showSame">'
									+'<div class="sameTitle" id="'+list[i].fid+'">'
										+'<img src="../../image/orderIcon.png" alt="" />'
										+'<span class="sameName">'+list[i].merchant_name+'</span>'
										+'<img src="../../image/orderGo.png" alt="" />'
										+'<span class="sameStatus '+colorStatus+'">'+list[i].status+'</span>'
									+'</div>'
							        if(list[i].goods!=null){						
										if(list[i].goods.length>0){
											for( var j=0;j<list[i].goods.length;j++){
										  		nowli = nowli +'<div class="sameContent" data="'+list[i].deal_no+'" datas="'+list[i].goods[j].product_id+'">'
													+'<div class="sameContentBox">'
														+'<img src="' + rootUrl + list[i].goods[j].img_url + '" alt="" />'
														+'<div class="commodityName">'+list[i].goods[j].good_name+'</div>'
														+'<span class="modle">规格  : '+list[i].goods[j].norm+'</span>  '
														+'<span class="modle">数量  : '+list[i].goods[j].amount+'</span>'
													+'</div>'
												+'</div>';
											}
										}
									}
									nowli = nowli+'<div class="detail">'
										+'<span class="dealSource">'+list[i].source_come+'</span>'
										+'<span class="dealNum dealCount">¥'+list[i].deal_amount+'</span>'
										+'<span class="dealNum marginNo">合计:</span>'
									+'</div>'+moreDeal+'</div>';
							$('#showList').append(nowli);
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
			queryOrders(urId, page,0);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
   //跳转相应商家
    $(".showList").on("click",".sameTitle",function(){
    	api.openWin({//详情界面
				name : 'business-man-list',
				url : '../../sjDetail/business-man-list.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					id : $(this).attr("id")
				}
			});
    })
	//跳转商品详情页
    $(".showList").on("click",".sameContent",function(){
    	api.openWin({//详情界面
				name : 'payDetail',
				url : 'payDetail.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					dealNo : $(this).attr("data")
				}
			});
    });
    //再来一单跳转
     $(".showList").on("click",".moreDeal",function(){
    	var goOther=$(this).parent().prev().find(".dealSource").text();
    	if(String(goOther)=="购买金蛋"){
    		api.openWin({//详情界面
				name : 'buyEgg',
				url : 'buyEgg.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
    	}else if(String(goOther)=="快速补单"){
    		api.openWin({//详情界面
				name : 'business-man-list',
				url : '../../sjDetail/business-man-list.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					id : $(this).parent().parent().find(".sameTitle").attr("id")
				}
			});
    	}else if(String(goOther)=="小客商品"){//普通商品
    		api.openWin({//详情界面
				name : 'buyListInfo',
				url : '../../shangjia/html/buyListInfo.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					id : $(this).parent().parent().find(".sameContent").attr("datas")
				}
			});
    	}else if(String(goOther)=="优选商品"){//普通商品
    		api.openWin({//详情界面
				name : 'ispref',
				url : '../../shangjia/html/ispref.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					id : $(this).parent().parent().find(".sameContent").attr("datas")
				}
			});
    	}
    })

var divs = $('.changeShow div');
var spans = $('.changeShow div span');
for (var i = 0; i < divs.length; i++) {
	$(divs[i]).click(function() {
		for (var j = 0; j < divs.length; j++) {
			$(spans[j]).removeClass();
		}
		$(this).find("span").addClass("special");
//		console.log($(this).text());
		if ($(this).text() == '全部') {
			$('#showList').empty();
			var status=$(this).attr("data");
			page = 1;
			queryOrders(urId, page,status);
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(page) <= parseInt(pageCount)) {
					page++;
					queryOrders(urId, page,status);
				} else {
					page = parseInt(pageCount) + 1;
				}
			});
		};
		if ($(this).text() == '待支付') {
			$('#showList').empty();
			var status=$(this).attr("data");
			page = 1;
			queryOrders(urId, page,status);
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(page) <= parseInt(pageCount)) {
					page++;
					queryOrders(urId, page,status);
				} else {
					page = parseInt(pageCount) + 1;
				}
			});
		};
		if ($(this).text() == '待收货') {
			$('#showList').empty();
			var status=$(this).attr("data");
			page = 1;
			queryOrders(urId, page,status);
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(page) <= parseInt(pageCount)) {
					page++;
					queryOrders(urId, page,status);
				} else {
					page = parseInt(pageCount) + 1;
				}
			});
		};
		if ($(this).text() == '已完成') {
			$('#showList').empty();
			var status=$(this).attr("data");
			page = 1;
			queryOrders(urId, page,status);
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(page) <= parseInt(pageCount)) {
					page++;
					queryOrders(urId, page,status);
				} else {
					page = parseInt(pageCount) + 1;
				}
			});
		};
		if ($(this).text() == '已撤销') {
			$('#showList').empty();
			var status=$(this).attr("data");
			page = 1;
			queryOrders(urId, page,status);
			api.addEventListener({
				name : 'scrolltobottom'
			}, function(ret, err) {
				if (parseInt(page) <= parseInt(pageCount)) {
					page++;
					queryOrders(urId, page,status);
				} else {
					page = parseInt(pageCount) + 1;
				}
			});
		};
	})
}
}

function goback() {
	api.closeWin({
	});
}
