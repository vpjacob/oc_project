var familyInfo = '';
apiready = function() {
    var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.toproof');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	var roomid = api.pageParam.roomid;
	familyInfo = "<div class='familyform'><ul><li><div class='approve3'><img src='\"[headurl]\"'/>" + "</div><h5>\"[name]\"</h5><div class='approve4'><img src='../../image/temp/yirenzheng_03.png'/></div></li></ul></div>";
	//获得个人信息
	ProgressUtil.showProgress();
	//获得个人信息
	AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : false,
		funName : "getallperson",
		form : {
			roomid : roomid,
			memberid : api.pageParam.memberid
		},
		success : function(data) {
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				var roomPlaceInfo = data.datasources[0].rows[0];
				//获取当前房间的位置信息
				place = roomPlaceInfo.city + roomPlaceInfo.area + roomPlaceInfo.name + roomPlaceInfo.fno + roomPlaceInfo.roomno;
				var result = data.datasources[0].rows[0];
				var name = result.nick == null ? result.memtelphone : result.nick;
				$('#myName').html(name);
//				var address = result.address == null ? '北京市' : result.address;
				$('#address').html(place);
				var headurl = result.headurl == null ? '../../image/temp/touxiang.png' : result.headurl;
				var headurl = result.headurl == null ? '../../image/morenpic.png' : rootUrl +result.headurl;
				$('#touxiang').attr('src',headurl);
			} else {
				api.alert({
				msg : '网络连接失败'
			}, function(ret, err) {
				//coding...
			});
				api.closeWin();
			}
		}
	});

	AjaxUtil.exeScript({//获得家庭成员列表
		script : "managers.home.home",
		needTrascation : false,
		funName : "getMemberByRoomId",
		form : {
			roomid : roomid
		},
		success : function(data) {
			api.hideProgress();
			var rows = data.datasources[0].rows;
			var headurl;
			var nick;
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].headurl == null) {
					headurl = '../../image/morenpic_03.png';
				} else {
					headurl = rootUrl +rows[i].headurl;
				}
				if (rows[i].nick == null) {
					nick = '暂无名称';
				} else {
					nick = rows[i].nick;
				}
				familyInfo = familyInfo.replace("\"[name]\"", nick);
				familyInfo = familyInfo.replace("\"[headurl]\"", headurl);

			}
			$('.family').append(familyInfo);
		}
	});
	$('#back').click(function(){
		api.closeWin();
	});

}