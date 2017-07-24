var memberid;
var name;
apiready = function() {
    var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	memberid = api.pageParam.memberid;
	name = api.pageParam.name;
	$('#vaildCode').val(name);
	$("#regist").click(function() {
		var text = $('#vaildCode').val();
		var input = /^[\s]*$/;
		if (input.test(text)) {
			api.alert({
				msg : "新用户名不能为空"
			}, function(ret, err) {
				//coding...
			});
		} else {
			api.showProgress({
				style : 'default',
				animationType : 'fade',
				title : '努力加载中...',
				text : '先喝杯茶...'
			});
			AjaxUtil.exeScript({
				script : "managers.home.person",
				needTrascation : false,
				funName : "updatememberinfo",
				form : {
					headurl : "",
					nick : text,
					sex : "",
					birthday : "",
					address : "",
					telphone : "",
					pwd : "",
					memberid : memberid
				},
				success : function(data) {
					api.hideProgress();
					if (data.execStatus == 'true') {
						api.execScript({//刷新person界面数据
							name : 'room',
							script : 'refresh();'
						});
						api.execScript({//刷新person界面数据
							name : 'content',
							script : 'refresh();'
						});
						closePage();
					}
				}
			});
		}
	});
	$('#goback').click(function() {
		closePage();

	});
}
function closePage() {
	api.closeWin();
}