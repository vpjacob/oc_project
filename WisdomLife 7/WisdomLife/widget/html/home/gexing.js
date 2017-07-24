var memberid;

apiready = function() {
    var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	memberid = api.pageParam.memberid;
		
	$('#goback').click(function() {
		closePage();

	});
	
	$("#savegexingbtn").click(function() {
		
		var gexing = $('#gexing').val();
		//ProgressUtil.showProgress();
		AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : true,
		funName : "updatememberinfo",
		form : {
			headurl : "",
			nick : "",
			sex : "",
			birthday : "",
			address : "",
			telphone : "",
			pwd : "",
			idCard : "",
			c_user_sign : gexing,
			keyword : "",
			couple : "",
			realname : "",
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
		
	});
}
function closePage() {
	api.closeWin();
}