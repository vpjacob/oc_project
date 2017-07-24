//$$('.popup-services').on('open', function () {
//console.log('Services Popup is opening')
//});


$$(document).on('click', '#popup-community-two',function () {
		var imageUrl = $$('#communityup-title').attr('src');
		if(imageUrl == 'image/community/communityup.jpg'){
			imageUrl = '';
		}
		var dataTypeCom = $$(this).data('type');
		var communityNewTitle = $$('input[name="com_new_title"]').val();
		var communityNewTitleLength = communityNewTitle.replace(/[^\x00-\xff]/g,"0101").length;
		if(communityNewTitleLength == 0){
			myApp.alert('圈名称必须输入！', '哦脉提示');
			return false;
		}
		if(imageUrl.length == 0){
			myApp.alert('圈图片必须上传！', '哦脉提示');
			return false;
		}
		if(communityNewTitle.length > 10){
			myApp.alert('圈名称输入过长，请重新输入！', '哦脉提示');
			return false;
		}
		var communityType = '';
		var popupHTML = '';
		
		popupHTML += '<div class="popup popup-community-twoStep">'+
	    '<div class="content-block" style="margin-top: 0px;">'+
	    '<p>'+
	    		'<a href="#" id="popupCommunityTwo">'+
		    		'<i class="icon-angle-left" style="font-size: 1.5em;color: #DDDDDD;"></i>'+
				'<span style="font-size: 1.5em;color: #DDDDDD;">上一步</span>'+
			'</a>'+
	    	'</p>'+
	     '<div class="content-block-title community-step-two-title">填写圈简介和关键词</div>'+
	     '<div class="content-block-title community-step-two-subtitle">认真填写圈简介和关键词,吸引朋友加入你的圈</div>'+
			'<form id="my-communityForm" class="list-block">'+
			  '<ul>'+
			    '<li style="margin-bottom: 50px;">'+
			      '<div class="item-content" style="padding-left: 0px;">'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<textarea placeholder="填写圈简介,15到300字" id="com-txtarea-info" name="com-txtarea-info"></textarea>'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">圈类型</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			          '<input type="text" name="communityBigType">'+
//			             '<select name="communityBigType">';
//			popupHTML +=communityType;
//			popupHTML +='</select>'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">圈名片</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" name="communityCardInfo">'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">关键词1</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" name="communityKey">'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">关键词2</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" name="communityKey">'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">关键词3</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" name="communityKey">'+
			         '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">关键词4</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" name="communityKey">'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			    '<li>'+
			      '<div class="item-content">'+
			        '<div class="item-media" style="color:#DDDDDD">关键词5</div>'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" name="communityKey">'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			  '</ul>'+
			'</form>'+
			'<div class="content-block">'+
			  '<a href="#" class="button form-community-json" style="color: white;background-color: #DDDDDD;font-size: 1em;" id="com-new-submit" data-type="'+dataTypeCom+'">完成</a>'+
			'</div>'+
	    '</div>'+
	'</div>';
				
			 myApp.popup(popupHTML);	
//			}
//		});
		
		$$(document).on('input', 'input[name="communityKey"]',function() {
			var communityNewTxt = $$('#com-txtarea-info').val();
			var communityNewTxtLength = communityNewTxt.replace(/[^\x00-\xff]/g,"0101").length;
			if ($$(this).val().length > 0 && communityNewTxtLength >= 60 && communityNewTxtLength <= 1200) {
				$$('#com-new-submit').css('background-color', '#0FAAE3');
			} else {
				$$('#com-new-submit').css('background-color', '#DDDDDD');
			}
		});
		
		$$(document).on('input', 'textarea[name="com-txtarea-info"]',function() {
			var communityNewTxt = $$('input[name="communityKey"]').val();
			var communityNewTxtLength = $$(this).val().replace(/[^\x00-\xff]/g,"0101").length;
			if (communityNewTxtLength >= 60 && communityNewTxtLength <= 1200 && communityNewTxt.length > 0) {
				$$('#com-new-submit').css('background-color', '#0FAAE3');
			} else {
				$$('#com-new-submit').css('background-color', '#DDDDDD');
			}
		});
	});

