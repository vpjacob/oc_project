var memberid;
var name;
var urId="";
apiready = function() {
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
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
		var realname = $('#vaildCode').val();
		var input = /^[\s]*$/;
		if (input.test(realname)) {
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
			script : "synchrodata.memeber.memeber",
			needTrascation : true,
			funName : "getUserNo",
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					if (data.formDataset.userNo != '' && data.formDataset.userNo != null && data.formDataset.userNo != "undefinded") {
						userNoNew = data.formDataset.userNo;
						var params = {};
						params.userNo = urId;
						params.name = encodeURI(realname);
						$.ajax({
							url : shopPath + "/member/register/modifyMemberName",
							type : "GET",
							data : params,
							cache : false,
							dataType : 'jsonp',
							scriptCharset : 'utf-8',
							jsonp : 'callback',
							jsonpCallback : "successCallback",
							
							crossDomain : true,
							success : function(data) {
							
								AjaxUtil.exeScript({			
									script : "managers.home.person",
									needTrascation : false,
									funName : "updateRealName",
									form : {
										realName : realname,
										memberid : memberid
									},
									success : function(data) {
										console.log('data.execStatus'+data.execStatus)
										if (data.execStatus == 'true') {
											api.execScript({//刷新person界面数据
												name : 'room',
												script : 'refresh();'
											});
											api.execScript({//刷新person界面数据
												name : 'content',
												script : 'refresh();'
											});
										api.closeWin();
										
										}
									}
								});
								
							}
						});
					}
				}
			}
		}); 
			
			
			
		}
	});
	$('#fanhui').click(function() {
		api.closeWin();

	});
}
