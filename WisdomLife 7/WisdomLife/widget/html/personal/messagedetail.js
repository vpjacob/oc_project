var relateid;
var msgnum;
apiready = function() {
	//同步返回结果：
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    getDetail(urId);
	if (msgnum == 0) {
	} else {
		msgnum = Number(msgnum) - 1;
		api.setPrefs({
			key : 'msgnum',
			value : msgnum
		});
		if (msgnum == 0) {
			api.execScript({
				name : 'root',
				frameName : 'weather',
				script : 'hidepot();'
			});
			api.execScript({
				name : 'room',
				script : 'hidepot();'
			});
		} else {
			api.execScript({
				name : 'root',
				frameName : 'weather',
				script : 'setmsgnum();'
			});
			api.execScript({
				name : 'room',
				script : 'setmsgnum();'
			});
		}
	}
	relateid = api.pageParam.relateid;
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	//Android返回键的监听
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		goback();
	});
	//getDetail();
}
function goback() {
	api.closeWin();
}

function getDetail(urId) {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.message.message",
		needTrascation : false,
		funName : "messageinfo",
		form : {
			relateid : relateid,
			userNo:urId
		},
		success : function(data) {
			ProgressUtil.hideProgress();
			console.log($api.jsonToStr(data));
			var newsResult = "";
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				var title = data.datasources[0].rows[0].title;
				var issuetime = data.datasources[0].rows[0].sendtime;
				var content = data.datasources[0].rows[0].message;
				$('#content').html(content);
				$('#issuetime').html(issuetime);
				$('#title').html(title);
			} else {
				api.alert({
					msg : '没有查到您的信息或者您的网络出问题了!'
				}, function(ret, err) {
					//coding...
				});
			}
		}
	});
}