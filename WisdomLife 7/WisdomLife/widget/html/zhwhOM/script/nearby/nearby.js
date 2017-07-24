$$('#power .item-inner').on('click', function() {
	$$('.item-inner').children('div .item-text').addClass('item-subtitle-hidden');
	$$(this).children('div .item-text').removeClass('item-subtitle-hidden');
});

myApp.onPageInit('screening', function(page) {
	//自定义查询
	$$("#zidingyi").on('click', function() {
		var gender = $$('#gender').children('div .btnbg-selected').children('input').val();
		var time = $$('#zdytime').children('div .btnbg-selected').children('input').val();
		var age = $$('#age').children('input').val();
		var con = $$('#con').children('input').val();
		var ages = age.split('-');
		var ageMin = 0;
		var ageMax = 0;
		if ('不限' != age && ages.length == 1 && '' != age) {
			ageMin = 36;
		}
		if ('不限' != age && ages.length == 2) {
			ageMin = ages[0];
			ageMax = ages[1];
		}
		console.log("time"+time);
		console.log("gender"+gender);
		console.log("ageMin"+ageMin);
		console.log("ageMax"+ageMax);
		console.log("con"+con);
		getNearbyPersonnelList('1', time, gender, ageMin, ageMax, con);
		
	});
	$$('#picker-deviceAge').on('click', function(e) {
		var buttons1 = [{
			text : '年龄' ,
			label : true
		}, {
			text : '<span style="color:#0EAAE3">18-22</span>',
			onClick : function() {
				$$("#picker-deviceAge").val("18-22");

			}
		}, {
			text : '<span style="color:#0EAAE3">23-26</span>',
			onClick : function() {
				$$("#picker-deviceAge").val("23-26");

			}
		}, {
			text : '<span style="color:#0EAAE3">27-35</i></span>',
			onClick : function() {
				$$("#picker-deviceAge").val("27-35");
			}
		}, {
			text : '<span style="color:#0EAAE3">35以上</span>',
			onClick : function() {
				$$("#picker-deviceAge").val("35以上");
			}
		}, {
			text : '<span style="color:#0EAAE3">不限</span>',
			onClick : function() {
				$$("#picker-deviceAge").val("不限");

			}
		}];
		var groups = [buttons1];
		myApp.actions(groups);
	});

	var pickerDevice = myApp.picker({
		input : '#picker-deviceCons',
		textAlign : 'center',
		rotateEffect : true,
		toolbar : true,
		backgroudcolor : '#FFFFFF',
		toolbarTemplate : '<div class="toolbar" >' + '<div class="toolbar-inner">' + '<div class="left">' + '</div>' + '<div class="right">' + '<a href="#" class="link close-picker" style="color:#000000">确定</a>' + '</div>' + '</div>' + '</div>',
		onClose : function(p) {
		},
		cols : [{
			values : ['不限', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
		}]
	});
	$$('.col-33').on('click', function() {
		$$('.col-33').removeClass('btnbg-selected').addClass('btnbg');
		$$(this).addClass('btnbg-selected');
	});
	$$('.col-25').on('click', function() {
		$$('.col-25').removeClass('btnbg-selected').addClass('btnbg');
		$$(this).addClass('btnbg-selected');
	});
});
myApp.onPageBack('nearbyDynamicInfo', function() {
	onclickTab($$("#dynamic"),'tabspan2')
	$$('#tab-people').removeClass('active');
	$$('#tab-dynamic').addClass('active');
	Auto517.UIChatbox._inputBar_closeBoard();
	window.Auto517.UIChatbox._inputBar_close();
	
	
});
myApp.onPageBack('nearby_news_report', function() {

	window.Auto517.UIChatbox._inputBar_show_hide("show");
});



//评论页
myApp.onPageInit('nearbyDynamicInfo', function(page) {
	var type=1;
	var dynamicId = page.query.dynamicId;
	var dyUserId = page.query.dyUserId;
	var flag = page.query.flag;
	$$("#dyInBack").val(flag);
	Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
				_im_emotionData = emotion;
	});
	$$("#DynamicInfo-back").on('click',function(){
//		getNearbyDynamicList(0,20,1);
		if(flag==1){
			mainView.router.back({
				url:'html/nearby/nearbyMain.html',
				force:true
			});	
		}else{
			mainView.router.back();	
		}
		
		
	})
	var _data = {
		script : "managers.om.nearby.nearby",
		needTrascation : true,
		funName : "getNearbyDynamicInfo",
		form : "{cur_page: 1,page_num:2,uid:'" + uid + "',dynamicId:'" + dynamicId + "',dyUserId:'" + dyUserId + "'}"
	};
	
	console.log(uid+"$$"+dynamicId+"$$"+dyUserId);

	$$.ajax({
		url : rootUrl + "/api/execscript",
		method : 'post',
		dataType : 'json',
		data : _data,
		success : function(data) {			
			var data_list = data.datasources[0].rows;
			var data_commentList = data.datasources[1].rows;
			var card = $$('#dynamicInfo');
			var essence =''//精华动态的页面代码片段
			if (data_list.length > 0) {
				var template = '';
				var id = data_list[0].id;
				var userName = data_list[0].username;
				var age = data_list[0].age;
				var gender = data_list[0].gender;
				var genderEn = 'male';
				var userImage = data_list[0].userimage;
				var userLevel = data_list[0].userlevel;
				var content = window.Auto517.UIChatbox._im_transText(data_list[0].content);
				var creatTime = data_list[0].creattime;
				var readNum = data_list[0].readnum;
				var praise = data_list[0].praise;
				var dynamicImage = data_list[0].dynamicimage;
				var isPraise = data_list[0].ispraise;
				var distince = data_list[0].distance;
				var c_dynamic_essence = data_list[0].c_dynamic_essence;
				if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
					creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
				} else if (parseInt(creatTime) / 60 >= 24) {
					creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
				} else {
					creatTime = creatTime + '分钟前';
				}
				if (gender == '2') {
					genderEn = 'famale';
				}
				if (praise == 0) {
					praise = '赞';
				}
				//判断是否是精华动态
				if(c_dynamic_essence==0){
					essence += '<div class="userImage-1">';
					essence += '<img src="image/community/communityjing.png" style="width: 100%;" />';
					essence += '</div>';
				}
				//图片
				var dynamicImages = '';
				var dynamicImageHtml = '';
				var arrImage = new Array();
				if (dynamicImage != null && dynamicImage != '') {
					dynamicImages = dynamicImage.split(',');
					for (var j = 0; j < dynamicImages.length; j++) {
						var img = new Image();
						var imgPath = rootUrl + dynamicImages[j];
						img.src = api.cacheDir + "/nearby/pic" + dynamicImages[j].substring(dynamicImages[j].lastIndexOf('/'));
						if (img.width == 0) {
							img.src = rootUrl + dynamicImages[j];
						}
//						var cssKey = 'width';
						var classKey = 'dyImgPositionE';
//						if (img.width > img.height) {
//							cssKey = 'height';
//							classKey = 'dyImgPositionH';
//						}
//						if (img.width == img.height) {
//							classKey = 'dyImgPositionE';
//						}
						var winWidth = api.winWidth / 4 - 5;
						dynamicImageHtml += '<div class="pb-standalone-dark dyImg" onclick="openPhoneBrowserDynamicInfo(this);" style="width:' + winWidth + 'px;height:' + winWidth + 'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">' + '<img class="cache ' + classKey + ' " src="' + imgPath + '" width="'+winWidth+'px" height="'+winWidth+'px" />' + '</div>';
					}

				}
				//是否已赞,大于零已赞
				var thumbsClass = 'icon-thumbs-up-alt';
				if (parseInt(isPraise) > 0) {
					thumbsClass = 'icon-thumbs-up';
				}
				var headWidth = api.winWidth / 7;
				template += '<div class="card facebook-card card-margin">' +essence+ '<div class="card-header">' +'<div class="facebook-avatar"><img src="' + (rootUrl + userImage) + '" style="width:' + headWidth + 'px;height:' + headWidth + 'px;"></div>' + '<div class="item-inner" >' + '<div class="item-title-row" >' + '<div class="item-title"><span>' + userName + '</span><input type="hidden" id="dynamicId" value=' + dynamicId + '></div>' + '</div>' + '<div class="item-subtitle">' + '<div class="sex sex-bgc' + gender + ' l_float">' + '<img class="img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span style="margin-top: 0px">' + age + '</span>' + '</div>' + '<div class="communityDetal-vip">' + '<img src="' + userLevel + '" width="100%" style="height: 12px;margin-bottom: 6px;">' + '</div>' + '</div>' + '</div>' + '<div class="facebook-date facebook-dateafter" style="position:relative;float:left;left:0px;"><div  id="angle-down" class="r_float"><span>' + creatTime + '</span>&nbsp;<i class="icon-angle-down"></i></div></div>' + '</div>' + '<div class="card-content">' + '<div class="card-content-inner" style="padding-bottom: 0px;padding-top: 0px;">' + '<p style="color: #838383;">' + content + '</p>' + dynamicImageHtml + '</div>' + '</div>' + '<div class="card-footer">' + '<div class="card-footer-title">' + '<span>'+distince+'km</span>&nbsp;' + '<span>' + readNum + '阅读</span>' + '</div>' + '<div class="">' + '<i class="' + thumbsClass + '" onclick="clickThumbs(this,\'' + id + '\');"></i>' + '&nbsp;<span>' + praise + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' + '<i class="icon-flickr"  style="color:#D3D3D5"></i>' + '&nbsp;<span id="personnel-commentnum">' + data_commentList.length + '</span>' + '</div>' + '</div>' + '</div>';
				card.append(template);

				$$('#angle-down').on('click', function() {
					window.Auto517.UIChatbox._inputBar_show_hide("hide");
					var buttons1 = [{
						text : '操作',
						label : true
					}, {
						text : '<span style="color:#0EAAE3">不感兴趣</span>',
						onClick : function() {
							window.Auto517.UIChatbox._inputBar_show_hide("hide");
							mainView.router.back();
							insertDynamicInteresting(dynamicId, dyUserId);
							
						}
					},{
						text : '<span style="color:#0EAAE3">收藏</span>',
						onClick : function() {
							window.Auto517.UIChatbox._inputBar_show_hide("hide");
							shoucang(dyUserId,dynamicId,type);
						}
					},{
						text : '<span style="color:#0EAAE3">举报</span>',
						onClick : function() {
							window.Auto517.UIChatbox._inputBar_show_hide("hide");
							mainView.router.loadPage('html/nearby/nearbyNewsReport.html?dynamicId="' + dynamicId + '"');
						}
					}];
					var buttons2 = [{
						text : '<span style="color:#0EAAE3;font-weight: 500;">取消</span>',
						onClick : function() {
							window.Auto517.UIChatbox._inputBar_show_hide("show");
						}
					}];
					var groups = [buttons1, buttons2];
					myApp.actions(groups);
				});

			}
			if (data_commentList.length > 0) {
				var ul = $$('#commentList');
				for (var i = 0; i < data_commentList.length; i++) {
					var template = '';
					var id = data_commentList[i].id;
					var userName = data_commentList[i].username;
					var userImage = data_commentList[i].userimage;
					var creatTime = data_commentList[i].creattime;
					var content = window.Auto517.UIChatbox._im_transText(data_commentList[i].content);
					if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
						creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
					} else if (parseInt(creatTime) / 60 >= 24) {
						creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
					} else {
						creatTime = creatTime + '分钟前';
					}
//					template += '<li><div class="item-content"><div class="item-media"><img src="' + (rootUrl + userImage) + '" style="width: 35px; height: 35px;"></div><div class="item-inner"><div class="item-title-row"><div class="item-title" style="font-weight: 300;">' + userName + '</div><div class="item-after" style="color: #DDDDDD;font-size:10px;">' + creatTime + '</div></div><div class="item-subtitle" style="color: #DDDDDD;">' + content + '</div></div></li>';
					template += '<li><div class="item-content"><div class="item-media" style="position:absolute;top:0px;"><img src="' + (rootUrl + userImage) + '" style="width: 35px; height: 35px;"></div><div class="item-inner" style="padding-left:25px;"><div class="item-title-row"><div class="item-title" style="font-weight: 300;">' + userName + '</div><div class="item-after" style="color: #DDDDDD;font-size:10px;">' + creatTime + '</div></div><div class="card-content" style="color: #c8c7cc;font-size:13px;min-height: 25px;line-height: 25px;">' + content + '</div></div></li>';
					ul.append(template);
					
				}
			}
			//前一页阅读书更新
			$$("#"+dynamicId).children('div').children('div').next('a').next('div').children('div').children('span').next('span').html(data_list[0].readnum+'阅读');
		

		},
		error : function(xhr, type) {
			toast.show("请求失败");
		}
	});

		//uichatbox的open事件与uichatbox将屏幕上推时间
		Auto517.UIChatbox._uichatbox_open(function(content) {
			Auto517.UIChatbox._inputBar_closeBoard();
			Auto517.UIChatbox._im_transText(content);
			sendComment(content);
		});
		Auto517.UIChatbox._inputBar_move($$("#nearbyDynamicInfo"),$$("#nbDyInfoPc").height(),"ohmy");
		
	
});

