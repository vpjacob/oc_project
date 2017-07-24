//需要填充的模版
var template = "<li class='aLi' ontouchstart='touchstart(this)' onclick='showDetail(\"[url]\")'> " + "<img src='[imgurl]' height='63' width='85' /><div class='conter'><p class='conterO'>" + "<span class='conterOleft'>[title]</span><span class='conterOringht'>[instance]</span></p>" + "<p class='describe'>[describe]</p><p class='price'><span class='priceLeft'>￥[current_price]</span>" + "<s class='priceDel'>[market_price]</s><span class='conterOringht priceRight'>[score]分</span></p>" + "</div></li>";
var lon = "";
var lat = "";
var loading = false;
//正在加载中
var defaultCartId = '326';
//默认的搜索类别
var currentPage = 1;
var isAll = false;
//已是所有数据
var keyword = '';
//被查询的关键字
apiready = function() {
	var header = $api.byId('header');
//	if (api.systemType == 'ios') {
//		var cc = $api.dom('.content');
//		$api.css(header, 'margin-top:20px;');
//		$api.css(cc, 'margin-top:20px;');
//	}

	//读取info.json文件：
	FileUtils.readFile("info.json", function(info, err) {
		lon = info.location.lon;
		lat = info.location.lat;
		console.log("lon ::: " + lon);
		console.log("lat ::: " + lat);
		showArround(lon, lat);
	});

	//搜索事件
	$('form').on('submit', function(e) {
		currentPage = 1;
		keyword = $("#search").val();
		var jsonParam = {
			longitude : lon,
			latitude : lat,
			page : currentPage,
			keyword : $("#search").val()
		};
		getNuomiList(jsonParam, true);
		document.activeElement.blur();
		return false;
	});

}
//显示周边的团购
function showArround(lon, lat) {
	var jsonParam = {
		longitude : lon,
		latitude : lat,
		page : currentPage
	};
	getNuomiList(jsonParam, true);
}

//获得列表详情
function getNuomiList(jsonParam, reload) {
	console.log("url ::: " + rootUrl + "/api/nearby");
	$.ajax({
		type : "GET",
		url : rootUrl + "/api/nearby",
		data : jsonParam,
		error : function() {
			api.hideProgress();
			$.pullToRefreshDone('.pull-to-refresh-content');
		},
		beforeSend : function() {
			api.showProgress({
				modal : true
			});
		},
		success : function(json) {
			console.log($api.jsonToStr(json));
			api.hideProgress();
			if (json == null) {
				api.alert({
					msg : "小客正在为您准备数据，请您稍后刷新再试"
				}, function(ret, err) {
					//coding...
				});
				$.pullToRefreshDone('.pull-to-refresh-content');
			} else if (json.errno == 0) {

				//var template = $("#template").get(0).innerHTML;
				//data，已经是baidu糯米的json结果，具体页面参考http://apistore.baidu.com/apiworks/servicedetail/508.html，倒数第二个“根据查询条件获取”
				var deals = json.data.deals;
				var listStr = "";
				for (i in deals) {
					listStr += template;
					listStr = listStr.replace("[imgurl]", deals[i].tiny_image);
					//替换头像
					listStr = listStr.replace("[describe]", deals[i].description);
					//提花介绍
					listStr = listStr.replace("[title]", deals[i].title);
					//替换标题
					listStr = listStr.replace("[score]", deals[i].score);
					//替换积分
					if (deals[i].distance != "-1")
						listStr = listStr.replace("[instance]", deals[i].distance + "m");
					//替换距离
					else
						listStr = listStr.replace("[instance]", "&nbsp");
					listStr = listStr.replace("[market_price]", deals[i].market_price / 100);
					//替换原价格
					listStr = listStr.replace("[current_price]", deals[i].current_price / 100);
					//替换当前价格
					listStr = listStr.replace("[url]", deals[i].deal_murl);
					//跳转路径
				}
				if (deals.length === 10) {//返回10条数据，说明可能还有下一页
					currentPage++;
					isAll = false;
					$('.infinite-scroll-preloader').show();
				} else {//未返回10条数据，说明没有下一页了
					$('.infinite-scroll-preloader').hide();
					isAll = true;
				}

				if (reload) {
					$(".alist").empty();
				}
				$(".alist").append(listStr);
				$.pullToRefreshDone('.pull-to-refresh-content');
			} else {
				api.alert({
					msg : "小客正在为您准备数据，请您稍后刷新再试"
				}, function(ret, err) {
					//coding...
				});
				$.pullToRefreshDone('.pull-to-refresh-content');
			}
			loading = false;
		}
	});
}

function touchstart(o) {
	$(o).css("backgroundColor", "#eaeaea");
	setTimeout(function() {
		$(o).css("backgroundColor", "#fff");
	}, 1000 * 0.2);
}

//获得某个类型的类型内容
function getTypeList(catid, page) {

	if (loading) {
		return;
	}

	defaultCartId = catid;
	loading = true;
	keyword = '';
	currentPage = page;
	isAll = false;

	var jsonParam = {
		longitude : lon,
		latitude : lat,
		page : page,
		catid : catid
	};

	getNuomiList(jsonParam, true);
}

//显示详细页面
function showDetail(url) {
	api.openWin({
		name : 'arroundDetailWin',
		pageParam : {
			"url" : url
		},
		url : "detail.html"
	});

}

function goback() {
	//	api.closeWin({
	//	});
	api.closeFrame({
		name : 'aroundWin'
	});
}

$.init();

//下拉刷新
$(document).on('refresh', '.pull-to-refresh-content', function(e) {
	console.log("aaaaa");
	if (loading) {
		return;
	}
	isAll = false;
	loading = true;
	keyword = '';
	defaultCartId = '326';

	$("#search").val("");
	//显示周边的团购
	showArround(lon, lat);
});

//无限滚动
$(document).on('infinite', function() {
	// 如果正在加载，则退出
	if (loading)
		return;
	// 设置flag
	loading = true;

	if (isAll) {
		$.toast("已加载所有信息，换个查询试一试吧");
		loading = false;
		return;
	}
	//设置当前的搜索参数
	var jsonParam = {};
	if (keyword == '') {
		jsonParam = {
			longitude : lon,
			latitude : lat,
			page : currentPage,
			catid : defaultCartId
		};
	} else {
		var jsonParam = {
			longitude : longitude,
			latitude : latitude,
			page : currentPage,
			keyword : keyword,
			catid : defaultCartId
		};
	}

	getNuomiList(jsonParam, false);

	// 模拟1s的加载过程
	//setTimeout(function () {
	//    // 重置加载flag
	//    $('.infinite-scroll-preloader').remove();
	//}, 1000);
});
