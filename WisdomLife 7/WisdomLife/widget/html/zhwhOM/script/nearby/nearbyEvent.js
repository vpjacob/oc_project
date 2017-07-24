function onclickTab(obj, childId) {
	//	$$('.current').removeClass("current")
	$$(obj).css("border-bottom", "#FFFFFF solid 2px");
	var curpage = $$("#nearbyRefresh", mainView.activePage.container);
	$$(curpage).scrollTop(0, Math.round($$(curpage).scrollTop() / 4));
	if (childId.indexOf('1') > 0) {
	
		$$('#rightTitle').html("筛选");
		$$('#' + childId).parent('div').parent('a').next('a').css("border-bottom", "#0EAAE3 solid 2px");
		time = 0;
		gender = 0;
		ageMin = 0;
		ageMax = 0;
		con = 0;
		getNearbyPersonnelList('1', time, gender, ageMin, ageMax, con);
		
	}
	if (childId.indexOf('2') > 0) {
		
		$$('#rightTitle').html("发布");
		$$('#' + childId).parent('div').parent('a').prev('a').css("border-bottom", "#0EAAE3 solid 2px");
		getNearbyDynamicList('0', 20, 1);
		myApp.attachInfiniteScroll($$('#nearbyRefresh'));
		$$('#loadMore').css('display', '');
	}
//	Auto517.bMap._bmap_getNameFromCoords(user_lat,user_lon,function(ret){
//		
//			user_address=ret.address;
//			user_city = ret.city;
//			user_district=ret.district;
//			user_province=ret.province;
//			user_streetName=ret.streetName;
//			user_streetNumber=ret.streetNumber;
//		});
}


//- 弹出筛选
function screeningDynamics(obj) {
	var key = $$(obj).children().html();
	if ('筛选' == key) {
		var buttons1 = [{
			text: '筛选',
			label: true
		}, {
			text: '<span style="color:#0EAAE3">全部</span>',
			onClick: searchNearbyPersonAll
		}, {
			text: '<span style="color:#0EAAE3">男<i class="icon-mars"></i></span>',
			onClick: searchNearbyPersonMale
		}, {
			text: '<span style="color:#0EAAE3">女<i class="icon-venus"></i></span>',
			onClick: searchNearbyPersonFemale
		}, {
			text: '<span style="color:#0EAAE3">自定义</span>',
			onClick: function() {
				mainView.router.loadPage('html/nearby/nearbyScreening.html');
			}
		}];
		var buttons2 = [{
			text: '<span style="color:#0EAAE3;font-weight: 500;">取消</span>',
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	}
	if ('发布' == key) {
		mainView.router.loadPage('html/nearby/nearbyReleaseDy.html');
	}
}

//查看关键字
function viewkey(userid) {

	var _data = {
		script: "managers.om.user.user",
		needTrascation: false,
		funName: "keyList",
		form: "{userID: '" + userid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			var data_list = data.datasources[0].rows;
			if (data_list.length > 0) {
				var id = data_list[0].id;
				var userName = data_list[0].username;
				var age = data_list[0].age;
				var gender = data_list[0].gender;
				var genderEn = 'male';
				var userImage = data_list[0].userimage;
				var userLevel = data_list[0].userlevel;
				var keywordhtml = '';
				if (gender == '2') {
					genderEn = 'famale';
				}
				var contentHeight = 30;
				var keys = '';
				for (var i = 0; i < data_list.length; i++) {
					keywordhtml += '<div class="key-keyword-search" style="font-size: 0.8em;margin-top:1px;"><span>' + data_list[i].keyword + '</span></div>';
					keys = keys + data_list[i].keyword;
				}
				contentHeight = contentHeight + (Math.floor(keys.length / 10)) * 20;

				var modal = myApp.modal({
					title: '',
					text: '',
					afterText: '<div class="card facebook-card key-card">' +
						'<div class="card-header" style="margin-bottom: 8px;padding-bottom: 2px;">' +
						'<div class="facebook-avatar"><img src="' + (rootUrl + userImage) + '" width="50" height="50"></div>' +
						'<div class="facebook-name key-facebook-name"><span class="key-card-title">' + userName + '</span></div>' +
						' <div class="facebook-date key-facebook-date">' +
						'<div class="key-sex-img sex-bgc' + gender + '">' +
						'<img class="key-img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span>' + age + '</span>' +
						'</div>' +
						'<div class=" key-vip-img">' +
						'<img class="key-img2" src="' + userLevel + '" />' +
						'</div>' +
						' </div>' +
						'</div>' +
						'<div class="card-content" style="height: ' + contentHeight + 'px;margin-left: 62px;">' +
						'<div class="item-inner key-item-inner">' +
						'<div class="item-title-row" style="background: none;">' +
						'<div style="width: 90%; height: auto; margin-right: 0px;margin-bottom: 10px;">' +
						'<div class="row no-gutter" style="margin-top: 10px;width: 7em;display: inline;">' +
						keywordhtml +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>'
				});
				myApp.swiper($$(modal).find('.swiper-container'), {
					pagination: '.swiper-pagination'
				});
				$$('.modal-inner').addClass('modalInnerPadding');
				$$('.modal-overlay.modal-overlay-visible').on('click', function() {
					myApp.closeModal();
				});
			}
		},
		error: function(xhr, type) {

			toast.show('请求失败');
		}
	});

	
}

