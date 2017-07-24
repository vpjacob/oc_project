var iframe;
var id;
var nowli = '<div class="swiper-slide"><img src="\"[src]\"" alt="" /></div>';
var lon;
var lat;
var shopname;
apiready = function() {
	id = api.pageParam.id;
//	console.log("url :::: " + api.pageParam.id);
//	$("#detailFrame").css("width", api.winWidth);
//	$("#detailFrame").css("height", api.winHeight);
//	$("#detailFrame").attr("src", api.pageParam.url);
    var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	$('#gohere').click(function() {
		if (lon && lat && shopname) {
			api.openWin({//打开导航界面
				name : 'pathplan',
				url : 'pathplan.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					lon : lon,
					lat : lat,
					shopname : shopname
				}
			});
		} else {
			api.alert({
				msg : '暂时未获得该商家的位置信息'
			});
		}

	});
	api.showProgress();
	AjaxUtil.exeScript({
		script : "managers.provider.providerDetail", //need to do
		needTrascation : false,
		funName : "getprovider",
		form : {
			fid : id
		},
		success : function(data) {
			api.hideProgress();
			console.log('详情***********' + $api.jsonToStr(data));
			if (data.execStatus == "true") {
				var json = data.datasources[0].rows[0];
				lon = json.longtitude;
				lat = json.latitude;
				shopname = json.companyname;
				$('#companyname').html(json.companyname);
				$('#address').html(json.address);
				$('#tel').html(json.tel);
				$('#time').html(json.starttime + "-" + json.endtime);
				$('#mainbusiness').html(json.mainbusiness);
				$('#summary').html(json.summary);
				$('#companytype').html(json.companytype);
				$('#headpic').attr('src', rootUrl+ json.shopurl);
				AjaxUtil.exeScript({
					script : "managers.provider.providerDetail", //need to do
					needTrascation : false,
					funName : "getpic",
					form : {
						fid : id
					},
					success : function(data) {
						api.hideProgress();
						console.log('详情***********' + $api.jsonToStr(data));
						if (data.execStatus == "true") {
							var json = data.datasources[0].rows;
							var length = json.length;
							if (length == 0) {
								$('.businessshow').hide();
								$('.swiper-container').hide();
							} else {
								var result = "";
								for (var i = 0; i < length; i++) {
									result += nowli.replace("\"[src]\"", rootUrl + json[i].pictureurl);
								}
								$('.swiper-wrapper').append(result);
								var swiper = new Swiper('.swiper-container', {
									slidesPerView : 3,
									spaceBetween : 10
								});

							}
						} else {
							api.toast({
								msg : '获取商品信息失败，请重试'
							});
						}
					}
				});
			} else {
				api.toast({
					msg : '获取信息失败，请重试'
				});
			}
		}
	});
	$('.swiper-wrapper').on('click','.swiper-slide', function() {
		$('.zzc').show();
		$('.zzc img').attr('src',$(this).find('img').attr('src'));
	})
	$('.zzc').click(function(){
	    $('.zzc').hide();
	});
};

function goback() {
	api.closeWin({
	});
}