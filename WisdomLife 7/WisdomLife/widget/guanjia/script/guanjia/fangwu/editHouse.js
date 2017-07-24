var urId = '';
apiready = function() {
	//	兼容ios
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	var roomId = api.pageParam.id;
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
	});
	queryRoomInfoByroomId();
	
	$("#save").click(function() {
		if ($("#acreage").val() == '') {
			alert("请输入您的房屋面积");
		} else {
			api.confirm({
				title : '提示',
				msg : '请您慎重更改',
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					changeHouseType();
				}
			});
		}
	})

	//回显房屋信息
	function queryRoomInfoByroomId() {
		var data = {
			"roomId" : roomId
		};
		$.ajax({
			url : rootUrls + '/xk/queryRoomInfoByroomId.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					$('#acreage').val(data.acreage);
					$('#type').val(data.type);
					$("#orientation option").each(function() {
						if ($(this).html() == data.orientation) {
							$(this).attr("selected", "true");
						}
					});
					$("#decorate option").each(function() {
						if ($(this).html() == data.decorate) {
							$(this).attr("selected", "true");
						}
					});
					$("#type option").each(function() {
						if($(this).val() == data.type) {
							$(this).attr("selected", "true");
						}
					});
				} else {
					alert(data.msg);
				}
			}
		});
	}

	//编辑物业房屋
	function changeHouseType() {
		var data = {
			"userNo" : urId,
			"roomId" : roomId,
			"type" : $("#type option:selected").val(),
			"acreage" : $("#acreage").val(),
			"orientation" : $("#orientation option:selected").html(),
			"decorate" : $("#decorate option:selected").html()
		};
		$.ajax({
			url : rootUrls + '/xk/changeHouseType.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					alert(result.msg);
					api.execScript({
						name : 'myhouse',
						script : 'refresh();'
					});
					api.closeWin({
					});
				} else {
					alert(result.msg);
				}
			}
		});
	}

}
function goBack() {
	api.closeWin({
	});
}