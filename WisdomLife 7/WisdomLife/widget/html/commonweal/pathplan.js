var lon;
var lat;
var lon_Purpose;
var lat_Purpose;
var map;
var detail;
var bus_json;
var walk_json;
var shopname;
var type_GPS = 1;
var appBundle;
var systemType;
var y;
var h;
var nowli = '<li onclick="showLi(\"[detail]\")"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"></div>' + '<div class="item-subtitle">\"[name]\"</div><div class="item-text"><span>\"[time]\" |</span><span>\"[miles]\"</span></div></div> </a></li>';
apiready = function() {
	shopname = api.pageParam.shopname;
	lon_Purpose = api.pageParam.lon;
	lat_Purpose = api.pageParam.lat;
	var header = $api.byId('header');
	var top1 = $(window).height();
	var top2 = $('.content-block').offset().top;
	systemType = api.systemType;
	if (systemType == "ios") {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
		appBundle = "baidumap";
		$('.map').height(top1 - top2 - 20);
		y = top2 + 20;
		h = top1 - top2 - $('.detail').height() - 20;
	} else {
		appBundle = 'com.baidu.BaiduMap';
		$('.map').height(top1 - top2);
		y = top2;
		h = top1 - top2 - $('.detail').height();
	}
	$("#back").bind("click", function() {
		map.close();
		api.closeWin();
	});

	$('#navigation').click(function() {
		//		$('.hide').show();
		api.confirm({
			title : '提示',
			msg : '是否打开百度地图？',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {
				//同步返回结果：
				var installed = api.appInstalled({
					sync : true,
					appBundle : appBundle
				});
				if (installed) {
					if (type_GPS == 1) {
						if (systemType == "ios") {
							window.location.href = "baidumap://map/direction?origin=" + lat + "," + lon + "&destination=" + lat_Purpose + "," + lon_Purpose + "&mode=driving&src=webapp.navi.yourCompanyName.yourAppName";
						} else {
							window.location.href = "bdapp://map/direction?origin=name:我的位置|latlng:" + lat + "," + lon + "&destination=name:" + shopname + "|latlng:" + lat_Purpose + "," + lon_Purpose + "&mode=driving";
						}
					} else if (type_GPS == 2) {
						if (systemType == "ios") {
							window.location.href = "baidumap://map/direction?origin=" + lat + "," + lon + "&destination=" + lat_Purpose + "," + lon_Purpose + "&mode=transit&src=webapp.navi.yourCompanyName.yourAppName";
						} else {
							window.location.href = "bdapp://map/direction?origin=name:我的位置|latlng:" + lat + "," + lon + "&destination=name:" + shopname + "|latlng:" + lat_Purpose + "," + lon_Purpose + "&mode=transit&sy=3&index=0&target=1";
						}
					} else {
						if (systemType == "ios") {
							window.location.href = "baidumap://map/direction?origin=" + lat + "," + lon + "&destination=" + lat_Purpose + "," + lon_Purpose + "&mode=walking&src=webapp.navi.yourCompanyName.yourAppName";
						} else {
							window.location.href = "bdapp://map/direction?origin=name:我的位置|latlng:" + lat + "," + lon + "&destination=name:" + shopname + "|latlng:" + lat_Purpose + "," + lon_Purpose + "&mode=walking";
						}
					}
				} else {
					api.alert({
						msg : "请安装百度地图后重试"
					});
				}
			}
		});
	})
	$('.hide').click(function() {
		$('.hide').hide();
	})
	$('.jili>div').click(function() {
		$(this).addClass('changeCor').siblings().removeClass('changeCor');
	})
	map = api.require('bMap');
	api.showProgress();
	map.getLocation({
		accuracy : '10m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		api.hideProgress();
		if (ret.status) {
			console.log('定位结果：  ' + JSON.stringify(ret));
			lon = ret.lon;
			lat = ret.lat;
			api.showProgress();
			map.open({
				rect : {
					x : 0,
					y : y,
					w : api.winWidth,
					h : h
				},
				center : {
					lon : lon,
					lat : lat
				},
				zoomLevel : 16,
				showUserLocation : true,
				fixedOn : api.frameName,
				fixed : true
			}, function(ret) {
				console.log('打开界面结果：  ' + JSON.stringify(ret));
				if (ret.status) {
					getCarPath();
				}
			});
		} else {
			alert(err.code);
		}
	});

	$('#detailOfDrive').click(function() {
		api.openWin({//打开我的房间界面
			name : 'pathdetail',
			url : 'pathdetail.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				name : $('#costTime').html(),
				mon : $('#costMon').html(),
				detail : detail
			}
		});
	});

	$('#a_tab1').click(function() {
		type_GPS = 1;
		map.show();
		getCarPath();
	});
	$('#a_tab2').click(function() {
		type_GPS = 2;
		map.hide();
		$('li').remove();
		getBusDetails('ebus_time_first');
	});
	$('#jili61').click(function() {
		$('li').remove();
		getBusDetails('ebus_time_first');
	});
	$('#jili121').click(function() {
		$('li').remove();
		getBusDetails('ebus_walk_first');
	});
	$('#jili241').click(function() {
		$('li').remove();
		getBusDetails('ebus_transfer_first');
	});
	$('#jili242').click(function() {
		$('li').remove();
		getBusDetails('ebus_no_subway');
	});
	$('#a_tab3').click(function() {
		type_GPS = 3;
		map.removeRoute({
			ids : [1, 3]
		});
		map.show();
		map.searchRoute({
			id : 3,
			type : 'walk',
			start : {
				lon : lon,
				lat : lat
			},
			end : {
				lon : lon_Purpose,
				lat : lat_Purpose
			}
		}, function(ret, err) {
			console.log("路线搜索3****" + JSON.stringify(ret));
			api.hideProgress();
			if (ret.status) {
				walk_json = ret.plans[0].nodes
				$('#costTime2').html(getTimeCost(ret.plans[0].duration, ret.plans[0].distance / 1000));
				map.drawRoute({
					id : 3,
					autoresizing : true,
					index : 0,
					styles : {
						start : {
							icon : ''
						},
						end : {
							icon : ''
						}
					}
				}, function(ret) {

				});
			} else {
				alert(JSON.stringify(err));
			}
		});
	});
	$('#detailOfDrive2').click(function() {
		api.openWin({//打开我的房间界面
			name : 'pathdetail',
			url : 'pathdetail.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				name : $('#costTime2').html(),
				mon : $('#costMon').html(),
				detail : walk_json
			}
		});
	});
}
function getBusDetails(policy) {
	api.showProgress();
	map.searchRoute({
		id : 2,
		type : 'transit',
		policy : policy,
		start : {
			lon : lon,
			lat : lat
		},
		end : {
			lon : lon_Purpose,
			lat : lat_Purpose
		}
	}, function(ret, err) {
		console.log("路线搜索2****" + JSON.stringify(ret));
		api.hideProgress();
		if (ret.status) {
			bus_json = ret;
			var length = ret.plans.length;
			var newsResult = "";
			for (var i = 0; i < length; i++) {
				var detail = getDetail_bus(ret.plans[i].nodes);
				var result = nowli.replace("\"[name]\"", detail.totalB);
				result = result.replace("\"[miles]\"", '步行' + detail.totalW + '米');
				result = result.replace("\"[time]\"", getTimeCost(ret.plans[i].duration, ret.plans[i].distance / 1000));
				result = result.replace("\"[detail]\"", i);
				newsResult += result;
			}
			console.log(newsResult);
			$('#ul_tab2').append(newsResult);
		} else {
//			alert(JSON.stringify(err));
			if(err.code==6){
				alert('起终点太近');
			}else if(err.code==3){
				alert('该城市不支持公交搜索');
			}else if(err.code==4){
				alert('不支持跨城市公交');
			}else if(err.code==5){
				alert('没有找到检索结果');
			}
		}
	});
}

