// 获取文件拓展名
function getExt(fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1);
}

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate
	return currentdate;
}

function NewGuid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

 // 图片压缩
// imgsrc：源图片的路径
// quality：图片压缩质量，一般建议0.5
// scale：图片压缩比例，也是建议0.5
// ext：源图片拓展名
// callback：转换成功之后回调函数

function imgCompress(imgsrc, quality, scale, ext, callback) {
	// 压缩文件的保存目录
	var savePath = api.cacheDir + "/nearby/pic/";
	// 压缩文件生成的随机文件名称
	var savename = NewGuid() + "." + ext;
	api.require("imageFilter").compress({
		img : imgsrc,
		quality : quality,
		scale : quality,
		save : {
			album : false,
			imgPath : savePath,
			imgName : savename
		}
	}, function(ret, err) {
		if (ret) {
			callback(savePath + savename);
		} else {

		}
	});
}


function addPress(obj, index) {
	// 获取目前长按的对象
	var hammertime = new Hammer(obj[0]);
	// 绑定长按对象
	hammertime.on("press", function(e) {
		api.confirm({
			title : '温馨提示',
			msg : '您确定要删除该图片吗？',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			if (ret.buttonIndex == 1) {
				// 移除自己
				$$(obj).remove();
				api.toast({
					msg : '删除成功！'
				});
				//发送个事件
		        api.sendEvent({
		            name: 'delPic',
		            extra:{fileName:'waiting'}
		        });
			}
		});
	});
}

function openImageBrowser(imgs) {

	imageBrowser.openImages({
		imageUrls : imgs,
		showList : false,
		activeIndex : 0
	});
}

function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.src = url;    
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
    var that = this;
    //生成比例 
    var w = that.width,
        h = that.height,
        scale = w / h;
        if(w<=h){
        	w = 346 || w;
        	h = w / scale;
        }
        if(w>h){
        	h = 346 || h;
        	w = h * scale;
        }
//      canvas.height = img.height;
//      canvas.width = img.width;
        ctx.drawImage(img,0,0);
        $api.attr(canvas,'width',''+w+'');
        $api.attr(canvas,'height',''+h+'');
        ctx.drawImage(that, 0, 0, w, h);
        var ext = getExt(img.src);
        var dataURL = canvas.toDataURL("image/"+ext);
        
//      var dataURL = canvas.toDataURL(outputFormat || 'image/png' );
        callback.call(this, dataURL);
        canvas = null; 
    };
}

// 上传图片
// url：上传的url地址
// data：上传的文件
// callback：上传成功返回地址
function uploadFile( data,imgPath,ext,callback) {
$$.ajax({
		url: rootUrl + 'index.php/nearby/personnel/Personnel_ajax/uploadImage',
		dataType: 'json',
		method: 'post',
//		async:false,//同步执行
		data: {
			pic: data,
			imgPath:imgPath,
			ext:ext
		},
		success: function(data) {
			var message = data.message;
			callback(data.imgName);
		},
		error: function(data,e) {

		}
	});
}

function writeFile(json,fileName,pageNum){
        //缓存目录
    var cacheDir = api.cacheDir;
    //内容的数据，内容的数据存储时就根据自己的需要来看存储哪些，可以循环过滤一下
    //写入文件
    api.writeFile({
            //保存路径
        path: cacheDir+'/om/'+fileName+'/'+fileName+pageNum+'.json',
        //保存数据，记得转换格式
        data: JSON.stringify(json)
    }, function(ret, err){

    })
}

//装载人员列表
function initPersonnelList(data_list,searchFlag){
	var ul = $$('#theList');
	if (data_list.length>0) {
		if (searchFlag != '2') {
			$$('#theList').html('');
		}
		for (var i = 0; i < data_list.length; i++) {
			var template = '';
			var id = data_list[i].id;
			var userName = data_list[i].username;
			var age = data_list[i].age;
			var gender = data_list[i].gender;
			var genderEn = 'male';
			var userSign ='';
			if(data_list[i].usersign!=null){
				userSign=data_list[i].usersign;
			}
			 
			var userImage = data_list[i].userimage;
			var userLevel = data_list[i].userlevel;
			var creatTime = data_list[i].creattime;
			if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
				creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
			} else if (parseInt(creatTime) / 60 >= 24) {
				creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
			} else {
				creatTime = (creatTime==0?1:creatTime) + '分钟前';
			}
			if (gender == '2') {
				genderEn = 'famale';
			}
			
			var winWidth=70*Math.floor(api.winWidth/320);
			template += '<li id="'+id+'">' +
				'<a href="html/user/userinfo_view.html?type=1&userID='+id+'" class="item-link">' +
				'<div class="item-link item-content" style="padding-top: 0px;">' +
				'<div class="item-media"><img src="' + (rootUrl + userImage) + '" width="'+winWidth+'px" height="'+winWidth+'px"></div>' +
				'<div class="item-inner">' +
				'<div class="item-title-row">' +
				'<div class="item-title"><span>' + userName + '</span></div>' +
				'<div class="item-after "><span>'+data_list[i].distance+'km&nbsp;|&nbsp;' + creatTime + '</span></div>' +
				'</div>' +
//				'<div class="item-subtitle">' +
//				'<div class="sex sex-bgc' + gender + ' l_float">' +
//				'<img class="img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span>' + age + '</span>' +
//				'</div>' +
//				'<div class="vip">' +
//				'<img class="img2" src="' + userLevel + '" />' +
//				'</div>' +
//				'</div>' +
				'<div class="item-text" style="width:150px;"><span style="width:150px;">' + userSign + '</span></div>' +
//				'</div>' +
//				'</div>' +
//				'</a>' +
//				'<div class="key-word " onclick="viewkey(\'' + id + '\');">' +
//				'<span class="button button-fill color-teal">关键词</span>' +
//				'</div>' +
				'</li>';
			ul.append(template);
		}
		if(searchFlag!='2'){
			lastDistance = data_list[0].distance;
		}
		if(data_list.length<20){
			myApp.detachInfiniteScroll($$('#nearbyRefresh'));
			$$('#loadMore').css('display','none');
		}
	} else {
		$$('#theList').html('');
		ul.append('<span></span>');
		myApp.detachInfiniteScroll($$('#nearbyRefresh'));
		$$('#loadMore').css('display','none');
	}
	$$("#laodnow").css('display','none');
}
//装载动态列表,searchFlag:0 初始化查询 和 刷新；1 下拉刷新 ；  2 发布动态后回列表页；3 加载更多
function initDynamicList(data,searchFlag){
	Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
			_im_emotionData = emotion;
	});
	
