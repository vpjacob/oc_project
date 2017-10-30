var urId;
var page = 1;
var pageCount = 1;
var lon;
var lat;
var map;
var cityName="";
var id="";
apiready = function() {
	if (api.systemType == 'ios') {
		var cc = $api.dom('.title_div');
		$api.css(cc, 'margin-top:0.8rem;');
	};
	
//	var UILoading = api.require('UILoading');
//	UILoading.flower({
//		center : {
//			x : api.winWidth/2.0,
//			y : api.winHeight/2.0
//		},
//		size : 30,
//		mask:'rgba(0,0,0,0.5)',
//		fixed : true
//	}, function(ret) {
//		id=ret.id;
//	}); 
	
//	var bMap = api.require('bMap');
//	bMap.getLocation({
//		accuracy : '100m',
//		autoStop : true,
//		filter : 1
//	}, function(ret1, err1) {
//		if (ret1.status) {
//			//获取当前位置经纬度
//			lon = ret1.lon;
//			lat = ret1.lat;
//			bMap.getNameFromCoords({
//				lon : lon,
//				lat : lat
//			}, function(ret, err) {
//				if (ret.status) {
//					currentCity = ret.city;
//					var cityStorage = $api.getStorage("cityName");
//					if(cityStorage==''||String(cityStorage)=='undefinded'||String(cityStorage)=='null'){
//						$api.setStorage("cityName",currentCity);
//						cityName = currentCity;
//						init();
//					}else{
//						if(currentCity.indexOf(cityStorage)<0){
//							api.confirm({
//								title:'切换所在城市',
//								msg : '当前所在城市是' + currentCity + ',是否选择切换',
//								buttons : ['切换','取消']
//							}, function(ret2, err2) {
//								if (ret2.buttonIndex == 2) {
//									cityName = cityStorage;
//								}else if(ret2.buttonIndex==1){
//									$api.setStorage("cityName",ret.city);
//									cityName = ret.city;
//								}
//								init();
//							}); 
//						}else{
//							cityName = ret.city;
//							init();
//						}
//					}
//				}else{
//					api.toast({
//	                    msg:'定位失败'
//                  });
//					cityName = "北京";
//					init();
//				}
//			}); 
//		} else {
//			$api.toast('定位失败！刷新一下试试！');
//		}
//		UILoading.closeFlower({
//			id : id
//		}); 
//	}); 
//	function init(){
//		$("#showCity").html(cityName);
		//加载轮播
//		queryCarouselList();
//		businessList(1, '', cityName);
		//分类列表
//		list();
		//获取商家推荐列表
//		recommendList(); 
//	}
	$('body').on("touchmove", function(ev) {
		var winHeight = $(window).scrollTop();
		if (winHeight >= 0 && winHeight <= 150) {
			$(".title_div").css("background", "none");
			$(".title_div").css("opacity", 1.0);
		} else if (winHeight > 150) {
			$(".title_div").css("background", "#EEE");
			$(".title_div").css("opacity", 1.0);
			if (api.systemType == 'android') { 
				var cc = $api.dom('.title_div');
				$api.css(cc, 'margin-top:0rem;');
			}
		}
	});
	//下拉刷新
	api.setRefreshHeaderInfo({
		loadingImg : '../../image/mainbus.jpg',
		bgColor : '#ccc',
		textColor : '#fff',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : false
	}, function(ret, err) {
		if(ret){
			location.reload();
			api.refreshHeaderLoadDone();
		}else{
			alert(err);
		}
		
	}); 
	//搜索关键字  待测
	$("#submit").on("submit", function() {
		$('#tab1').html('');
		page = 1;
		getDistance("", cityName);
		return false;
	});
	//获取id
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    //交易总额统计
    total(urId);
	Ytotal(urId);
    //获得商品主页轮播图
	function queryCarouselList() {
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryCarouselList",
			//        form:{
			//           userNo:urId
			//        },
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.carouselList;
					var list = $api.strToJson(account);
					var nowli = "";
					for (var i = 0; i < list.length; i++) {
						nowli += '<div class="swiper-slide"><img src="' + rootUrl + list[i].image_url + '"></img></div>'
					}
					$('#mainShowImg').html(nowli);
					var swiper = new Swiper('.swiper-container', {
					        pagination: '.swiper-pagination',
					        paginationClickable: true,
					        spaceBetween: 3,
					        centeredSlides: true,
					        autoplayDisableOnInteraction: false,
					        autoplay: 2500,
					        loop: true,
							observer:true,//修改swiper自己或子元素时，自动初始化swiper
					   		observeParents:true//修改swiper的父元素时，自动初始化swiper
					    });	
					//跳转到商品列表页
					$('.swiper-container img').click(function() {
						api.openWin({
							name : 'buyList',
							url : 'buyList.html',
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							}
						});
					});
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
	};
	//加载轮播
	queryCarouselList();
	//获得商品信息分类列表
	function list() {
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : false,
			funName : "findCompanyType",
			//        form:{
			//           userNo:urId
			//        },
			success : function(data) {
				console.log("商品详情" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.companyType;
					var list = $api.strToJson(account);
					var nowli = "";
					var nowlis = "";
					for (var i = 0; i < list.length; i++) {
						if (i < 10) {
							nowli = '<span id="' + list[i].uuid + '">' + '<img src="' + rootUrl + list[i].image + '"></img>' + '<div class="leibie">' + list[i].name + '</div>' + '</span>';
							$('#showTypeInfo').append(nowli);
						} else {
							nowlis = '<span id="' + list[i].uuid + '">' + '<img src="' + rootUrl + list[i].image + '"></img>' + '<div class="leibie">' + list[i].name + '</div>' + '</span>';
							$('#showTypeInfo1').append(nowlis);
						}

					}
					//                 $('#showTypeInfo').append(nowli);
				} else {
					//          alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	};
		list();
	//	单击相应的分类获取分类
	$('#showTypeInfo').on('click', 'span', function() {
		var typeId = this.id;
		api.openWin({//详情界面
			name : 'businessType',
			url : 'businessType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : typeId,
				city:cityName
			}
		});
	});

	$('#showTypeInfo1').on('click', 'span', function() {
		var typeId = this.id;
		api.openWin({//详情界面
			name : 'businessType',
			url : 'businessType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : typeId,
				city:cityName
			}
		});
	});


	//金银蛋交易总额
	function total(urId) {
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "allEgg",
			form : {
				userNo : urId
			},
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.recordList;
					var list = $api.strToJson(account);
					//	       		console.log('list为'+list);

					for (var i = 0; i < list.length; i++) {
						if (list[i].rebatetype == '1') {
							$('#totalG').html(list[i].deal_amount);
						} else if (list[i].rebatetype == '2') {
							$('#totalS').html(list[i].deal_amount);
						}
					}

				} else {
					//					alert(data.formDataset.errorMsg);
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

	//金银蛋昨夜交易总额
	function Ytotal() {
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "queryYesterdayEgg",
			form : {
				userNo : urId
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.recordList;
					var list = $api.strToJson(account);

					for (var i = 0; i < list.length; i++) {

						if (list[i].rebatetype == '1') {
							$('#ytotalG').html(list[i].deal_amount);
							//	       					alert(list[i].deal_amount);
						} else if (list[i].rebatetype == '2') {
							$('#ytotaly').html(list[i].deal_amount);
						}
					}
				} else {
					//					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	};
	
	//优选商家列表
	function recommendList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "findBusinessIsrecommendList",
			form : {
				is_recommend : '0',
				is_online : '0',
				recordCount : 6,
				lng : '',
				lat : '',
				typename : ''
			},
			success : function(data) {
				api.hideProgress();
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.companyDataList;
					var list = $api.strToJson(account);
					if (list.length == undefined || list.length == 0 || list == undefined || list == '' || list.length == '') {
						//                 api.toast({
						//                         msg:'暂无商家记录'
						//                     });
						return false;
					} else {
						var nowli = "";
						for (var i = 0; i < list.length; i++) {
//							nowli += '<dl class="recommend-details" id="' + list[i].fid + '" data="' + list[i].industry_name + '"><img src="' + rootUrl + list[i].shopurl + '" alt="" /><dt>' + list[i].companyname + '</dt><dd>' + list[i].industry_name + '</dd></dl>';
							nowli +='<div class="same"  id="' + list[i].fid + '" data="' + list[i].industry_name + '">'
								+'<img src="' + rootUrl + list[i].shopurl + '" alt="" />'
								+'<span>' + list[i].companyname + '</span>'
								+'<span>' + list[i].industry_name + '</span>'
								+'</div>'
						}
						$('#recommend').append(nowli);
					}
				} else {
					//          alert(data.formDataset.errorMsg);
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
	recommendList();
	//优选商家进行跳转
	$('#recommend').on('click', '.same', function() {
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
				id : $(this).attr('id'),
				companytype : $(this).attr('data')
			}
		});
	});
	//获取距离
	function getDistance(typeId, city) {
//		map = api.require('bMap');
//		map.getLocation({
//			accuracy : '10m',
//			autoStop : true,
//			filter : 1
//		}, function(ret, err) {
//			if (ret.status) {
//				lon = ret.lon;
//				lat = ret.lat;
				businessList(1, typeId, city);
//			} else {
//			}
//		});
	}
//	getDistance("", "");
	function getCityName(typeId,city) {
		var map = api.require('bMap');
		map.getLocation({
			accuracy : '10m',
			autoStop : true,
			filter : 1
		}, function(ret, err) {
			if (ret.status) {
				lon = ret.lon;
				lat = ret.lat;
				var point = new BMap.Point(lon, lat);
				var geoc = new BMap.Geocoder();
				geoc.getLocation(point, function(rs) {
					var addComp = rs.addressComponents;
					var address = addComp.city
					$("#showCity").html(address);
					city=address;
				});
				businessList(1, typeId, city);
			} else {
			}
		});

	}
	getCityName("","");

	//附近商家列表
	function businessList(pages, typeId, city) {
		var searchVal=$("#searchVal").val();
		if ( typeof (city) == "undefined" || city == "") {
			city = "北京";
		};
		api.showProgress({});
//		alert(searchVal);
		var startTime = DateUtils.getNowFormatDate();
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "findBusinessList",
			async : false,
			form : {
				p : pages,
				companytype : typeId || '',
				title : searchVal,
				lng : lon,
				lat : lat,
				city : city
			},
			success : function(data) {
				console.log("测试商家列表：" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.companyDataList;
					var list = $api.strToJson(account);

					if (list.length == undefined || list.length == 0 || list == undefined || list == '' || list.length == '') {
						if (pages == 1) {
							api.toast({
								msg : '暂无商家记录'
							});
						} else {
							api.toast({
								msg : '无更多商家记录'
							});
						}
					} else {
						for (var i = 0; i < list.length; i++) {
							var starlen = list[i].star;
							//alert(picLen.length); 评星数
							function starLenght(starlen) {
								var daF = '';
								var kf = '';
								if (starlen == 0 || starlen == '' || starlen == undefined) {
									daF = '评星暂无'
								} else {
									for (var k = 0; k < starlen; k++) {
										daF += '<img src="../image/newimg/stares.png" alt=""/>'
									}
									for (var w = 0; w < 5 - starlen; w++) {
										kf += '<img src="../image/newimg/starelost.png" alt=""/>'
									}
								}
								return daF + kf;
							}
							if (list[i].address == null || list[i].address == '') {
								list[i].address = '无';
							}
							if (list[i].industry_name == null || list[i].industry_name == '') {
								list[i].industry_name = '无';
							}
							var distance = list[i].distance;
							if (0 < distance && distance < 1000) {
								distance = ('距此' + (distance.toFixed(1)) + 'm');
							} else if (1000 <= distance && distance <= 100000) {
								distance = ((distance / 1000).toFixed(1));
								distance = ('距此' + distance + 'km');
							} else if (distance > 100000) {
								distance = ('距此大于100km');
							} else {
								distance = ('距离暂无');
							}
//							var nowli = '<div class="businessman-box" id="' + list[i].fid + '" data="' + list[i].industry_name + '">' + '<div class="businessman-list">' + '<div class="left"><img  class="lazy" src="' + rootUrl + list[i].shopurl + '" alt=""/></div>' + '<dl class="left">' + '<dt>' + list[i].companyname + '</dt>' + '<dd>' + '' + starLenght(starlen) + '' + '<span></span>' + '</dd>' + '<dd>' + list[i].industry_name + '<span class="text-right" >' + distance + '</span></dd>' + '</dl>' + '</div>' + '</div>';						
							var nowli='<div class="bussame" id="' + list[i].fid + '" data="' + list[i].industry_name + '">'
									+'<div class="buscontent">'	
									+'<div class="left">'
									+'<img src="' + rootUrl + list[i].shopurl + '" alt="" />'
									+'</div>'
									+'<div class="rightTop">'+list[i].companyname+'</div>'
									+'<div class="stare">'+starLenght(starlen)+'</div>'
									+'<span>' + list[i].industry_name +'</span>'
									+'<span>'+distance+'</span>'
									+'</div>'
									+'</div>'
							$('#tab1').append(nowli);
						};
					}

					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
					console.log("返回的:pageCount=" + pageCount);
					console.log("返回的page=" + page);
				} else {
					//          alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	};
	//滚动刷新
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			businessList(page,"",cityName);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
	//商家列表进行跳转
	$('#tab1').on('click', '.bussame', function() {
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
				id : $(this).attr('id'),
				companytype : $(this).attr('data')
			}
		});
	});
	
	//获取商家地理位置
	$('#nearby').click(function() {
		if (api.systemType == 'ios') {
			api.accessNative({
				name : 'NativeSelectCity',
				extra : {

				}
			}, function(ret, err) {
				if (ret) {
					$('#tab1').children().remove();
					getDistance("", ret.title);
					cityName = ret.title;
					$('#showCity').html(ret.title);
				} else {
					api.toast({
	                    msg:JSON.stringify(err)
                    });
				}
			});
		} else {
			getCityList();
		}
	});
	function getCityList() {
		var hh = 0;
		var UICityList = api.require('UICityList');
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
					if (ret.eventType == 'selected') {
						cityName=ret.cityInfo.city;
						page=1;
						$('#tab1').children().remove();
						getDistance("", ret.cityInfo.city);
						$('#showCity').html(ret.cityInfo.city);
//						$api.setStorage("cityName",ret.cityInfo.city);
						UICityList.close()
					}
				}
			} else {
				api.toast({
					msg : JSON.stringify(err)
				});
			}
		});
	}
}