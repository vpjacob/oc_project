var urId = '';
var page = 1;
var pageCount = 1;
apiready = function() {
	//查看详情
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}

	//调用小区公告
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		queryAnnouncementListByUserNo(urId, page);
	});
	//小区公告接口
	function queryAnnouncementListByUserNo(urId, pages) {
		api.showProgress({
		});
		var data = {
			"userNo" : urId,
			"pageNo" : pages,
			"pageSize" : "10"
		};
		$.ajax({
			url : rootUrls + '/xk/queryAnnouncementListByUserNo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				api.hideProgress();
				 console.log($api.jsonToStr(result));
				if (result.state == 1) {
					var data = result.data.list;
					if (data == undefined || data == "" || data.length == 0 || data.length == null || data.length == undefined || data == null) {
						if (pages == 1) {
							api.toast({
								msg : '暂无小区公告'
							});
						} else {
							api.toast({
								msg : '无更多小区公告'
							});
						}

					} else {
						var type = '';
						var grade = '';
						for (var i = 0; i < data.length; i++) {
							//公告类型
							if (data[i].type == 1) {
								type = '通知';
							} else if (data[i].type == 2) {
								type = '公告';
							} else if (data[i].type == 3) {
								type = '活动';
							} else if (data[i].type == 4) {
								type = '其他';
							}
							//公告等级
							if (data[i].instancyGrade == 1) {
								grade = 'background:#fb5259';
							} else if (data[i].instancyGrade == 2) {
								grade = 'background:#029f37';
							}
							var nowList = '<div class="gonggao" id="' + data[i].id + '">' + '<div><span style="' + grade + '">' + type + '</span><span>' + data[i].title + '</span></div>' + '<div><span>' + data[i].strPushtTime + '</span></div>' + '<div id="first"><span>查看详情</span><span class="iconfont icon-xiangyou1"></span></div>' + '<div class="clearfix"></div>' + '</div>'
							$("#gao").append(nowList);
						}
					}
					pageCount = result.data.count > 10 ? Math.ceil(result.data.count / 10) : 1;
				} else {
					api.hideProgress();
					alert(result.msg);
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


	$('#gao').on('click', '.gonggao', function() {
		api.openWin({
			name : 'gonggaoxiangqing',
			url : 'gonggaoxiangqing.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : $(this).attr('id'),
			}
		});
	});
	//分页的刷功能
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			queryAnnouncementListByUserNo(urId, page);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});

}
function goBack() {
	api.closeWin({
	});
}