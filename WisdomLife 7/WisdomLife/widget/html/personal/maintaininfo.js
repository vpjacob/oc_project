$.init();
//保修表的主键
var fid;
apiready = function() {
var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	
api.showProgress({
    style: 'default',
    animationType: 'fade',
    title: '努力加载中...',
    text: '先喝杯茶...'
});
	fid = api.pageParam.fid;
	AjaxUtil.exeScript({
		script : "managers.home.home",
		needTrascation : false,
		funName : "info",
		form : {
			fid : fid
		},
		success : function(data) {
		api.hideProgress();
			if (data.execStatus == 'true') {
				var result = data.datasources[0].rows[0];
				$('#applicant').html(result.nick);
				$('#telphone').html(result.telphone);
				$('#fno').html(result.name+"  "+result.fno+"  "+result.roomno);
				$('#ftype').html(result.ftype);
				$('#descript').html(result.descript);
				if (result.status == 1) {
					$('#status').html('未维修');
				} else if (result.status == 2) {
					$('#status').html('维修中');
				} else if (result.status == 3) {
					$('#status').html('已维修');
				}
				;
			} else {
			api.alert({
				msg : "请求失败"
			}, function(ret, err) {
				//coding...
			});
			}
		}
	});
	$(document).on('touchend', ' .buttons', function() {
		$(this).css({
			"background-color" : "#1fb8f0",
			"color" : "#fff"
		});
	});
	$(document).on('touchstart', '.buttons', function() {
		$(this).css({
			"background-color" : "#fff",
			"color" : "#1fb8f0",
			"border" : "2px solid #0fb8f3"
		});
	});
	$('#back').click(function(){
		api.closeWin();
	});
}; 