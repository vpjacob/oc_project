var page = 1;
var pageCount = 1;
apiready = function() {
	var header = $api.byId('title');
	var Back = $api.byId('Back');
	var submit = $api.dom('.title_div');
	var top = $api.dom('.top');
	var cc = $api.dom('.box');
    
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'height:5.6rem');
            $api.css(Back, 'top:1.75rem');
            $api.css(top, 'top:3.8rem');
            $api.css(submit, 'top:1.8rem');
            $api.css(cc, 'margin-top:3.6rem;');
            $("#searchval").focus(function(){
                                  $("#title").css({
                                                  "position":"absolute",
                                                  "top":"0px"
                                                  });
                                  });
            $("#searchval").blur(function(){
                                 $("#title").css("position","fixed");
                                 });
        }else{
            $api.css(header, 'height:5.6rem');
            $api.css(Back, 'top:1.25rem');
            $api.css(top, 'top:3.3rem');
            $api.css(submit, 'top:1.3rem');
            $api.css(cc, 'margin-top:3.1rem;');
            $("#searchval").focus(function(){
                                  $("#title").css({
                                                  "position":"absolute",
                                                  "top":"0px"
                                                  });
                                  });
            $("#searchval").blur(function(){
                                 $("#title").css("position","fixed");
                                 });
        }
	};
	
	//查找所有金蛋商品
	function queryEggShoppingList(pages,name,sales) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
			needTrascation : false,
			funName : "queryEggShoppingList",
			form : {
				name : name,
				sales : sales,
				p : pages
			},
			success : function(data) {
				console.log("积分所有商品" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.shoppingList;
					var list = $api.strToJson(account);
					var nowli = "";
					if (list.length == undefined || list.length == 0 || list == undefined || list == '' || list.length == '') {
						if (pages == 1) {
							api.toast({
								msg : '暂无商品信息'
							});
						} else {
							api.toast({
								msg : '无更多商品信息'
							});
						}

					} else {
						var price="";
						var flag=""
						for (var i = 0; i < list.length; i++) {
							nowli +='<div class="same">'
								+'<img src="' + rootUrl + list[i].img_url + '" alt="" id="'+list[i].id+'"/>'						
								+'<div class="busname">' + list[i].name + '</div>'
								+'<div class="busprice">'
								+'<span class="symbol">'+list[i].price_discount+'颗</span><img src="../../image/jin.png" alt="" />'
								+'</div>'
								+'<span class="busperson">' + list[i].buy_count + '人已买</span>'
								+'</div>'
						}

					};
						$('#showListAll').append(nowli);

					pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
					console.log("返回的:pageCount=" + pageCount);
					console.log("返回的page=" + page);
					
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	}
	queryEggShoppingList(page,"","");
//全部商品的下拉加载
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			queryEggShoppingList(page,"","");
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
	
	//点击相应的图跳转到相应的详情页
		$("#showListAll").on('click', 'img', function() {
			api.openWin({//详情界面
				name : 'eggListInfo',
				url : 'eggListInfo.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					id : $(this).attr("id")
				}
			});
		});
		
//搜索关键字  待测
$("#submit").on("submit",function(){
	$('#showListAll').empty();
	page = 1;
	var searchVal=$("#searchval").val();
//	alert(searchVal);
		queryEggShoppingList(page,searchVal,"");
		api.addEventListener({
			name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				queryEggShoppingList(page,searchVal,"");
			} else {
				page = parseInt(pageCount) + 1;
			}
		});
	return false;
})
	

	//点击切换
	var divs = $('.top div span');
	for (var i = 0; i < divs.length; i++) {
		$(divs[i]).click(function() {
			for (var j = 0; j < divs.length; j++) {
				$(divs[j]).removeClass();
			}
			$(this).addClass("special");
			if ($(this).attr("class") == "special") {
				//切换到全部  
				if ($(this).attr("data") == 2) {
					$('#showListAll').empty();
					page = 1
					queryEggShoppingList(page,"","");
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryEggShoppingList(page,"","");
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				};
				//切换到  销量
				if ($(this).attr("data") == 0) {
					$('#showListAll').empty();
					page = 1;
					var saleData=$(this).attr("data");
					queryEggShoppingList(page,"",saleData);
					api.addEventListener({
						name : 'scrolltobottom'
					}, function(ret, err) {
						if (parseInt(page) <= parseInt(pageCount)) {
							page++;
							queryEggShoppingList(page,"",saleData);
						} else {
							page = parseInt(pageCount) + 1;
						}
					});
				};
				
			};
		})
	};
};
function goBack() {
	api.closeWin({
	});
}
