var id = "";
var page = 1;
var pageCount = 1;
var lon="";
var lat="";
var cityName="";
apiready = function() {
	//展示商家列表
	id = api.pageParam.id;
	cityName = api.pageParam.city;
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.deal');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:22px;');
		$api.css(miancss, 'margin-top:1.5rem;');
	};
	function businessList(pages, typeId){
		if ( typeof (cityName) == "undefined" || cityName == "") {
			cityName = "北京";
		};
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "queryBusinessByType",
			async : false,
			form : {
				p : pages,
				companytype : typeId,
				title : "",
				//           is_online:0,
				lng : lon,
				lat : lat,
				city : cityName
			},
			success : function(data) {
				console.log("商家列表：" + $api.jsonToStr(data));
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
							//							lon = list[i].longtitude;
							//							lat = list[i].latitude;
							var starlen = list[i].star;
							//alert(picLen.length); 评星数
							function starLenght(starlen) {
								var daF = '';
								var kf = '';
								if (starlen == 0 || starlen == '' || starlen == undefined) {
									daF = '评星暂无'
								} else {
									for (var k = 0; k < starlen; k++) {
										daF += '<img src="../image/stares.jpg" alt=""/>'
									}
									for (var w = 0; w < 5 - starlen; w++) {
										kf += '<img src="../image/stares.png" alt=""/>'
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
							var nowli = '<div class="businessman-box" id="' + list[i].fid + '" data="' + list[i].industry_name + '">' + '<div class="businessman-list">' + '<div class="left"><img src="' + rootUrl + list[i].shopurl + '" alt=""/></div>' + '<dl class="left">' + '<dt>' + list[i].companyname + '</dt>' + '<dd>' + '' + starLenght(starlen) + '' + '<span></span>' + '</dd>' + '<dd>' + list[i].industry_name + '<span class="text-right" >' + distance + '</span></dd>' + '</dl>' + '</div>' + '</div>';

							$('#tab1').append(nowli);
							
						}
						//               getDistance()
					}

					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
					console.log("返回的:pageCount=" + pageCount);
					console.log("返回的page=" + page);
				} else {
					//  alert(data.formDataset.errorMsg);
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

	function getDistance(typeId, city) {
		map = api.require('bMap');
		//api.showProgress();
		map.getLocation({
			accuracy : '10m',
			autoStop : true,
			filter : 1
		}, function(ret, err) {
			//api.hideProgress();
			if (ret.status) {
				lon = ret.lon;
				lat = ret.lat;
				businessList(1, id);
			} else {
				//				alert(err.code);
			}
		});

	}
//	获取当前的定位
	getDistance("", "");
	
	//商家列表进行跳转
	$('#tab1').on('click', '.businessman-box', function() {

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

	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			businessList(page, id);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
}	
function goBack() {
		api.closeWin({
		});
	}