//	if (data == "[object Object]") {
//
//		alert("没有数据！！");
//		return;
//		
//	}

	//alert("rrrrr" + data.datasources[0]);
	
	var data_list = data.datasources[0].rows;
	var data_comment = data.datasources[1].rows;
	var card = $$('#tab-dynamic');
	var namewidth = api.winWidth - 250;
	if (data_list.length > 0) {
		if (searchFlag == '0'||searchFlag == '1') {
			$$('#tab-dynamic').html('');
			if(data_list.length<20){
				myApp.detachInfiniteScroll($$('#nearbyRefresh'));
				$$('#loadMore').css('display','none');
			}
		}else if(searchFlag == '3'){
			if(data_list.length<20){
				myApp.detachInfiniteScroll($$('#nearbyRefresh'));
				$$('#loadMore').css('display','none');
			}
		}
		for (var i = 0; i < data_list.length; i++) {
			var template = '';
			var dynamicComment='';
			var id = data_list[i].id;
//			if(id==lastDyId&&searchFlag=='1'){
//				break;
//			}
			var dyUserId = data_list[i].dyuserid;
			//alert("dyUserId" + dyUserId);
			var userName = data_list[i].username;
			//alert("userName" + userName);
			var age = data_list[i].age;
			//alert("age" + age);
			var gender = data_list[i].gender;
			//alert("gender" + gender);
			var genderEn = 'male';
			var userImage = data_list[i].userimage;
			var userLevel = data_list[i].userlevel;
			var content = window.Auto517.UIChatbox._im_transText(data_list[i].content);
//			var content=data_list[i].content;
			var communityName = data_list[i].communityname;
			var creatTime = data_list[i].creattime;
			var readNum = data_list[i].readnum;
			var praise = data_list[i].praise;
			var dynamicImage = data_list[i].dynamicimage;
			var isPraise = data_list[i].ispraise;
			var c_dynamic_essence = data_list[i].c_dynamic_essence;
			if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
				creatTime = Math.floor(parseInt(creatTime) / 60) + '小时前';
			} else if (parseInt(creatTime) / 60 >= 24) {
				creatTime = Math.floor(parseInt(creatTime) / (60 * 24)) + '天前';
			} else {
				creatTime = (creatTime==0?1:creatTime) + '分钟前';
			}
			if (gender == '2') {
				genderEn = 'famale';
			}
			if(praise==0){
				praise = '赞';
			}
			
			//图片
			var dynamicImages = '';
			var dynamicImageHtml = '';
			if (dynamicImage != null && dynamicImage != '') {
				dynamicImages = dynamicImage.split(',');
				for (var j = 0; j < (dynamicImages.length > 3 ? 3 : dynamicImages.length); j++) {
					// 创建对象  
					var img = new Image();  
					var imgPath =rootUrl+ dynamicImages[j];
					// 改变图片的src  
					if(searchFlag == '2'){
						img.src = dynamicImages[j];
						imgPath = dynamicImages[j];
					}else{
						img.src = api.cacheDir + "/nearby/pic" +dynamicImages[j].substring(dynamicImages[j].lastIndexOf('/'));
					}
					if(img.width==0){
						img.src = rootUrl+ dynamicImages[j]; 
					}
//					var cssKey = 'width';
					var classKey ='dyImgPositionE';
//					if(img.width>img.height){
//						cssKey = 'height';
//						classKey = 'dyImgPositionH';
//					}
//					if(img.width==img.height){
//						classKey = 'dyImgPositionE';
//					}
					var winWidth = api.winWidth/4;
					dynamicImageHtml += '<div class="pb-standalone-dark dyImg"  style="width:'+winWidth+'px;height:'+winWidth+'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">' +
						'<img class="cache '+classKey+' " src="' +imgPath+ '" width="'+winWidth+'px" height="'+winWidth+'px" />' +
						'</div>';
				}
			}
			//是否已赞,大于零已赞
			var thumbsClass = 'icon-thumbs-up-alt';
			if (parseInt(isPraise) > 0) {
				thumbsClass = 'icon-thumbs-up';
			}
			var flag=0;
			dynamicComment+='<div class="comment">';
			//评论
			for(var j=0;j<data_comment.length;j++){
					if(data_comment[j].dynamicid==id){
						dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
						dynamicComment+=	'<ul >';
						dynamicComment+='			<li style="border-bottom:1px;">';
						dynamicComment+='	          <div class="item-title" style="font-size:14px;padding:0px;margin:0px;white-space:normal;"><span style="color:#0EAAE3;">'+data_comment[j].c_user_name+':</span>&nbsp;&nbsp;<span>'+window.Auto517.UIChatbox._im_transText(data_comment[j].c_comment_content)+'<span ></div>';
						dynamicComment+='	          </li>' ;
						dynamicComment+='	         </ul>';
						dynamicComment+='	        </div>';
						flag++;
					}
					
				}
			dynamicComment+='</div>';
			var headWidth=45*Math.floor(api.winWidth/320);
			template += '<div id="'+id+'" class="card" style="padding-bottom:10px;">' 
				if(c_dynamic_essence==0){
					template +='		<div class="userImage-1" style="margin-right:0px;padding-right:0px;">' 
					template +='		<img src="image/community/communityjing.png" style="width: 100%" />' 
					template +='		</div><br/>' 
				}
			template +=	'<div class="card-header ">' +
				'<div class="facebook-avatar" style="padding-right: 5px;padding-left: 5px;"><img style="width:'+headWidth+'px;height:'+headWidth+'px;" src="' + (rootUrl + userImage) + '"></div>' +
				'<div class="facebook-name">' +
				'<div class="title">' +
				'<div class="title-name" >' +
				'<span class="titlespan" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden; max-width:'+namewidth+'px;">' + userName + '</span>' +
				'</div>' +
//				'<div class="sex sex-bgc' + gender + ' l_float">' +
//				'<img class="img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span>' + age + '</span>' +
//				'</div>' +
//				'<div class="vip l_float">' +
//				'<img class="img2" src="' + userLevel + '" />' +
//				'</div>' +
				'</div>' +
				'<div class="sectitle">' +
				'<span>' + communityName + '</span>' +
				'</div>' +
				'</div>' +
				'<div id=time'+id+' class="facebook-date facebook-dateafter r_float" onclick="notFunOrReport(\''+id+'\',\''+dyUserId+'\');">' + creatTime + '&nbsp;<i class="icon-angle-down" ></i></div>' +
				'</div>' +
				'<a href="#" onclick="evaClick(\'' + id + '\',\''+dyUserId+'\',1);"><div class="card-content">' +
				'<div class="card-content-inner" style="color: #A2A2A2;font-size: 14px;padding-left: 5px;padding-right: 5px;">' +
				'<p style="word-break: break-all">' + Auto517.UIChatbox._im_transText(content) + '</p>' +
				dynamicImageHtml +
				'</div>' +
				'</div></a>' +
				'<div class="card-footer">' +
				'<div class="card-footer-title">' +
				'<span>'+data_list[i].distance+'km</span>&nbsp;' +
				'<span>' + readNum + '阅读</span>';
			if(dyUserId==uid){
				template +='&nbsp;<a href="#" class="confirm-title-ok" onclick="user_info_deleteSelfDynamic(\''+id+'\');"><span style="color:#0EAAE3">删除</span></a>' ;
			}
			template +='</div>' +
				'<div class="">' +
				'<div data-ids="'+id+'" id="comment'+id+'" class="r_float discuss" >' +
				'<i class="icon-flickr" ></i>' +
				'&nbsp;<span>'+flag+'</span>' +
				'</div>' +
				'<div class="r_float">' +
				'<i class="' + thumbsClass + '" onclick="clickThumbs(this,\'' + id + '\');"></i>' +
				'&nbsp;<span>' + praise + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'</div>' +
				'</div>' +
				'</div>' +
				dynamicComment+
				'</div>';
				
				
			
			if(searchFlag == '2'){
				card.prepend(template);		
				$$('#'+id).children('div').children('#time'+id).removeAttr("onclick");
				$$('#'+id).children('a').removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('a').removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('#comment'+id).removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('div').children('i').removeAttr("onclick");
			}else{
				card.append(template);
			}
			
		}
		
		
		if(searchFlag=='0'||searchFlag=='1'){
			lastDyId=data_list[0].id;
		}
			
	}
}