//评论
function evaClick(dynamicId, dyUserId,flag) {
	mainView.router.loadPage('html/nearby/nearbyDynamicInfo.html?dynamicId=' + dynamicId + '&dyUserId=' + dyUserId+ '&flag=' + flag);
//	var num = parseInt($$("#"+dynamicId).children('div').next('div').next('div').children('div').children('span').next('span').html())+1;
//	$$("#"+dynamicId).children('div').next('div').next('div').children('div').children('span').next('span').html(num+'阅读');



}

function powerFinish() {
	$$('#power-text').html($$("#power input[type='radio']:checked").next('.item-inner').children('.item-title').children('#select').html());
	var value = $$("#power input[type='radio']:checked").val();
	$$('#power-value').val(value);
}


//分享
function shareIconClickDisplay(obj) {
	$$(obj).addClass('icon-hidden');
	$$(obj).next().removeClass('icon-hidden');
}

function shareIconClickPlay(obj) {
	$$(obj).addClass('icon-hidden');
	$$(obj).prev().removeClass('icon-hidden');
}

//点赞
function clickThumbs(obj, dynamicId) {
	myApp.showIndicator();
	var className = obj.className;
	//判断加一还是减一
	var thumbFlag = '0';
	//	加1
	if (className.indexOf('icon-thumbs-up-alt') >= 0) {
		
		$$(obj).removeClass('icon-thumbs-up-alt').addClass('icon-thumbs-up');
		$$("#"+dynamicId).children('div').children('div').next('a').next('div').children('div').next('div').children('i').removeClass('icon-thumbs-up-alt').addClass('icon-thumbs-up');
		thumbFlag = '1';
	} else {
		
		$$(obj).removeClass('icon-thumbs-up').addClass('icon-thumbs-up-alt');
		$$("#"+dynamicId).children('div').children('div').next('a').next('div').children('div').next('div').children('i').removeClass('icon-thumbs-up').addClass('icon-thumbs-up-alt');
	}
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: true,
		funName: "updateAndGetThumbs",
		form: "{dynamicID: '" + dynamicId + "',uid:'" + uid + "',thumbFlag:'" + thumbFlag + "'}"
	};
	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {

			var data_list = data.datasources[0].rows;

			if (data_list.length > 0) {
				$$(obj).next('span').html(data_list[0].praise == 0 ? '赞' : data_list[0].praise);
				$$("#"+dynamicId).children('div').children('div').next('a').next('div').children('div').next('div').children('span').html(data_list[0].praise == 0 ? '赞' : data_list[0].praise+'');
				$$(obj).parent('div').parent('div').children('div').children('span').next('span').text(data_list[0].readnum + '阅读');
			}
			myApp.hideIndicator();

		},
		error: function(xhr, type) {
			
		}
	});
}

