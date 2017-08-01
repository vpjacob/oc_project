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
	
	$('#goback').click(function() {
		closePage();

	});
	
	
	$("#saveIdCardBtn").click(function() {
		
		var idCard = $('#idCard').val();
		var regId=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
		if (idCard=="") {
				api.alert({
					msg : "亲,输入您的身份证号！"
				}, function(ret, err) {
		
				});
				return false;
		}else if(!regId.test(idCard)){
			api.alert({
					msg : "亲,您的身份证格式不对！"
				}, function(ret, err) {
		
				});
				return false;	
		}
	
		//ProgressUtil.showProgress();
		AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : false,
		funName : "updatememberinfo",
		form : {
			headurl : "",
			nick : "",
			sex : "",
			birthday : "",
			address : "",
			telphone : "",
			pwd : "",
			c_user_sign : "",
			idCard : idCard,
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
