//装载我的圈子信息
function initCommunitylList(data_list,searchFlag){
	if (searchFlag == '1') {
		$$('#community-main-list').html('');
		$$('.transparent_class').html('');
	}
	var result = data_list.datasources[0].rows;
	var resultPY = data_list.datasources[1].rows;
	if (result.length > 0) {
		var community_template = '';
		var community_templatepy = '';
			for (var i = 0; i < resultPY.length; i++) {
				var communityPY = resultPY[i];
				community_template += '<div class="list-group">';
				community_template += '<ul>';
				community_template += '<li class="list-group-title" style="font-weight: 200;">' + communityPY.communitynamepy + '</li>';
				for (var j = 0; j < result.length; j++) {
					var community = result[j];
					if (communityPY.communitynamepy == community.communitynamepy) {
						community_template += '<li class="list-group-content" data-index-letter=\"' + communityPY.communitynamepy + '\">';
						community_template += '<a href="html/community/communityInfoList.html?communityId=' + community.communityid + '&communityname=' +community.communityname+'&conversationtype='+community.c_conversationtype+'&counselId='+community.c_consultid+ '\" class="item-link item-content">';
						community_template += '<div class="item-media"><img class="community-image-main cache" src=\"' + rootUrl + community.communityimage + '\"></div>';
						community_template += '<div class="item-inner">';
						community_template += '<div class="item-title-row" style="background-image:none;display:inline;">';
						community_template += '<div class="item-title title-community-style" style="font-weight: 300;max-width: 90px;">' + community.communityname + '</div>';
						community_template += '<div class="col-100 tablet-50 tag-info-one" style="background-color: #FF9500;color: #FFFFFF;">' + community.communitytype + '</div>';
						community_template += '<div class="col-100 tablet-50 tag-info-two" style="background-color: #FF2D55;color: #FFFFFF;">' + community.persontype + '</div>';
						community_template += '</div>';
						community_template += '<div class="item-text text-community-style" style="height: 30px;line-height: 40px;font-size: 14px;">';
						var dynamicNums = community.dynamicnums;
						if (community.dynamicnums == null || community.dynamicnums == '') {
							dynamicNums = 0;
						}
						community_template += '<i class="icon icon-group" ></i>&nbsp;<span style="color: #8e8e93;">' + community.personnums + '人&nbsp|&nbsp' + dynamicNums + '条新动态</span></div>';
						community_template += '</div>';
						community_template += '</a>';
						community_template += '</li>';
					}
				}
				community_template += '</ul>';
				community_template += '</div>';

				community_templatepy += '<li data-index-letter=\"' + communityPY.communitynamepy + '\">' + communityPY.communitynamepy + '</li>';


			}
			$$('#community-main-list').html(community_template);
			$$('.transparent_class').html(community_templatepy);
			
	} else {
		$$('#community-main-list').append('<span></span>');
	}
}
//装载单一圈信息
initCommunityDyOne = function(data_list,searchFlag,communityId){
	
	var resultOne = data_list.datasources[0].rows;
		if (resultOne.length > 0) {
			var communityOne = resultOne[0];
			$$('#communityInfo-image-bg').addClass('cache');
			$$('input[name="communityNameHide"]').val(communityOne.c_name);
			$$('#communityInfo-image-bg').attr('style', 'background-image:url(' + rootUrl + communityOne.c_image + ')');
			$$('#popover-community-setting').attr('href', 'html/community/communitySetting.html?communityId=' + communityId + '&troubleFree=' + communityOne.c_trouble_free + '&showLevel=' + communityOne.c_show_level);
		}
}

