var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">\"[reachtime]\"</div>' + '<div class="item-after"><i class="iconfont icon-aixin3"></i><span class="red">\"[lovenumber]\"</span></div>' + '<div class="item-after"><i class="iconfont icon-meidou"></i><span class="orange">\"[lovevalue]\"</span></div></div></li>';
var nowli2 = '<li class="item-content"><div class="item-inner"><div class="item-title">\"[returntime]\"</div>' + '<div class="item-after"><div><div class="xinshi">信使</div><div>\"[sourcename]\"</div></div>' + '</div><div class="item-after"><i class="iconfont icon-meidou"></i><span class="orange">\"[amount]\"</span></div></div></li>';
var num_top = 1;
var num_tab1 = 6;
var num_tab2 = 6;
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
	var winHeight = api.winHeight;
	var offsetTop = $(".change").offset().top;
	//	$(".change").css('height',winHeight-offsetTop+'px');

	$("#choose").on('click', function() {
		var top = $(this).children().hasClass('icon-top');
		if (top) {
			$(".secondul").show();
			$(this).children().removeClass('icon-top').addClass('icon-down');
		} else {
			$(".secondul").hide();
			$(this).children().removeClass('icon-down').addClass('icon-top');
		}
	})

	$('#jili6').on('click', function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	$('#jili12').on('click', function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	$('#jili24').on('click', function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	$('#jili61').on('click', function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	$('#jili121').on('click', function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	$('#jili241').on('click', function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	$("#back").bind("click", function() {
		api.closeWin();
	});
	getTabInfo("6", "6", "", "", "1");
	$("#a_tab1").on('click', function() {//激励信使豆
		num_top = 1;
		initState();
		$('.infinite-scroll-preloader').eq(0).show();
		getTabInfo(num_tab1, "6", "", "", "1");
	});
	$("#jili6").on('click', function() {
		num_tab1 = 6;
		$('li.item-content').remove();
		page1 = true;
		pageNum1 = 1;
		$('.infinite-scroll-preloader').eq(0).show();
		getTabInfo(num_tab1, "6", "", "", "1");
	});
	$("#jili12").on('click', function() {
		num_tab1 = 12;
		$('li.item-content').remove();
		page2 = true;
		pageNum2 = 1;
		$('.infinite-scroll-preloader').eq(0).show();
		getTabInfo(num_tab1, "6", "", "", "1");
	});
	$("#jili24").on('click', function() {
		num_tab1 = 24;
		$('li.item-content').remove();
		page3 = true;
		pageNum3 = 1;
		$('.infinite-scroll-preloader').eq(0).show();
		getTabInfo(num_tab1, "6", "", "", "1");
	});
	$("#a_tab2").on('click', function() {//推荐信使豆
		console.log('推荐');
		num_top = 2;
		initState();
		$('.infinite-scroll-preloader').eq(1).show();
		getTab2Info(num_tab2, "", "", "1");
	});
	$("#jili61").on('click', function() {
		console.log('推荐6');
		num_tab2 = 6;
		$('li.item-content').remove();
		page1 = true;
		pageNum1 = 1;
		$('.infinite-scroll-preloader').eq(1).show();
		getTab2Info(num_tab2, "", "", "1");
	});
	$("#jili121").on('click', function() {
		console.log('推荐12');
		num_tab2 = 12;
		$('li.item-content').remove();
		page2 = true;
		pageNum2 = 1;
		$('.infinite-scroll-preloader').eq(1).show();
		getTab2Info(num_tab2, "", "", "1");
	});
	$("#jili241").on('click', function() {
		console.log('推荐24');
		num_tab2 = 24;
		$('li.item-content').remove();
		page3 = true;
		pageNum3 = 1;
		$('.infinite-scroll-preloader').eq(1).show();
		getTab2Info(num_tab2, "", "", "1");
	});
	/**
	 *筛选
	 */
	$("#allLi").on('click', function() {
		a = 0;
		$(".secondul").hide();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		$('li.item-content').remove();
		initState();
		if (num_top == 1) {
			$('.infinite-scroll-preloader').eq(0).show();
			getTabInfo(num_tab1, "6", "", "", "1");
		} else if (num_top == 2) {
			console.log('点击了全部');
			$('.infinite-scroll-preloader').eq(1).show();
			getTab2Info(num_tab2, "", "", "1");
		}
	});
	$("#todayLi").on('click', function() {
		console.log('todayLi');
		$(".secondul").hide();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		$('li.item-content').remove();
		initState();
		if (num_top == 1) {
			$('.infinite-scroll-preloader').eq(0).show();
			getTabInfo(num_tab1, "6", getToday(), getToday(), "1");
		} else if (num_top == 2) {
			$('.infinite-scroll-preloader').eq(1).show();
			getTab2Info(num_tab2, getToday(), "", "1");
		}
	});
	$("#weekLi").on('click', function() {
		console.log('weekLi');
		$(".secondul").hide();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		$('li.item-content').remove();
		initState();
		if (num_top == 1) {
			$('.infinite-scroll-preloader').eq(0).show();
			getTabInfo(num_tab1, "2", "", "", "1");
		} else if (num_top == 2) {
			$('.infinite-scroll-preloader').eq(1).show();
			getTab2Info(num_tab2, getWeek(), getToday(), "1");
		}
	});
	$("#mouthLi").on('click', function() {
		console.log('mouthLi');
		$(".secondul").hide();
		$('.icon-down').removeClass('icon-down').addClass('icon-top');
		$('li.item-content').remove();
		initState();
		if (num_top == 1) {
			$('.infinite-scroll-preloader').eq(0).show();
			getTabInfo(num_tab1, "3", "", "", "1");
		} else if (num_top == 2) {
			$('.infinite-scroll-preloader').eq(1).show();
			getTab2Info(num_tab2, getMouth(), getToday(), "1");
		}
	});

	$(document).on('pageInit', function(e, id, page) {
		$(page).on('infinite', function() {
			if (isRefresh) {
				return
			}
			console.log('*******加载更多');
			if (num_top == 1) {
				if (num_tab1 == 6) {
					if (page1) {
						pageNum1 = pageNum1 + 1;
						getTabInfo(num_tab1, "6", "", "", pageNum1);
					}
				} else if (num_tab1 == 12) {
					if (page2) {
						pageNum2 = pageNum2 + 1;
						getTabInfo(num_tab1, "6", "", "", pageNum2);
					}
				} else if (num_tab1 == 24) {
					if (page3) {
						pageNum3 = pageNum3 + 1;
						getTabInfo(num_tab1, "6", "", "", pageNum3);
					}
				}
			} else if (num_top == 2) {
				if (num_tab2 == 6) {
					if (page1) {
						pageNum1 = pageNum1 + 1;
						getTab2Info(num_tab2, "", "", pageNum1);
					}
				} else if (num_tab2 == 12) {
					if (page2) {
						pageNum2 = pageNum2 + 1;
						getTab2Info(num_tab2, "", "", pageNum2);
					}
				} else if (num_tab2 == 24) {
					if (page3) {
						pageNum3 = pageNum3 + 1;
						getTab2Info(num_tab2, "", "", pageNum3);
					}
				}
			}

		});
	});
	$.init();
}
function initState() {
	page1 = true;
	page2 = true;
	page3 = true;
	pageNum1 = 1;
	pageNum2 = 1;
	pageNum3 = 1;
	isRefresh = true;
}

function getTab2Info(drivetype, returntime, datetime, toPage) {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/pageReferrerflow',
		method : 'post',
		data : {
			values : {
				drivetype : drivetype, //激励模式 6 ，12 ，24
				usertype : 1, //用户类型默认1
				returntime : returntime,
				datetime : datetime,
				toPage : toPage,
				pageSize : 10
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		isRefresh = false;
		console.log('getTab2Info');
		console.log($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true") {
				var result = ret.formDataset.entity;
				$('#tuijianTotal').html(ret.formDataset.refbeancount);
				setTab2(result);
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
	});
}

//激励信使豆
function getTabInfo(driveType, dateType, startTime, endTime, toPage) {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/excitationList',
		method : 'post',
		data : {
			values : {
				driveType : driveType, //激励模式 6 ，12 ，24
				dateType : dateType, //筛选条件   2：近一周    3：近一个月
				startTime : startTime,
				endTime : endTime,
				dataType : "", //消费来源  可传""
				toPage : toPage,
				pageSize : 10
			}
		}
	}, function(ret, err) {
		isRefresh = false;
		api.hideProgress();
		console.log($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true") {
				var result = ret.formDataset.entity;
				$("#lingshouTotal").html(ret.formDataset.lsscount);
				$("#shangjiaTotal").html(ret.formDataset.sjcount);
				setTab1(result);
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
		$('.infinite-scroll-preloader').eq(0).hide();
		if (num_tab1 == 6) {
			page1 = false;
		} else if (num_tab1 == 12) {
			page2 = false;
		} else if (num_tab1 == 24) {
			page3 = false;
		}

	}
	if (totalItem == "0") {
		$("#back_tab1").show();
		$("#ul_tab1").hide();
	} else {//数据不为0  背景隐藏
		$("#ul_tab1").show();
		$("#back_tab1").hide();
		var length = info.list.length;
		var newsResult = "";
		for (var i = 0; i < length; i++) {
			var result = nowli.replace("\"[reachtime]\"", info.list[i].reachtime);
			result = result.replace("\"[lovenumber]\"", info.list[i].lovenumber);
			result = result.replace("\"[lovevalue]\"", info.list[i].lovevalue);
			newsResult += result;
		}
		$('#tab1_ul').append(newsResult);
	}
}

function setTab2(info) {
	var totalItem = info.totalItem;
	if (info.list.length < 10 || totalItem == 10) {
		$('.infinite-scroll-preloader').eq(1).hide();
		if (num_tab2 == 6) {
			page1 = false;
		} else if (num_tab2 == 12) {
			page2 = false;
		} else if (num_tab2 == 24) {
			page3 = false;
		}
	}
	if (totalItem == "0") {
		$("#back_tab2").show();
		$("#ul_tab2").hide();
	} else {//数据不为0  背景隐藏
		$("#ul_tab2").show();
		$("#back_tab2").hide();
		var length = info.list.length;
		var newsResult = "";
		for (var i = 0; i < length; i++) {
			var result = nowli2.replace("\"[returntime]\"", info.list[i].returntime);
			result = result.replace("\"[sourcename]\"", info.list[i].sourcename);
			result = result.replace("\"[amount]\"", info.list[i].amount);
			newsResult += result;
		}
		$('#tab2_ul').append(newsResult);
	}
}

function getToday() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return year + '-' + month + '-' + day;
}

function getWeek() {
	var now = new Date();
	var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return year + '-' + month + '-' + day;
}

function getMouth() {
	var now = new Date();
	var date = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return year + '-' + month + '-' + day;
}