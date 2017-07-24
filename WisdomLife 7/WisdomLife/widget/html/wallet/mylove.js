var tabTop = "6";
//默认
var page1 = true;
var page2 = true;
var page3 = true;
var pageNum1 = 1;
var pageNum2 = 1;
var pageNum3 = 1;
//var nowli = '<li class="delete"><div class="detailone"><span class="detailLeft">消费日期：</span><span class="detailRight">\"[lastDay]\"</span>' 
//+ '</div><span><i class="iconfont icon-meidou"></i></span><span class="detailnumber">\"[tax]\"</span></li>' 
//+ '<li class="litwo delete"><div class="detailtwo"><span class="detailLeft">消费日期：</span><span class="detailRight">\"[reachtime]\"</span>' 
//+ '</div><span><i class="iconfont icon-aixin3"></i></span><span class="detailnumber">\"[lovenumber]\"</span></li>';

var nowli = '<li class="delete"><div class="detailone"><span class="detailLeft">消费日期：</span><span class="detailRight">\"[lastDay]\"</span></div>'
 + '<span><i class="iconfont icon-moneybag"></i></span><span class="detailnumber">\"[tax]\"</span></li><li class="delete"><div class="detailone">'
 + '<span class="detailLeft">爱心产生日期：</span><span class="detailRight">\"[reachtime]\"</span></div><span><i class="iconfont icon-aixin3"></i> </span>'
 + '<span class="detailnumber">\"[totalnumber]\"</span></li><li class="delete"><div class="detailone"><span class="detailLeft">激励中的爱心</span>'
 + '<span class="detailRight"></span></div><span><i class="iconfont icon-aixin3"></i> </span><span class="detailnumber">\"[lovenumber]\"</span></li>'
 + '<li class="delete"><div class="detailone"><span class="detailLeft">激励完成的爱心</span><span class="detailRight"></span></div>'
 + '<span><i class="iconfont icon-aixin3"></i> </span><span class="detailnumber">\"[endnumber]\"</span></li><li class="delete"><div class="detailone">'
 + '<span class="detailLeft">已激励信使豆</span><span class="detailRight"></span></div><span><i class="iconfont icon-meidou"></i> </span>'
 + '<span class="detailnumber">+0.00</span></li><li class="delete bottomLi"><div class="detailone"><span class="detailLeft">平台管理费</span><span class="detailRight"></span>'
 + '</div><span><i class="iconfont icon-meidou"></i> </span><span class="detailnumber">\"[totalnumber2]\"</span></li>';
var winHeight;
var offsetTop;
//控制刷新方法的触发
var isRefresh = true;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}

	winHeight = api.winHeight;
	offsetTop = $("#back_tab1").offset().top;

	$("#choose").on('click', function() {
		var top = $(this).children().hasClass('icon-top');
		if (top) {
			$(".secondul").show();
			$(this).children().removeClass('icon-top').addClass('icon-down');
		} else {
			$(".secondul").hide();
			$(this).children().removeClass('icon-down').addClass('icon-top');
		}
	});

	$("#back").bind("click", function() {
		api.closeWin();
	});
	getInfos(tabTop, "5", "1");
	$("#a_tab1").on('click', function() {
		$('li.delete').remove();
		tabTop = "6";
		page1 = true;
		isRefresh = true;
		pageNum1 = 1;
		$('.infinite-scroll-preloader').eq(0).show();
		getInfos(tabTop, "5", "1");
	});
	$("#a_tab2").on('click', function() {
		$('li.delete').remove();
		tabTop = "12";
		page2 = true;
		isRefresh = true;
		pageNum2 = 1;
		$('.infinite-scroll-preloader').eq(1).show();
		getInfos(tabTop, "5", "1");
	});
	$("#a_tab3").on('click', function() {
		$('li.delete').remove();
		tabTop = "24";
		page3 = true;
		isRefresh = true;
		pageNum3 = 1;
		$('.infinite-scroll-preloader').eq(2).show();
		getInfos(tabTop, "5", "1");
	});
	$("#week").on('click', function() {
		$(".secondul").hide();
		$('li.delete').remove();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		initState();
		getInfos(tabTop, "2", "1");
	});
	$("#mouth").on('click', function() {
		$(".secondul").hide();
		$('li.delete').remove();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		initState();
		getInfos(tabTop, "3", "1");
	});
	$("#threeMouth").on('click', function() {
		$('li.delete').remove();
		$(".secondul").hide();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		initState();
		getInfos(tabTop, "4", "1");
	});
	$("#sixMouth").on('click', function() {
		$('li.delete').remove();
		$(".secondul").hide();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		initState();
		getInfos(tabTop, "5", "1");
	});

	$(document).on('pageInit', function(e, id, page) {
		$(page).on('infinite', function() {
			if (isRefresh) {
				return
			}
			if (tabTop == "6") {
				if (page1) {
					pageNum1 = pageNum1 + 1;
					getInfos(tabTop, "2", page);
				}
			} else if (tabTop == "12") {
				if (page2) {
					pageNum2 = pageNum2 + 1;
					getInfos(tabTop, "2", page);
				}
			} else if (tabTop == "24") {
				if (page3) {
					console.log("刷新了----：    " + page3);
					pageNum3 = pageNum3 + 1;
					getInfos(tabTop, "2", page);
				}
			}
		});
	});
	$.init();
}
function getInfos(drivetype, datetype, toPage) {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/getHeart',
		method : 'post',
		data : {
			values : {
				drivetype : drivetype, //6.12.24
				dataType : "",
				datetype : datetype, // 近6个月：5，近1季：4；近一月：3；近一周；2
				toPage : toPage,
				pageSize : "10",
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		isRefresh = false;
		console.log($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true") {
				var result = ret.formDataset.entity;
				$('#loveTotal6').html(ret.formDataset.heart6);
				$('#loveTotal12').html(ret.formDataset.hear12);
				$('#loveTotal24').html(ret.formDataset.heat24);
				if (drivetype == "6") {//消费
					setTab1(result);
				} else if (drivetype == "12") {//回购
					setTab2(result);
				} else if (drivetype == "24") {//通知
					setTab3(result);
				}
			} else {
				api.hideProgress();
				api.toast({
					msg : "数据请求失败，请重试"
				});
			}
		} else {
			api.hideProgress();
			api.toast({
				msg : "数据请求失败，请重试"
			});
		}
	})
}