myApp.onPageInit('power', function(page) {
	$$('#power .item-inner').on('click', function() {
		$$('.item-inner').children('div .item-text').addClass('item-subtitle-hidden');
		$$(this).children('div .item-text').removeClass('item-subtitle-hidden');
	});
});

myApp.onPageInit('releaseDy', function(page) {
	var status = page.query.status;
	uiMediaScanner = api.require('UIMediaScanner');
	//初始化发布动态页监听
	initListener(status);
	$$("#fanhui").on('click', function() {
		onclickTab($$("#dynamic"), 'tabspan2');
		$$('#tab-people').removeClass('active');
		$$('#tab-dynamic').addClass('active');
	});
	
//	$$("#dy1").on('click', function() {
//		onclickTab($$("#dynamic"), 'tabspan2');
//		$$('#tab-people').removeClass('active');
//		$$('#tab-dynamic').addClass('active');
//	});
	//  var select =  $$('#dyPlace');
	//  $$('.smart-select-value').html(user_address);
	//默认位置附近的地址
	Auto517.bMap._bmap_getNearByLat(user_lon,user_lat,user_address+'附近', function(ret) {
		$$('select[name="dyPlace"]').html('');
		for (var i = 0; i < ret.results.length; i++) {
			var addressDy = ret.results[i];
			var addressDyLon = addressDy.lon + ',' + addressDy.lat;
			myApp.smartSelectAddOption('#nearbyOpenAddress select', '<option value="' + addressDy.name + '">' + addressDy.name + '<input type="hidden" name="addressDyLat" value="' + addressDyLon + '" /></option>');
		}
	});
	//搜索关键字附近的地址
	$$(document).on('keyup keydown change', 'input[type="search"]', function(e) {
		if (e.keyCode == 13) {
			$$('select[name="dyPlace"]').html('');
			var searchItem = $$('input[type="search"]').val();
			$$('input[type="search"]').blur();
			Auto517.bMap._bmap_getNearByLat(user_lon,user_lat,searchItem, function(ret) {
				//				$$('#dyPlace').html('');
				for (var i = 0; i < ret.results.length; i++) {
					var addressDy = ret.results[i];
					var addressDyLon = addressDy.lon + ',' + addressDy.lat;
					myApp.smartSelectAddOption('#releaseDy select', '<option value="' + addressDy.name + '">' + addressDy.name + '<input type="hidden" name="addressDyLat" value="' + addressDyLon + '" /></option>');
					//					select.append('<option selected value="'+addressDy.name+'">'+addressDy.name+'<input type="hidden" name="addressDyLat" value="'+addressDyLon+'" /></option>');
				}
			});
		}
	});
	//选图片
	initSelectPic();

});
var time = 0, gender = 0, ageMin = 0, ageMax = 0, con = 0;
myApp.onPageInit('nearby-index', function(page) {

	var dyPageNum = 20;
	var dy_cur_page = 1;
	var loadMore = true;
	var refreshFlag = true;
	per_curPage=1;
//	updateLanderPosition(user_lat,user_lon);
	 var cacheDir = api.cacheDir;
	  api.readFile({
	      path: cacheDir+'/om/personnel/personnel1.json',
	  }, function(ret, err){
	      if(ret.status){
	       //如果成功，说明有本地存储，读取时转换下数据格式
	       var jsonData = JSON.parse(ret.data);
	       initPersonnelList(jsonData,0);
	      }else{
			//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
			getNearbyPersonnelList('0', time, gender, ageMin, ageMax, con);
	      }
	 //缓存图片
//	 	 	setTimeout(iconCache(), 2000);

	  });
	 
	//读本地动态
	  var cacheDir = api.cacheDir;
	  api.readFile({
	      path: cacheDir+'/om/dynamic/dynamic1.json',
	  }, function(ret, err){
	      if(ret.status){
	              //如果成功，说明有本地存储，读取时转换下数据格式
	          var jsonData = JSON.parse(ret.data);
	          initDynamicList(jsonData,0);
	      }else{
			//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
			getNearbyDynamicList('0', dyPageNum, dy_cur_page);
	      }
	  });
		
	  
//	 下拉刷新页面
	var ptrContent = $$('#nearbyRefresh');
//	 添加'refresh'监听器
	ptrContent.on('refresh', function(e) {

		if (refreshFlag) {
			refreshFlag = false;
			if ('tab-people' == $$('.tabs').find('.active').attr('id')) {
				setTimeout(function() {
					getNearbyPersonnelList('1', $$('#personnel_time').val(),$$('#personnel_gender').val(),$$('#personnel_ageMin').val(),$$('#personnel_ageMax').val(), $$('#personnel_con').val());
					myApp.pullToRefreshDone();
					refreshFlag = true;
				}, 2000);
			}
			if ('tab-dynamic' == $$('.tabs').find('.active').attr('id')) {
				setTimeout(function() {
					getNearbyDynamicList('1', dyPageNum, 1);
					myApp.pullToRefreshDone();
					refreshFlag = true;
				}, 2000);
			}
		}
	});
	
	//加载更多
	$$('#nearbyRefresh').on('infinite', function() {
		if (loadMore) {
			loadMore = false;
			if ('tab-people' == $$('.tabs').find('.active').attr('id')) {
				setTimeout(function() {
					getNearbyPersonnelList('2', $$('#personnel_time').val(),$$('#personnel_gender').val(),$$('#personnel_ageMin').val(),$$('#personnel_ageMax').val(), $$('#personnel_con').val());
					loadMore = true;
				}, 2000);
			}
			if ('tab-dynamic' == $$('.tabs').find('.active').attr('id')) {
				var lastIndex = $$('#tab-dynamic .card').attr('id');
				setTimeout(function() {
					getNearbyDynamicList('3', dyPageNum, ++dy_cur_page);
					loadMore = true;
				}, 2000);
			}
		}
	});
	
});



