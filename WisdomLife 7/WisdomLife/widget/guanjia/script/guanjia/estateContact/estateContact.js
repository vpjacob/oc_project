var urId = '';
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		queryUserAllEstateList(urId);
	});

	//28.查询当前用户所属的所有物业
	function queryUserAllEstateList(urId) {
		var data = {
			"userNo" : urId,
		};
		$.ajax({
			url : rootUrls + '/xk/queryUserAllEstateList.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
						api.toast({
							msg : '暂无相关信息'
						});
						return false;
					} else {
						var nowli = '';
						for (var i = 0; i < data.length; i++) {
							
							if (data[i].address == '' || data[i].address == undefined || data[i].address == null) {
								data[i].address = '具体地址暂无'
							}
							nowli += '<div class="same">'
									+'<div class="sameBox">'
									+'<div class="top">'
									+'<span>'+data[i].estateName +'</span>'
									+'<img src="../../../image/callWy.png" alt="" class="callTels" />'
									+'<span class="callTels callTel">'+data[i].contactNumber+'</span>'
									+'</div>'
									+'<div class="bottom">'
									+'<span>'+data[i].province+data[i].city+data[i].district+data[i].address+'</span>'
									+'</div>'
									+'</div>'
									+'</div>'
						}
						$('#showList').html(nowli);
						//获取物业电话
						$('.same').on('click', '.callTels', function() {
							api.call({
								type : 'tel_prompt',
								number : $('.callTel').html()
							});
						});
					}
				} else {
//					alert(result.msg);
				}
			}
		});
	};
//	//获取物业电话
//	$('.same').on('click', '.callTels', function() {
//		api.call({
//			type : 'tel_prompt',
//			number : $('.callTel').html()
//		});
//	});
}
function goBack() {
	api.closeWin({
	});
}
