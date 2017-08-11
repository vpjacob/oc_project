var nowli = "<li class='item-content'><div class='item-inner'><div class='item-title'>\"[city]\"</div></div><div class='del'>删除</div></li>";
var nowaddr;
var choose;
apiready = function() {
	bMap = api.require('bMap');
	//	nowaddr = api.getPrefs({
	//		sync : true,
	//		key : 'nowaddr'
	//	});
	//	$("#nowaddr").html(nowaddr);
	loadLocation();
	FileUtils.readFile("citys.json", function(data) {
		console.log('citys.json:  ' + $api.jsonToStr(data));
		var newsResult = "";
		for (var k in data) {
			var result = nowli.replace("\"[city]\"", data[k]);
			newsResult += result;
		}
		$('ul').append(newsResult);

		choose = api.getPrefs({
			sync : true,
			key : 'cityname'
		});
		if (choose) {

			$(".first").removeClass("first");
			$("li").each(function(i, v) {
				if ($(this).find(".item-title").html() == choose) {
					$(this).addClass("first");
					return;
				}
			})
			if ($(".first").length == 0) {
				$("#nowaddr").parent().parent().addClass("first");
			}
		}

		$(".item-content").each(function() {
			var startX;
			var movetouch;

			$(this).swipeLeft(function() {
				$(".del").animate({
					right : "-80px"
				}, "fast");
				$(this).find(".del").animate({
					right : "0px"
				}, "fast");
			});
			$(this).swipeRight(function() {
				$(this).find(".del").animate({
					right : "-80px"
				}, "fast");
			})
		})
	});

	$('#address').click(function() {
		$(".del").css("display", "none");
		getCityList();
	});

	$(document).on("click", ".item-content", function() {
		var cityname;
		$(this).siblings().removeClass("first");
		$(this).addClass("first");
		touchstart($(this)[0]);
		api.setPrefs({
			key : 'cityname',
			value : $(this).find(".item-title").html()
		});
		api.execScript({
			sync : true,
			name : 'root',
			frameName : 'weather',
			script : 'loadLocationFormMap("yes");'
		});
		setTimeout(function() {
			api.closeWin();
		}, 500);

	});
	//	$(document).on("click", ".item-title", function() {
	//		var cityname;
	//		$(this).siblings().removeClass("first");
	//		$(this).addClass("first");
	//		api.setPrefs({
	//			key : 'cityname',
	//			value : $(this).html()
	//		});
	//		api.execScript({
	//			sync : true,
	//			name : 'root',
	//			frameName : 'weather',
	//			script : 'loadLocationFormMap("yes");'
	//		});
	//		setTimeout(function() {
	//			api.closeWin();
	//		}, 800);
	//
	//	});

	$(document).on("touchstart", ".del", function() {
		$(this).parent().remove();
		var deladdr = $(this).prev().children("div").html();
		FileUtils.readFile("citys.json", function(data) {
			var citys = data;
			delete citys[deladdr];
			FileUtils.writeFile(citys, "citys.json");
		});
		return false;

	});

	//		getCity();

};

function touchstart(o) {
	o.style.backgroundColor = '#eaeaea';
	setTimeout(function() {
		o.style.background = "#fff";
	}, 1000 * 0.2);
}

function getCityList() {
	var hh = 0;
	var UICityList = api.require('UICityList');
	if (api.systemType == 'ios') {
		hh = 20;
	}
	UICityList.open({
		rect : {
			x : 0,
			y : hh,
			w : api.frameWidth,
			h : api.frameHeight
		},
		resource : 'widget://res/UICityList.json',
		styles : {
			searchBar : {
				bgColor : '#f6f6f6',
				cancelColor : '#E3E3E3'
			},
			location : {
				color : '#696969',
				size : 12
			},
			sectionTitle : {
				bgColor : '#eee',
				color : '#000',
				size : 12
			},
			item : {
				bgColor : '#fff',
				activeBgColor : '#696969',
				color : '#000',
				size : 14,
				height : 40
			},
			indicator : {
				bgColor : '#fff',
				color : '#696969'
			}
		},
		currentCity : nowaddr,
		locationWay : 'GPS(当前定位)',
		hotTitle : '热门城市',
		fixedOn : api.frameName,
		placeholder : '请输入城市'
	}, function(ret, err) {
		if (ret) {
			if (ret.eventType == 'show') {
			} else {
				changeaddress(ret.cityInfo.city);
				api.setPrefs({
					key : 'cityname',
					value : ret.cityInfo.city
				});
				api.execScript({
					sync : true,
					name : 'root',
					frameName : 'weather',
					script : 'loadLocationFormMap("yes");'
				});
				setTimeout(function() {
					api.closeWin();
					UICityList.close();
				}, 500);
			}
		} else {
			api.alert({
				msg : JSON.stringify(err)
			});
		}
	});
}

function changeaddress(address) {
	if (address == nowaddr) {
		return;
	}
	var newsResult = "";
	var citys = {};
	var choosecity = {};
	FileUtils.readFile("citys.json", function(data) {
		citys = data;
		if (!citys[address]) {
			citys[address] = address;
			var result = nowli.replace("\"[city]\"", address);
			newsResult += result;
			$('ul').append(newsResult);
			FileUtils.writeFile(citys, "citys.json");
		} else {

		}
	});
}

function loadLocation() {
	console.log("开始定位");
	var lat;
	var lon;
	//读取地图位置
	bMap.getLocation({
		accuracy : '100m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			lat = ret.lat;
			lon = ret.lon;
			getNameFromLocat(lon, lat);
		} else {
			api.alert({
				title : "提示",
				msg : "定位失败，请检查手机设置"
			});
		}
	});
}

function getNameFromLocat(lon, lat) {

	// 创建地址解析器实例，使用的时百度js api
	var point = new BMap.Point(lon, lat);
	var geoc = new BMap.Geocoder();

	geoc.getLocation(point, function(rs) {
		var addComp = rs.addressComponents;
		var address = addComp.district + addComp.street + addComp.streetNumber;

		$("#nowaddr").html(address);
		api.setPrefs({
			key : 'nowaddr',
			value : address
		});
		api.setPrefs({
			key : 'nowLon',
			value : lon
		});
		api.setPrefs({
			key : 'nowLat',
			value : lat
		});

	});
}