//装载邻里好友动态列表,searchFlag:0 初始化查询 和 刷新；1 下拉刷新 ；  2 发布动态后回列表页；3 加载更多
function initNeighboursDynamicList(data,searchFlag){
	Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
			_im_emotionData = emotion;
	});
	var data_list = data.datasources[0].rows;
	var data_comment = data.datasources[1].rows;
	var card = $$('#neighbours-dynamic');
	var namewidth = api.winWidth - 250;
	if (data_list.length > 0) {
		if (searchFlag == '0'||searchFlag == '1') {
			$$('#neighbours-dynamic').html('');
			if(data_list.length<20){
				myApp.detachInfiniteScroll($$('#personnelDynamicRefresh'));
				$$('#personnelDynamicLoadMore').css('display','none');
			}
		}else if(searchFlag == '3'){
			if(data_list.length<20){
				myApp.detachInfiniteScroll($$('#personnelDynamicRefresh'));
				$$('#personnelDynamicLoadMore').css('display','none');
			}
		}
		for (var i = 0; i < data_list.length; i++) {
			var template = '';
			var dynamicComment='';
			var id = data_list[i].id;
//			if(id==lastDyId&&searchFlag=='1'){
//				break;
//			}
			var dyUserId = data_list[i].dyuserid;
			var userName = data_list[i].username;
			var age = data_list[i].age;
			var gender = data_list[i].gender;
			var genderEn = 'male';
			var userImage = data_list[i].userimage;
			var userLevel = data_list[i].userlevel;
			var content = window.Auto517.UIChatbox._im_transText(data_list[i].content);
//			var content=data_list[i].content;
			var communityName = data_list[i].communityname;
			var creatTime = data_list[i].creattime;
			var readNum = data_list[i].readnum;
			var praise = data_list[i].praise;
			var dynamicImage = data_list[i].dynamicimage;
			var isPraise = data_list[i].ispraise;
			var c_dynamic_essence = data_list[i].c_dynamic_essence;
			if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
				creatTime = Math.floor(parseInt(creatTime) / 60) + '小时前';
			} else if (parseInt(creatTime) / 60 >= 24) {
				creatTime = Math.floor(parseInt(creatTime) / (60 * 24)) + '天前';
			} else {
				creatTime = (creatTime==0?1:creatTime) + '分钟前';
			}
			if (gender == '2') {
				genderEn = 'famale';
			}
			if(praise==0){
				praise = '赞';
			}
			
			//图片
			var dynamicImages = '';
			var dynamicImageHtml = '';
			if (dynamicImage != null && dynamicImage != '') {
				dynamicImages = dynamicImage.split(',');
				for (var j = 0; j < (dynamicImages.length > 3 ? 3 : dynamicImages.length); j++) {
					// 创建对象  
					var img = new Image();  
					var imgPath =rootUrl+ dynamicImages[j];
					// 改变图片的src  
					if(searchFlag == '2'){
						img.src = dynamicImages[j];
						imgPath = dynamicImages[j];
					}else{
						img.src = api.cacheDir + "/nearby/pic" +dynamicImages[j].substring(dynamicImages[j].lastIndexOf('/'));
					}
					if(img.width==0){
						img.src = rootUrl+ dynamicImages[j]; 
					}
//					var cssKey = 'width';
					var classKey ='dyImgPositionE';
//					if(img.width>img.height){
//						cssKey = 'height';
//						classKey = 'dyImgPositionH';
//					}
//					if(img.width==img.height){
//						classKey = 'dyImgPositionE';
//					}
					var winWidth = api.winWidth/4;
					dynamicImageHtml += '<div class="pb-standalone-dark dyImg"  style="width:'+winWidth+'px;height:'+winWidth+'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">' +
						'<img class="cache '+classKey+' " src="' +imgPath+ '" width="'+winWidth+'px" height="'+winWidth+'px" />' +
						'</div>';
				}
			}
			//是否已赞,大于零已赞
			var thumbsClass = 'icon-thumbs-up-alt';
			if (parseInt(isPraise) > 0) {
				thumbsClass = 'icon-thumbs-up';
			}
			var flag=0;
			dynamicComment+='<div class="comment">';
			//评论
			for(var j=0;j<data_comment.length;j++){
					if(data_comment[j].dynamicid==id){
						dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
						dynamicComment+=	'<ul >';
						dynamicComment+='			<li style="border-bottom:1px;">';
						dynamicComment+='	          <div class="item-title" style="font-size:14px;padding:0px;margin:0px;white-space:normal;"><span style="color:#0EAAE3;">'+data_comment[j].c_user_name+':</span>&nbsp;&nbsp;<span>'+window.Auto517.UIChatbox._im_transText(data_comment[j].c_comment_content)+'<span ></div>';
						dynamicComment+='	          </li>' ;
						dynamicComment+='	         </ul>';
						dynamicComment+='	        </div>';
						flag++;
					}
					
				}
			dynamicComment+='</div>';
			var headWidth=45*Math.floor(api.winWidth/320);
			template += '<div id="'+id+'" class="card" style="padding-bottom:10px;">' 
				if(c_dynamic_essence==0){
					template +='		<div class="userImage-1" style="margin-right:0px;padding-right:0px;">' 
					template +='		<img src="image/community/communityjing.png" style="width: 100%" />' 
					template +='		</div><br/>' 
				}
			template +=	'<div class="card-header ">' +
				'<div class="facebook-avatar" style="padding-right: 5px;padding-left: 5px;"><img style="width:'+headWidth+'px;height:'+headWidth+'px;" src="' + (rootUrl + userImage) + '"></div>' +
				'<div class="facebook-name">' +
				'<div class="title">' +
				'<div class="title-name" >' +
				'<span class="titlespan" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden; max-width:'+namewidth+'px;">' + userName + '</span>' +
				'</div>' +
//				'<div class="sex sex-bgc' + gender + ' l_float">' +
//				'<img class="img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span>' + age + '</span>' +
//				'</div>' +
//				'<div class="vip l_float">' +
//				'<img class="img2" src="' + userLevel + '" />' +
//				'</div>' +
				'</div>' +
				'<div class="sectitle">' +
				'<span>' + communityName + '</span>' +
				'</div>' +
				'</div>' +
				'<div id=time'+id+' class="facebook-date facebook-dateafter r_float" onclick="notFunOrReport(\''+id+'\',\''+dyUserId+'\');">' + creatTime + '&nbsp;<i class="icon-angle-down" ></i></div>' +
				'</div>' +
				'<a href="#" onclick="evaClick(\'' + id + '\',\''+dyUserId+'\',1);"><div class="card-content">' +
				'<div class="card-content-inner" style="color: #A2A2A2;font-size: 14px;padding-left: 5px;padding-right: 5px;">' +
				'<p style="word-break: break-all">' + Auto517.UIChatbox._im_transText(content) + '</p>' +
				dynamicImageHtml +
				'</div>' +
				'</div></a>' +
				'<div class="card-footer">' +
				'<div class="card-footer-title">' +
				'<span>'+data_list[i].distance+'km</span>&nbsp;' +
				'<span>' + readNum + '阅读</span>';
			if(dyUserId==uid){
				template +='&nbsp;<a href="#" class="confirm-title-ok" onclick="user_info_deleteSelfDynamic(\''+id+'\');"><span style="color:#0EAAE3">删除</span></a>' ;
			}
			template +='</div>' +
				'<div class="">' +
				'<div data-ids="'+id+'" id="comment'+id+'" class="r_float discuss" >' +
				'<i class="icon-flickr" ></i>' +
				'&nbsp;<span>'+flag+'</span>' +
				'</div>' +
				'<div class="r_float">' +
				'<i class="' + thumbsClass + '" onclick="clickThumbs(this,\'' + id + '\');"></i>' +
				'&nbsp;<span>' + praise + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'</div>' +
				'</div>' +
				'</div>' +
				dynamicComment+
				'</div>';
				
				
			
			if(searchFlag == '2'){
				card.prepend(template);		
				$$('#'+id).children('div').children('#time'+id).removeAttr("onclick");
				$$('#'+id).children('a').removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('a').removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('#comment'+id).removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('div').children('i').removeAttr("onclick");
			}else{
				card.append(template);
			}
			
		}
		
		
		if(searchFlag=='0'||searchFlag=='1'){
			lastDyId=data_list[0].id;
		}
			
	}
}

