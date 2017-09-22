apiready = function() {
//查看详情
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		//var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		//$api.css(cc, 'margin-top:20px;');
	}
	$('.jiaofei_list').on('click','div',function(){
		api.toast({
				msg : "此功能暂未开通！"
			});
	})
}
function goBack() {
	api.closeWin({
	});
}