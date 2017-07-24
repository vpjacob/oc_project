
$$(document).on('click','.community-1',function () {
	    var buttons1 = [
	        {
	            text: '拍照',
	            onClick: function () {
	                api.getPicture({
				    sourceType: 'camera',
				    encodingType: 'jpg',
				    mediaValue: 'pic',
				    destinationType: 'base64',
				    allowEdit: true,
				    quality: 50,
				    targetWidth:460,
				    saveToPhotoAlbum: true
					}, function(ret, err){ 
					    if (ret) {
					    		imageUrl = ret.data;
					    		imageUrlBase64 = ret.base64Data;
					    		var imageUrlInfo = '<div style="display: none" id="imageUrlInfo">'+imageUrl+'</div>填写圈名称';
					    		$$('#facebook-name-community').html(imageUrlInfo);
					    		$$('#communityup-title').attr('src',imageUrl);
					    		
					    		//发送个事件
					        api.sendEvent({
					            name: 'newPicCommunity',
					            extra:{fileName:'waiting'}
					        });
					    		
					    } else{
					    	
					    }
					});
	            }
	        },
	        {
	            text: '从手机相册选择',
	            onClick: function () {
	                api.getPicture({
				    sourceType: 'library',
				    encodingType: 'jpg',
				    mediaValue: 'pic',
				    destinationType: 'base64',
				    allowEdit: true,
				    quality: 50,
				    targetWidth:460,
				    saveToPhotoAlbum: false
					}, function(ret, err){ 
					    if (ret && ret.data.length > 0) {
					        imageUrl = ret.data;
					    		imageUrlBase64 = ret.base64Data;
					    		var imageUrlInfo = '<div style="display: none" id="imageUrlInfo">'+imageUrl+'</div>填写圈名称';
					    		$$('#facebook-name-community').html(imageUrlInfo);
					    		$$('#communityup-title').attr('src',imageUrl);
					    		
					    		//发送个事件
					        api.sendEvent({
					            name: 'newPicCommunity',
					            extra:{fileName:'waiting'}
					        });
					    		
					    } else{
					        
					    }
					});
	            }
	        }
	    ];
	    var buttons2 = [
	        {
	            text: '取消',
	            color:'red'
	        }
	    ];
	    var groups = [buttons1, buttons2];
	    myApp.actions(groups);
	});
	

$$(document).on('click','#popupCommunityOne',function () {
	  	myApp.closeModal('.popup-community-oneStep');
}); 
$$(document).on('click','#popupCommunityTwo',function () {
  	myApp.closeModal('.popup-community-twoStep');
}); 

closeExpressionPicker = function(){
	if ($$('#select-expression-modal').length > 0) {
	    myApp.closeModal('#select-expression-modal');
	}
}

