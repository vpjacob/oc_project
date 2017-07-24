myApp.onPageInit('communityInfo', function(page) {
	myApp.showIndicator();
	var type = page.query.type;
	var communityId = page.query.communityId;
	var communityName = '';
	var counselId = '';
	var conversationtype = '';
    var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityInfo",
		form: "{communityId: '"+communityId+"',uid:'"+uid+"'}"
	};
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data:_data,
		type: 'post',
		success: function(data) {
			var result = data.datasources[0].rows;
			var resultPerson = data.datasources[2].rows;
			var resultKey = data.datasources[3].rows;
			var resultDy = data.datasources[1].rows;
			var resultRong = data.datasources[4].rows;
			conversationtype = resultRong[0].c_coversationtype;
		    counselId = resultRong[0].c_id;
			var joinBool = false;
			for (var i = 0; i < result.length; i++) {
				var communityInfo = result[i];
				communityName = communityInfo.communityname;
				$$('#community-info-center-title').append(communityInfo.communityname + '圈子');
				$$('#community-info-image').attr('src', rootUrl + communityInfo.communityimage);
				$$('#community-info-title').append(communityInfo.communityname);
				$$('#community-info-person').append(communityInfo.personnums + '人');
				$$('#community-info-code').append(communityInfo.communitycode);
				$$('#community-info-introduce').append(communityInfo.communityintroduce);
				$$('#community-info-vip').attr('src', communityInfo.levelimage);
				$$('#community-info-level').append(communityInfo.leveldes);
				$$('#community-info-createtime').append(communityInfo.createtime);
				$$('#community-info-mainIm').attr('src', rootUrl + communityInfo.userimage);
				$$('#community-info-mainName').append(communityInfo.username);
				$$('#community-info-card').append(communityInfo.communitycard);
				$$('#community-info-pnum').append(communityInfo.personnums+'');
				$$('#community-dy-link').attr('href', 'html/community/communityInfoList.html?communityId=' + communityId + '&fromPageType=noJoin'+'&conversationtype='+conversationtype+'&counselId='+counselId+'&communityname='+communityName);
				
				if(communityInfo.powertype == 2 || type == 1){
					$$('#community-dyli-link').hide();
				}else{
					var communityDyC = '';
					$$('#community-dyli-link').show();
					$$('#community-info-dnum').append(communityInfo.dynums==null?0+'':communityInfo.dynums+'');
					for(var j = 0 ; j < resultDy.length ; j++){
						var communityInfoDy = resultDy[j];
						if(communityInfoDy.dyimg != null){
							communityDyC = '<div class="item-title"><img style="width: 40px;height: 40px;" src="'+rootUrl+communityInfoDy.dyimg+'"/></div>';
						}
						if(communityInfoDy.dycontent != null){
							if(communityInfoDy.dyimg != null){
								communityDyC +='<div class="item-text" style="color:#333333;float: left;width: calc(100% - 40px);">'+communityInfoDy.dycontent+'</div>';
							}else{
								communityDyC +='<div class="item-text" style="color:#333333;float: left;width: 100%">'+communityInfoDy.dycontent+'</div>';
							}
							
						}
					}
					
					$$('#community-info-dImg').append(communityDyC);
				}
				
				$$('#community-members-link').attr('href', 'html/community/communityMembers.html?communityId=' + communityInfo.communityid + '&orderByNum=0&pagetype=1');
			    var communityPersonIm = '';
				for (var j = 0; j < 5; j++) {
					if (j < resultPerson.length) {
						var communityPerson = resultPerson[j];
						communityPersonIm += '<img src="'+rootUrl+communityPerson.userimage+'" style="width: 40px;height: 40px;"/>';
						if (communityPerson.persontypeid == 0 && communityPerson.userid == '2') {
							joinBool = true;
						}

					} else {
						communityPersonIm += '<div class="item-after" style="width: 13%;"></div>';
					}
				}

				$$('#community-info-pImg').append(communityPersonIm);
				var communityKeydiv = '';
				for (var j = 0; j < resultKey.length; j++) {
					var communityKeyword = resultKey[j];
					communityKeydiv += '<div class="col-auto tag-info-three">' + communityKeyword.keyword + '</div>';
				}
				$$('#community-info-keyword').append(communityKeydiv);
				$$('#community-info-accusa').attr('href', 'html/community/communityInfoAccusation.html?communityId=' + communityInfo.communityid);
				$$('#community-info-join-new').attr('href', 'html/community/communityJoinMember.html?communityId=' + communityInfo.communityid);
			}
			if (joinBool) {
				$$('#community-info-join-li').show();
			} else {
				$$('#community-info-join-li').hide();
			}
			myApp.hideIndicator();
		},
		error: function(e) {
			//alert(e.responseText);
		}
	});
	if (type == 1) {
		//$$('#joinOneCommunity').attr('href', 'html/message/messageGroup.html?communityId=' + communityId + '&communityName="'+ communityName +'"');
		$$('#joinOneCommunity').show();
		$$('#joinOtherCommunity').hide();
		$$('#communityInfo-back').attr('data-force', 'true');
		$$('#communityInfo-back').attr('href', 'html/community/communityInfoList.html?communityId=' + communityId + '&fromPageType=join'+'&conversationtype='+conversationtype+'&counselId='+counselId+'&communityname='+communityName);
	} else if (type == 2) {
		$$('#joinOneCommunity').attr('href', '#');
		$$('#joinOtherCommunity').show();
		$$('#joinOtherCommunity').data('community', {
			communityId: communityId,
			communityName: communityName
		});
		$$('#joinOneCommunity').hide();
		$$('#communityInfo-back').removeAttr('data-force');
		$$('#communityInfo-back').attr('href', '#');
	} else {
		//$$('#joinOneCommunity').attr('href', 'html/message/messageGroup.html?communityId=' + communityId + '&communityName="'+ communityName +'"');
		$$('#joinOneCommunity').show();
		$$('#joinOtherCommunity').hide();
		$$('#communityInfo-back').attr('data-force', 'true');
		$$('#communityInfo-back').attr('href', 'html/community/communityInfoList.html?communityId=' + communityId + '&fromPageType=join'+'&conversationtype='+conversationtype+'&counselId='+counselId+'&communityname='+communityName);
	}
	
	$$('#joinOneCommunity').on('click', function(){
//		Auto517.RongCloud.joinGroup(communityId,communityName);
		imgroupchat(communityId,communityName,counselId,conversationtype);
	});
	
});