//附近-人
function getNearbyPersonnelList(searchFlag, time, gender, ageMin, ageMax, con) {
	$$("#personnel_time").val(time);
	$$("#personnel_gender").val(gender);
	$$("#personnel_ageMin").val(ageMin);
	$$("#personnel_ageMax").val(ageMax);
	$$("#personnel_con").val(con);
	
	//加载更多
	if (searchFlag == '2') {
		per_curPage++;
	} else {
		per_curPage = 1;
		myApp.attachInfiniteScroll($$('#nearbyRefresh'));
		$$('#loadMore').css('display', '');
	}
	var _data = {
		script: "managers.om.user.user",
		needTrascation: false,
		funName: "userList",
		form: "{cur_page: " + per_curPage + ",page_num: 20,uid: '" + uid + "',time: " + time + ",gender: " + gender + ",ageMin: " + ageMin + ",ageMax: " + ageMax + ",con: '" + con + "',lastDistance:" + lastDistance + ",searchFlag:" + searchFlag + "}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {

			var data_list = data.datasources[0].rows;
			if (searchFlag != '2') {
				writeFile(data_list, 'personnel', 1);
			}
			initPersonnelList(data_list, searchFlag);

		},
		error: function(data) {

			toast.show("请求失败");
		}
	});

}



//附近-动态 searchFlag:0 初始化查询 和 刷新；1 下拉刷新 ；  2 发布动态后回列表页；3 加载更多
function getNearbyDynamicList(searchFlag,dyPageNum,dy_cur_page) {
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: false,
		funName: "NearbyList",
		form: "{cur_page: '"+dy_cur_page+"',page_num: '"+dyPageNum+"',lastDyId: '"+lastDyId+"',searchFlag: '"+searchFlag+"',uid: '"+uid+"',dynamicId: 0}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		method: 'post',
		data: _data,
		success: function(data) {
			var data_list = data.datasources[0].rows;
			
			//alert("data_list" + data_list);

			if(data_list.length>0 && (searchFlag=='0'||searchFlag=='1')){
				writeFile(data,'dynamic',1);
			} 
			initDynamicList(data,searchFlag);
			iCache($$('.cache'),"/nearby/pic/");

		},

		error:function(data){
			toast.show("请求失败");

		}
	});
}


//动态-邻里好友动态
function getNeighboursDynamicList(searchFlag,dyPageNum,dy_cur_page) {
	
	
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: false,
		funName: "NearbyList",
		form: "{cur_page: '"+dy_cur_page+"',page_num: '"+dyPageNum+"',lastDyId: '"+lastDyId+"',searchFlag: '"+searchFlag+"',uid: '"+uid+"',dynamicId: 0}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		method: 'post',
		data: _data,
		success: function(data) {
			var data_list = data.datasources[0].rows;

			if(data_list.length>0 && (searchFlag=='0'||searchFlag=='1')){
				writeFile(data,'neighboursDynamic',1);
			}
			initNeighboursDynamicList(data,searchFlag);
			iCache($$('.cache'),"/nearby/pic/");

		},

		error:function(data){
			toast.show("请求失败");

		}
	});

}

//动态-生活好友动态
function getFriendDynamicList(searchFlag,dyPageNum,dy_cur_page) {
	
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: false,
		funName: "NearbyList",
		form: "{cur_page: '"+dy_cur_page+"',page_num: '"+dyPageNum+"',lastDyId: '"+lastDyId+"',searchFlag: '"+searchFlag+"',uid: '"+uid+"',dynamicId: 0}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		method: 'post',
		data: _data,
		success: function(data) {
			var data_list = data.datasources[0].rows;

			if(data_list.length>0 && (searchFlag=='0'||searchFlag=='1')){
				writeFile(data,'friendDynamic',1);
			}
			initFriendDynamicList(data,searchFlag);
			iCache($$('.cache'),"/nearby/pic/");

		},

		error:function(data){
			toast.show("请求失败");

		}
	});

}
//查询男.
function searchNearbyPersonMale() {
	gender = 1;
	time = 0;
	ageMin = 0;
	ageMax = 0;
	con = 0;
	getNearbyPersonnelList('1', time, gender, ageMin, ageMax, con);
}
//查询女
function searchNearbyPersonFemale() {
	gender = 2;
	time = 0;
	ageMin = 0;
	ageMax = 0;
	con = 0;
	getNearbyPersonnelList('1', time, gender, ageMin, ageMax, con);
}
//查询全部人
function searchNearbyPersonAll() {
	time = 0;
	gender = 0;
	ageMin = 0;
	ageMax = 0;
	con = 0;
	getNearbyPersonnelList('1', time, gender, ageMin, ageMax, con);
}

