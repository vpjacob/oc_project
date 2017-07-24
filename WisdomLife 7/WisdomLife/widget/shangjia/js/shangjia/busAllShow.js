var urId = '';
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	var roomId = api.pageParam.id;
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;

	});

};
//软键盘搜索
$('#search').keydown(function(e) {
	//alert(e.keyCode);
//	var len = $('.same').length;
//	var arr = [];
//	var reg = new RegExp($("#search").val());
//	for (var i = 0; i < len; i++) {
//		//如果字符串中不包含目标字符会返回-1
//		if (list[i].match(reg)) {
//			arr.push(list[i]);
//		}
//	}
//	return arr;
//	alert(arr);
	if (e.keyCode == 13) {
		var same=$('.same');
		for(var i=0;i<same.length;i++){
			if($("#search").val()=="中"){
				$(this).show();
			}else{
				$(this).addClass('.special');
			}
		}
	}
});

function goBack() {
	api.closeWin({
	});
}
}
});