$$(document).on('click', '#joinOtherCommunity', function() {
	var communityId = $$('#joinOtherCommunity').data('community').communityId;
	mainView.router.loadPage('html/community/communityJoinSubmit.html?communityId='+communityId);
});


$$(document).on('touchstart', '#picker-community-search-id', function() {
	myApp.pickerModal('.picker-community-search')
});
//$$(document).on('click','#mailist',function(){
//		$$('.toolbar').show();
//		$$(document).on('click', '#chaxun', function() {
//		//	myApp.pickerModal('.picker-community-search')
//		$$('.toolbar').hide();
//		return;
//		});
//})


//
//$$(document).on('touchstart', '#chaxun', function() {
////	myApp.pickerModal('.picker-community-search')
// $$('.toolbar').css('display','none');
//});

myApp.onPageInit('list_community', function(page) {
	var mySearchbar = myApp.searchbar('.searchbar', {
		searchList: '.list-block-search',
		searchIn: '.item-title'
	});
	
	if(typeof(api) != 'undefined' && api != null){
		var cacheDir = api.cacheDir;
	    api.readFile({
	        path: cacheDir+'/om/community/community1.json',
	    }, function(ret, err){
	        if(ret.status){
	            //如果成功，说明有本地存储，读取时转换下数据格式
	            var jsonData = JSON.parse(ret.data);
	            initCommunitylList(jsonData,0);
	        }else{
	            //如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
	            getCommunitylList('0');
	        }
	    });
	    setTimeout(function(){
	    		if(page.query.reloadCommunityPage == 1){
	    			getCommunitylList('0');
	    		}
	    },1000);
	}else{
		setTimeout(function(){
	    		getCommunitylList('0');
	    },1000);
	}
	
    

	$$('#im-communityid').on('keyup keydown change', function(e) {
		if (e.keyCode == 13) {
			myApp.showIndicator();
			var searchItem = $$('#im-communityid').val();
			myApp.closeModal('.picker-community-search');
			$$('#im-communityid').blur();
			mainView.router.loadPage('html/community/communitySearchList.html?searchItem=' + searchItem);
		}
	});
	// 下拉刷新页面
	var ptrContent = $$('#community-main-list-one');
	// 添加'refresh'监听器
	ptrContent.on('refresh', function (e) {
	    // 模拟1s的加载过程
	    setTimeout(function () {
	        getCommunitylList('0');
	        // 加载完毕需要重置
	        myApp.pullToRefreshDone();
	    }, 2000);
	});
	
	
});