//装载圈动态信息 searchFlag:0(初始化)；searchFlag:1(下拉刷新)；searchFlag:2(上拉刷新)；
initCommunityDyList = function(data_list,searchFlag,communityId,fromPageType){
		var communityDyList = $$('#community-card-two');
		var resultDy = data_list.datasources[3].rows;
		var resultDyImg = data_list.datasources[0].rows;
		var resultDyZan = data_list.datasources[1].rows;
		var resultDyComNum = data_list.datasources[2].rows;
		var data_comment = data_list.datasources[4].rows;
		var dy_tem = '';
			for (var j = 0; j < resultDy.length; j++) {
				var comDyZan = '';
				var comDyCom = '';
				var comDyRead = '';
				var communityDynamic = resultDy[j];
				var communityDyZanD = '';
				var countZan = 0;
				var dynamicComment='';
				communityDyZanD +='<div class="">'
				//下部加载，当返回数据小于20条是，删除下部加载事件
				if(searchFlag == 2 || searchFlag == 0){
					if(resultDy.length < 20){
						  // 加载完毕，则注销无限加载事件，以防不必要的加载
					      myApp.detachInfiniteScroll($$('#community-card-one'));
					      // 删除加载提示符
					      $$('.infinite-scroll-preloader').remove();
					}
				}
				
				//上部刷新，直接查询最新的20条，返回数据中如果存在当前列表中的数据时，直接返回
//				if(searchFlag == 1){
//					var dynamicLastId = $$('#community-card-two').attr('data-dynamicLastId'); 
//					if(dynamicLastId == communityDynamic.dynamicid){
//						alert(1111);
//						break;
//					}
//				}

				dynamicComment+='<div class="comment">';
//				//评论
				for(var i=0;i<data_comment.length;i++){
						
						if(data_comment[i].dynamic_id==communityDynamic.dynamicid){
							dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
							dynamicComment+=	'<ul >';
							dynamicComment+='			<li style="border-bottom:1px;">';
							dynamicComment+='	          <div class="item-title" style="font-size:14px;padding:0px;margin:0px;white-space:normal;"><span style="color:#0EAAE3;">'+data_comment[i].c_user_name+':</span>&nbsp;&nbsp;<span>'+window.Auto517.UIChatbox._im_transText(data_comment[i].comment_content)+'<span ></div>';
							dynamicComment+='	          </li>' ;
							dynamicComment+='	         </ul>';
							dynamicComment+='	        </div>';
							
						}
						
				}
				dynamicComment+='</div>';
				if(fromPageType != 'noJoin'){
					for (var k = 0; k < resultDyZan.length; k++) {
						var communityDyZanF = resultDyZan[k];
						if (communityDynamic.dynamicid == communityDyZanF.c_dynamic_id) {
							if (null != communityDyZanF.userzan && communityDyZanF.userzan.indexOf(uid) >= 0) {
								comDyZan = communityDyZanF.allzan;
								comDyRead = communityDyZanF.allread;
								communityDyZanD += '<div  class="l_float"  onclick="getComZanNum(this,\'' + communityDyZanF.c_dynamic_id + '\',\'' + communityId + '\',' + communityDyZanF.allzan + ');"><i class="icon-thumbs-up" style="font-size: 1.2em;color: #6d6d72;"></i>';
								communityDyZanD += '&nbsp;<span style="font-size: 0.8em;color:#c4c4c4;">' + communityDyZanF.allzan + '</span>&nbsp;&nbsp;&nbsp;</div>';
								countZan++;
							} else {
								comDyZan = communityDyZanF.allzan<=0?'赞':communityDyZanF.allzan;
								comDyRead = communityDyZanF.allread;
								communityDyZanD += '<div class="l_float"  onclick="getComZanNum(this,\'' + communityDyZanF.c_dynamic_id + '\',\'' + communityId + '\',' + communityDyZanF.allzan + ');"><i class="icon-thumbs-up-alt" style="font-size: 1.2em;color: #6d6d72;"></i>';
								communityDyZanD += '&nbsp;<span style="font-size: 0.8em;color:#c4c4c4;">' + comDyZan + '</span>&nbsp;&nbsp;&nbsp;</div>&nbsp;';
								countZan++;
							}
						}
					}

					if (0 == resultDyZan.length || countZan == 0) {
						communityDyZanD += '<div class="l_float"   onclick="getComZanNum(this,\'' + communityDynamic.dynamicid + '\',\'' + communityId + '\');"><i class="icon-thumbs-up-alt" style="font-size: 1.2em;color: #6d6d72;"></i>';
						communityDyZanD += '&nbsp;<span style="font-size: 0.8em;color:#c4c4c4;">赞</span>&nbsp;&nbsp;&nbsp;</div>&nbsp;';
					}                       
					var count = 0;
					for (var k = 0; k < resultDyComNum.length; k++) {
						var resultDyComNum1 = resultDyComNum[k];
						if (communityDynamic.dynamicid == resultDyComNum1.dyid) {
							comDyCom = resultDyComNum1.commentarynum;
							communityDyZanD += '<div class="l_float community_discuss" data-ids="'+communityDynamic.dynamicid+'" data-communityId="'+communityId+'">';
							communityDyZanD += '<i class="icon-flickr" style="font-size: 1.2em;color: #6d6d72;"></i> ';
							communityDyZanD += '&nbsp;<span style="font-size: 0.8em;color:#c4c4c4;">' + resultDyComNum1.commentarynum + '</span></div>';
							count++;
						}
					}
				}
				if (0 == resultDyComNum.length || count == 0) {
					communityDyZanD += '<div class="l_float community_discuss" data-ids="'+communityDynamic.dynamicid+'" data-communityId="'+communityId+'");">';
					communityDyZanD += '<i class="icon-flickr" style="font-size: 1em;color: #6d6d72;"></i> ';
					communityDyZanD += '&nbsp;<span style="font-size: 1em;color:#c4c4c4;">0</span></div>';
				}
					communityDyZanD += '</div>'
				dy_tem += '<div class="card facebook-card card-margin" id="dy' + communityDynamic.dynamicid + '" style="padding-bottom:10px;">';
				if (communityDynamic.dynamicess == 0) {
					dy_tem += '<div class="userImage-1">';
					dy_tem += '<img src="image/community/communityjing.png" style="width: 100%;" />';
					dy_tem += '</div>';
				}
				dy_tem += '<div class="card-header" style="padding-bottom: -3px;padding-top:10px;">';
				dy_tem += '<div class="facebook-avatar"><img src=\"' + rootUrl + communityDynamic.userimg + '\" width="45px" height="45px" class="cache"></div>';
				dy_tem += '<div class="facebook-name" style="margin-left: 58px;">' + communityDynamic.username + '</div>';
				
				dy_tem += '<div class="facebook-date" style="height: 15px;margin-left: 0px;">';
				
				if (communityDynamic.usergender == 1) {
					dy_tem += '<div class="communityDetal-mars-com" style="margin-left: 12px">';
					dy_tem += '<i class="icon icon-mars" style="color: white;"></i>&nbsp;&nbsp;'+ communityDynamic.userage+'</div>';
				} else if (communityDynamic.usergender == 2) {
					dy_tem += '<div class="communityDetal-mars-com1" style="margin-left: 12px">';
					dy_tem += '<i class="icon icon-venus" style="color: white;"></i>&nbsp;&nbsp;'+ communityDynamic.userage+'</div>';
				}
				dy_tem += '<div class="communityDetal-vip-com">';
				dy_tem += '<img src="'+communityDynamic.levelimg+'" width="100%" style="height: 12px;">';
				dy_tem += '</div>';
				dy_tem += '</div>';
				
				
				if(fromPageType == 'noJoin'){
					dy_tem += '<a href="#" class="community-5" data-id="' + communityDynamic.dynamicid + '" data-communityId="' + communityId + '" data-pagetype="communityList">';
				}else{
					dy_tem += '<a href="#" class="community-2" data-id="' + communityDynamic.dynamicid + '" data-communityId="' + communityId + '" data-pagetype="communityList">';
				}
				dy_tem += '<div class="facebook-dateafter" style="font-size:14px;height:50%;">' + communityDynamic.createtime;
				dy_tem += '&nbsp<i class="icon-angle-down"></i>';
				dy_tem += '</div>';
				dy_tem += '</a></div>';
				dy_tem += '<a href="html/community/communityInfoDetailed.html?communityId=' + communityId + '&communityDyId=' + communityDynamic.dynamicid + '&fromPageType='+fromPageType+'" class="link" >';
				dy_tem += '<div class="card-content-inner" style="padding-bottom: 0px;padding-top: 0px;margin-left: 17%;">';
				dy_tem += '<p style="margin: 0.5em;margin-left: 0px;color: #7C7C7C;font-size:14px;font-weight:400;">' + Auto517.UIChatbox._im_transText(communityDynamic.dynamindes) + '</p>';
				var kk = 0;
				for (var k = 0; k < resultDyImg.length; k++) {
					var communityDyImage = resultDyImg[k];
					if (communityDynamic.dynamicid == communityDyImage.dynamicid) {
						// 创建对象  
						var img = new Image();
						// 改变图片的src  
						img.src = rootUrl + communityDyImage.dynamicimage;
						var cssKey = 'width';
						var classKey = 'dyImgPositionE';
//						if (img.width > img.height) {
//							cssKey = 'height';
//							classKey = 'dyImgPositionW';
//						}
//						if (img.width == img.height) {
//							classKey = 'dyImgPositionE';
//						}
						var winWidth = api.winWidth/4 - 5;
						dy_tem += '<div class="pb-standalone-dark dyImg"  style="width:'+winWidth+'px;height:'+winWidth+'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">';
						dy_tem += '<img class="cache ' + classKey + '" src="' + rootUrl + communityDyImage.dynamicimage + '" width="'+winWidth+'px" height="'+winWidth+'px" />';
						dy_tem += '</div>';
						kk++;
					}
					if (kk == 3) {
						break;
					}
				}
				dy_tem += '</div></a>';
				dy_tem += '<div class="card-footer no-border" >';
				dy_tem += '<div class="card-footer-title" style="padding-bottom: 0px;padding-top: 0px;margin-left: 17%;padding-left: 5px;">'
				dy_tem += '<div style="font-size: 1em;color:#c4c4c4;">' + communityDynamic.distance + 'km</div>';
				dy_tem += '</div>'
				if(fromPageType != 'noJoin'){
					dy_tem += communityDyZanD;
				}
				dy_tem += '</div>';
				dy_tem +=dynamicComment;
				dy_tem += '</div>';
				
				if(searchFlag == 1 || searchFlag == 0){
					if(j == 0){
						$$('#community-card-two').attr("data-dynamicLastId", communityDynamic.dynamicid);
					}
				}
				if(searchFlag == 2 || searchFlag == 0){
					if(j == resultDy.length - 1){
						$$('#community-card-two').attr("data-dynamicOldestId", communityDynamic.dynamicid);
					}
				}
			}
		
		if(resultDy.length <= 0){
			 // 加载完毕，则注销无限加载事件，以防不必要的加载
		      myApp.detachInfiniteScroll($$('#community-card-one'));
		      // 删除加载提示符
		      $$('.infinite-scroll-preloader').remove();
		}else{
			if(searchFlag == 1){
				communityDyList.html(dy_tem);
			}else if(searchFlag == 2){
				communityDyList.append(dy_tem);
			}else{
				communityDyList.html('');
				communityDyList.append(dy_tem);
			}
		}
		
}
//发布完成动态后返回装载动态列表
reloadCommunityDyByNewDy = function(data_list,communityId){
		var comDyJsonStr = JSON.parse(data_list);
		Auto517.bMap._bmap_getDistanceByLat(user_lon,user_lat,comDyJsonStr.dynamicLon,comDyJsonStr.dynamicLat,function(distince){
			var communityDyList = $$('#community-card-two');
			var communityDyZanD = '';
			var dy_tem = '';
			communityDyZanD += '<div class="">'
			//赞
			communityDyZanD += '<div  class="l_float"><i class="icon-thumbs-up-alt" style="font-size: 1.2em;color: #6d6d72;"></i>';
			communityDyZanD += '&nbsp;<span style="font-size: 0.8em;color:#c4c4c4;">赞</span>&nbsp;&nbsp;&nbsp;</div>&nbsp;';
			//阅读数
			communityDyZanD += '<div class="l_float">';
			communityDyZanD += '<i class="icon-flickr" style="font-size: 1em;color: #6d6d72;"></i> ';
			communityDyZanD += '&nbsp;<span style="font-size: 1em;color:#c4c4c4;">0</span></div>';
			communityDyZanD += '</div>';
				
			//动态主题
			dy_tem += '<div class="card facebook-card card-margin">';
			dy_tem += '<div class="card-header" style="padding-bottom: 10px;padding-top: 10px;">';
			dy_tem += '<div class="facebook-avatar"><img src=\"' + rootUrl + user_image + '\" width="45px" height="45px" class="cache"></div>';
			dy_tem += '<div class="facebook-name" style="margin-left: 58px;">' + user_name + '</div>';
			dy_tem += '<div class="facebook-date" style="height: 15px;margin-left: 0px;">';
			dy_tem += '<div class="communityDetal-mars-com" style="margin-left: 12px">';
			if (user_gender == 1) {
					dy_tem += '<i class="icon icon-mars" style="color: white;"></i>&nbsp;&nbsp;'+ user_age +'</div>';
				} else if (user_gender == 2) {
					dy_tem += '<i class="icon icon-venus" style="color: white;"></i>&nbsp;&nbsp;'+ user_age+'</div>';
				}
				
			dy_tem += '<div class="communityDetal-vip-com">';
			dy_tem += '<img src="'+user_level_image+'" width="100%" style="height: 12px;">';
			dy_tem += '</div>';
			dy_tem += '</div>';
			
			dy_tem += '<div class="facebook-dateafter" style="font-size:14px;">' + comDyJsonStr.createtime;
			dy_tem += '&nbsp<i class="icon-angle-down"></i>';
			dy_tem += '</div>';
			dy_tem += '</a></div>';
//			dy_tem += '<a href="#" class="link">';
			dy_tem += '<div class="card-content-inner" style="padding-bottom: 0px;padding-top: 0px;margin-left: 17%;">';
			dy_tem += '<p style="margin: 0.5em;margin-left:0px;color: #7C7C7C;font-size: 14px;font-weight: 400;">' + Auto517.UIChatbox._im_transText(comDyJsonStr.dynamicContent) + '</p>';
			//动态图片
			var kk = 0;
			if(comDyJsonStr.newPhones.indexOf(',') >= 0 || comDyJsonStr.newPhones.indexOf(',')==-1){
				var newPhonesArr = comDyJsonStr.newPhones.split(',');
				for(var k = 0; k < newPhonesArr.length; k++){
						var communityDyImage = newPhonesArr[k];
						if(communityDyImage.length > 0){
							// 创建对象  
						var img = new Image();
						// 改变图片的src  
						img.src = communityDyImage;
						var cssKey = 'width';
						var classKey = 'dyImgPositionE';
//						if (img.width > img.height) {
//							cssKey = 'height';
//							classKey = 'dyImgPositionH';
//						}
//						if (img.width == img.height) {
//							classKey = 'dyImgPositionE';
//						}
						var winWidth = api.winWidth/4;
						dy_tem += '<div class="pb-standalone-dark dyImg"  style="width:'+winWidth+'px;height:'+winWidth+'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">';
						dy_tem += '<img class="cache ' + classKey + '" src="' + communityDyImage + '" width="'+winWidth+'px" height="'+winWidth+'px" />';
						dy_tem += '</div>';
						
						kk++;
						if (kk == 3) {
							break;
						}
					}
				}
			}
			dy_tem += '</div>';//function getDistanceByLat(lonD,latD,callback){
			dy_tem += '<div class="card-footer no-border">';
			
			dy_tem += '<div class="card-footer-title" style="padding-bottom: 0px;padding-top: 0px;margin-left: 17%;padding-left: 5px;">'
			dy_tem += '<div style="font-size: 1em;color:#c4c4c4;">0km</div>';
			dy_tem += '</div>'
			dy_tem += communityDyZanD;
			dy_tem += '</div>';
			dy_tem += '</div>';
			dy_tem += '</div>';
			communityDyList.prepend(dy_tem);
	});
}