//邻里好友动态与生活好友动态页
myApp.onPageInit('personnel-dynamic', function(page) {

	var dyPageNum = 20;
	var dy_cur_page = 1;
	var loadMore = true;
	var refreshFlag = true;
	per_curPage=1;
//	updateLanderPosition(user_lat,user_lon);
	 var cacheDir = api.cacheDir;
	  api.readFile({
	      path: cacheDir+'/om/neighboursDynamic/neighboursDynamic1.json',
	  }, function(ret, err){
	      if(ret.status){
	       //如果成功，说明有本地存储，读取时转换下数据格式
	      
	       var jsonData = JSON.parse(ret.data);
	       initNeighboursDynamicList(jsonData,0);
	      }else{
			//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
			 
			getNeighboursDynamicList('0', dyPageNum, dy_cur_page);
	      }
	 //缓存图片
//	 	 	setTimeout(iconCache(), 2000);

	  });

	//读本地动态
	  var cacheDir = api.cacheDir;
	  api.readFile({
	      path: cacheDir+'/om/friendDynamic/friendDynamic1.json',
	  }, function(ret, err){
	      if(ret.status){
	              //如果成功，说明有本地存储，读取时转换下数据格式
	          var jsonData = JSON.parse(ret.data);
	          initFriendDynamicList(jsonData,0);
	      }else{
			//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
			getFriendDynamicList('0', dyPageNum, dy_cur_page);
	      }
	  });
	
//	 下拉刷新页面
	var ptrContent = $$('#personnelDynamicRefresh');
//	 添加'refresh'监听器
	ptrContent.on('refresh', function(e) {

		if (refreshFlag) {
			refreshFlag = false;
			
			if ('neighbours-dynamic' == $$('.tabs').find('.active').attr('id')) {
				setTimeout(function() {
					getNeighboursDynamicList('1', dyPageNum, 1);
					myApp.pullToRefreshDone();
					refreshFlag = true;
				}, 2000);
			}
			if ('friend-dynamic' == $$('.tabs').find('.active').attr('id')) {
				setTimeout(function() {
					getFriendDynamicList('1', dyPageNum, 1);
					myApp.pullToRefreshDone();
					refreshFlag = true;
				}, 2000);
			}
			myApp.attachInfiniteScroll($$('#personnelDynamicRefresh'));
			$$('#personnelDynamicLoadMore').css('display', '');
			dy_cur_page = 1;
//			myApp.attachInfiniteScroll($$('#personnelDynamicRefresh'));
//			$$('#personnelDynamicLoadMore').css('display','block');
		}
	});
	
	//加载更多
	$$('#personnelDynamicRefresh').on('infinite', function() {
		alert(loadMore);
		if (loadMore) {
			loadMore = false;
			
				var lastIndex = $$('#neighbours-dynamic .card').attr('id');
				setTimeout(function() {
					getNeighboursDynamicList('3', dyPageNum, ++dy_cur_page);
					getFriendDynamicList('3', dyPageNum, dy_cur_page);
					loadMore = true;
				}, 2000);
		}
	});

});