//图片浏览
function openPhoneBrowser(dynamicId, key) {
	if (viewPicFlag) {
		viewPicFlag = false;
		//查看自己刚发布动态图片
		if (dynamicId == 0) {
			var cacheDir = api.cacheDir;
			api.readFile({
				path: cacheDir + '/om/nearby/selfDy/' + uid + '.json'
			}, function(ret, err) {
				if (ret.status) {
					var jsonData = JSON.parse(ret.data);
					var arr = jsonData.dynamicImage.split(',');
					imageBrowser.openImages({
						imageUrls: arr,
						showList: false,
						activeIndex: key
					});
					viewPicFlag = true;
				}
			});
		} else {
			viewPicFlag = false;
			$$.ajax({
				url: rootUrl + 'index.php/nearby/personnel/Personnel_ajax/getPhoneByDynamicId',
				dataType: 'json',
				method: 'post',
				async: false,
				data: {
					dynamicId: dynamicId
				},
				success: function(data) {
					var data_list = data.imageList;
					if (data_list.length > 0) {
						var arr = new Array(data_list.length);
						for (var i = 0; i < data_list.length; i++) {
							arr[i] = rootUrl + data_list[i].dynamicImage;
						}
						//	/*=== 图片浏览 ===*/
						imageBrowser.openImages({
							imageUrls: arr,
							showList: false,
							activeIndex: key
						});

					}
					viewPicFlag = true;
				},
				error: function(data) {
					//					alert(data.responseText);
				}
			});
		}
	}
}

//发布动态
function releaseDynamic() {
	//	myApp.showIndicator();
	var obj = JSON.parse(getJson());
	var cacheDir = api.cacheDir;
	//内容的数据，内容的数据存储时就根据自己的需要来看存储哪些，可以循环过滤一下
	//写入文件
	api.writeFile({
		//保存路径
		path: cacheDir + '/nearby/selfDy/' + uid + '.json',
		//保存数据，记得转换格式
		data: JSON.stringify(obj)
	}, function(ret, err) {
		if (ret.status) {
			//发送上传事件
			api.sendEvent({
				name: 'waitUpload',
				extra: {
					fileName: uid
				}
			});
			// 向后台存储数据
	        setTimeout(function(){
	            api.closeWin({
	                name: ''
	            })
	        },1000);
	        			
			api.toast({
				msg: '发布成功',
				duration: 1500,
				location: 'top'
			});

		} else {
			api.toast({
				msg: '发布失败',
				duration: 2000,
				location: 'top'
			});
		}
	})
}
//将提交的动态封装成json格式字符串
function getJson(){
	var dynamic_content = $$('#dynamic_content').val();
	var place = $$('#nearbyOpenAddress select').val();
	var powerValue = $$('#power-value').val();
	var phone = $$('.phone');
	var phones = '';
	var upLoadPhones = new Array;

	//图片上传
	$$.each(phone, function(key, value) {
		if ($$(value).find('img').attr('src')) {
			var imgPath = $$(value).find('img').attr('src');
			phones += imgPath + ',';

		}
	});
	phones = phones.substring(0, phones.length - 1);

	var json = '{"id":"0","dyuserid":"'+uid+'","username":"'+uname+'","age":"'+user_age+'","gender":"'+user_gender+'","userimage":"'+uimg+'",'+
			  '"userlevel":"'+user_level+'","content":"'+dynamic_content+'",' +
			  '"communityname":"附近的人","creattime":"1","readnum":"0","praise":"0",' +
			  '"dynamicimage":"'+phones+'","ispraise":"0","distance":"0","place":"'+place+'","powervalue":"'+powerValue+'"}' ;
	return json;
}



