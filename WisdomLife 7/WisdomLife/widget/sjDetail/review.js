var urId;
var headurls = '';
var attachmentPic = '';
apiready = function() {
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;

	});
	var name = api.pageParam.name;
	var fid = api.pageParam.id;
	$('#topName').html(name);
	$('#topName').html(name);
	var header = $api.byId('title');
	var topPing = $api.byId('topPing');
	var top = $api.dom('.top')
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
		$api.css(top, 'margin-top:20px;');
		$api.css(topPing, 'margin-top:66px;');
	}
	//取消回转
	$("#cancel").on('click', function() {
		api.closeWin();
	});

	var oStar = document.getElementById("top_first");
	var aLi = $('.top_first li')
	var i = iScore = iStar = 0;
	for ( i = 1; i <= aLi.length; i++) {
		aLi[i - 1].index = i;
		//点击后进行评分处理
		aLi[i - 1].onclick = function() {
			iStar = this.index;
			fnPoint();
			//alert(iStar);
		}
	}

	function fnPoint(iArg) {
		iScore = iArg || iStar;
		for ( i = 0; i < aLi.length; i++)
			aLi[i].className = i < iScore ? "on" : "";
	}

	//选取相册
	$('#upLoad').click(function() {//选择相册
		api.getPrefs({
			key : 'hasLogon'
		}, function(ret, err) {
			var userName = ret.value;

			if (userName == 'true') {
				getPicture();
			} else {
				alert('请先去登录哦!')
			}
		});
	});

	//	function getPicture(type) {
	//	if (type == 0) {//本地相册
	//		api.getPicture({
	//			sourceType : 'library',
	//			mediaValue : 'pic',
	//			destinationType : 'url',
	//			allowEdit : true,
	//			quality : 100,
	//			//			targetWidth : 100,
	//			//			targetHeight : 100,
	//			saveToPhotoAlbum : false
	//		}, function(ret, err) {
	//			if (ret) {
	//				console.log(ret.data + "输出：+++++++++++++++++++++" + $api.jsonToStr(ret));
	//				//changeheadurl(ret.data);
	//			}
	//		});
	//	}
	//}

	function getPicture() {
		var UIMediaScanner = api.require('UIMediaScanner');
		UIMediaScanner.open({
			type : 'picture',
			column : 4,
			classify : true,
			max : 3,
			sort : {
				key : 'time',
				order : 'desc'
			},
			texts : {
				stateText : '已选择*项',
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
					bg : '#eee',
					stateColor : '#000',
					stateSize : 18,
					cancelBg : 'rgba(0,0,0,0)',
					cancelColor : '#000',
					cancelSize : 18,
					finishBg : 'rgba(0,0,0,0)',
					finishColor : '#000',
					finishSize : 18
				}
			},
//			scrollToBottom : {
//				intervalTime : 3,
//				anim : true
//			},
			exchange : true,
			rotation : true
		}, function(ret) {
			if (ret) {
				var account = ret.list;
				var nowlist = '';
				// alert(account.length);
				if (account == undefined || account == '' || account.length == '' || account.length == undefined || account.length == 0) {
					return false;
				} else {
					//		        if(account.length<3){
					//		        	alert('至少选择3张以上照片哦');
					//		        	return false;
					//		        }else{
					
					for (var i = 0; i < account.length; i++) {
						nowlist += '<div class="others"><img src="' + account[i].path + '" class="show"/><img src="img/redIcon.png" class="redIcon" /></div>'
						// headurl+=account[i].path;
					}

					//		        }
				}
				$('#upPic').append(nowlist);
				var showSrc = $('.show');
				for (var i = 0; i < showSrc.length; i++) {
					//headurls+=($(showSrc[i]).attr('src')+',');
					compress($(showSrc[i]).attr('src'));
					
				};
				console.log(showSrc);
//				setTimeout(function() {
//					var test = headurls.substring(0, headurls.length - 1);
//					var keke = test.split(',');
//					changeheadurl(keke);
//					console.log('keke的长度+++++++++++'+keke.length);
//				}, 1500);

			}
		});
	}

	function compress(compressPic) {
		//alert(compressPic);
		headurls='';
		var imgTempPath = compressPic.substring(compressPic.lastIndexOf("/"));
		if (api.systemType == 'ios') {
			var id=imgTempPath.substring(imgTempPath.indexOf('=')+1,imgTempPath.indexOf('&'));
			var cc = imgTempPath.replace('asset',id);
			var imgTempPath=cc.substring(0,cc.indexOf("?"));
		}
		var imageFilter = api.require('imageFilter');
		imageFilter.compress({
			img : compressPic,
			quality : 0.05,
			save : {
				imgPath : "fs://imgtemp",
				imgName : imgTempPath
			}
		}, function(ret, err) {
			if (ret.status) {
				headurls += "fs://imgtemp" + imgTempPath + ",";
				//alert(headurls);
			} else {
				alert(JSON.stringify(err));
			}
		});
	}

	//获取图片的路径  并提交给后台

	function showSrcs() {
		var showSrc = $('.show');
		if (iStar <= 0) {
			alert('请您评分!');
			return false;
		}
		if (showSrc.length >3) {
			alert('亲，最多上传3张照片哦');
			return false;
		} 
		if (showSrc.length <=0) {
			alert('亲，请上传照片哦！');
			return false;
		}else {
			// 评价部分  限制字数
			residue();
		}

	}

	//删除功能  获取路径 压缩
	$(document).on('click', '.others', function() {
		$(this).remove();
//		headurls='';
		var showSrc = $('.show');
			for (var i = 0; i < showSrc.length; i++) {
				//headurls+=($(showSrc[i]).attr('src')+',');
				compress($(showSrc[i]).attr('src'));
			};
	});
	//上传图片
	function changeheadurl(headurls) {
		//	if (headurls) {
		//var ddf={files:{file1:'/storage/emulated/0/DCIM/Camera/p-34289ded.jpg',file2:'/storage/emulated/0/DCIM/Camera/IMG_20170110_094927.jpg',}};
		api.showProgress({
			style : 'default',
			animationType : 'fade',
			title : '图片上传中...',
			text : '先喝杯茶...'
		});

		api.ajax({
			url : rootUrl + '/api/uploads',
			method : 'post',
			//report:true,
			contentType : "multipart/form-data",
			data : {
				files : {
					images : headurls
				}
			}
		}, function(ret, err) {
			api.hideProgress();
			console.log($api.jsonToStr(ret));
			if (ret.execStatus == 'true') {
				attachmentPic = ret.formDataset.saveNames;
				//alert('拿回来的路径'+attachmentPic);  上传接口拿回路径
				review();
			}
		});

		//}
	}

	//提交接口 提交给后台
	function review() {
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "addComment",
			form : {
				user_no : urId,
				company_no : fid,
				content : $('#top_area').val(),
				star : iStar,
				attachment : attachmentPic,
				status : 0
			},
			success : function(data) {
				
				api.execScript({//实现商家详情页的回显刷新
					name : 'business-man-list',
//					frameName : 'business-man-list',
					script : 'refresh()'
				});
				api.closeWin();
			}
		});
	}

	//实现剩余字数的判断并提交
	function residue() {

		var top_area = $('#top_area').val().length;
		if (top_area >= 7) {
			$('#textLen').html('谢谢您的评论');
//			review();
			var test = headurls.substring(0, headurls.length - 1);
			var keke = test.split(',');
			console.log('keke的长度+++++++++++'+keke.length);
			changeheadurl(keke);
		} else {
			$('#textLen').html('加油，还差' + (7 - top_area) + '个字');
			console.log('未满7字');
			return false;
		}
	}


	$('#sub').click(function() {
	//判断是否登录   来进行判断
		api.getPrefs({
			key : 'hasLogon'
		}, function(ret, err) {
			var userName = ret.value;
			//alert(userName);
			if (userName == 'true') {
				//获取路径并上传照片
				showSrcs();
			} else {
				alert('请先去登录哦!')
			}
		});

	})
}