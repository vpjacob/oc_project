//var _im_uichatbox_community = null;
var img_chuan = '';

myApp.onPageBack('communityInfoDetailed',function(){
	Auto517.UIChatbox._inputBar_closeBoard();
	Auto517.UIChatbox._inputBar_close();
});


myApp.onPageInit('communityInfoDetailed', function(page) {
	
	myApp.showIndicator();
	var communityId = page.query.communityId;
	var dynamicId = page.query.communityDyId;
	var fromPageType = page.query.fromPageType;
	//将表情文字转换为表情图片
	Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
				_im_emotionData = emotion;
	});
	
	$$('#community-detail-back').attr('href', 'html/community/communityInfoList.html?communityId=' + communityId+'&fromPageType='+fromPageType);

	$$('#community-share-person').data('dyDetailed', {
		id: dynamicId,
		communityId: communityId
	});

	var dyAllImgD = $$('#community-dy-all-img');
	var dyCominfo = $$('#community-dy-cominfo');
	
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityDynamicOne",
		form: "{communityId:'"+communityId+"',dynamicId:'"+dynamicId+"',uid:'"+uid+"',beginLat: "+user_lat+",beginLon:"+user_lon+"}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			var result = data.datasources[0].rows;
			var resultImg = data.datasources[1].rows;
			var resultDyC = data.datasources[3].rows;
			var resultDyZan = data.datasources[2].rows;
			var communityDy = result[0];
			var template ='';
			if(communityDy.dynamicess==0){
				template +='		<div class="userImage-1" style="margin-right:0px;padding-right:0px;">' 
				template +='		<img src="image/community/communityjing.png" style="width: 100%" />' 
				template +='		</div>' 
				$$('#community-detail-card').prepend(template);
			}
			
			$$('#communityDyTitleImg').attr('src', rootUrl + communityDy.userimg);
			$$('#community-dy-name').append(communityDy.username+'');
			if (communityDy.usergender == 1) {
				$$('#community-dy-mars').append('<i class="icon icon-mars community-mars-icon" style="color: white;"></i><span>&nbsp&nbsp' + communityDy.userage + '</span>');
			} else if (communityDy.usergender == 2) {
				$$('#community-dy-mars').append('<i class="icon icon-venus community-mars-icon" style="color: white;"></i>&nbsp&nbsp' + communityDy.userage );
			}
			$$('#community-dy-vip').attr('src', communityDy.levelimg);
			var creatTime = communityDy.beforemin;
			if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
				creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
			} else if (parseInt(creatTime) / 60 >= 24) {
				creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
			} else {
				creatTime = creatTime + '分钟前';
			}
			$$('#community-dy-min').append(creatTime);
			if(fromPageType == 'noJoin'){
				$$('#community-share-person').addClass('community-5');
			}else{
				$$('#community-share-person').addClass('community-2');
			}
			
			$$('#community-dy-con').append(Auto517.UIChatbox._im_transText(communityDy.dynamindes));
			$$('#community-dy-km').append(communityDy.distance + 'km');
			var arrImage = new Array(resultImg.length);
			var dyOneImgD = '<div class="swiper-slide">';
			if (resultImg.length > 0) {
				for (var i = 0; i < resultImg.length; i++) {
					var communityDyImg = resultImg[i];
					arrImage[i] = rootUrl + communityDyImg.dynamicimage;
					
					var img = new Image();
					// 改变图片的src  
					img.src = rootUrl + communityDyImg.dynamicimage;
					var cssKey = 'width';
					var classKey = 'dyImgPositionE';
//					if (img.width > img.height) {
//						cssKey = 'height';
//						classKey = 'dyImgPositionH';
//					}
//					if (img.width == img.height) {
//						classKey = 'dyImgPositionE';
//					}
					var winWidth = api.winWidth/4;
					dyOneImgD += '<div class="pb-standalone-dark dyImg" style="width: '+winWidth+';height:'+winWidth+';display: inline-block;margin-top: 5px;margin-right: 5px;">';
					dyOneImgD += '<img class="cache ' + classKey + '" src=\"' + rootUrl + communityDyImg.dynamicimage + '\"  width="'+winWidth+'px" height="'+winWidth+'px"  onclick = "communityDyShowImg(' + i + ');"></div>';
					if (resultImg.length > 8 && i % 8 == 7) {
						dyOneImgD += '</div><div class="swiper-slide">';
					}
				}
			}
			dyOneImgD += '</div>';
			dyAllImgD.append(dyOneImgD);
			
			communityDyShowImg = function(i){	
            Auto517.photoBrowser._photoBrowser_open(arrImage,i);
			}
			//赞
			var communityDyZanD = '';
			if(fromPageType != 'noJoin'){
				$$('#communityInfoDetailed .icon-thumbs-up-alt').show();
				$$('#communityInfoDetailed .icon-flickr').show();
				communityDyZanD = resultDyZan[0];
				if (typeof(communityDyZanD) == "undefined" || communityDyZanD.length <= 0 || communityDyZanD.userread ==null) {
					$$('#community-dy-read').append('1阅读');
					$$('#community-dy-zan').append('赞');
				} else {
					if (null != communityDyZanD.userzan && communityDyZanD.userzan.indexOf(uid) >= 0) {
						$$('#community-detail-zan i').removeClass('icon-thumbs-up-alt');
						$$('#community-detail-zan i').addClass('icon-thumbs-up');
					}
					if (communityDyZanD.allread == 0) {
						$$('#community-dy-read').append('1阅读');
					} else {
						$$('#community-dy-read').append(communityDyZanD.allread + '阅读');
					}
					$$('#community-dy-zan').append(communityDyZanD.allzan == 0?'赞':communityDyZanD.allzan+'');
				}
				$$('#community-dy-com').html(resultDyC.length);
			}else{
				$$('#communityInfoDetailed .icon-thumbs-up-alt').hide();
				$$('#communityInfoDetailed .icon-flickr').hide();
			}
			var communityDyComD = '';
			for (var i = 0; i < resultDyC.length; i++) {
				var communityDyCom = resultDyC[i];
				communityDyComD += '<li><div class="item-content">';
				communityDyComD += '<div class="item-media" style="position:absolute;top:0px;"><img src="' + rootUrl + communityDyCom.userimg + '" width="35" height="35"></div>';
				communityDyComD += '<div class="item-inner" style="margin-left:40px;"><div class="item-title-row">';
				communityDyComD += '<div class="item-title" style="font-weight: 300;font-size:14px">' + communityDyCom.username + '</div>';

				var creatTimeCom = communityDyCom.beforemin;
				if (parseInt(creatTimeCom) / 60 > 1 && parseInt(creatTimeCom) / 60 < 24) {
					creatTimeCom = Math.round(parseInt(creatTimeCom) / 60) + '小时前';
				} else if (parseInt(creatTimeCom) / 60 >= 24) {
					creatTimeCom = Math.round(parseInt(creatTimeCom) / (60 * 24)) + '天前';
				} else {
					creatTimeCom = creatTimeCom + '分钟前';
				}
				communityDyComD += '<div class="item-after" style="color: #DDDDDD;font-size:12px;">' + creatTimeCom + '</div>';
				communityDyComD += '</div>';
				var areaTextShow = Auto517.UIChatbox._im_transText(communityDyCom.dycontext);
				communityDyComD += '<div class="card-content" style="color: #c8c7cc;font-size:13px;min-height: 25px;line-height: 25px;">' + areaTextShow + '</div>';
				communityDyComD += '</div>';
				communityDyComD += '</div>';
				communityDyComD += '</li>';
			}
			dyCominfo.append(communityDyComD);
			myApp.hideIndicator();
		}
	});

	$$('#community-detail-zan').on('click', function() {
		getComZanNum(this, dynamicId, communityId, this.innerText);
	});
	
	$$(document).on('close','.community-2', function() {
		Auto517.UIChatbox._inputBar_show_hide("show");
	});
	
	communityDyTextSend = function(areaText){
		if (areaText.length > 0) {
			if(null != $$('#community-dy-list')){
//				if(null != chatBox){
//					chatBox.resignFirstResponder();
//				}
				var areaTextShow = Auto517.UIChatbox._im_transText(areaText);
				var communityDyComD = '';
				communityDyComD += '<li><div class="item-content">';
				communityDyComD += '<div class="item-media" style="position:absolute;top:0px;"><img src="' + rootUrl + uimg + '" width="34" height="34"></div>';
				communityDyComD += '<div class="item-inner" style="margin-left:40px;"><div class="item-title-row">';
				communityDyComD += '<div class="item-title" style="font-weight: 300;">' + uname + '</div>';
				communityDyComD += '<div class="item-after" style="color: #DDDDDD;font-size:10px;">1分钟前</div>';
				communityDyComD += '</div>';
				communityDyComD += '<div class="card-content" style="color: #c8c7cc;font-size:13px;min-height: 25px;line-height: 25px;">' + areaTextShow + '</div>';
				communityDyComD += '</div>';
				communityDyComD += '</div>';
				communityDyComD += '</li>';
				dyCominfo.append(communityDyComD);
				
				$$('#community-dy-area').val("");
				$$('#community-dy-list').scrollTo(0, $$('#community-dy-list')[0].scrollHeight + 44);
				var beforeCom = $$('#community-dy-com')[0].innerText;
				var comDyCom = parseInt(beforeCom) + parseInt(1);
				$$('#community-dy-com').html(comDyCom);
//				alert(comDyCom);
				var num = $$('#dy'+dynamicId).children('div').next('a').next('div').children('div').next('div').children('div').next('div').children('span').html();
//				$$('#dy'+dynamicId).children('div').next('a').next('div').children('div').next('div').children('div').next('div').children('span').html(comDyCom);
				var _data = {
					script: "managers.om.community.appcommunity",
					needTrascation: true,
					funName: "saveCommunityComArea",
					form: "{communityId:'"+communityId+"',dynamicId:'"+dynamicId+"',uid:'"+uid+"',areaText:'"+Auto517.p_emotion.utf16toEntities(areaText)+"'}"
			
				};
				
				$$.ajax({
					url: rootUrl + "/api/execscript",
					dataType: 'json',
					data:_data,
					type: 'post',
					success: function(data) {
						$$('#dy'+dynamicId).children('div').next('a').next('div').children('div').next('div').children('div').next('div').children('span').html(comDyCom);
//						getCommunityDyList('0',communityId,'');
					}
				});
				
//				$$.ajax({
//					url: server_address + 'index.php/community/Community_ajax/saveCommunityComArea',
//					dataType: 'json',
//					data: {
//						communityId: communityId,
//						dynamicId: dynamicId,
//						uid: uid,
//						areaText: areaText
//					},
//					type: 'post',
//					success: function(data) {
//						getCommunityDyList('0',communityId,'');
//					}
//				});
			}
		}			
	}

	var mySwiper = new Swiper('#communityInfoDetailed .swiper-container', {
//			pagination: '.swiper-pagination',
			speed: 400,
			spaceBetween: 100
		});

	Auto517.UIChatbox._uichatbox_open(function(content) {
		Auto517.UIChatbox._inputBar_closeBoard();
		Auto517.UIChatbox._im_transText(content);
		communityDyTextSend(content);
	});
	Auto517.UIChatbox._inputBar_move($$("#communityInfoDetailed"),$$("#community-dy-list").height(),"ohmy");
	
});