//查找需要提示的成员
initCommunityManageForList = function(data_list){
	var comDyJsonStr = data_list;
	var dy_tem = '';
	for(var i =0 ; i < comDyJsonStr.length;i++){
		$$('#im-group-notification').css('display','block');
		var resultJoinMess = comDyJsonStr[i];
		var remark = resultJoinMess.userremark;
		if(resultJoinMess.userremark == null || resultJoinMess.userremark == '' || resultJoinMess.length > 0){
			remark = resultJoinMess.username+'申请加入圈子';
		}
		var cardId = resultJoinMess.communityid + 'resultJoinMess';
		dy_tem += '<div class="card facebook-card" style="margin:0;" id="'+cardId+'">';
		dy_tem += '<div class="card-header no-border" style="padding-left: 8px;padding-bottom: 0px;">';
		dy_tem += '<div class="facebook-avatar"><img src="'+rootUrl+resultJoinMess.userimg+'"  width="40" height="40"></div>';
		dy_tem += '<div class="facebook-date" style="margin-left: 15px;font-size:15px;width: 100%;">'+resultJoinMess.username+'申请加入"'+resultJoinMess.communityname+'"圈子,申请理由:'+remark+'</div>';
		dy_tem += '</div>';
		
		dy_tem += '<div class="card-content">';
		dy_tem += '</div>';
		dy_tem += '<div class="card-footer no-border" style="padding-left: 100px;padding-right: 100px;">';
		dy_tem += '<a href="#" class="link" id="submitCommunityJoin" data-communityId="'+resultJoinMess.communityid+'" data-joinUserId="'+resultJoinMess.joinuserid+'" data-communityname = "'+resultJoinMess.communityname+'"><span style="color: #77777;">同意</span></a>';
		dy_tem += '<a href="#" class="link" id="concelCommunityJoin" data-communityId="'+resultJoinMess.communityid+'" data-joinUserId="'+resultJoinMess.joinuserid+'" data-communityname = "'+resultJoinMess.communityname+'"><span style="color: #77777;">拒绝</span></a>';
		dy_tem += '</div>';
		dy_tem += '</div>';
	}
	$$('#im-messageJoinlist-list').append(dy_tem);
}

