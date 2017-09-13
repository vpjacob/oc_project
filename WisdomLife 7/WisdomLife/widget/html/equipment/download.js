$.init();
var result_yes = '<li onclick="download(' + "'\"[name]\"'" + ')"><div class="downloadlist1"><img src="\"[src]\""/></div>' + '<div class="downloadlist_right"><p>\"[title]\"</p><h6>\"[time]\"<span  style="float: right;margin-right:0.5rem;">\"[size]\"</span></h6>';
//已下载和未下载
var result_no = '<li onclick="download(' + "'\"[name]\"'" + ')"><div class="downloadlist1"><img src="\"[src]\""/></div>' + '<div class="downloadlist_right"><p>\"[title]\"</p><h6>\"[time]\"<span  style="float: right;margin-right:0.5rem;">\"[size]\"</span></h6>' + '<i id="\"[id]\"" class="icon iconfont icon-xiazai" style="font-size:20px;position:absolute;float:right;right:0.5rem;top:0.2rem;"></i></div></li>';
var html = "";
var result;
var state = 1;
//判断是否有文件下载或有未下载完成文件的状态标记 0=下载未完成 1=默认或下载完成
var ssid;
//记录分页总数
var totalPage;
//当前显示的页数
var newPage;
var newJSON = [];
var names = "";
var path_file;
apiready = function() {
	path_file = api.getPrefs({//在equipment_index界面设置的
		sync : true,
		key : 'path'
	});
    

    
	var header = $api.byId('header');
	ssid = api.pageParam.ssid;
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	// 注册'infinite'事件处理函数
	$(document).on('infinite', '.infinite-scroll-bottom', function() {
		var html = "";
		var i = newJSON.length - 1 - (15 * (totalPage - newPage));
		var j = newJSON.length - 1 - (15 * (totalPage - newPage + 1));
		if (j < 0) {
			j = 0;
			// 加载完毕，则注销无限加载事件，以防不必要的加载
			$.detachInfiniteScroll($('.infinite-scroll'));
			// 删除加载提示符
			$('.infinite-scroll-preloader').remove();
		}
		console.log("i" + i);
		console.log("j" + j);
		for (i; i >= j; i--) {//倒叙
			console.log(1);
			var src = "http://192.168.1.254/CARDV/MOVIE/" + newJSON[i].File.NAME + "?custom=1&cmd=4001";
			console.log(2);
			var title = newJSON[i].File.NAME;
			console.log(3);
			var time = newJSON[i].File.TIME;
			console.log(4);
			if (names.indexOf(newJSON[i].File.NAME) >= 0) {
				console.log(5);
				result = result_yes;
			} else {
				result = result_no;
			}
			console.log(6);
			var nowli = result.replace("\"[src]\"", src);
			nowli = nowli.replace("\"[title]\"", title);
			nowli = nowli.replace("\"[time]\"", time);
			nowli = nowli.replace("\"[name]\"", title);
			nowli = nowli.replace("\"[id]\"", title.substring(0, title.length - 4));
			nowli = nowli.replace("\"[size]\"", Math.round((Number(newJSON[i].File.SIZE) / (1024 * 1024)) * 100) / 100 + "M");
			html += nowli;
			console.log(7);
			console.log(html);

		}
		newPage = totalPage - 1;
		console.log(8);
		$api.append(document.getElementById("con"), html);
		console.log(9);
	});

	$("#back").bind("click", function() {
		if (state == 0) {
			api.confirm({
				msg : '您有文件未下载完成，确认退出吗?',
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					api.closeWin();
				}
			});
		} else {
			api.closeWin();
		}
	});

	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		if (state == 0) {
			api.confirm({
				msg : '您有文件未下载完成，确认退出吗?',
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					api.closeWin();
				}
			});
		} else {
			api.closeWin();
		}
	});
	var moduleTest = api.require('movies');
	var systemType = api.systemType;
	if (systemType != "ios") {//只限Android系统
		moduleTest.get(function(ret) {
			if (ret.ssid != ssid) {
				api.alert({
					msg : "请连接设备指定WiFi"
				}, function(ret, err) {
					api.closeWin({
					});
				});
			} else {
				getList();
			}
		});
	} else {
		var retWifiName = moduleTest.get();
		if (retWifiName != ssid) {
			api.alert({
				msg : "请连接设备指定WiFi"
			}, function(ret, err) {
				api.closeWin({
				});
			});
		} else {
			getList();
		}
	}
};
function getList() {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var trans = api.require('trans');
			trans.parse({
				data : xmlhttp.responseText
			}, function(ret, err) {
				if (JSON.stringify(ret).indexOf("Function") > 0) {//返回值有错误码
					api.alert({
						msg : "设备正在录制不支持查看文件，请停止录制并重试！"
					}, function(ret, err) {
						api.closeWin({
						});
					});
				} else if (JSON.stringify(ret).indexOf("[") < 0 && JSON.stringify(ret).indexOf("ALLFile") < 0) {//没有
					api.alert({
						msg : "您暂时还没有录制文件"
					}, function(ret, err) {
						api.closeWin({
						});
					});
				} else if (JSON.stringify(ret).indexOf("[") < 0) {//只有一条
					var info = ret;
					console.log($api.jsonToStr(ret));
					//							alert($api.jsonToStr(ret));
					var html = "";
					var fs = api.require('fs');
					fs.readDir({
						path : path_file
					}, function(ret, err) {
						if (ret.status) {
							for (var i = 0; i < ret.data.length; i++) {
								if (ret.data[i].indexOf("MOV") != '-1') {
									names += ret.data[i] + ",";
								}
							}
							if (info.LIST.ALLFile.File.NAME.indexOf("MOV") != '-1') {//判断是否为视频
								var src = "http://192.168.1.254/CARDV/MOVIE/" + info.LIST.ALLFile.File.NAME + "?custom=1&cmd=4001";
								var title = info.LIST.ALLFile.File.NAME;
								var time = info.LIST.ALLFile.File.TIME;
								if (names.indexOf(info.LIST.ALLFile.File.NAME) >= 0) {
									result = result_yes;
								} else {
									result = result_no;
								}
								var nowli = result.replace("\"[src]\"", src);
								nowli = nowli.replace("\"[title]\"", title);
								nowli = nowli.replace("\"[time]\"", time);
								nowli = nowli.replace("\"[name]\"", title);
								nowli = nowli.replace("\"[id]\"", title.substring(0, title.length - 4));
								nowli = nowli.replace("\"[size]\"", Math.round((Number(newJSON[i].File.SIZE) / (1024 * 1024)) * 100) / 100 + "M");
								html += nowli;
								$api.append(document.getElementById("con"), html);
							} else {
								api.alert({
									msg : "设备暂时没有视频文件存在"
								}, function(ret, err) {
									api.closeWin();
								});
							}
						}
					});
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();
				} else {//有多个
					if (ret) {//本地文件数量的判断
						console.log(JSON.stringify(ret));
						var info = ret;
						var fs = api.require('fs');
						fs.readDir({
							path : path_file
						}, function(ret, err) {
							if (ret.status) {
								var html = "";
								for (var i = 0; i < ret.data.length; i++) {
									if (ret.data[i].indexOf("MOV") != '-1') {
										names += ret.data[i] + ",";
									}
								}
								///////////////////////////////////////////////////////////////
								for (var i = 0; i < info.LIST.ALLFile.length; i++) {
									if (info.LIST.ALLFile[i].File.NAME.indexOf("MOV") != '-1') {//判断是否为视频
										newJSON.push(info.LIST.ALLFile[i]);
									}
								}
								var j = 0;
								if (newJSON.length < 15) {
									//											alert(newJSON.length);
									// 加载完毕，则注销无限加载事件，以防不必要的加载
									$.detachInfiniteScroll($('.infinite-scroll'));
									// 删除加载提示符
									$('.infinite-scroll-preloader').remove();
								} else {
									totalPage = Math.ceil(newJSON.length / 15);
									j = newJSON.length - 15;
									if (j < 0) {
										j = 0;
									}
								}
								for (var i = newJSON.length - 1; i >= j; i--) {//倒叙
									var src = "http://192.168.1.254/CARDV/MOVIE/" + newJSON[i].File.NAME + "?custom=1&cmd=4001";
									var title = newJSON[i].File.NAME;
									var time = newJSON[i].File.TIME;
									if (names.indexOf(newJSON[i].File.NAME) >= 0) {
										result = result_yes;
									} else {
										result = result_no;
									}
									var nowli = result.replace("\"[src]\"", src);
									nowli = nowli.replace("\"[title]\"", title);
									nowli = nowli.replace("\"[time]\"", time);
									nowli = nowli.replace("\"[name]\"", title);
									nowli = nowli.replace("\"[id]\"", title.substring(0, title.length - 4));
									nowli = nowli.replace("\"[size]\"", Math.round((Number(newJSON[i].File.SIZE) / (1024 * 1024)) * 100) / 100 + "M");
									html += nowli;
									console.log(html);

								}
								newPage = totalPage - 1;
								$api.append(document.getElementById("con"), html);
								console.log(html);
								console.log(JSON.stringify(newJSON));

							} else {
								api.alert({
									msg : "请检查您的SD卡或手机储存卡是否安装"
								}, function(ret, err) {
									api.closeWin();
								});
							}
						});
					}
				}
			});
		}
	}
	xmlhttp.open("GET", "http://192.168.1.254/?custom=1&cmd=3015", true);
	xmlhttp.send();
}

