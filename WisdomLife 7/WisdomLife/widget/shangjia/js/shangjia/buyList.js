var page = 1;
var pageCount = 1;
apiready = function() {
	var indexid = api.pageParam.indexid;
	var prefShop = api.pageParam.prefShop;//主页传来进行优选商品展示
	var prefShopGz = api.pageParam.prefShopGz;//规则页传来进行优选商品展示
	var header = $api.byId('title');
	var Back = $api.byId('Back');
	var submit = $api.dom('.title_div');
	var top = $api.dom('.top');
	var cc = $api.dom('.box');
	var first = $api.dom('.first');
	var secondul = $api.dom('.secondul');
	var boxTop=($(".top").height()+$(".swiper-container").height());
	$(".box").css("top",boxTop);
	$("div.first").css("top",$(".top").height()/3+$(".swiper-container").height()+$("#title").height());
	
    if (api.systemType == 'ios') {
	$("div.first").css("top",$(".swiper-container").height()+$("#title").height());
        
        if (api.screenHeight == 2436){
            $api.css(header, 'height:5.1rem');
            $api.css(Back, 'top:1.75rem');
            //        $api.css(top, 'top:3.3rem');
            $api.css(submit, 'top:3.8rem');
            $api.css(secondul, 'margin-top:1.8rem;');
            $api.css(first, 'margin-top:1.0rem;');
            $api.css($api.dom('.swiper-container'), 'margin-top:3.0rem;');
        }else{
            $api.css(header, 'height:5.6rem');
            $api.css(Back, 'top:0.75rem');
            //        $api.css(top, 'top:3.3rem');
            $api.css(submit, 'top:0.8rem');
            $api.css(secondul, 'margin-top:1.0rem;');
            $api.css(first, 'margin-top:1.0rem;');
            $api.css($api.dom('.swiper-container'), 'margin-top:2.5rem;');
        }
        
		//处理ios端fexed不生效问题
		$("#searchval").focus(function(){
			$("#title").css({
			"position":"absolute",
			"top":"0px"
			});
		});
		$("#searchval").blur(function(){
			$("#title").css("position","fixed");
		});
	};
	
	if(indexid==true){
		$("#Back").hide();
		if (api.systemType == 'ios'){
			
            if (api.screenHeight == 2436){
                $api.css(submit, 'top:1.5rem');
            }else{
                $api.css(submit, 'top:0.8rem');
            }
		}
	}
	if(String(prefShop)=="true" || String(prefShopGz)=="true"){
		$("#optimizationGz").show();
		$("#eggGz").hide();
		page = 1;
		queryProductList(page,"","","","",1000);
		$(".top span:eq(0)").removeClass();
		$(".top span:eq(2)").addClass("special");
		api.addEventListener({
			name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				queryProductList(page,"","","","",1000);
			} else {
				page = parseInt(pageCount) + 1;
			}
		});
	}else{
		$("#optimizationGz").hide();
		$("#eggGz").show();
		queryProductList(page,"","","","","");
		api.addEventListener({
			name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				queryProductList(page,"","","","","");
			} else {
				page = parseInt(pageCount) + 1;
			}
		});
	}
	//查找所有商品分类
	function queryProductTypeList() {
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryProductTypeList",
			//        form:{
			//           userNo:urId
			//        },
			success : function(data) {
				console.log("商品分类" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.typeList;
					var list = $api.strToJson(account);
					var nowli = "";
					for (var i = 0; i < list.length; i++) {
						nowli += '<li class="other" id="' + list[i].id + '">' + list[i].name + '</li>'
					}
					$('#showTypes').append(nowli);
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

	queryProductTypeList();

	//查找所有商品
	function queryProductList(pages, isRecommend,type,name,sales,isPref) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryProductList",
			form : {
				isRecommend : isRecommend,
				type : type,
				name : name,
				sales : sales,
				isPref:isPref,
				p : pages
			},
			success : function(data) {
				console.log("所有商品" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.productList;
					var list = $api.strToJson(account);
					var nowli = "";
					if (list.length == undefined || list.length == 0 || list == undefined || list == '' || list.length == '') {
						if (pages == 1) {
							api.toast({
								msg : '暂无商品信息'
							});
						} else {
							api.toast({
								msg : '无更多商品信息'
							});
						}

					} else {
						var price="";
						var flag=""
						for (var i = 0; i < list.length; i++) {
							if(list[i].price_discount=="" ||list[i].price_discount==null || list[i].price_discount==undefined || list[i].price_discount==0){
								price=list[i].price; 
								flag="none";
							}else{
								price=list[i].price_discount; 
								flag="";
							}
						
							nowli += '<div class="same">' + '<img data-original="' + rootUrl + list[i].img_url + '" alt="" id="'+list[i].id+'"/>' + '<div class="busname">' + list[i].name + '</div>' + '<div class="busprice">' + '<span class="symbol">¥</span><span class="nowPrice">' + price + '</span><s class="initprice" style="display:'+flag+'">¥' + list[i].price + '</s>' + '</div>' + '<span class="busperson">' + list[i].buy_count + '人已购买</span>' + '</div>'
						}

					};
					//走不同的渲染模板
					if (isPref == 1000) {
						$('#isPref').append(nowli);
					} else {
						$('#showListAll').append(nowli);
					}
					$(".box img").lazyload({
						threshold : 200
					}); 

					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
					console.log("返回的:pageCount=" + pageCount);
					console.log("返回的page=" + page);
					
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

//	queryProductList(page,"","","","","");
//全部商品的下拉加载
//	api.addEventListener({
//		name : 'scrolltobottom'
//	}, function(ret, err) {
//		if (parseInt(page) <= parseInt(pageCount)) {
//			page++;
//			queryProductList(page,"","","","","");
//		} else {
//			page = parseInt(pageCount) + 1;
//		}
//	});
	
	//点击相应的图跳转到相应的详情页
		$("#showListAll").on('click', 'img', function() {
			api.openWin({//详情界面
				name : 'buyListInfo',
				url : 'buyListInfo.html',
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
		});
		//点击相应的图跳转优选详情
		$("#isPref").on('click', 'img', function() {
			api.openWin({//详情界面
				name : 'ispref',
				url : 'ispref.html',
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
		});
		//跳转到优选活动规则
		$("#optimizationGz").click(function() {
			api.openWin({//详情界面
				name : 'optimizationGz',
				url : 'optimizationGz.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
			});
		});
		//跳转到优选活动规则
		$("#eggGz").click(function() {
			api.openWin({//详情界面
				name : 'eggGz',
				url : 'eggGz.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
			});
		});
//搜索关键字  待测
$("#submit").on("submit",function(){
	$('#showListAll').empty();
	$('#isPref').empty();
	page = 1;
	var searchVal=$("#searchval").val();
//	alert(searchVal);
		queryProductList(page,"","",searchVal,"");
		api.addEventListener({
			name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				queryProductList(page,"","",searchVal,"","");
			} else {
				page = parseInt(pageCount) + 1;
			}
		});
	return false;
})
	

	//点击切换
	var divs = $('.top div span');
	for (var i = 0; i < divs.length; i++) {
		$(divs[i]).click(function() {
			for (var j = 0; j < divs.length; j++) {
				$(divs[j]).removeClass();
			}
			$(this).addClass("special");
			if ($(this).attr("class") == "special") {
				//切换到推荐
				if ($(this).attr("data") == 1) {
					$('#showListAll').empty();
					$('#isPref').empty();
					page = 1
					var freData=$(this).attr("data");
					queryProductList(page, freData,"","","","");
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryProductList(page, freData,"","","","");
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				}
				//切换到全部  
				if ($(this).attr("data") == 2) {
					$('#showListAll').empty();
					$('#isPref').empty();
					$("#optimizationGz").hide();
					$("#eggGz").show();
					page = 1
					queryProductList(page,"","","","","");
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryProductList(page,"","","","","");
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				};
				//切换到  销量
				if ($(this).attr("data") == 0) {
					$('#showListAll').empty();
					$('#isPref').empty();
					page = 1;
					var saleData=$(this).attr("data");
					queryProductList(page,"","","",saleData,"");
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryProductList(page,"","","",saleData);
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				};
				//切换到  优选
				if ($(this).attr("data") == 3) {
					$('#showListAll').empty();
					$('#isPref').empty();
					$("#optimizationGz").show();
					$("#eggGz").hide();
					page = 1;
					queryProductList(page,"","","","",1000);
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryProductList(page,"","","","",1000);
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				};
			};
		})
	};
	//点击分类展示分类列表
	var flag = true;
	$("#showType").click(function() {
		if (flag == true) {
			$("div.first").show();
			$(".secondul").show();
			$(".black_box").show();
			flag = false;
		} else {
			$("div.first").hide();
			$(".secondul").hide();
			$(".black_box").hide();
			flag = true;
		}
	});
	//点击列表选项
	$('.secondul').on('click', 'li', function() {
		$(this).addClass("typeSpecial");
		setTimeout(function() {
			$(".secondul").hide();
			flag = true;
			$(".black_box").hide();
			$("div.first").hide();
			$(".secondul li").removeClass("typeSpecial");
		}, 200);
		
		$('#showListAll').empty();
		$('#isPref').empty();
		page = 1;
		var typeData=$(this).attr("id");
		queryProductList(page,"",typeData,"","");
		api.addEventListener({
			name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
//				alert(typeData)
				queryProductList(page,"",typeData,"","");
			} else {
				page = parseInt(pageCount) + 1;
			}
		});
	});
	//点击蒙版消失
	$('.black_box').on('click', function() {
		$(".secondul").hide();
		$("div.first").hide();
		flag = true;
		$(".black_box").hide();
	});
};
function goBack() {
	api.closeWin({
	});
}