myApp.onPageBeforeInit('communityInfoDetailed', function(page) {
	var communityId = page.query.communityId;
	var dynamicId = page.query.communityDyId;
	
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "saveCommunityComRead",
		form: "{communityId: '"+communityId+"',dynimId: '"+dynamicId+"',read: 1,uid: '"+uid+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
		}
	});
});

myApp.onPageInit('communityInfoDynamic', function(page) {
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getUserInfo",
		form: "{userID: '"+uid+"'}"
	};
	$$.ajax({
		url: rootUrl + "/api/execscript",
		data: _data,
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			user_age = data.datasources[0].rows[0].userage;
			user_gender = data.datasources[0].rows[0].usergender;
			user_level = data.datasources[0].rows[0].userlevel;
			user_name = data.datasources[0].rows[0].username;
			user_image = data.datasources[0].rows[0].userimage;
			user_level_image = data.datasources[0].rows[0].userlevelimage;
		}
	});
	
	api.addEventListener({
    		name:'delPicCommunity'
		},function(ret){
		    if(ret && ret.value&&$$('textarea[name="communityReleaseDyArea"]').val().length==0&&$$('.tool').find('div .phone').length-1==0){
				$$('#communityReleaseDyB').show();
				$$('#communityReleaseDyA').hide();
		    }else{
		    	$$('#communityReleaseDyA').show();
				$$('#communityReleaseDyB').hide();
		    }
	});
	
	uiMediaScanner = api.require('UIMediaScanner');
	var user_location = user_lon + ',' + user_lat;
	var communityId = page.query.communityId;
	if (null != user_address && user_address.length > 0) {
		myApp.smartSelectAddOption('#communityOpenAddress select', '<option value="' + user_address + '">' + user_address + '<input type="hidden" name="addressDyLat" value="' + user_location + '" /></option>');
	}

	$$(document).on('keyup keydown change', 'input[type="search"]', function(e) {
		if (e.keyCode == 13) {
			$$('select[name="address"]').html('');
			var searchItem = $$('input[type="search"]').val();
			$$('input[type="search"]').blur();
			Auto517.bMap._bmap_getNearByLat(user_lon,user_lat,searchItem, function(ret) {
				for (var i = 0; i < ret.results.length; i++) {
					var addressDy = ret.results[i];
					var addressDyLon = addressDy.lon + ',' + addressDy.lat;
					myApp.smartSelectAddOption('#communityOpenAddress select', '<option value="' + addressDy.name + '">' + addressDy.name + '<input type="hidden" name="addressDyLat" value="' + addressDyLon + '" /></option>');
				}
			});
		}
	});

	$$('.phone').on('click', function() {
		var imgLength = $$('#communityReleaseDy .tool').children('.phone').length-1;
		if(imgLength==6){
			toast.show("您已上传六张图片，不能继续上传了");
			return
		};
		var buttons1 = [{
				text: '<span style="color:#0FAAE3">拍照</span>',
				onClick: function() {
					api.getPicture({
						sourceType: 'camera',
						encodingType: 'jpg',
						mediaValue: 'pic',
						destinationType: 'url',
						allowEdit: false,
						quality: 50,
//						targetWidth: 400,
//						targetHeight: 150,
						saveToPhotoAlbum: true
					}, function(ret, err) {
						if (ret) {
							// 拍照返回的本地路径
							var returnUrl = ret.data;
							// 图片压缩
							imgCompress(returnUrl, 0.5, 0.5, getExt(returnUrl), function(compressImg) {
								var showImgHtml = '<div class="phone"><img src="' + compressImg + '"/></div>';
								// 追加图片
								$$('#communityReleaseDy .tool').prepend(showImgHtml);
								addPressCommunity($$(".phone img[src='" + compressImg + "']").parent('div'), $$('.tool'));
								$$('#communityReleaseDyA').show();
								$$('#communityReleaseDyB').hide();
							});
						}
					});
				}
			}, {
				text: '<span style="color:#0FAAE3">从手机相册选择</span>',
				onClick: function() {
					uiMediaScanner.open({
							type: 'picture',
							column: 4,
							classify: true,
							max: 6,
							sort: {
								key: 'time',
								order: 'desc'
							},
							texts: {
								stateText: '已选*项',
								cancelText: '取消',
								finishText: '完成'
							},
							styles: {
								bg: '#fff',
								mark: {
									icon: '',
									position: 'bottom_left',
									size: 20
								},
								nav: {
									bg: '#0FAAE3',
									stateColor: '#fff',
									stateSize: 18,
									cancelBg: 'rgba(0,0,0,0)',
									cancelColor: '#fff',
									cancelSize: 18,
									finishBg: 'rgba(0,0,0,0)',
									finishColor: '#fff',
									finishSize: 18
								}
							}
						},
						function(ret) {
							if (ret) {
								if(ret.eventType=='cancel'){
									return
								}
								if(imgLength+ret.list.length>6){
									toast.show("您已上传了"+imgLength+"张图片，最多只能再传6张图片");
									return
								}
								for (var i = 0; i < ret.list.length; i++) {
									var selectImg = ret.list[i];
									// 获取图片的路径
									var selectimgPath = selectImg.path;
									var selectimgThumbPath = selectImg.thumbPath;
									// IOS需要将虚拟路径转换为本地路径才可以压缩
									if (isIOS) {
										// 转换为真实路径
										uiMediaScanner.transPath({
											path: selectimgPath
										}, function(transObj) {
											// 图片压缩
											imgCompress(transObj.path, 0.5, 0.5, selectImg.suffix, function(compressImg) {
												$$('#communityReleaseDy .tool').prepend('<div class="phone"><img src="' + compressImg + '" /></div>');
												addPressCommunity($$("img[src='" + compressImg + "']").parent('div'), $$('.tool'));
												$$('#communityReleaseDyA').show();
												$$('#communityReleaseDyB').hide();
											});
										});
									} else {
										// 图片压缩
										imgCompress(selectimgPath, 0.5, 0.5, selectImg.suffix, function(compressImg) {
											// 追加图片
											$$('#communityReleaseDy .tool').prepend('<div class="phone"><img src="' + compressImg + '" /></div>');
											addPressCommunity($$("img[src='" + compressImg + "']").parent('div'), $$('.tool'));
											$$('#communityReleaseDyA').show();
											$$('#communityReleaseDyB').hide();
										});
									}

								}
							}
						});

				}
			}

		];
		var buttons2 = [{
			text: '<span style="color:#0FAAE3;font-weight: 500;">取消</span>',
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	});


	$$('#communityReleaseDyA').on('click', function() {
		myApp.showIndicator();
		var communityReleaseDyArea = '';
		communityReleaseDyArea = $$('textarea[name="communityReleaseDyArea"]').val();
		var communityReleaseDyAddress = '';
		communityReleaseDyAddress = $$('#communityOpenAddress select').val();
		var communityReleaseDyAddress1 = $$('#communityOpenAddress select input[name="addressDyLat"]').val();
		var user_lon_dy = 0;
		var user_lat_dy = 0;

		if (communityReleaseDyAddress1 != null && communityReleaseDyAddress1.length > 0 && communityReleaseDyAddress1.indexOf(',') >= 0) {
			user_lon_dy = communityReleaseDyAddress1.split(',')[0];
			user_lat_dy = communityReleaseDyAddress1.split(',')[1];
		}

		//上传图片
		var phone = $$('.phone');
		var phones = '';
		var upLoadPhones = new Array;
		var newPhones = '';
		var oldPhones = '';
		//判断是否有图片或者内容
		if (communityReleaseDyArea.length <= 0 && 'undefined' == typeof($$('.phone').find('img').attr('src'))) {
			myApp.hideIndicator();
			myApp.alert('请填写动态内容！', '哦脉提示');
			return false;
		}
		var communityReleaseDyAreaL = communityReleaseDyArea.replace(/[^\x00-\xff]/g, "0101").length;
		if (communityReleaseDyAreaL >= 2048) {
			myApp.hideIndicator();
			myApp.alert('动态内容过长，请重新填写！', '哦脉提示');
			return false;
		}
		
		//图片上传
		$$.each(phone, function(key, value) {
			if ($$(value).find('img').attr('src')) {
				var imgPath = $$(value).find('img').attr('src');
				newPhones += imgPath + ',';
					uploadimage($$(value).find('img').attr('src'),function(path){
						oldPhones += path;
					});
           }
			});
		  
		newPhones = newPhones.substring(0,newPhones.length-1);
		//在动态列表上先显示
		var myDate = new Date();
		var month; 
		var today;
		if((myDate.getMonth()+1).length==1){
			month='0'+(myDate.getMonth()+1);
		}
		if((myDate.getDate()).length==1){
			today='0'+myDate.getDate();
		}
		var createtime = month +'-'+today;
		var comDyJsonStr = '{"createtime":"'+createtime+'","communityId":"'+communityId+'","dynamicContent":"'+communityReleaseDyArea+'","dynamicLon":"'+user_lon_dy+'","dynamicLat":"'+user_lat_dy+'","newPhones":"'+newPhones+'"}';
		
		reloadCommunityDyByNewDy(comDyJsonStr,communityId);
		myApp.hideIndicator();
		mainView.router.back();
		
		//保存动态
		
		//发布动态
		
		setTimeout(function(){
			var _data = {
			script: "managers.om.community.appcommunity",
			needTrascation: true,
			funName: "saveCommunityDynamic",
			form: "{communityId: '"+communityId+"',dynamicContent: '"+Auto517.p_emotion.utf16toEntities(communityReleaseDyArea)+"',dynamicPerson: '"+uid+"',dynamicAddress: '"+communityReleaseDyAddress+"',dynamicLon: '"+user_lon_dy+"',dynamicLat:'"+user_lat_dy+"',phones:'"+oldPhones+"'}"
	    };
		
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			method: 'post',
			data: _data,
			success: function(data) {
				getCommunityDyList('0',communityId,'');
			}
		});
		},2000);
			
//		}
	});

	$$('textarea[name="communityReleaseDyArea"]').on('input', function() {		
		if ($$(this).val().length > 0) {
			$$('#communityReleaseDyA').show();
			$$('#communityReleaseDyB').hide();
		} else {
			if($$('.tool').find('div .phone').length-1>0){
				$$('#communityReleaseDyA').show();
				$$('#communityReleaseDyB').hide();
			}else{
				$$('#communityReleaseDyB').show();
				$$('#communityReleaseDyA').hide();	
			}
		}
	});
	
	api.addEventListener({
        name:'addComEmotion'
    },function(ret){
        if(ret && ret.value){
            $$('#communityReleaseDyA').show();
			$$('#communityReleaseDyB').hide();
        }
    });
	
});

function addPressCommunity(obj, objTool, index) {
	// 获取目前长按的对象
	var hammertime = new Hammer(obj[0]);
	// 绑定长按对象
	hammertime.on("press", function(e) {
		api.confirm({
			title: '温馨提示',
			msg: '您确定要删除该图片吗？',
			buttons: ['确定', '取消']
		}, function(ret, err) {
			if (ret.buttonIndex == 1) {
				// 移除自己
				$$(obj).remove();
				api.toast({
					msg: '删除成功！'
				});
				//发送个事件
		        api.sendEvent({
		            name: 'delPicCommunity',
		            extra:{fileName:'waiting'}
		        });
			}
		});
	});
}

myApp.onPageBack('communityInfoAccusation', function(page) {
	window.Auto517.UIChatbox._inputBar_show_hide("show");
});



function uploadimage(value,callback){
	var path;
		api.ajax({
		url: rootUrl + '/api/uploadForOM',
		method: 'post',
		data: {
			files: {
				file: value
			}
		}
	}, function(ret, err) {
		if (ret.execStatus == 'true') {
			path= ret.formDataset.saveName + ',';
			callback(path);
		}
	});
	
}

