//需要填充的模版
//var template = "<li class='aLi' ontouchstart='touchstart(this)' onclick='showDetail(\"[url]\")'> " + "<img src='[imgurl]' height='63' width='85' /><div class='conter'><p class='conterO'>" + "<span class='conterOleft'>[title]</span><span class='conterOringht'>[instance]</span></p>" + "<p class='describe'>[describe]</p><p class='price'><span class='priceLeft'>￥[current_price]</span>" + "<s class='priceDel'>[market_price]</s><span class='conterOringht priceRight'>[score]分</span></p>" + "</div></li>";
var template = '<li class="addLi" id="[id]"><a href="#" class="item-link item-content"><div class="item-media"><img src="[imgurl]" style=" width:4rem;height:4rem">' + '</div><div class="item-inner"><div class="item-title-row"><div class="item-title">[title]</div>' + '</div><div class="item-subtitle">[instance]</div><div class="item-text"><i class="icon iconfont icon-favorfill"></i>' + '<i class="icon iconfont icon-favorfill"></i><i class="icon iconfont icon-favorfill"></i><span>\"[companytype]\"</span></div>' + '</div> </a></li>';
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
//
var geDiv = '<div class="same" onclick="showList(\"[id]\")"><img src="\"[pic]\""/><p>\"[name]\"</p></div>';
var hangDiv = '<div class="swiper-slide" ><div  id="hangDiv\"[id]\"" class="typeAll" style="padding-bottom:10px;"></div></div>';
var jsonOfFenLei;
var page = 1;
apiready = function() {
	setFenLeiList();
	setLieBiaoList(page);
	$('#allcity').click(function() {
		var isTop = $('.icon-top');
		if (isTop.length != 0) {
			$('.icon-top').removeClass('icon-top').addClass('icon-down');
			$('.hide').hide();
		} else {
			$('.hide').show();
			$('.icon-down').removeClass('icon-down').addClass('icon-top');
		}
	})

	$('#changeCity').click(function() {
		$(".hide").hide();
		getCityList();
	})

	$('#search').focus(function() {
		changeDir();
		$('#search').blur();
		api.openWin({//打开我的房间界面
			name : 'search',
			url : 'search.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	})

	$(document).on('infinite', function() {
		if (loading)
			return;
		loading = true;
		setLieBiaoList(page);
	});
	$.init();
}
//获得首页的列表
function setLieBiaoList(p) {
	api.showProgress();
	AjaxUtil.exeScript({
		script : "managers.provider.providerMsg", //need to do
		needTrascation : false,
		funName : "list",
		form : {
			p : p,
			urge : "",
			site : "",
			industry : "",
			mainbusiness : "",
			scale : "",
			address : "",
			companycategory : ''
		},
		success : function(data) {
			api.hideProgress();
			loading = false;
			console.log('列表***********' + $api.jsonToStr(data));
			if (data.execStatus == "true") {
				getNuomiList(data.datasources[0]);
			} else {
				api.toast({
					msg : '获取信息失败，请重试'
				});
			}
		}
	});
}

function setFenLeiList() {
	api.showProgress();
	AjaxUtil.exeScript({
		script : "managers.provider.providerManager", //need to do
		needTrascation : false,
		funName : "selectTypeList",
		success : function(data) {
			api.hideProgress();
			console.log('分类的类型列表***********' + $api.jsonToStr(data));
			if (data.execStatus === "true") {
				var rows = data.datasources[0].rows;
				jsonOfFenLei = rows;
				var length = rows.length;
				if (length <= 8) {
					var newre = hangDiv;
					$('#totalDiv').append(newre);
					var allGeDiv = "";
					for (var i = 0; i < length; i++) {
						var result = geDiv.replace("\"[name]\"", rows[i].typename);
						result = result.replace("\"[pic]\"", rootUrl + rows[i].picpath);
						result = result.replace("\"[id]\"", i);
						allGeDiv += result;
					};
					$('.typeAll').append(allGeDiv);
				} else {
					var pageLength = Math.ceil(length / 8);
					var newre = "";
					for (var i = 0; i < pageLength; i++) {
						newre += hangDiv.replace("\"[id]\"", i);
					}
					console.log('分类的全部界面代码2222:  ' + newre);
					$('#totalDiv').append(newre);
					for (var j = 0; j < pageLength; j++) {
						var allGeDiv = "";
						var total = 0;
						if (j == pageLength - 1) {
							total = length;
						} else {
							total = 8 * (j + 1);
						}
						for (var i = 8 * j; i < total; i++) {
							var result = geDiv.replace("\"[name]\"", rows[i].typename);
							result = result.replace("\"[pic]\"", rootUrl + rows[i].picpath);
							result = result.replace("\"[id]\"", i);
							allGeDiv += result;
						};
						console.log('分类的全部界面代码:  ' + allGeDiv);
						var id = "#hangDiv" + j;
						console.log("" + id + "");
						$(id).append(allGeDiv);
					}
				}
				var swiper = new Swiper('.swiper-container', {
					pagination : '.swiper-pagination',
					paginationClickable : true
				});
			} else {
				api.toast({
					msg : '数据请求失败，请重试'
				});
			}
		}
	});
}

//跳转到类型列表界面
function showList(i) {
	api.openWin({
		name : 'commondetail',
		url : 'commondetail.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		},
		pageParam : {
			name : jsonOfFenLei[i].typename,
			id : jsonOfFenLei[i].fid
		}
	});
}

//获得列表详情
function getNuomiList(json) {
	var info = json.rows;
	var length = info.length;
	var listStr = "";
	for (var i = 0; i < length; i++) {
		listStr += template;
		listStr = listStr.replace("[imgurl]", rootUrl + info[i].shopurl);
		listStr = listStr.replace("[instance]", info[i].address);
		listStr = listStr.replace("[title]", info[i].companyname);
		listStr = listStr.replace("[id]", info[i].fid);
		listStr = listStr.replace("\"[companytype]\"", info[i].companytype);
	}
	$(".media-list ul").append(listStr);
	$('.addLi').bind('click', function() {
		api.openWin({//详情界面
			name : 'detailspage',
			url : 'detailspage.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : $(this).attr('id')
			}
		});
	})
	if (json.rowCount <= 10) {
		// 加载完毕，则注销无限加载事件，以防不必要的加载
		$.detachInfiniteScroll($('.infinite-scroll'));
		// 删除加载提示符
		$('.infinite-scroll-preloader').remove();
	} else {
		page++;
		if (Math.ceil(json.rowCount / 10) < page) {
			// 加载完毕，则注销无限加载事件，以防不必要的加载
			$.detachInfiniteScroll($('.infinite-scroll'));
			// 删除加载提示符
			$('.infinite-scroll-preloader').remove();
		}
	}

}

function touchstart(o) {
	$(o).css("backgroundColor", "#eaeaea");
	setTimeout(function() {
		$(o).css("backgroundColor", "#fff");
	}, 1000 * 0.2);
}

function goback() {
	api.closeWin({
	});
}

function changeDir() {
	var isTop = $('.icon-top');
	if (isTop.length != 0) {
		$('.icon-top').removeClass('icon-top').addClass('icon-down');
		$('.hide').hide();
	}
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
		currentCity : '北京',
		locationWay : 'GPS(当前定位)',
		hotTitle : '热门城市',
		fixedOn : api.frameName,
		placeholder : '请输入城市'
	}, function(ret, err) {
		if (ret) {
			if (ret.eventType == 'show') {
			} else {
				UICityList.close();
			}
		} else {
			api.alert({
				msg : JSON.stringify(err)
			});
		}
	});
}

function refresh() {
	$('#search').blur();
}