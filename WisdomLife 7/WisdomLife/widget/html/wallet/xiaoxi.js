var nowli = '<li class="all item-content"><div class="mess">\"[content]\"</div><div class="time"><span>\"[messagetime]\"</span></div></li>';
var nowTab = 1;
//默认
var page1 = true;
var page2 = true;
var page3 = true;
var pageNum1 = 1;
var pageNum2 = 1;
var pageNum3 = 1;
//控制刷新方法的触发
var isRefresh = true;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}
	//	var height = $('.buttons-tab').height();
	//	$('.content-block').css('margin-top', height + 'px');

	$("#back").on('click', function() {
		api.closeWin();
	});
	$("#back").on('click', function() {
		api.closeWin();
	});
	getTab1Info('1', '1');
	$("#a_tab1").on('click', function() {
		$('li').remove();
		nowTab = 1;
		page1 = true;
		pageNum1 = 1;
		isRefresh = true;
		$('.infinite-scroll-preloader').eq(0).show();
		getTab1Info('1', '1');
	});
	$("#a_tab2").on('click', function() {
		$('li').remove();
		nowTab = 2;
		page2 = true;
		pageNum2 = 1;
		isRefresh = true;
		$('.infinite-scroll-preloader').eq(1).show();
		getTab1Info('3', '1');
	});
	$("#a_tab3").on('click', function() {
		$('li').remove();
		nowTab = 3;
		page3 = true;
		pageNum3 = 1;
		isRefresh = true;
		$('.infinite-scroll-preloader').eq(2).show();
		getTab1Info('6', '1');
	});
	$(document).on('pageInit', function(e, id, page) {
		$(page).on('infinite', function() {
			if (isRefresh) {
				return
			}
			if (nowTab == 1) {
				if (page1) {
					pageNum1 = pageNum1 + 1;
					getTab1Info('1', pageNum1);
				}
			} else if (nowTab == 2) {
				if (page2) {
					pageNum2 = pageNum2 + 1;
					getTab1Info('3', pageNum2);
				}
			} else if (nowTab == 3) {
				if (page3) {
					pageNum3 = pageNum3 + 1;
					getTab1Info('6', pageNum3);
				}
			}
		});
	});
	$.init();

}
function getTab1Info(messagetype, toPage) {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/pagemessage',
		method : 'post',
		data : {
			values : {
				messagetype : messagetype,
				toPage : toPage,
				pageSize : 10
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		isRefresh = false;
		if (ret) {
			if (ret.execStatus == "true") {
				var result = ret.formDataset.entity;
				if (messagetype == "1") {//消费
					setTab1(result);
				} else if (messagetype == "3") {//回购
					setTab2(result);
				} else if (messagetype == "6") {//通知
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
	} else {//数据不为0  背景隐藏

		$("#back_tab1").hide();
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
	} else {//数据不为0  背景隐藏

		$("#back_tab2").hide();
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
	} else {//数据不为0  背景隐藏

		$("#back_tab3").hide();
		$('#ul_tab3').append(setLi(info));
	}
}

function setLi(info) {
	var length = info.list.length;
	var newsResult = "";
	for (var i = 0; i < length; i++) {
		var result = nowli.replace("\"[content]\"", info.list[i].content);
		result = result.replace("\"[messagetime]\"", info.list[i].messagetime);
		newsResult += result;
	}
	return newsResult;
}
