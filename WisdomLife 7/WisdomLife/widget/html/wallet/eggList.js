var id = "";
var page = 1;
var pageCount = 1;
var cityName="";
apiready = function() {
var browser = api.require('webBrowser');
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.businessList');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:1.1rem;');
		$api.css(miancss, 'margin-top:3.3rem;');
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	
	//下拉刷新
	refresher.init({
		id : "wrapper",
		pullDownAction : Refresh,
	});
	function Refresh() {
		myScroll.refresh();
		queryCollectionList()
	}

	//调用金蛋龙虎榜
	function queryCollectionList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "goldEggEveryValue",
			form : {},
			success : function(data) {
				api.hideProgress();
				console.log("金蛋龙虎榜"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = $api.strToJson(data.formDataset.goldEggBoard);
					var nowli = "";
					for (var i = 0; i < list.length; i++) {
						if(i==0){
							if(String(list[i].head_image) !='null'){
								$("#onehead").attr("src",rootUrl + list[i].head_image);
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								$("#oneName").html("暂无");
							}else{
								$("#oneName").html(list[i].username);
							}
							$("#oneJb").html((list[i].money).toFixed(3));
						}else if(i==1){
							if(String(list[i].head_image) !='null'){
								$("#twohead").attr("src",rootUrl + list[i].head_image);
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								$("#twoName").html("暂无");
							}else{
								$("#twoName").html(list[i].username);
							}
							$("#twoJb").html((list[i].money).toFixed(3));
						}else if(i==2){
							if(String(list[i].head_image) !='null'){
								$("#thirdhead").attr("src",rootUrl + list[i].head_image);
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								$("#thirdName").html("暂无");
							}else{
								$("#thirdName").html(list[i].username);
							}
							$("#thirdJb").html((list[i].money).toFixed(3));
						}else{
							 var k=i+1;
							 var imgUrl="";
							 var listName="";
							if (String(list[i].head_image) != 'null') {
								imgUrl = rootUrl + list[i].head_image;
							} else {
								imgUrl = '../../image/eggList/icon_c.png'
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								listName="暂无";
							}else{
								listName=list[i].username;
							}
							nowli+='<div class="same">'
								+'<div class="sameBox">'
								+'<span class="botRanking">NO.'+k+'</span>'
								+'<div class="botDiv">'
								+' <img src="'+imgUrl+'" alt="" class="botImg"/> '
								+'</div>'
								+'<span class="botName">'
								+''+listName+''
								+'</span>'
								+'<span class="sameLast">枚/颗</span>'
								+'<span class="sameCount">'+(list[i].money).toFixed(3)+'</span>'
								+'<img src="../../image/eggList/icon_a.png" alt="" class="botGold"/>'
								+'</div>'
								+'</div>'
						}		
						$('#otherList').html(nowli);
					}
					
				} else {
					console.log(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				api.toast({
	                msg:'您的网络不给力啊，检查下是否连接上网络了！'
                });
			}
		});
	};
	queryCollectionList();

//调用图片
	function queryGoldRanking() {
		AjaxUtil.exeScript({
			script : "mobile.center.homepage.homepage",
			needTrascation : true,
			funName : "queryGoldRanking",
			form : {},
			success : function(data) {
				console.log("龙虎榜广告位"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var placeOneList=$api.strToJson(data.formDataset.rankList);
					for(var i=0;i<placeOneList.length;i++){
						if(String(placeOneList[i].place_no)=="1"){
							$("#adver").attr("src",''+rootUrl+placeOneList[i].img_url+'');
							$("#adver").attr("data",''+placeOneList[i].skip_no+'');
							$("#adver").attr("datas",''+placeOneList[i].skip_url+'');
						};
					};
				} else {
//					alert(data.formDataset.errorMsg);
				}
			}
		});
	};
	queryGoldRanking();

	//点击图片进行跳转
	$("#adver").click(function(){
		var skipNo=$(this).attr("data");
		var skipurl=$(this).attr("datas");
		console.log("**********"+skipNo+"**"+skipurl);
		if (String(skipurl) == "000000") {
			api.openFrame({//商家列表
				name : 'commonProvider',
				url : '../../shangjia/html/newIndex.html',
				bounces : false,
				reload : true,
				rect : {
					x : 0,
					y : 0,
					w : 'auto',
					h : frameH + headerH,
				}
			});

		} else if(String(skipurl) == "111111") {
			api.openWin({//商城列表
				name : 'busList',
				url : '../../shangjia/html/buyList.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "222222") {
			api.openWin({//金蛋商城列表
				name : 'integralStore',
				url : '../../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "333333") {
			api.openWin({//积分商城列表
				name : 'integralStore',
				url : '../../shangjia/integralStore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});		
		}else if(skipNo=="" || String(skipNo)=="null" || String(skipNo)=="undefined"){
			api.confirm({
				title : '提示',
				msg : '您即将跳转到' + skipurl,
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					browser.open({
						url : skipurl
					});
				}
			})
		}else if(skipurl=="" || String(skipurl)=="null" || String(skipurl)=="undefined"){
			//获取商品或商家id
			queryGoodOrMerchantByNo(skipNo);
		};
	});
	
	function queryGoodOrMerchantByNo(skipNo){
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.center.homepage.homepage",
			needTrascation : true,
			funName : "queryGoodOrMerchantByNo",
			form : {
				skipNo: skipNo
			},
			success : function(data) {
				api.hideProgress();
				console.log("获取商家或商品Id" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					//走商家
					if(data.formDataset.skipType=="1"){
						api.openWin({//商家详情界面
							name : 'business-man-list',
							url : '../../sjDetail/business-man-list.html',
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							},
							pageParam : {
								id : data.formDataset.skipId,
								companytype : data.formDataset.skipId
							}
						});
										
					}else if(data.formDataset.skipType=="2"){
						api.openWin({//详情界面
							name : 'buyListInfo',
							url : '../../shangjia/html/buyListInfo.html',
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							},
							pageParam : {
								id : data.formDataset.skipId
							}
						});
					
					}
				
				} else {
					
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				api.toast({
	                msg:'您的网络不给力啊，检查下是否连接上网络了！'
                });
			}
		});
	};
	
}	
function goBack() {
	api.closeWin({
	});
}
