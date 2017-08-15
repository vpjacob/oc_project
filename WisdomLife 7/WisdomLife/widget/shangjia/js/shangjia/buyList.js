var page = 1;
var pageCount = 1;
apiready = function() {
	var header = $api.byId('title');
	var Back = $api.byId('Back');
	var submit = $api.dom('.title_div');
	var top = $api.dom('.top');
	var cc = $api.dom('.box');
	var first = $api.dom('.first');
	var secondul = $api.dom('.secondul');
	if (api.systemType == 'ios') {
		$api.css(header, 'height:5.6rem');
		$api.css(Back, 'top:1.25rem');
		$api.css(top, 'top:3.3rem');
		$api.css(submit, 'top:1.3rem');
		$api.css(secondul, 'margin-top:1.0rem;');
		$api.css(first, 'margin-top:1.0rem;');
		$api.css(cc, 'margin-top:3.1rem;');
	};

	
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
	function queryProductList(pages, isRecommend,type,name,sales) {
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
						
							nowli += '<div class="same">' + '<img src="' + rootUrl + list[i].img_url + '" alt="" id="'+list[i].id+'"/>' + '<div class="busname">' + list[i].name + '</div>' + '<div class="busprice">' + '<span class="symbol">¥</span><span class="nowPrice">' + price + '</span><s class="initprice" style="display:'+flag+'">¥' + list[i].price + '</s>' + '</div>' + '<span class="busperson">' + list[i].buy_count + '人已购买</span>' + '</div>'
						}

					}
					$('#showListAll').append(nowli);
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

	queryProductList(page,"","","","");
//全部商品的下拉加载
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			queryProductList(page,"","","","");
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
	
	//点击相应的图跳转到相应的详情页
		$(document).on('click', 'img', function() {
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
//搜索关键字  待测
$("#submit").on("submit",function(){
	$('#showListAll').empty();
	page = 1;
	var searchVal=$("#searchval").val();
//	alert(searchVal);
		queryProductList(page,"","",searchVal,"");
		api.addEventListener({
			name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				queryProductList(page,"","",searchVal,"");
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
					$('#showListAll').empty()
					page = 1
					var freData=$(this).attr("data");
					queryProductList(page, freData,"","","");
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryProductList(page, freData,"","","");
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				}
				//切换到全部  
				if ($(this).attr("data") == 2) {
					$('#showListAll').empty()
					page = 1
					queryProductList(page,"","","","");
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryProductList(page,"","","","");
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				};
				//切换到  销量
				if ($(this).attr("data") == 0) {
					$('#showListAll').empty()
					page = 1;
					var saleData=$(this).attr("data");
					queryProductList(page,"","","",saleData);
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
				}
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