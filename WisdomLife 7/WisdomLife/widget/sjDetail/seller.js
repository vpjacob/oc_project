var id;
var lon;
var lat;
var shopname;
var page = 1;
var pageCount = 1;
var chaPing = 0;
var haoPing = 0;
var companyNo;
var comtype = '';
var map;
var fname=""
apiready = function() {
	id = api.pageParam.id;
	comtype = api.pageParam.companytype;
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	$("#Back").on('click', function() {
		api.closeWin();
	});
	function listInfo(fid) {
		//    /console.log(fid);
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "getBusinessById",
			form : {
				fid : fid,
				lng : lon,
				lat : lat
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.comDTO;
					var list = $api.strToJson(account);
					$('#headpic').attr('src', rootUrl + list.shopurl);
					lon = list.longtitude;
					lat = list.latitude;
					shopname = list.companyname;
					var distance = list.distance;
					if (0 < distance && distance < 1000) {
						distance = ('距此' + (distance.toFixed(1)) + 'm');
					} else if (1000 <= distance && distance <= 100000) {
						distance = ((distance / 1000).toFixed(1));
						distance = ('距此' + distance + 'km');
					} else if (distance > 100000) {
						distance = ('大于100km');
					} else {
						distance = ('距离暂无');
					}
					var starlen = list.star;
					function starLenght(starlen) {
						var daF = '';
						var kf = '';
						if (starlen == 0 || starlen == '' || starlen == undefined) {
							daF = '<span style="line-height:20px;font-size:15px;">评星暂无</span>'
						} else {
							for (var k = 0; k < starlen; k++) {
								daF += '<img src="./img/stares.jpg" alt=""/>'
							}
							for (var w = 0; w < 5 - starlen; w++) {
								kf += '<img src="./img/gstars.png" alt=""/>'
							}
						}

						return daF + kf + '<span style="line-height:20px;font-size:15px;margin-left: 5px" id="pingCount"></span>';
					};
					var stares = starLenght(starlen);
					$('#showstar').append(stares);
					$('#distance').html(distance);
					fname=list.fname;
					list.fname == null ? $('.container').attr('id', '') : $('.container').attr('id', list.fname);
					list.companyname == null ? $('#name').html('无') : $('#name').html(list.companyname);
					list.companyname == null ? $('#sjname').html('无') : $('#sjname').html(list.companyname);
					list.address == null ? $('#address').html('无') : $('#address').html(list.address);
					list.companytype == null ? $('#companytype').html('无') : $('#companytype').html(list.industry_name);
					list.tel == null ? $('#tel').html('无') : $('#tel').html(list.tel);
					list.starttime == null ? $('#time').html('无') : $('#time').html(list.starttime + "-" + list.endtime);
					list.endtime == null ? $('#time').html('无') : $('#time').html(list.starttime + "-" + list.endtime);
					list.mainbusiness == null ? $('#mainbusiness').html('无') : $('#mainbusiness').html(list.mainbusiness);
					list.industry_name == null ? $('#type').html('无') : $('#type').html(list.industry_name);
					list.summary == null ? $('#summary').html('无') : $('#summary').html(list.summary);
					//判断商品展示
					if(list.goodimgurls=="" || list.goodimgurls==null || list.goodimgurls=="undefined"){
						$(".showbus").hide();
					}else{
						var goodimgurls= list.goodimgurls.split(";");
						var nowList="";
						for(var i=0;i<goodimgurls.length;i++){
							nowList+='<span class="swiper-slide"><img src="'+rootUrl+goodimgurls[i]+'"></span>'
						};
						$('#mainShowImg').html(nowList);
						var swiper = new Swiper('.swiper-container', {
					        pagination: '.swiper-pagination',
					        paginationClickable: true,
					        spaceBetween: 3,
					        centeredSlides: true,
					        width : 90,
					    });
					}
					getReview(1);
					goodBad();
					
				} else {
					//alert(data.formDataset.errorMsg);
				}
			}
		});
	}


	$('#goToHere').click(function() {
		if (lon && lat && shopname) {
			api.openWin({//打开导航界面
				name : 'pathplan',
				url : '../html/commonweal/pathplan.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					lon : lon,
					lat : lat,
					shopname : shopname
				}
			});
		} else {
			api.alert({
				msg : '暂时未获得该商家的位置信息'
			});
		}

	});
	//  跳转评论
	$('#review').click(function() {
		api.getPrefs({
			key : 'hasLogon'
		}, function(ret, err) {
			var userName = ret.value;
			//alert(userName);
			if (userName == 'true') {
				//获取路径并上传照片
				api.openWin({//打开导航界面
					name : 'review',
					url : 'review.html',
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					},
					pageParam : {
						name : $('#name').html(),
						id : $('.container').attr('id')
					}
				});
			} else {
				alert('请先去登录哦!')
			}
		});

	});

	function getDistance() {
		map = api.require('bMap');
		map.getLocation({
			accuracy : '10m',
			autoStop : true,
			filter : 1
		}, function(ret, err) {
			api.hideProgress();
			if (ret.status) {
				lon = ret.lon;
				lat = ret.lat;
				listInfo(id);
				//推荐相关商家
				//recommendList();
			} else {
				alert(err.code);
			}
		});

	}

	getDistance();
	//getDistance();

	function getReview(pages, starMin, starMax) {
		//alert($('.container').attr('id'));
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "findComments",
			form : {
				company_no : fname,
				starMin : starMin || 1,
				starMax : starMax || 5,
				p : pages
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.result;
					var list = $api.strToJson(account);
					if (list.length == undefined || list.length == 0 || list == undefined || list == '' || list.length == '') {
						if (pages == 1) {
							api.toast({
								msg : '暂无评价记录'
							});
						} else {
							api.toast({
								msg : '无更多评价记录'
							});
						}

					} else {
						for (var i = 0; i < list.length; i++) {
							var starlen = list[i].star;
							var picLen = list[i].attachment.split(";");
							//alert(picLen.length);
							function starLenght(starlen) {
								var daF = '';
								var kf = '';
								for (var k = 0; k < starlen; k++) {
									daF += '<img src="./img/stares.jpg" alt=""/>'
								}
								for (var w = 0; w < 5 - starlen; w++) {
									kf += '<img src="./img/gstars.png" alt=""/>'
								}
								return daF + kf;
							}

							//展示图片方法
							function pic(picLen) {
								var picCount = '';
								for (var j = 0; j < picLen.length; j++) {
									//alert(picLen[j]);
									picCount += '<img src="' + rootUrl + picLen[j] + '" alt=""/>';
								}
								return picCount;
							}

							var time = list[i].create_time.split(' ');
							var nowli = '<div class="conmment-neirong">' + '<span class="showPic"><img src="' + rootUrl + list[i].head_image + '" alt="" /></span>' + '<span>' + '<div>' + list[i].user_no + '' + '</div>' + '<div><span class="dafen">打分</span>' + '' + starLenght(starlen) + '' + '<div class="cl"></div>' + '</div>' + '</span>' + '<span class="youzhi">' + time[0] + '</span>' + '<div class="cl"></div></div>' + '<div class="conmment-jianjie"><span>' + list[i].content + '</span></div>' + '<div class="conmment-ps">' + '' + pic(picLen) + '' + '<div class="cl"></div>' + '</div>' + '<div class="conmment-pl" style="border-bottom:1px solid #EAEAEA; height: 12px;width: 100%"></div>'
							$('#showList').append(nowli);

						}
						//		       		alert(haoPing);
						//		       		alert(chaPing);
						//		       		$('#haoP').html('网友好评（'+haoPing+'）');
						//		       		$('#chaP').html('网友差评（'+chaPing+'）');
					}

					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
					console.log("返回的:pageCount=" + pageCount);
					console.log("返回的page=" + page);
				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	}

	//推荐相关商家列表
	//	function recommendList(){
	//		AjaxUtil.exeScript({
	//	      script:"mobile.business.business",
	//	      needTrascation:true,
	//	      funName:"findBusinessIsrecommendList",
	//	      form:{
	//	         is_recommend:'0',
	//	         is_online:'0',
	//	         recordCount:4,
	//	         typename:comtype,
	//	         lng:lon,
	//		     lat:lat
	//	      },
	//	      success:function (data) {
	//	      console.log("推荐相关商家列表"+$api.jsonToStr(data));
	//	       if (data.formDataset.checked == 'true') {
	//	       		var account = data.formDataset.companyDataList;
	//	       		var list=$api.strToJson(account);
	//	       			if(list.length==undefined ||list.length==0 ||list==undefined || list=='' || list.length  ==''){
	//	       				$('#refer').html('为您推荐的商家: 暂无');
	//						return false;
	//	       			}else{
	//	       			var nowli ="";
	//
	//	       			for(var i=0;i<list.length;i++){
	//	       				var starlen=list[i].star;
	//		       			//alert(picLen.length); 评星数
	//		       			function starLenght(starlen){
	//		       				var daF='';
	//		       				var kf='';
	//		       				if(starlen==0||starlen==''||starlen==undefined){
	//		       					daF='<span style="float:left">评星暂无</span>'
	//		       				}else{
	//				       			for(var k=0;k<starlen;k++){
	//				       				 daF+='<img src="./img/stares.jpg" alt=""/>'
	//				       			}
	//				       			for(var w=0;w<5-starlen;w++){
	//				       				kf+='<img src="./img/gstars.png" alt=""/>'
	//				       			}
	//			       			}
	//		       				return daF+kf;
	//		       			}
	//		       			var distance=list[i].distance;
	//		       			if(0<distance&&distance<1000){
	//				    		distance=('距此'+(distance.toFixed(1))+'m');
	//				    	}else if(1000<=distance&&distance<5000){
	//				    		distance=((distance/1000).toFixed(1));
	//				    		distance=('距此'+(distance.toFixed(1))+'km');
	//				    	}else if(distance>5000){
	//				    		distance=('距此大于5km');
	//				    	}else{
	//				    		distance=('距离暂无');
	//				    	}
	//	       				//nowli += '<dl class="recommend-details" id="'+list[i].fid+'"><img src="'+rootUrl+list[i].head_image+'" alt="" /><dt>'+list[i].companyname+'</dt><dd>'+list[i].companytype+'</dd></dl>';
	//						nowli+='<div class="show-list" id="'+list[i].fid+'"><img src="'+rootUrl+list[i].head_image+'" alt="" class="show-p"/><div>'+list[i].companyname+'</div><div>'+starLenght(starlen)+'<span>'+distance+'</span><div class="cl"></div></div><div >'+list[i].mainbusiness+'</div><div class="cl"></div></div>'
	//
	//	       			}
	//	       				$('#recommends').append(nowli);
	//	       			}
	//	         } else {
	//	             alert(data.formDataset.errorMsg);
	//	         }
	//	       }
	//	    });
	//	}
	//  推荐相关商家跳转
	//	$('#recommends').on('click','.show-list',function() {
	//			api.openWin({//详情界面
	//				name : 'nearList',
	//				url : 'nearList.html',
	//				slidBackEnabled : true,
	//				animation : {
	//					type : "push", //动画类型（详见动画类型常量）
	//					subType : "from_right", //动画子类型（详见动画子类型常量）
	//					duration : 300 //动画过渡时间，默认300毫秒
	//				},
	//				pageParam : {
	//					id : $(this).attr('id'),
	//					companytype:$(this).attr('data')
	//				}
	//			});
	//		});

	function goodBad() {
		//alert($('.container').attr('id'));
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "getCommentsCount",
			form : {
				company_no : $('.container').attr('id'),
				starGood : 3,
				starBad : 2
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					$('#haoP').html('网友好评（' + data.formDataset.countGood + '）');
					$('#chaP').html('网友差评（' + data.formDataset.countBad + '）');
					$('#pingCount').html(parseInt(data.formDataset.countBad) + parseInt(data.formDataset.countGood) + '条');
				}

			}
		})
	}

	//goodBad();

	$('#haoP').click(function() {
		$('#showList').html('');
		getReview(1, 3, 5)
	});
	$('#chaP').click(function() {
		$('#showList').html('');
		getReview(1, 1, 2)
	});
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			getReview(page);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
}