//装载生活好友动态列表,searchFlag:0 初始化查询 和 刷新；1 下拉刷新 ；  2 发布动态后回列表页；3 加载更多
function initFriendDynamicList(data,searchFlag){
	Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
			_im_emotionData = emotion;
	});
	var data_list = data.datasources[0].rows;
	var data_comment = data.datasources[1].rows;
	var card = $$('#friend-dynamic');
	var namewidth = api.winWidth - 250;
	if (data_list.length > 0) {
		if (searchFlag == '0'||searchFlag == '1') {
			$$('#friend-dynamic').html('');
			if(data_list.length<20){
				myApp.detachInfiniteScroll($$('#personnelDynamicRefresh'));
				$$('#personnelDynamicLoadMore').css('display','none');
			}
		}else if(searchFlag == '3'){
			if(data_list.length<20){
				myApp.detachInfiniteScroll($$('#personnelDynamicRefresh'));
				$$('#personnelDynamicLoadMore').css('display','none');
			}
		}
		for (var i = 0; i < data_list.length; i++) {
			var template = '';
			var dynamicComment='';
			var id = data_list[i].id;
//			if(id==lastDyId&&searchFlag=='1'){
//				break;
//			}
			var dyUserId = data_list[i].dyuserid;
			var userName = data_list[i].username;
			var age = data_list[i].age;
			var gender = data_list[i].gender;
			var genderEn = 'male';
			var userImage = data_list[i].userimage;
			var userLevel = data_list[i].userlevel;
			var content = window.Auto517.UIChatbox._im_transText(data_list[i].content);
//			var content=data_list[i].content;
			var communityName = data_list[i].communityname;
			var creatTime = data_list[i].creattime;
			var readNum = data_list[i].readnum;
			var praise = data_list[i].praise;
			var dynamicImage = data_list[i].dynamicimage;
			var isPraise = data_list[i].ispraise;
			var c_dynamic_essence = data_list[i].c_dynamic_essence;
			if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
				creatTime = Math.floor(parseInt(creatTime) / 60) + '小时前';
			} else if (parseInt(creatTime) / 60 >= 24) {
				creatTime = Math.floor(parseInt(creatTime) / (60 * 24)) + '天前';
			} else {
				creatTime = (creatTime==0?1:creatTime) + '分钟前';
			}
			if (gender == '2') {
				genderEn = 'famale';
			}
			if(praise==0){
				praise = '赞';
			}
			
			//图片
			var dynamicImages = '';
			var dynamicImageHtml = '';
			if (dynamicImage != null && dynamicImage != '') {
				dynamicImages = dynamicImage.split(',');
				for (var j = 0; j < (dynamicImages.length > 3 ? 3 : dynamicImages.length); j++) {
					// 创建对象  
					var img = new Image();  
					var imgPath =rootUrl+ dynamicImages[j];
					// 改变图片的src  
					if(searchFlag == '2'){
						img.src = dynamicImages[j];
						imgPath = dynamicImages[j];
					}else{
						img.src = api.cacheDir + "/nearby/pic" +dynamicImages[j].substring(dynamicImages[j].lastIndexOf('/'));
					}
					if(img.width==0){
						img.src = rootUrl+ dynamicImages[j]; 
					}
//					var cssKey = 'width';
					var classKey ='dyImgPositionE';
//					if(img.width>img.height){
//						cssKey = 'height';
//						classKey = 'dyImgPositionH';
//					}
//					if(img.width==img.height){
//						classKey = 'dyImgPositionE';
//					}
					var winWidth = api.winWidth/4;
					dynamicImageHtml += '<div class="pb-standalone-dark dyImg"  style="width:'+winWidth+'px;height:'+winWidth+'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">' +
						'<img class="cache '+classKey+' " src="' +imgPath+ '" width="'+winWidth+'px" height="'+winWidth+'px" />' +
						'</div>';
				}
			}
			//是否已赞,大于零已赞
			var thumbsClass = 'icon-thumbs-up-alt';
			if (parseInt(isPraise) > 0) {
				thumbsClass = 'icon-thumbs-up';
			}
			var flag=0;
			dynamicComment+='<div class="comment">';
			//评论
			for(var j=0;j<data_comment.length;j++){
					if(data_comment[j].dynamicid==id){
						dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
						dynamicComment+=	'<ul >';
						dynamicComment+='			<li style="border-bottom:1px;">';
						dynamicComment+='	          <div class="item-title" style="font-size:14px;padding:0px;margin:0px;white-space:normal;"><span style="color:#0EAAE3;">'+data_comment[j].c_user_name+':</span>&nbsp;&nbsp;<span>'+window.Auto517.UIChatbox._im_transText(data_comment[j].c_comment_content)+'<span ></div>';
						dynamicComment+='	          </li>' ;
						dynamicComment+='	         </ul>';
						dynamicComment+='	        </div>';
						flag++;
					}
					
				}
			dynamicComment+='</div>';
			var headWidth=45*Math.floor(api.winWidth/320);
			template += '<div id="'+id+'" class="card" style="padding-bottom:10px;">' 
				if(c_dynamic_essence==0){
					template +='		<div class="userImage-1" style="margin-right:0px;padding-right:0px;">' 
					template +='		<img src="image/community/communityjing.png" style="width: 100%" />' 
					template +='		</div><br/>' 
				}
			template +=	'<div class="card-header ">' +
				'<div class="facebook-avatar" style="padding-right: 5px;padding-left: 5px;"><img style="width:'+headWidth+'px;height:'+headWidth+'px;" src="' + (rootUrl + userImage) + '"></div>' +
				'<div class="facebook-name">' +
				'<div class="title">' +
				'<div class="title-name" >' +
				'<span class="titlespan" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden; max-width:'+namewidth+'px;">' + userName + '</span>' +
				'</div>' +
				'<div class="sex sex-bgc' + gender + ' l_float">' +
				'<img class="img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span>' + age + '</span>' +
				'</div>' +
				'<div class="vip l_float">' +
				'<img class="img2" src="' + userLevel + '" />' +
				'</div>' +
				'</div>' +
				'<div class="sectitle">' +
				'<span>' + communityName + '</span>' +
				'</div>' +
				'</div>' +
				'<div id=time'+id+' class="facebook-date facebook-dateafter r_float" onclick="notFunOrReport(\''+id+'\',\''+dyUserId+'\');">' + creatTime + '&nbsp;<i class="icon-angle-down" ></i></div>' +
				'</div>' +
				'<a href="#" onclick="evaClick(\'' + id + '\',\''+dyUserId+'\',1);"><div class="card-content">' +
				'<div class="card-content-inner" style="color: #A2A2A2;font-size: 14px;padding-left: 5px;padding-right: 5px;">' +
				'<p style="word-break: break-all">' + Auto517.UIChatbox._im_transText(content) + '</p>' +
				dynamicImageHtml +
				'</div>' +
				'</div></a>' +
				'<div class="card-footer">' +
				'<div class="card-footer-title">' +
				'<span>'+data_list[i].distance+'km</span>&nbsp;' +
				'<span>' + readNum + '阅读</span>';
			if(dyUserId==uid){
				template +='&nbsp;<a href="#" class="confirm-title-ok" onclick="user_info_deleteSelfDynamic(\''+id+'\');"><span style="color:#0EAAE3">删除</span></a>' ;
			}
			template +='</div>' +
				'<div class="">' +
				'<div data-ids="'+id+'" id="comment'+id+'" class="r_float discuss" >' +
				'<i class="icon-flickr" ></i>' +
				'&nbsp;<span>'+flag+'</span>' +
				'</div>' +
				'<div class="r_float">' +
				'<i class="' + thumbsClass + '" onclick="clickThumbs(this,\'' + id + '\');"></i>' +
				'&nbsp;<span>' + praise + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
				'</div>' +
				'</div>' +
				'</div>' +
				dynamicComment+
				'</div>';
				
				
			
			if(searchFlag == '2'){
				card.prepend(template);		
				$$('#'+id).children('div').children('#time'+id).removeAttr("onclick");
				$$('#'+id).children('a').removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('a').removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('#comment'+id).removeAttr("onclick");
				$$('#'+id).children('div').children('div').children('div').children('i').removeAttr("onclick");
			}else{
				card.append(template);
			}
			
		}
		
		
		if(searchFlag=='0'||searchFlag=='1'){
			lastDyId=data_list[0].id;
		}
			
	}
	
	
}
//缓存图片
function iCache(selector,fileDirectory) {
	selector.each(function(data) {! function(data) {
			var url = selector.eq(data).attr("src");
			var img = this;
			var pos = url.lastIndexOf("/");
			var filename = url.substring(pos + 1);
			var path = api.cacheDir + fileDirectory + filename;
			var obj = api.require('fs');
			obj.exist({
				path : path
			}, function(ret, err) {
				//msg(ret);
				if (ret.exist) {
					if (ret.directory) {
						//api.alert({msg:'该路径指向一个文件夹'});
					} else {
						if(url.indexOf(api.cacheDir)==-1){
							selector.eq(data).attr('src', null);
							path = api.cacheDir + fileDirectory + filename;
							selector.eq(data).attr('src', path);
						}
					}
				} else {
					api.download({
						url : url,
						savePath : path,
						report : false,
						cache : true,
						allowResume : true
					}, function(ret, err) {
						//msg(ret);
						if (ret) {
							var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
//							alert(value);
						} else {
							var value = err.msg;
						};
					});
				}
			});
		}(data);
	});
}