//向服务器发送动态保存
function synchroServer(data, status) {
	var isSynchro = 0;
	var fs = api.require('fs');
	var dynamic_content = data.content;
	var place = data.place;
	var powerValue = data.powervalue;
	var phones = '';
	var dynamicImages;
	var newPhones='';
	var c_community_id=0;
	var num='';
	var newphotos ='' ;
	//向服务器上传照片
	if (data.dynamicimage != null && data.dynamicimage != '') {
		dynamicImages = data.dynamicimage.split(',');
		for(var i=0;i<dynamicImages.length;i++){
			uploadimage(dynamicImages[i],function(path){
				newPhones += path;
			});
		}	
		
	}
	
	
			

	//newPhones = newPhones.substring(0, phones.length - 1);
	
	//发布动态
setTimeout(function(){	
	if (data.dynamicimage != null && data.dynamicimage != ''){
		var photoArray = newPhones.split(',');
		for(var k=0;k<dynamicImages.length;k++){
			var uploadimgName=dynamicImages[k].substring(dynamicImages[k].lastIndexOf("/")+1);
			for(var j=0; j<photoArray.length;j++){
				var serverimgName=photoArray[j].substring(photoArray[j].lastIndexOf("/")+1);
				if(serverimgName==uploadimgName){
					newphotos +=photoArray[j]+",";
					break;
				}
			}
		}
	}
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: true,
		funName: "saveDynamicInfo",
		form: "{uid: '"+uid+"',dynamicContent: '"+Auto517.p_emotion.utf16toEntities(dynamic_content)+"',place: '"+place+"',powerValue: '"+powerValue+"',user_lat: "+user_lat+",user_lon: "+user_lon+",phones: '"+newphotos+"'}"
	};
	$$.ajax({
		url :rootUrl + "/api/execscript",
		dataType : 'json',
		method : 'post',
		data : _data,
		success : function(data) {
			//var message = data.datasources[0].rows;
			if (data.execStatus == 'true') {
				setTimeout(function() {
//					if (newPhones=='') {
						if (status == 'personnal') {
							init_user_dynamic(uid);
						} else {
							onclickTab($$('#dynamic'), 'tabspan2');
						}
//					}
				}, 1000);
			}
		},
		error : function(data, e) {

			toast.show("请求失败");
		}
	});
	},2000)
}


//发表评论
function sendComment(areaText) {
	
	var dynamicId = $$('#dynamicId').val();
	if (areaText.length > 0) {
		if (null != chatBox ) {
			chatBox.resignFirstResponder();
			
		}
		var communityDyComD = '';
		var areaTextShow = window.Auto517.UIChatbox._im_transText(areaText);
		communityDyComD += '<li><div class="item-content">';
		communityDyComD += '<div class="item-media" style="position:absolute;top:0px;"><img src="' + (rootUrl + uimg) + '" style="width:35px;height:35px;"></div>';
		communityDyComD += '<div class="item-inner" style="margin-left:39px;"><div class="item-title-row">';
		communityDyComD += '<div class="item-title" style="font-weight: 300;">' + uname + '</div>';
		communityDyComD += '<div class="item-after" style="color: #DDDDDD;font-size:10px;">1分钟前</div>';
		communityDyComD += '</div>';
//		communityDyComD += '<div class="item-subtitle" style="color: #DDDDDD;">' + areaTextShow + '</div>';
		communityDyComD += '<div class="card-content" style="color: #c8c7cc;font-size:13px;min-height: 25px;line-height: 25px;">' + areaTextShow + '</div>';
		communityDyComD += '</div>';
		communityDyComD += '</div>';
		communityDyComD += '</li>';
		dyCominfo.append(communityDyComD);
		$$('#nearby-dy-area').val("");
		var _data = {
			script: "managers.om.nearby.nearby",
			needTrascation: true,
			funName: "saveDynamicComment",
			form: "{uid:'" + uid + "',dynamicId:'" + dynamicId + "',areaText:'" + Auto517.p_emotion.utf16toEntities(areaText) + "'}"
		};
		$$.ajax({
			url: rootUrl + "/api/execscript",
			method: 'post',
			dataType: 'json',
			data: _data,
			success: function(data) {
				var num = parseInt($$("#personnel-commentnum").html())+1;
				$$("#personnel-commentnum").html(num);
			}
		});
	}
}

function openPhoneBrowserDynamicInfo(obj) {
	var _thatImgs = $$(obj).parent().find(".dyImg");
	var arr = new Array();
	var key = $$(obj).index()-1;
	$$.each(_thatImgs, function (index, value) {
		arr[index] = $$(value).find("img").attr("src");
	}); 
		Auto517.photoBrowser._photoBrowser_open(arr,key);
}

