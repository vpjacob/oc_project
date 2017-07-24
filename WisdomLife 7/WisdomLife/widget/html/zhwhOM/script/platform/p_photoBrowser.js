var _p_photoBrowser=function(){
	
	var photoBrowser = api.require('photoBrowser');
	 //打开图片浏览器
	function _photoBrowser_open(images,key){
		 photoBrowser.open({
      		images: images,
    		placeholderImg: 'widget://res/img/apicloud.png',
   			bgColor: '#000000',
   			activeIndex:key,
			zoomEnabled:true
		}, function(ret, err) {
			androidBack='closePhoto';
			if(ret.eventType == "longPress") {	
				savetribunepicture(images[ret.index]);
			}
			if(ret.eventType == "click") {
				photoBrowser.close();	
			}
	    });
	} 
	//关闭图片浏览器
	function _photoBrowser_close (){
		if ( typeof (photoBrowser) != "undefined" && null != photoBrowser){
			androidBack='';
			photoBrowser.close();
		}		
	}
	//显示图片浏览器 隐藏图片浏览器
	function _photoBrowser_show (temp){
		if ( typeof (photoBrowser) != "undefined" && null != photoBrowser){
			if(temp=='show'){
				photoBrowser.show();
			}else{
				photoBrowser.hide();
			}			
		}		
	}
	
	//设置当前显示图片
	function _photoBrowser_setIndex (num){
		photoBrowser.setIndex({
			index:num    
		}) 
	} 
	//获取当前图片在图片路径数组内的索引
	function _photoBrowser_getIndex (callback){
		photoBrowser.getIndex(function(ret, err) {
		    if (ret) {
		        callback(ret.index);
		    } else {
		        
		    }
		});
	}
	//获取指定图片在本地的绝对路径
	function _photoBrowser_getImage (index,callback){
		photoBrowser.getImage({
		    index: index
		}, function(ret, err) {
		    if (ret) {
		        callback(ret.path);
		    } else {
		        
		    }
		});
	}
	//设置指定位置的图片，若设置的是网络图片加载成功或失败会给 open 接口回调该加载事件
	function _photoBrowser_setImage (index){
		photoBrowser.setImage({
		    index: index,
		    image: 'http://docs.apicloud.com/img/docImage/imageBrowser.jpg'
		});
	}
	//往已打开的图片浏览器里添加图片（拼接在最后）
	function _photoBrowser_appendImage (images,callback){
		photoBrowser.appendImage({
		    images: images
		}, function(ret, err){
			if (ret) {
		        callback();
		    } else {
		        
		    }
		});
	}
	//删除指定位置的图片
	function _photoBrowser_deleteImage (index,callback){
		photoBrowser.deleteImage({
		    index: index
		}, function(ret, err){
			if (ret) {
		        callback();
		    } else {
		        
		    }
		});
	}
	//保存图片
	function savetribunepicture (img){
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
	
	return {
		"_photoBrowser_open":_photoBrowser_open,
		"_photoBrowser_show":_photoBrowser_show,
		"_photoBrowser_setIndex":_photoBrowser_setIndex,
		"_photoBrowser_getIndex":_photoBrowser_getIndex,
		"_photoBrowser_getImage":_photoBrowser_getImage,
		"_photoBrowser_setImage":_photoBrowser_setImage,
		"_photoBrowser_appendImage":_photoBrowser_appendImage,
		"_photoBrowser_deleteImage":_photoBrowser_deleteImage,
		"savetribunepicture":savetribunepicture,
		"_photoBrowser_close":_photoBrowser_close
	}
}
Auto517.regist(_p_photoBrowser, "photoBrowser");