function download(name) {
	var idOfI = name.substring(0, name.length - 4);
	idOfI = '#' + idOfI;
	////$(aaa).remove();
	//$(aaa2).remove();
	var url = "http://192.168.1.254/CARDV/MOVIE/" + name;
    
    var fs = api.require('fs');
    fs.exist({
             path:path_file+name
             }, function(ret, err) {
             if (ret.exist) {
             if (ret.directory) {
             alert('是文件夹');
             } else {
             
             api.accessNative({
                              name : 'palyCarViedo',
                              extra : {
                              path:path_file+name,
                              name:name
                              }
                              }, function(ret, err) {
                              if (ret) {
                              //                                    alert(JSON.stringify(ret));
                              } else {
                              //                                    alert(JSON.stringify(err));
                              }
                              });
             $(idOfI).remove();
             
             
             }
             } else {
             
             
             api.showProgress({
                              style : 'default',
                              animationType : 'fade',
                              title : '下载中...',
                              text : '正在努力下载，请稍后...',
                              modal : false
                              });
             
             api.download({
                          url : url,
                          savePath : path_file + name,
                          report : true,
                          cache : true,
                          allowResume : true
                           }, function(ret, err) {
                          console.log(JSON.stringify(ret));
                          if (ret.state == 1) {
                          state = 1;
                          api.accessNative({
                                           name : 'palyCarViedo',
                                           extra : {
                                           path:path_file+name,
                                           name:name
                                           }
                                           }, function(ret, err) {
                                           if (ret) {
                                           //                                    alert(JSON.stringify(ret));
                                           } else {
                                           //                                    alert(JSON.stringify(err));
                                           }
                                           });
                          
                          
                          
                          $(idOfI).remove();
                          api.hideProgress();
                          } else {
                          state = 0;
                          }
                          });
             
             }
             });
    

}