myApp.onPageInit('communitySearchList', function(page) {
	var searchItem = page.query.searchItem;
	$$('#community-search-center-title').append('搜索'+'"'+searchItem+'"');
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityListBySearchItem",
		form: "{ownerId:'"+uid+"',itemsPerLoad:1000,lastIndex:0,searchItem:'"+searchItem+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data:_data,
		type: 'post',
		success: function(data) {
			// 生成新条目的HTML
			var community_template = "";
			var result = data.datasources[0].rows;
			for (var i = 0; i < result.length; i++) {
				var communityBySearchItem = result[i];
				community_template += '<li>';
				community_template += '<div class="item-link item-content">';
				community_template += '<div class="item-media"><img class="community-image" src=\"' + rootUrl + communityBySearchItem.communityimage + '\"></div>';
				community_template += '<div class="item-inner">';
				community_template += '<div class="item-title-row" style="background-image:none;display:inline;">';
				community_template += '<div class="item-title title-community-style" style="font-weight: 300;max-width: 90px;">' + communityBySearchItem.communityname + '</div>';
				community_template += '	<div class="col-100 tablet-50 tag-info-one" style="background-color: #FF9500;color: #FFFFFF;">' + communityBySearchItem.communitytype + '</div>';
				community_template += '<div class="col-100 tablet-50 tag-info-two" style="background-color: #FF2D55;color: #FFFFFF;">' + communityBySearchItem.powertype + '</div>';
				community_template += '</div>';
				community_template += '<div class="buttons-row community-button-synopsis">';
				community_template += '<a href="html/community/communityInfo.html?type=2&communityId=' + communityBySearchItem.communityid + '\" class="button item-link" style="background: rgb(15, 170, 227);color: white;padding-left: 1px;padding-right: 1px;">圈简介</a>';
				community_template += '</div>   ';
				community_template += '<div class="item-text" style="height: 30px;font-size:12px;">';
				community_template += '<i class="icon icon-group"></i>&nbsp;<span style="color: #8e8e93;">' + communityBySearchItem.personnums + '&nbsp&nbsp</span>';
				community_template += '<i class="icon icon-time"></i>&nbsp;<span style="color: #8e8e93;">' + communityBySearchItem.createtime + '</span>';
				community_template += '</div>';
				community_template += '<div class="item-subtitle" style="margin-top: 4px;">';
				community_template += '<div class="row no-gutter" style="margin-top: 10px;width: 7em;display: inline;">';
				if(communityBySearchItem.keyword.length > 0){
					var keywords = '';
					if (communityBySearchItem.keyword.indexOf(',') > 0) {
						keywords = communityBySearchItem.keyword.split(",");
						for (var j = 0; j < keywords.length; j++) {
							var keyword = keywords[j];
							if (searchItem!= '' && searchItem.length > 0) {
								if (keyword.indexOf(searchItem) >= 0) {
									community_template += '<div class="keyword-search" style="font-size: 0.9em;"><span>' + keyword + '</span></div>';
								} else {
									community_template += '<div class="keyword" style="font-size: 0.9em;"><span>' + keyword + '</span></div>';
								}
							} else {
								community_template += '<div class="keyword-search" style="font-size: 0.9em;"><span>' + keyword + '</span></div>';
							}
						}
					}else{
						keywords = communityBySearchItem.keyword;
						if (searchItem!= '' && searchItem.length > 0) {
							if (keywords.indexOf(searchItem) >= 0) {
								community_template += '<div class="keyword-search" style="font-size: 0.9em;"><span>' + keywords + '</span></div>';
							} else {
								community_template += '<div class="keyword" style="font-size: 0.9em;"><span>' + keywords + '</span></div>';
							}
						} else {
							community_template += '<div class="keyword-search" style="font-size: 0.9em;"><span>' + keywords + '</span></div>';
						}
					}
				}else {
					community_template += '<div class="keyword" style="font-size: 0.9em;"><span>' + communityBySearchItem.keyword + '</span></div>';
				}
				community_template += '</div>';
				community_template += '</div>';
				community_template += '</div>';
				community_template += '</div>';
				community_template += '</li>';
			}
			// 添加新条目
			$$('#communitySearchList-ul').append(community_template);
			myApp.hideIndicator();
		}
	})
});