function setTab1(info) {
	var totalItem = info.totalItem;
	if (info.list.length < 10 || totalItem == 10) {
		//			$.detachInfiniteScroll($('.infinite-scroll').eq(0));
		$('.infinite-scroll-preloader').eq(0).hide();
		page1 = false;
	}
	if (totalItem == "0") {
		$("#back_tab1").show();
		$("#back_tab1").next().css('height', '0px');
	} else {//数据不为0  背景隐藏
		$("#back_tab1").hide();
		//		$("#back_tab1").next().css('height',winHeight-offsetTop+'px');
		$('#ul_tab1').append(setLi(info));
	}
}

function setTab2(info) {
	var totalItem = info.totalItem;
	if (info.list.length < 10 || totalItem == 10) {
		$('.infinite-scroll-preloader').eq(1).hide();
		page2 = false;
	}
	if (totalItem == "0") {
		$("#back_tab2").show();
		$("#back_tab2").next().css('height', '0px');
	} else {//数据不为0  背景隐藏
		$("#back_tab2").hide();
		//		$("#back_tab2").next().css('height',winHeight-offsetTop+'px');
		$('#ul_tab2').append(setLi(info));
	}
}

function setTab3(info) {
	var totalItem = info.totalItem;
	if (info.list.length < 10 || totalItem == 10) {
		$('.infinite-scroll-preloader').eq(2).hide();
		page3 = false;
	}
	if (totalItem == "0") {
		$("#back_tab3").show();
		$("#back_tab3").next().css('height', '0px');
	} else {//数据不为0  背景隐藏
		$("#back_tab3").hide();
		//		$("#back_tab3").next().css('height',winHeight-offsetTop+'px');
		$('#ul_tab3').append(setLi(info));
	}
}

function setLi(info) {
	var length = info.list.length;
	var newsResult = "";
	for (var i = 0; i < length; i++) {
		var result = nowli.replace("\"[reachtime]\"", info.list[i].reachtime);
		result = result.replace("\"[lovenumber]\"", "+"+info.list[i].lovenumber);
		var numberTax = info.list[i].tax;
		numberTax = Number(numberTax.replace(/,/g, ''));
		result = result.replace("\"[tax]\"", "+"+numberTax * 500);
		result = result.replace("\"[lastDay]\"", GetDay(info.list[i].reachtime));
		result = result.replace("\"[totalnumber]\"", "+"+info.list[i].totalnumber);
		result = result.replace("\"[endnumber]\"", "+"+info.list[i].endnumber);
		result = result.replace("\"[totalnumber2]\"", "+"+info.list[i].totalnumber);
		newsResult += result;
	}
	return newsResult;
}

function GetDay(time) {
	var year = parseInt(time.substr(0, 4), 10);
	var month = parseInt(time.substr(5, 2), 10);
	var day = parseInt(time.substr(8, 2), 10);
	var today = new Date(year, month - 1, day);
	var yesterday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24;

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();
	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;
	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay;
	return strYesterday;
}

function initState() {
	$('.infinite-scroll-preloader').eq(0).show();
	$('.infinite-scroll-preloader').eq(1).show();
	$('.infinite-scroll-preloader').eq(2).show();
	page1 = true;
	page2 = true;
	page3 = true;
	pageNum1 = 1;
	pageNum2 = 1;
	pageNum3 = 1;
	isRefresh = true;
}