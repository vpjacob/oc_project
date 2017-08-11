var template = '<li class="addLi" id="[id]"><a href="#" class="item-link item-content"><div class="item-media"><img src="[imgurl]" style=" width:4rem;">' + '</div><div class="item-inner"><div class="item-title-row"><div class="item-title">[title]</div>' + '</div><div class="item-subtitle">[instance]</div><div class="item-text"><i class="icon iconfont icon-favorfill"></i>' + '<i class="icon iconfont icon-favorfill"></i><i class="icon iconfont icon-favorfill"></i><span>\"[companytype]\"</span></div>' + '</div> </a></li>';
var loading = false;
var companycategory;
var page = 1;
apiready = function() {
    var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	companycategory = api.pageParam.id;
	$('.title').html(api.pageParam.name);
	setLieBiaoList(page, companycategory);
	$(document).on('infinite', function() {
		if (loading)
			return;
		loading = true;
		setLieBiaoList(page, companycategory);

	});
	$.init();
};

//获得首页的列表
function setLieBiaoList(p, companycategory) {
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
			companycategory : companycategory
		},
		success : function(data) {
			api.hideProgress();
			loading = false;
			console.log('列表***********' + $api.jsonToStr(data));
			if (data.execStatus == "true") {
				if (data.datasources[0].rows.length == 0) {
					api.toast({
						msg : '暂无该分类信息'
					});
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();
				} else {
					getNuomiList(data.datasources[0]);
				}
			} else {
				api.toast({
					msg : '获取信息失败，请重试'
				});
			}
		}
	});
}

//获得列表详情 商家主页的详情页
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
	$("ul").append(listStr);
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

function goback() {
	api.closeWin({
	});
}