$$('.form-community-json').on('click', function() {
	var formData = myApp.formToJSON('#my-communityForm');
});

function imgroupchat(communityId,communityName,counselId,conversationtype) {
	mainView.router.loadPage('html/service/servicechat.html?counselId=' + counselId + '&conversationtype='+conversationtype+'&name='+ communityName+'&targetId='+communityId);
}

myApp.onPageInit('communityInfoList', function(page) {
	
	var communityId = page.query.communityId;
	var fromPageType = page.query.fromPageType;
	var counselId = page.query.counselId;
	var conversationtype = page.query.conversationtype;
	var communityDyList = $$('#community-card-one');
	var communityName =page.query.communityname;
	
	var fs = api.require('fs');
	
	if(fromPageType == 'noJoin'){
		$$('#communityInfoList-back').removeAttr('data-force');
		$$('#communityInfoList-back').attr('href','#');
		$$('#communityInfoList .icon-bars-one').hide();
	}else{
		$$('#communityInfoList .icon-bars-one').show();
	}
	
	if(typeof(api) != 'undefined'){
	    api.readFile({
	        path: api.cacheDir+'/om/communityDy/communityDy'+communityId+'.json',
	    }, function(ret, err){
	        if(ret.status){
	            //如果成功，说明有本地存储，读取时转换下数据格式
	            var jsonData = JSON.parse(ret.data);
	            initCommunityDyOne(jsonData,0,communityId);

	        }else{
	            //如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
	            getCommunityForDy('0',communityId);
	        }
	    });
	    api.readFile({
	        path: api.cacheDir+'/om/communityDyAll/communityDyAll'+communityId+'.json',
	    }, function(ret, err){
	        if(ret.status){
	            //如果成功，说明有本地存储，读取时转换下数据格式
	            var jsonData = JSON.parse(ret.data);
	            initCommunityDyList(jsonData,0,communityId,fromPageType);
	        }else{
				//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
	            getCommunityDyList('0',communityId,'',fromPageType);
	        }
	    });
    }else{
    		getCommunityForDy('0',communityId);
    		getCommunityDyList('0',communityId,'',fromPageType);
    }
//  setTimeout(function(){
//  			getCommunityForDy('0',communityId);
//  			getCommunityDyList('0',communityId,'');
//  },2000);
	
	//cuikai
	$$('#im-group-chat').attr('onclick', 'imgroupchat(' + communityId + ','+ communityName +','+counselId+','+conversationtype+');');
	$$('#popover-community-info').attr('href', 'html/community/communityInfo.html?communityId=' + communityId + '&type=1');
	$$('#popover-community-dynamic').attr('href', 'html/community/communityInfoDynamic.html?communityId=' + communityId);
	
	if(fromPageType != 'noJoin'){
		$$('.community-3').on('click', function() {
			var buttons1 = [{
				text: '<span style="color:rgb(15, 170, 227)">更换相册封面</span>',
				onClick: function() {
					api.getPicture({
						sourceType: 'library',
						encodingType: 'jpg',
						mediaValue: 'pic',
						destinationType: 'base64',
						allowEdit: true,
						quality: 50,
						saveToPhotoAlbum: false
					}, function(ret, err) {
						if (ret && ret.data.length > 0) {
							var imageUrl = ret.data;
							var imageUrlBase64 = ret.base64Data;
							$$('#communityInfo-image-bg').attr('style', 'background-image:url(' + imageUrl + ')');
							
							var cacheDir = api.cacheDir;
							
								fs.remove({
								    path: cacheDir+'/communityDy/communityDy'+communityId+'.json'
								},function(ret,err){
								    if (ret.status) {
								    		
								    } 
								});
							
							api.ajax({
									url : rootUrl + '/api/upload',
									method : 'post',
									data : {files : {file : imageUrl}}
								}, function(ret, err) {
								if (ret.execStatus == 'true') {
								imageUrlBase64 = ret.formDataset.saveName;
								
								var _data = {
									script: "managers.om.community.appcommunity",
									needTrascation: true,
									funName: "updateCommunityImage",
									form: "{communityId: '"+communityId+"',photoImg: '"+imageUrlBase64+"'}"
							    };
							    $$.ajax({
										url: rootUrl + "/api/execscript",
										dataType: 'json',
										data: _data,
										type: 'post',
										success: function(data) {
											getCommunitylList('0');
										}
							    })
						         } else {
										api.alert({
											msg : '上传图片失败,请您从新上传'
										});
									}
								});
							
							
						} 
					});
				}
			}];
			var buttons2 = [{
				text: '<span style="color:rgb(15, 170, 227)">取消</span>'
			}];
			var groups = [buttons1, buttons2];
			myApp.actions(groups);
		});
	}
	
	// 下拉刷新页面
	var ptrContent = $$('#community-card-one');
	// 添加'refresh'监听器
	ptrContent.on('refresh', function (e) {
	    // 模拟1s的加载过程
	    setTimeout(function () {
	        getCommunityForDy('1',communityId);
    			getCommunityDyList('1',communityId,'');
    			//加载前一个页面
    			getCommunitylList('0');
	        // 加载完毕需要重置
	        myApp.pullToRefreshDone();
	    }, 2000);
	});
	// 加载flag
	var loading = false;
	// 注册'infinite'事件处理函数
	$$('#community-card-one').on('infinite', function () {
	  // 如果正在加载，则退出
	  if (loading) return;
	  // 设置flag
	  loading = true;
	  // 模拟1s的加载过程
	  setTimeout(function () {
	    // 重置加载flag
	    var dynamicOldestId = $$('#community-card-two').attr('data-dynamicOldestId'); 
	   	getCommunityDyList('2',communityId,dynamicOldestId);
	   	//加载前一个页面
	   	getCommunitylList('0');
	   	loading = false;
	  }, 2000);
	});
	$$('#popover-community-message').data('communityId',communityId);
	$$('#popover-community-message').data('communityName',communityName);
	$$('#popover-community-message').data('counselId',counselId);
	$$('#popover-community-message').data('conversationtype',conversationtype);
});

