var id = "";
var page = 1;
var pageCount = 1;
var lon="";
var lat="";
var cityName="";
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.businessList');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'margin-top:1.6rem;');
            $api.css(miancss, 'margin-top:3.8rem;');
        }else{
            $api.css(header, 'margin-top:1.1rem;');
            $api.css(miancss, 'margin-top:3.3rem;');
        }
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	//我的收藏列表
	function queryCollectionList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "queryCollectionList",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("我的收藏"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = $api.strToJson(data.formDataset.collectionList);
					var nowli = "";
					for (var i = 0; i < list.length; i++) {
						nowli += '<div class="same">'
								+'<div class="samaBox">'
								+'<img src="'+ rootUrl + list[i].shopurl +'" alt="" />'
								+'<div class="mid" id="' + list[i].fid + '" data="' + list[i].industry_name + '">'
								+'<div>'+list[i].companyname+'</div>'
								+'<div>'+list[i].industry_name+'</div>'
								+'</div>'
								+'<div class="right" id="' + list[i].fname + '">取消收藏</div>'
								+'</div>'
								+'</div>'			
					}
					$('#tab1').html(nowli);
				} else {
					var listImg='<img src="../../image/shezhi/collectNo.png" alt="" class="collectNo"/>'
					$('#tab1').html(listImg);
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
	//商家列表进行跳转
	$('#tab1').on('click', '.mid', function() {
		api.openWin({//详情界面
			name : 'business-man-list',
			url : '../../sjDetail/business-man-list.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : $(this).attr('id'),
				companytype : $(this).attr('data')
			}
		});
	});
	$('#tab1').on('click', '.right', function() {
		var merchantId=$(this).attr("id")
		api.confirm({
			title : '提示',
			msg : '您确定要取消收藏该商家吗？',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {
				cancelCollection(merchantId);
			} 
		}); 

	});
	//取消收藏
	function cancelCollection(merchantNo) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.business",
			needTrascation : true,
			funName : "cancelCollection",
			form : {
				userNo : urId,
				merchantNo :merchantNo 
			},
			success : function(data) {
				api.hideProgress();
				console.log("取消收藏"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					location.reload();
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
}	
function goBack() {
	api.closeWin({
	});
}
