$.init();
var memberid;
var photo_yes = '<li ><div class="play2"><p onclick="showPic(' + "'\"[name]\"'" + ')">\"[title]\"</p><span id="\"[id]\"" style="display: block;float: right;margin-top: 1.2rem;">123kb</span><i onclick="uploadfile2(' + "'\"[name2]\"'" + ')"; class="icon iconfont icon-yishangchuan"></i></div></li>';
var photo_li = "";
var fs;
var photo_no = '<li ><div class="play2"><p onclick="showPic(' + "'\"[name]\"'" + ')">\"[title]\"</p><span id="\"[id]\"" style="display: block;float: right;margin-top: 1.2rem;">123kb</span><i onclick="uploadfile(' + "'\"[name2]\"'" + ')"; class="icon iconfont icon-shangchuan"></i></div></li>';
var path_file;
apiready = function() {
	path_file = api.getPrefs({//在equipment_index界面设置的
		sync : true,
		key : 'path'
	});
	fs = api.require('fs');
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	showLi();
//	var header = $api.byId('header');
//	if (api.systemType == 'ios') {
//		var cc = $api.dom('.content');
//		$api.css(header, 'margin-top:20px;');
//		$api.css(cc, 'margin-top:20px;');
//	}

	$("#back").bind("click", function() {
		api.alert({
			msg : "请记得切换您的网络连接，继续享受小客为您带来的服务"
		}, function(ret, err) {
			api.closeWin();
		});
	});

	$(document).on("click", ".zzc", function() {
		$('.zzc').hide(500);
	});
	// 添加'refresh'监听器
	$(document).on('refresh', '.pull-to-refresh-content', function(e) {
		showLi();
		$.pullToRefreshDone('.pull-to-refresh-content');

	});
};
function showPic(name) {
	if (name.indexOf("JPG") != '-1') {
		$('.zzc').show(500);
		$(".zzc img").attr("src", path_file + name);
	} else if (name.indexOf("MOV") != '-1') {
		api.openVideo({
			url : path_file + name
		});
	}
}

function showLi() {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.equipment.equipment",
		needTrascation : true,
		funName : "getfiles",
		form : {
			memberid : memberid
		},
		success : function(data) {
			api.hideProgress();
			console.log(JSON.stringify(data));
			//			alert(JSON.stringify(data));
			if (data.execStatus == 'true') {
				var length = data.datasources[0].rows.length;
				var names = "";
				if (length > 0) {//后台有文件
					for (var i = 0; i < length; i++) {
						names += data.datasources[0].rows[i].filename
					}
				}
				fs.readDir({
					path : path_file
				}, function(ret, err) {
//					alert(JSON.stringify(ret) + "-----" + JSON.stringify(err));
					if (ret.status) {
//						alert(JSON.stringify(ret) + "-----");
						console.log("-----****" + JSON.stringify(ret));
						var html = "";
						$("li").remove();
						for (var i = 0; i < ret.data.length; i++) {
							if (ret.data[i].indexOf("JPG") != '-1' || ret.data[i].indexOf("MOV") != '-1') {
								if (names.indexOf(ret.data[i]) != '-1') {//在后台
									photo_li = photo_yes;
								} else {
									photo_li = photo_no;
								}
								var title = ret.data[i];
								var id = title.substring(0, title.length - 4);
								getSize(title, id);
								var newli = photo_li.replace("\"[name]\"", ret.data[i]);
								newli = newli.replace("\"[name2]\"", ret.data[i]);
								newli = newli.replace("\"[title]\"", ret.data[i]);
								newli = newli.replace("\"[id]\"", id);
								html += newli;
							}
						}
						$api.append(document.getElementById("con"), html);
					} else {
						api.alert({
							msg : "请检查您的SD卡或手机储存卡是否安装"
						});
					}
				});

			} else {
				api.alert({
					msg : '获取网络文件列表失败，请检查您的网络连接并下拉重试'
				});
			}
		},
		error : function(xhr, type) {
			api.hideProgress();
			api.alert({
				msg : '获取网络文件列表失败，请检查您的网络连接并下拉重试'
			});
		}
	});
}

function getSize(name, id) {
	fs.getAttribute({
		path : path_file + name
	}, function(ret, err) {
		var num = Number(ret.attribute.size) / (1024 * 1024);
		var idOfI = name.substring(0, name.length - 4);
		idOfI = '#' + idOfI;
		$(idOfI).html(Math.round(num * 100) / 100 + "M");
	});
}

function uploadfile(name) {
	fs.getAttribute({
		path : path_file + name
	}, function(ret, err) {
		if (ret.status) {
			var num = Number(ret.attribute.size) / (1024 * 1024);
			if (Math.round(num * 100) / 100 > 10) {
				api.alert({
					msg : "文件过大，请选择不大于10M的文件"
				});
			} else {
				var headurl = path_file + name;
				api.showProgress({
					style : 'default',
					animationType : 'fade',
					title : '文件上传中...',
					modal : false
				});
				api.ajax({
					url : rootUrl + '/api/equipmentUpload',
					method : 'post',
					data : {
						files : {
							file : headurl
						}
					}
				}, function(ret, err) {
					api.hideProgress();
					if (ret.execStatus == 'true') {
						var path = ret.formDataset.path;
						var filename = ret.formDataset.filename;
						var size = ret.formDataset.size;
						var suffix = ret.formDataset.suffix;
						AjaxUtil.exeScript({
							script : "mobile.center.equipment.equipment",
							needTrascation : true,
							funName : "addfile",
							form : {
								path : path,
								filename : filename,
								size : size,
								suffix : suffix,
								memberid : memberid
							},
							success : function(data) {
								if (data.execStatus == 'true') {
									api.alert({
										msg : '上传成功！'
									}, function(ret, err) {
										showLi();
									});
								} else {
									api.alert({
										msg : '上传失败,请您从新上传'
									});
								}
							}
						});
					} else {
						api.alert({
							msg : '上传图片失败,请您从新上传'
						});
					}
				});
			}
		} else {
			api.alert({
				msg : "获取文件大小失败"
			});
		}
	});

}

function uploadfile2() {
	api.alert({
		msg : "文件已上传至云端"
	});
}