$$(document).on('click', '#popover-community-message',function(){
		communityName = $$('input[name="communityNameHide"]').val();
		var communityId = $$('#popover-community-message').data('communityId');
		var communityName = $$('#popover-community-message').data('communityName');
		var counselId = $$('#popover-community-message').data('counselId');
		var conversationtype = $$('#popover-community-message').data('conversationtype');
//		Auto517.RongCloud.joinGroup(communityId,communityName);
		imgroupchat(communityId,communityName,counselId,conversationtype);
	});

$$(document).on('click', '.community-2', function() {
	var type=0;
	var dynamicId = '';
	var communityId = '';
	var objectCommunityDy = '';
	var objectCommunityImg = '';
	var dynamic_content = '';
	var phones = '';
	var powerValue=0;
	var place ='';
	var user_lat='';
	var user_lon='';
	var num=rootUrl.length;
	Auto517.UIChatbox._inputBar_show_hide("hide");
	if ($$(this).data('pagetype') == 'communityList') {
		dynamicId = $$(this).data('id');
		communityId = $$(this).data('communityId');
		objectCommunityDy = $$('#dy' + dynamicId);
		objectCommunityImg = objectCommunityDy.find('.pb-standalone-dark');
		dynamic_content = objectCommunityDy.find('.card-content-inner p').text();
		//图片上传
		$$.each(objectCommunityImg, function(key, value) {
			if ($$(value).find('img').attr('src')) {
				var imgPath1 = $$(value).find('img').attr('src');
				imgPath=imgPath1.substring(num);
//				imgPath = 'img/community' + imgPath.substring(imgPath.lastIndexOf('/'));
				phones += imgPath + ',';
			}
		});
//		phones = phones.substring(0, phones.length - 1).trim();
	} else if ($$(this).data('pagetype') == 'detailed') {
		var dyDetailed = $$(this).data('dyDetailed');
		dynamicId = dyDetailed.id;
		communityId = dyDetailed.communityId;
		objectCommunityDy = $$('#community-dy-all-img');
//		objectCommunityImg = objectCommunityDy.find('.user_inf_view_imageView');
		objectCommunityImg = objectCommunityDy.find('.pb-standalone-dark');
		dynamic_content = $$('#community-dy-con').text();
		//图片上传
		$$.each(objectCommunityImg, function(key, value) {
			if ($$(value).find('img').attr('src')){
				var imgPath1 = $$(value).find('img').attr('src');
				imgPath=imgPath1.substring(num);
//				imgPath = 'img/community' + imgPath.substring(imgPath.lastIndexOf('/'));
				phones += imgPath + ',';
			}
		});
//		phones = phones.substring(0, phones.length - 1).trim();
	}

	var buttons1 = [{
		text: '<span style="color:#0EAAE3">分享到个人动态</span>',
		onClick: function() {
			var _data = {
				script: "managers.om.nearby.nearby",
				needTrascation: true,
				funName: "saveDynamicInfo",
				form: "{uid: '"+uid+"',c_community_id: '"+communityId+"',dynamicContent: '"+dynamic_content+"',place: '"+place+"',powerValue: '"+powerValue+"',user_lat: '"+user_lat+"',user_lon: '"+user_lon+"',phones: '"+phones+"'}"
			};
			
			$$.ajax({
				url: rootUrl + "/api/execscript",
				dataType: 'json',
				method: 'post',
				data: _data,
				success: function(data) {
					if (data.execStatus == 'true') {
						myApp.alert('分享成功', '哦脉提示');
						Auto517.UIChatbox._inputBar_show_hide("show");
					}
				},
				error: function(data) {
					Auto517.UIChatbox._inputBar_show_hide("show");
					myApp.alert('请求错误，请重试！', '哦脉提示');
				}
			});
		}
	    },{
			text : '<span style="color:#0EAAE3">收藏</span>',
			onClick : function() {
				Auto517.UIChatbox._inputBar_show_hide("show");
				shoucang(uid,dynamicId,type);
			}
		},{
		text: '<span style="color:#0EAAE3">举报</span>',
		onClick: function() {
			Auto517.UIChatbox._inputBar_show_hide("hide");
			mainView.router.loadPage('html/community/communityCircleNewsAcc.html?dynamicId=' + dynamicId+'&communityId='+communityId);
		}
	}];
	var buttons2 = [{
		text: '<span style="color:#0EAAE3">取消</span>',
		onClick: function() {
			Auto517.UIChatbox._inputBar_show_hide("show");
		}
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});

$$(document).on('click', '.community-5', function() {
	var dynamicId = '';
	var communityId = '';
	
	dynamicId = $$(this).data('id');
	communityId = $$(this).data('communityId');
	
	var buttons1 = [{
		text: '<span style="color:rgb(15, 170, 227)">举报</span>',
		onClick: function() {
			Auto517.UIChatbox._inputBar_show_hide("hide");
			mainView.router.loadPage('html/community/communityInfoAccusation.html?dynamicId=' + dynamicId+'&communityId='+communityId);
		}
	}];
	var buttons2 = [{
		text: '<span style="color:rgb(15, 170, 227)">取消</span>',
		onClick: function() {
			Auto517.UIChatbox._inputBar_show_hide("show");
		}
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});



	$$(document).on('close','.actions-modal.modal-in', function() {
		Auto517.UIChatbox._inputBar_show_hide("show");
	});

function getComZanNum(comDiv, dynimId, comId) {
	myApp.showIndicator();
	var classStyle = $$(comDiv).find("i").attr('class');
	var zanNum = $$(comDiv).find("span").html();
	if(zanNum == '赞'){
		zanNum = 0;
	}
	if (classStyle.indexOf('icon-thumbs-up-alt') >=0 ) {
		comDiv.children[1].innerText = parseInt(zanNum) + 1;
		$$(comDiv).find("i").removeClass('icon-thumbs-up-alt');
		$$(comDiv).find("i").addClass('icon-thumbs-up');
		var _data = {
			script: "managers.om.community.appcommunity",
			needTrascation: true,
			funName: "saveCommunityComZan",
			form: "{communityId: '"+comId+"',dynimId: '"+dynimId+"',zan: 1,uid: '"+uid+"'}"
	   };
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data: _data,
			type: 'post',
			success: function(data) {
				getCommunityDyList('0',comId,'');
			    myApp.hideIndicator();
			}
		});
	} else{
		if(parseInt(zanNum) - 1 == 0){
			comDiv.children[1].innerText = '赞';
		}else{
			comDiv.children[1].innerText = parseInt(zanNum) - 1;
		}
		
		$$(comDiv).find("i").removeClass('icon-thumbs-up');
		$$(comDiv).find("i").addClass('icon-thumbs-up-alt');
		
		var _data = {
			script: "managers.om.community.appcommunity",
			needTrascation: true,
			funName: "deleteCommunityComZan",
			form: "{communityId: '"+comId+"',dynimId: '"+dynimId+"',zan: 1,uid: '"+uid+"'}"
	  };
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data: _data,
			type: 'post',
			success: function(data) {
				getCommunityDyList('0',comId,'');
 				myApp.hideIndicator();
			}
		});
	}
}