myApp.onPageInit('communityNew', function(page) {
	$$('.popup-community-one').on('click', function () {
	  var dataTypeCom = $$(this).data('type');
	  var popupHTML = '<div class="popup popup-community-oneStep">'+
	    '<div class="content-block" style="margin-top: 0px;">'+
	    	'<p>'+
	    		'<a href="#" id="popupCommunityOne">'+
		    		'<i class="icon-angle-left" style="font-size: 1.5em;color: #DDDDDD;"></i>'+
				'<span style="font-size: 1.5em;color: #DDDDDD;">返回</span>'+
			'</a>'+
	    '</p>'+
	     '<div class="card-community facebook-card-community">'+
		  '<div class="card-header-community no-border">'+
		    '<div class="facebook-name-community" id="facebook-name-community">填写圈名称</div>'+
		    '<div class="facebook-date-community">圈名称需要审批,请认真说明圈主题</div>'+
		  '</div>'+
		  '<div class="card-content-community">'+
		  	 '<a href="#" class="community-1"><img src="image/community/communityup.jpg" width="100%" id="communityup-title"></a>'+
		  '</div>'+
		  '<div class="list-block inset" style="margin: auto;">'+
  			'<ul>'+
			  '<li>'+
			      '<div class="item-content" style="padding-left: 0px;">'+
			        '<div class="item-inner">'+
			          '<div class="item-input">'+
			            '<input type="text" placeholder="输入圈名称不超过10个字" name="com_new_title">'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</li>'+
			'</ul>'+
		  '</div>'+
			  '<a href="#" class="button button-fill" id="popup-community-two" style="color: white;background-color: #DDDDDD;font-size: 1em;"  data-type="'+dataTypeCom+'">下一步</a>'+
		'</div>'+
	    '</div>'+
  	'</div>';
	  myApp.popup(popupHTML);
	});
	//监听新建圈子事件
	api.addEventListener({
    		name:'newPicCommunity'
		},function(ret){
		    if(ret && ret.value){
		    		var imageUrl = $$('#communityup-title').attr('src');
				if(imageUrl == 'image/community/communityup.jpg'){
					imageUrl = '';
				}
				if ($$('input[name="com_new_title"]').val().length > 0 && imageUrl != '') {
					$$('#popup-community-two').css('background-color', '#0FAAE3');
				} else {
					$$('#popup-community-two').css('background-color', '#DDDDDD');
				}
		    }else{
		    		$$('#popup-community-two').css('background-color', '#DDDDDD');
		    }
	});
	
	$$(document).on('input', 'input[name="com_new_title"]',function() {
		var imageUrl = $$('#communityup-title').attr('src');
		if(imageUrl == 'image/community/communityup.jpg'){
			imageUrl = '';
		}
		if ($$(this).val().length > 0 && imageUrl != '') {
			$$('#popup-community-two').css('background-color', '#0FAAE3');
		} else {
			$$('#popup-community-two').css('background-color', '#DDDDDD');
		}
	});
});

$$(document).on('click','#com-new-submit',function(){	
		myApp.showIndicator();
		var dataTypeCom = $$(this).data('type');
		var communityNewTitle = $$('input[name="com_new_title"]').val();
		var communityCardInfo = $$('input[name="communityCardInfo"]').val();
		var communityBigType = $$('input[name="communityBigType"]').val();
		var communityNewTxt = $$('#com-txtarea-info').val();
		var communityNewTxtLength = communityNewTxt.replace(/[^\x00-\xff]/g,"0101").length;
		var communityCardInfoLength = communityCardInfo.replace(/[^\x00-\xff]/g,"0101").length;
		var communityBigTypeLength = communityBigType.replace(/[^\x00-\xff]/g,"0101").length;
		var communityKeys = $$('input[name="communityKey"]');
		
//		 var formData = myApp.formToJSON('#my-communityForm');
//		var communityBigType = formData.communityBigType;
		var communityKey = new Array();
		var count = 0;
		for(var i = 0;i<communityKeys.length;i++){
			var communityKeyLength = communityKeys[i].value.replace(/[^\x00-\xff]/g,"0101").length;
			if(communityKeyLength > 40){
				myApp.hideIndicator();
				myApp.alert('单个圈关键字不能超过10个字！');
				return false;
			}else{
				if(communityKeys[i].value.length > 0){
					communityKey+=communityKeys[i].value+",";
					count++;
				}
			}
		}
		if(communityBigTypeLength > 40){
			myApp.hideIndicator();
			myApp.alert('圈类型不能超过10个字，请重新输入！','哦脉提示');
			return false;
		}
		if(communityCardInfoLength > 40){
			myApp.hideIndicator();
			myApp.alert('圈名片不能超过10个字，请重新输入！','哦脉提示');
			return false;
		}
		if(communityNewTxtLength < 60 || communityNewTxtLength > 1200){
			myApp.hideIndicator();
			myApp.alert('圈介绍输入不符合要求(15到300字)，请重新输入！','哦脉提示');
			return false;
		}
		if(count <= 0){
			myApp.hideIndicator();
			myApp.alert('请输入圈关键字！','哦脉提示');
			return false;
		}
		
		imageUrlBase64 = $$('#imageUrlInfo').text();
		api.ajax({
			url : rootUrl + '/api/upload',
			method : 'post',
			data : {files : {file : imageUrlBase64}}
		}, function(ret, err) {
		if (ret.execStatus == 'true') {
		imageUrlBase64 = ret.formDataset.saveName;
		var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: true,
		funName: "saveCommunity",
		form: "{uid: '"+uid+"',communityInfo: '"+communityNewTxt+"',communityKeys: '"+communityKey+"',name: '"+communityNewTitle+"',communityPower: "+dataTypeCom+",photoImg: '"+imageUrlBase64+"',communityType: '"+ communityBigType + "',communityCardInfo: '" + communityCardInfo + "'}"
	    };
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data: _data,
			type: 'post',
			success: function(data) {
				
				myApp.hideIndicator();
				myApp.closeModal('.popup-community-oneStep');
				myApp.closeModal('.popup-community-twoStep');
				mainView.router.loadPage('html/community/communityMain.html?reloadCommunityPage=1');
			},
			error: function(data, mes) {
//					alert(JSON.stringify(data) + mes);
				}
		});
         } else {
				api.alert({
					msg : '上传图片失败,请您从新上传'
				});
			}
		});
	});