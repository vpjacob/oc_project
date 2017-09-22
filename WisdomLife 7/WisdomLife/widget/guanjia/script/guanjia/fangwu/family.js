var id = '';
var communityId = '';
var buildingId = '';
var unitId = '';
var roomId = '';
var ownerInfo = '';
var test = '';
var urId;
//地址信息
apiready = function() {
	//	兼容ios
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	};
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });

	//获取相关房屋穿过来的房间id
	id = api.pageParam.id;
	//根据业主id查找房屋及业主所有信息
	function queryhouseOwnerInfoById() {
		var data = {
			id : id
		};
		$.ajax({
			url : rootUrls + '/xk/queryhouseOwnerInfoById.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				var headAddress = '';
				if (result.state == 1) {
					if (data.headImg == '' || data.headImg == null || data.headImg == undefined) {
						headAddress == "../../../image/familyLogo.png"
					} else {
						headAddress = rootUrl + data.headImg;
					}
					test = data.communityName + "&nbsp" + data.buildingName + data.unitName + "&nbsp" + data.roomName;
					communityId = data.communityId;
					buildingId = data.buildingId;
					unitId = data.unitId;
					roomId = data.roomId;
					//二维码生成的信息
					ownerInfo = {
						data : {
							"building" : data.buildingName,
							"city" : data.city,
							"community" : data.communityName,
							"district" : data.district,
							"province" : data.province,
							"room" : data.roomName,
							"unit" : data.unitName,
							"userName" : data.ownerName,
							"userPhone" : data.ownerPhone,
							"communityId" : data.communityId,
							"buildingId" : data.buildingId,
							"unitId" : data.unitId,
							"roomId" : data.roomId
						}
					};

					$('#headImage').attr("src", headAddress);
					$('#userName').html(data.ownerName);
					$('#address').html(test);
					//调用家庭成员
					queryMemberByParentNo();
				} else {
					alert(result.msg);
				}
			}
		});
	};
	queryhouseOwnerInfoById();

	//18，查询当前小区楼栋房间的家庭成员
	function queryMemberByParentNo() {
		var data = {
			userNo : urId,
			communityId : communityId,
			buildingId : buildingId,
			unitId : unitId,
			roomId : roomId,
		};
		$.ajax({
			url : rootUrls + '/xk/queryMemberByParentNo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				var headImg = '';
				if (result.state == 1) {
					if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
						api.toast({
							msg : '暂无成员信息'
						});
						return false;
					} else {
						for (var i = 0; i < data.length; i++) {
							if (data[i].headImg == '' || data[i].headImg == null) {
								headImg = '../../../image/familyLogo.png'
							} else {
								headImg = rootUrl + data[i].headImg;
							}
							var list = '<div class="otherSame">' + '<div class="topLeft">' + '<div class="topImg">' + '<img src="' + headImg + '"/>' + '</div>' + '</div>' + '<span>' + data[i].userName + '</span>' + '<span style="background-color:#FF8704;">' + data[i].relation + '</span>' + '<span>' + data[i].userPhone + '</span>' + '<img src="../../../image/del.png"  class="imgDel" id="' + data[i].id + '"/> ' + '</div>'
							$('#showList').append(list);
						}

						//删除相应的家庭成员
						$('.otherSame').on('click', '.imgDel', function() {
							var delInfoId = $(this).attr('id');
							api.confirm({
								title : '提示',
								msg : '您要删除吗？',
								buttons : ['确定', '取消']
							}, function(ret, err) {
								var index = ret.buttonIndex;
								if (index == 1) {
									$(this).parent().remove();
									deleteMemebrInfo(delInfoId);
								}
							});

						});

					}
				} else {
					alert(result.msg);
				}
			}
		});
	};

	//	22.根据id删除家庭成员信息
	function deleteMemebrInfo(numberId) {
		var data = {
			id : numberId
		};
		$.ajax({
			url : rootUrls + '/xk/deleteMemebrInfo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					alert(result.msg);
					location.reload();
				} else {
					alert(result.msg);
				}
			}
		});
	};

	$('#addPersonal').click(function() {
		api.openWin({
			name : 'addFamily',
			url : 'addFamily.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				communityId : communityId,
				buildingId : buildingId,
				unitId : unitId,
				roomId : roomId
			}
		});
	});

	//二维码模块
	//	$('#ewm').click(function() {
	//		$('.tankuang_box').show();
	//		$('.black_box').show();
	//		var strings=$api.jsonToStr(ownerInfo);
	//		var FNScanner = api.require('FNScanner');
	//		FNScanner.encodeImg({
	//			content : strings,
	//			saveToAlbum : true,
	//			saveImg : {
	//				path : 'fs://myRoom.png',
	//				w : 200,
	//				h : 200
	//			}
	//		}, function(ret, err) {
	//			if (ret.status) {
	//				$("#qr_img").attr("src", ret.imgPath);
	//				console.log(JSON.stringify(ret));
	//			} else {
	//				console.log(JSON.stringify(err));
	//			}
	//		});
	//
	//	});

	$('#ewm').click(function() {
		$('.tankuang_box').show();
		$('.black_box').show();
		//请求二维码模块
		var scanner = api.require('scanner');
		var strings = $api.jsonToStr(ownerInfo);
		scanner.encode({
			string : strings,
			save : {
				imgPath : 'fs://',
				imgName : 'myRoom.png'
			}
		}, function(ret, err) {
			if (ret.status) {
				$("#qr_img").attr("src", ret.savePath);
				console.log(JSON.stringify(ret));
			} else {
				console.log(JSON.stringify(err));
			}
		});
	});

	$('.black_box').click(function() {
		$('.tankuang_box').css('display', 'none');
		$('.black_box').css('display', 'none');
	});

}
function goBack() {
	api.closeWin({
	});
}