/**
 * *举报圈子
 * */
myApp.onPageInit('communityInfoAccusation',function(page) {
			//被举报圈子ID
			var communityID =page.query.communityId;
          $$('#jubao_quanzi').attr('onclick','communityInfoAccusation_confirm("'+communityID+'")');
});

myApp.onPageAfterBack('communityInfoAccusation',function(){
	Auto517.UIChatbox._inputBar_show_hide("show");
});

		/*
		 举报圈子
		 * */
		function communityInfoAccusation_confirm(communityID) {
            var report = $$("#report_community input[type = 'radio']:checked").next('div').find('span').html();

				var myApp = new Framework7({
					modalButtonOk: '确定',
					modalButtonCancel: '取消 '
				}); 
				myApp.confirm('是否确定提交举报该圈子？', '', function() {
					Auto517.UIChatbox._inputBar_close();
					mainView.router.loadPage('html/community/communityMain.html?reloadCommunityPage=1');
					
					var _data = {
					script: "managers.om.community.appcommunity",
					needTrascation: true,
					funName: "saveCommunityReport",
					form: "{communityId: '"+communityID+"',uid:'"+uid+"',report: '"+report+"'}"
				    };
	
					$$.ajax({
						url: rootUrl + "/api/execscript",
                        dataType: 'json',
                        type: 'post',
                        data: _data,
                        success: function(data) {
                       }
					});

                    var data = {
					script: "managers.om.community.appcommunity",
					needTrascation: false,
					funName: "deleteDecommunity",
					form: "{toCommunityID: '"+communityID+"',uid:'"+uid+"'}"
				    };
                    
					$$.ajax({
                           url: rootUrl + "/api/execscript",
                           data: data,
                           dataType: 'json',
                           type: 'post',
                           timeout: 5000,
                           success: function(data) {
                                  toast.show('已拉黑 ');
                              }
                           });
					},
					function() {

					}
				);
			}
			myApp.onPageInit('communitySetting', function(page) {
				var communityId = page.query.communityId;
				var troubleFree = page.query.troubleFree;
				var showLevel = page.query.showLevel;
				$$('#community-accusa-set').attr('href', 'html/community/communityInfoAccusation.html?communityId=' + communityId);
				$$('#community-join-set').attr('href', 'html/community/communityJoinMember.html?communityId=' + communityId);
				if (troubleFree == 0) {
					$$('input[name="community-trouble-free"]').prop('checked', true);
				} else {
					$$('input[name="community-trouble-free"]').prop('checked', false);
				}
				if (showLevel == 0) {
					$$('input[name="community-show-level"]').prop('checked', true);
				} else {
					$$('input[name="community-show-level"]').prop('checked', false);
				}
				$$('#quitThisCommunity').on('click', function() {
					myApp.confirm('确定要退出该圈子吗?', function() {
					    var _data = {
						script: "managers.om.community.appcommunity",
						needTrascation: true,
						funName: "deleteCommunityOnlyInfo",
						form: "{communityId: '"+communityId+"',uid:'"+uid+"'}"
					    };
				    
						$$.ajax({
							url: rootUrl + "/api/execscript",
							dataType: 'json',
							data:_data,
							type: 'post',
							success: function(data) {
								if(data.formDataset.flag == 'true'){
									mainView.router.loadPage('html/community/communityMain.html?reloadCommunityPage=1');
								}else{
									alert('该圈子您是圈主！不能退出！');
								}
								
//								_im_rong.quitGroup({
//									groupId: communityId
//								}, function(ret, err) {
//									if (ret.status == 'success') {
//										//api.toast({ msg: JSON.stringify(ret.status) });
//									} else {
//										api.toast({
//											msg: err.code
//										});
//									}
//								});
							}
						});
					});
				});
			});

			myApp.onPageBack('communitySetting', function(page) {
				var troubleFree = 1;
				var showLevel = 0;
				if ($$('input[name="community-trouble-free"]').prop('checked')) {
					troubleFree = 0;
				}
				if ($$('input[name="community-show-level"]').prop('checked')) {
					showLevel = 0;
				} else {
					showLevel = 1;
				}
				var communityId = page.query.communityId;
				
				var _data = {
					script: "managers.om.community.appcommunity",
					needTrascation: false,
					funName: "saveCommunityOnlyInfo",
					form: "{communityId: '"+communityId+"',troubleFree:"+troubleFree+",showLevel:"+showLevel+"}"
				};
				
				$$.ajax({
					url: rootUrl + "/api/execscript",
					dataType: 'json',
					data: _data,
					type: 'post',
					success: function(data) {
						//自己添加
                         getCommunityForDy('0',communityId);
					}
				});
			});

			//myApp.onPageAfterBack('communityInfoDetailed',function(page){
			//	var communityId = page.query.communityId;
			//	var dynamicId = page.query.communityDyId;
			//	var communityListPage = $$(this);
			//	alert(1111);
			//});

			myApp.onPageInit('communityNewStep2', function(page) {
				//	var dataset = $$('#dateEdit').dataset();
				//	var dataCheck = dataset.checked;
				//	if(){
				//		
				//	}
				$$('#dateEdit').on('click', function() {
					$$('.item-media-one').show();
				});
			});

			$$('#power .item-inner').on('click', function() {
				$$('.item-inner').children('div .item-text').addClass('item-subtitle-hidden');
				$$(this).children('div .item-text').removeClass('item-subtitle-hidden');
			});

			function powerFinish() {
				$$('#power-text').html($$("#power input[type='radio']:checked").val());
			}

			function shareIconClickDisplay(obj) {
				$$(obj).addClass('icon-hidden');
				$$(obj).next().removeClass('icon-hidden');
			}

			function shareIconClickPlay(obj) {
				$$(obj).addClass('icon-hidden');
				$$(obj).prev().removeClass('icon-hidden');
			}
			