function showLi(i) {
	var json_bus_li = bus_json.plans[i].nodes;
	api.openWin({//打开我的房间界面
		name : 'pathdetail',
		url : 'pathdetail.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		},
		pageParam : {
			name : getTimeCost(bus_json.plans[i].duration, bus_json.plans[i].distance / 1000),
			mon : $('#costMon').html(),
			detail : json_bus_li
		}
	});
}

function getDetail_bus(json) {
	var totalW = 0;
	var totalB = "";
	var description = "";
	var a1 = "步行";
	var a2 = "乘坐";
	var a = 0;
	for (var i = 0; i < json.length; i++) {
		description += json[i].description;
	}
	console.log(description + "*************");
	for (var i = 0; i < (description.split(a1)).length - 1; i++) {
		var haha = description.substr(description.indexOf(a1, a) + 2, 4);
		if (haha.indexOf('米') >= 0) {
			var c = haha.indexOf('米');
			totalW += Number(haha.substring(0, c));
		}
		a = description.indexOf(a1, a) + 1;
	}
	a = 0;
	for (var i = 0; i < (description.split(a2)).length - 1; i++) {
		var haha = description.indexOf(',', description.indexOf(a2, a) + 2);
		var nana = description.substring(description.indexOf(a2, a) + 2, haha);
		if (nana.indexOf('(') >= 0) {
			var c = nana.indexOf('(');
			totalB += nana.substring(0, c) + ">";
		} else {
			totalB += nana + ">";
		}
		a = description.indexOf(a2, a) + 1;
	}
	var descriptionInfo = {};
	descriptionInfo.totalW = totalW;
	descriptionInfo.totalB = totalB.substring(0, totalB.length - 1);
	return descriptionInfo;
}