//初始化发布动态页监听
function initListener(status){
	//监听是否输入内容	
    $$('textarea[id="dynamic_content"]').on('input', function() {
    	if($$(this).val().replace(/[^\x00-\xff]/g,"0101").length>1200){
    		$$('#dy2').show();
    		$$('#dy1').hide();
    		toast.show("你输入的文字内容要小于300字");
    	}else if ($$(this).val().length > 0) {
			$$('#dy1').show();
			$$('#dy2').hide();
		} else {
			if($$('.tool').find('div div:not(#selectImg)').length-1==0){
				$$('#dy2').show();
				$$('#dy1').hide();
			}
		}
	});
	
	api.addEventListener({
        name:'addEmotion'
    },function(ret){
        if(ret && ret.value){
            $$('#dy1').show();
			$$('#dy2').hide();
        }
    });
	
	api.addEventListener({
        name:'addPic'
   },function(ret){
        if(ret && ret.value){
            $$('#dy1').show();
			$$('#dy2').hide();
        }
    });
    api.addEventListener({
        name:'delPic'
    },function(ret){
        if(ret && ret.value&&$$('#dynamic_content').val().length==0&&$$('.tool').find('div div:not(#selectImg)').length-1==0){
        	$$('#dy1').hide();
            $$('#dy2').show();
        }
    });
    
    //监听静默上传
    api.addEventListener({
        name:'waitUpload'
    },function(ret){
        if(ret && ret.value){
        	var value = ret.value;
            var cacheDir = api.cacheDir;
            api.readFile({
                path: cacheDir+'/nearby/selfDy/'+value.fileName+'.json'
            }, function(ret, err){
                if(ret.status){
                	var jsonData = JSON.parse('['+ret.data+']');
                	if(status=='personnal'){
                		user_dynamic_add(jsonData);
                	}else{
                		initDynamicList(jsonData,'2');
                		iCache($$('.cache'),"/nearby/pic/");
                	}
                    //如果监听到事件，先利用readFile来读取数据并写入到列表页，就省略这块了

                    //加了个延迟来同步服务器，传入数据，我这里的数据后面加了个0，因为在开发的时候我用了doT模板引擎，在发布保存的时候我组装的是一个多维数组，然后这里只取了第一个数组。
                    setTimeout(function(){
                        synchroServer(jsonData[0],status);
                    },500)

                }
        });
        }
    });
}