$$(document).on('click','.selectExpression',function(e){
	if ($$('#select-expression-modal').length > 0) {
	    myApp.closeModal('#select-expression-modal');
	}
	Auto517.p_emotion.im_getEmotionCommunityPaths(_im_sourcePath, function(emotionArray) {
			if(emotionArray.length > 0){
				var emotionCount = emotionArray.length/60;
				var emotionCountROW = emotionArray.length/10;
				var expressionPicker = '<div class="picker-modal" id="select-expression-modal">';
					expressionPicker += '<div class="toolbar"><div class="toolbar-inner">';
					expressionPicker += '<div class="left"></div>';
					expressionPicker += '<div class="right"><a href="#" class="close-picker">Close</a></div>';
					expressionPicker += '</div>';
					expressionPicker += '</div>';	
					expressionPicker += '<div class="picker-modal-inner">';
					expressionPicker += '<div class="content-block" style="margin:0;padding:0">';
					expressionPicker += '<div class="swiper-container swiper-slow">';
				    expressionPicker += '<div class="swiper-pagination"></div>';
				    expressionPicker += '<div class="swiper-wrapper">';
				   	for(var i = 0;i < emotionCount;i++){
						expressionPicker += '<div class="swiper-slide">';
						for(var j = 0;j < emotionCountROW;j++){
							expressionPicker += '<div class="row no-gutter">';
							for(var idx = 0;idx < 10;idx++){
								var idxCount = idx+(j*10+i*60);
								var emotionItem = emotionArray[idxCount];
								if('undefined' != typeof(emotionItem)){
									var emotionText = eval(emotionItem).text;
									var emotionUrl = "image/em/" + eval(emotionItem).name + ".png";								
									expressionPicker += '<div class="col-10"><a href="#" id="openEmotion" data-emotion="'+emotionText+'"><img src="'+emotionUrl+'" alt="'+emotionText+'" width="30"/></a></div>';
								}else{
									expressionPicker += '<div class="col-10"></div>';
								}																								
								if(idx == 10){
									break;
								}
							}
							expressionPicker += '</div>';
							if(j == 5){
								break;
							}
						}
						expressionPicker += '</div>';
					}
														
				expressionPicker += '</div>';
				expressionPicker += '</div>';
				expressionPicker += '</div>';
				expressionPicker += '</div>';			
				expressionPicker += '</div>';

				myApp.pickerModal(expressionPicker);
				
				var mySelectExpSlow = myApp.swiper('#select-expression-modal .swiper-slow', {
				  pagination:'#select-expression-modal .swiper-slow .swiper-pagination',
				  speed: 600
				});			
			}			
	});		
});
$$(document).on('click','.selectExpressionNy',function(e){
	if ($$('#select-expression-modal').length > 0) {
	    myApp.closeModal('#select-expression-modal');
	}
	Auto517.p_emotion.im_getEmotionCommunityPaths(_im_sourcePath, function(emotionArray) {
			if(emotionArray.length > 0){
				var emotionCount = emotionArray.length/60;
				var emotionCountROW = emotionArray.length/10;
				var expressionPicker = '<div class="picker-modal" id="select-expression-modal">';
					expressionPicker += '<div class="toolbar"><div class="toolbar-inner">';
					expressionPicker += '<div class="left"></div>';
					expressionPicker += '<div class="right"><a href="#" class="close-picker">Close</a></div>';
					expressionPicker += '</div>';
					expressionPicker += '</div>';	
					expressionPicker += '<div class="picker-modal-inner">';
					expressionPicker += '<div class="content-block" style="margin:0;padding:0">';
					expressionPicker += '<div class="swiper-container swiper-slow">';
				    expressionPicker += '<div class="swiper-pagination"></div>';
				    expressionPicker += '<div class="swiper-wrapper">';
				   	for(var i = 0;i < emotionCount;i++){
						expressionPicker += '<div class="swiper-slide">';
						for(var j = 0;j < emotionCountROW;j++){
							expressionPicker += '<div class="row no-gutter">';
							for(var idx = 0;idx < 10;idx++){
								var idxCount = idx+(j*10+i*60);
								var emotionItem = emotionArray[idxCount];
								if('undefined' != typeof(emotionItem)){
									var emotionText = eval(emotionItem).text;
									var emotionUrl = "image/em/" + eval(emotionItem).name + ".png";								
									expressionPicker += '<div class="col-10"><a href="#" id="openEmotionNy" data-emotion="'+emotionText+'"><img src="'+emotionUrl+'" alt="'+emotionText+'" width="30"/></a></div>';
								}else{
									expressionPicker += '<div class="col-10"></div>';
								}																								
								if(idx == 10){
									break;
								}
							}
							expressionPicker += '</div>';
							if(j == 5){
								break;
							}
						}
						expressionPicker += '</div>';
					}
														
				expressionPicker += '</div>';
				expressionPicker += '</div>';
				expressionPicker += '</div>';
				expressionPicker += '</div>';			
				expressionPicker += '</div>';

				myApp.pickerModal(expressionPicker);
				
				var mySelectExpSlow = myApp.swiper('#select-expression-modal .swiper-slow', {
				  pagination:'#select-expression-modal .swiper-slow .swiper-pagination',
				  speed: 600
				});			
			}			
	});		
});

$$(document).on('click','#openEmotion',function(){
	var communityReleaseDyArea = $$('textarea[name="communityReleaseDyArea"]').val();
	var emotion = $$(this).data('emotion');
	$$('textarea[name="communityReleaseDyArea"]').val(communityReleaseDyArea+emotion);
	api.sendEvent({
        name: 'addComEmotion',
        extra:{fileName:'waiting'}
    });
}); 
$$(document).on('click','#openEmotionNy',function(){
		var communityReleaseDyArea = $$('#dynamic_content').val();
		var emotion = $$(this).data('emotion');
		$$('#dynamic_content').val(communityReleaseDyArea+emotion);
		api.sendEvent({
            name: 'addEmotion',
            extra:{fileName:'waiting'}
        });
}); 