function getCarPath() {
	map.removeRoute({
		ids : [1, 3]
	});
	map.showUserLocation({
		isShow : true,
		trackingMode : 'none'
	});
	map.searchRoute({
		id : 1,
		type : 'drive',
		start : {
			lon : lon,
			lat : lat
		},
		end : {
			lon : lon_Purpose,
			lat : lat_Purpose
		}
	}, function(ret, err) {
		console.log("路线搜索****" + JSON.stringify(ret));
		api.hideProgress();
		if (ret.status) {
			$('#costTime').html(getTimeCost(ret.plans[0].duration, ret.plans[0].distance / 1000));
			console.log(ret.plans[0].distance+"---------------------");
			console.log(getTexCost(ret.plans[0].distance / 1000));
			if (ret.plans[0].distance) {
				$('#costMon').html(getTexCost(ret.plans[0].distance / 1000));
			} else {
				$('#costMonAll').css('visibility', 'hidden');
			}
			detail = ret.plans[0].nodes;
			map.drawRoute({
				id : 1,
				autoresizing : false,
				index : 0,
				styles : {
					start : {
						icon : ''
					},
					end : {
						icon : ''
					}
				}
			}, function(ret) {

			});
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function getTexCost(km) {
	if (km <= 3) {
		return 13;
	} else if (km > 3) {
		return (13 + (km - 3) * 2.3).toFixed(1);
	}
}

function getTimeCost(totalTime, km) {
	var gongli;
	if (km < 1) {
		gongli = ' (' + km * 1000 + '米)';
	} else {
		gongli = ' (' + km.toFixed(1) + '公里)';
	}
	if (totalTime < 3600) {
		return Math.round(totalTime / 60) + '分钟' + gongli;
	} else if (totalTime <= 24 * 60 * 60) {
		return parseInt(totalTime / 3600) + '小时' + Math.round((totalTime % 3600) / 60) + '分钟' + gongli;
	} else {
		return '超过一天' + gongli;
	}
}