//初始化相机和相册选相
function initSelectPic(){
	
	$$('.phone').on('click', function() {
		var imgLength = $$('#releaseDy .tool').children('.phone').length-1;
		if(imgLength==6){
			toast.show("您已上传六张图片，不能继续上传了");
			return
		};
		var buttons1 = [{
				text: '<span style="color:#0EAAE3">拍照</span>',
				onClick: function() {
					api.getPicture({
						sourceType: 'camera',
						encodingType: 'jpg',
						mediaValue: 'pic',
						destinationType: 'url',
						allowEdit: true,
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
                            //发送个事件
					        api.sendEvent({
					            name: 'addPic',
					            extra:{fileName:'waiting'}
					        });
                            // 追加图片
                            $$('#releaseDy .tool').prepend(showImgHtml);
                            addPress($$(".phone img[src='" + compressImg + "']").parent('div'));
                            });
						} else {
							
						}
					});
				}
			}, {
				text: '<span style="color:#0EAAE3">从手机相册选择</span>',
				onClick: function() {
				uiMediaScanner.open({
						type : 'picture',
						column : 4,
						classify : true,
						max : 6,
						sort : {
							key : 'time',
							order : 'desc'
						},
						texts : {
							stateText : '已选*项',
							cancelText : '取消',
							finishText : '完成'
						},
						styles : {
							bg : '#fff',
							mark : {
								icon : '',
								position : 'bottom_left',
								size : 20
							},
							nav : {
								bg : '#0EAAE3',
								stateColor : '#fff',
								stateSize : 18,
								cancelBg : 'rgba(0,0,0,0)',
								cancelColor : '#fff',
								cancelSize : 18,
								finishBg : 'rgba(0,0,0,0)',
								finishColor : '#fff',
								finishSize : 18
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
									path : selectimgPath
								}, function(transObj) {
									// 图片压缩
									imgCompress(transObj.path, 0.5, 0.5, selectImg.suffix, function(compressImg) {
//										if(i==3){
//											$$('#releaseDy .tool').prepend('<div id="imageListrow2" class=row></div>')
//										}
										$$('#releaseDy .tool').prepend('<div class="phone"><img src="' + compressImg + '" /></div>');
										//发送个事件
								        api.sendEvent({
								            name: 'addPic',
								            extra:{fileName:'waiting'}
								        });
										addPress($$("img[src='" + compressImg + "']").parent('div'));
									});
								});
							} else {
								// 图片压缩
								imgCompress(selectimgPath, 0.5, 0.5, selectImg.suffix, function(compressImg) {
									// 追加图片
									$$('#releaseDy .tool').prepend('<div class="phone"><img src="' + compressImg + '" /></div>');
										//发送个事件
							        api.sendEvent({
							            name: 'addPic',
							            extra:{fileName:'waiting'}
							        });
									addPress($$("img[src='" + compressImg + "']").parent('div'));
								});
							}

						}
					}
				});

				}
			}

		];
		var buttons2 = [{
			text: '<span style="color:#0EAAE3;font-weight: 500;">取消</span>',
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	});
}