//举报用户
function nearby_report_insertUser_confirm(userID) {

	//举报内容report
	var report = $$("#report input[type='radio']:checked").next('div').find('span').html();
	//	var re = JSON.stringify(report);
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});
	myApp.confirm('是否确定提交举报该用户？', '', function() {

			$$.ajax({
				url: rootUrl + 'index.php/nearby/personnel/Personnel_ajax/saveUserReport',
				dataType: 'json',
				type: 'post',
				data: {
					userID: userID,
					uid: uid,
					report: report
				},
				success: function(data) {

				}
			});
			if ($$('input[name="same-black"]').prop('checked')) {
				$$.ajax({
					url: rootUrl + 'index.php/user/user_info/insertDefriend',
					data: {
						userID: uid,
						toUserID: userID
					},
					dataType: 'json',
					type: 'post',
					timeout: 5000,
					success: function(data) {
						toast.show('已拉黑');
					}
				});
			}
		},
		function() {

		}
	);
}
//保存到手机
function savetribunepicture(img) {

	api.confirm({
		msg: '是否保存图片'
	}, function(ret, err) {
		if(ret.buttonIndex == 2) {
			api.download({
				url: img,
				savePath: 'fs://' + img,
				report: true,
				cache: true,
				allowResume: true
			}, function(ret, err) {
				if(ret.state == 1) {
					api.saveMediaToAlbum({
						path: ret.savePath
					}, function(ret, err) {
						if(ret && ret.status) {
							api.toast({
								msg: '保存成功'
							});
						} else {
							api.toast({
								msg: '保存失败'
							});

						}
					});
				} else {

				}
			});
		}

	});

}
$$(document).on('click','.discuss',function(){
	
	var dynamicID=$$(this).data('ids');
	var pageId = myApp.getCurrentView().activePage.container.id;
	$$('#'+pageId).append('<div class="modal-overlay modal-overlay-visible"></div>');
	Auto517.UIChatbox._uichatbox_open(function(content) {
		Auto517.UIChatbox._im_transText(content);
		sendDynaComment(content,dynamicID);
	});
	
	
})

//$$(document).on('click','#nearbyRefresh',function(){
//	if(androidBack=='uichat'){
//		Auto517.UIChatbox._inputBar_close();
//		androidBack='';
//	}else{
//		$$('.discuss').on('click',function(){
//			Auto517.UIChatbox._uichatbox_open(function(content) {
//				Auto517.UIChatbox._inputBar_closeBoard();
//				Auto517.UIChatbox._im_transText(content);
//				sendComment(content);
//				Auto517.UIChatbox._inputBar_close();
//			});
//			api.addEventListener({
//			    name: 'uichatOpen'
//			}, function(ret, err) {
//			    Auto517.UIChatbox._inputBar_popupBoard();
//			});
//
//			
//		});
//		androidBack='uichat';
//	}
//	  
//
//	  
//	  
//	  
//});

function sendDynaComment(content,dynamicId){
	var dynamicComment='';
	dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
	dynamicComment+='	<ul >';
	dynamicComment+='		<li style="border-bottom:1px;">';
	dynamicComment+='	       <div class="item-title" style="font-size:14px;padding:0px;margin:0px;"><span style="color:#0EAAE3;">'+uname+':</span>&nbsp;&nbsp;'+window.Auto517.UIChatbox._im_transText(content)+'</div>';
	dynamicComment+='	     </li>' ;
	dynamicComment+='	</ul>';
	dynamicComment+='</div>';
	$$('#'+dynamicId).find('.comment').append(dynamicComment);
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: true,
		funName: "saveDynamicComment",
		form: "{uid:'" + uid + "',dynamicId:'" + dynamicId + "',areaText:'" + Auto517.p_emotion.utf16toEntities(content) + "'}"
	};
	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			var num=$$('#'+dynamicId).find('.discuss').find('span').html();
			num=parseInt(num)+1;
			$$('#'+dynamicId).find('.discuss').find('span').html(num);
			Auto517.UIChatbox._inputBar_closeBoard();
			Auto517.UIChatbox._inputBar_close();
			$$('.modal-overlay').remove();
			
		}
	});
	
}
	
	


//$$(document).on('click','.closeUIchatbox',function(){
//	Auto517.UIChatbox._inputBar_close();
//	$$("#nearbyRefresh").removeClass("closeUIchatbox");
//	$$(".discuss").addClass("openUIchatBox");
//	
//})