//动态不感兴趣处理
function insertDynamicInteresting(dynamicID,dyUserId,functionName){
	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: false,
		funName: "insertDynamicInteresting",
		form: "{uid: '"+uid+"',dynamic_id:'"+dynamicID+"'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			if(data.execStatus == 'true'){
				$$("#"+dynamicID).css('display','none');
			}
		},
		error: function(xhr, type) {
			
		}
	});
}

//动态中下三角点击事件

function notFunOrReport(dynamicId,dyUserId) {
	var type=1;
	var buttons1 = [{
			text: '操作',
			label: true
		}, {
			text: '<span style="color:#0EAAE3">不感兴趣</span>',
			onClick: function() {
				insertDynamicInteresting(dynamicId,dyUserId);	
			}
		},{
			text : '<span style="color:#0EAAE3">收藏</span>',
			onClick : function() {
				shoucang(dyUserId,dynamicId,1);
			}
		}, {
			text: '<span style="color:#0EAAE3">举报</span>',
			onClick: function() {
				mainView.router.loadPage('html/nearby/nearbyNewsReport.html?dynamicId="'+dynamicId+'"');
			}
		}

	];
	var buttons2 = [{
		text: '<span style="color:#0EAAE3;font-weight: 500;">取消</span>',
		onClick: function(){
			
		}
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
}
//上传图片的方法
function uploadimage(value,callback){
	var path;
	
	
		api.ajax({
		url: rootUrl + '/api/uploadForOM',
		method: 'post',
		async: false,
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
//uichatbox在点击其他位置关闭键盘
var closeKeyBoard=function(){
	window.Auto517.UIChatbox._inputBar_closeBoard();

}

function shoucang(dyUserId,dynamicId,type){
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});
	myApp.confirm('是否确定收藏该动态？', '', function(){
		var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: true,
		funName: "insertt_collection",
		form: "{c_user_id: '"+uid+"',c_dynamic_id:'"+dynamicId+"',c_type:'"+type+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			if(data.formDataset.checked == 'true'){
					toast.show("收藏成功");
//					mainView.router.back();
			}else{
				toast.show("已收藏");
			}
		},					
		error: function(xhr, type) {

			toast.show("请求失败");
		}
	});
	});
	
	
}
