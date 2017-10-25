var urId = "";
var page = 1;
var pageCount = 1;
//交易记录初始值
var pageDeal = 1;
var pageDealCount = 1;
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	};
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
   	//初始化  
	$(function() {
		$(".Personal_centent").hide().first().show();
		$(".span1").click(function() {
			$('#integralShop').empty();
			$(".prefecture").attr("src","../../image/integralShop.jpg");
			$(".prefecture").attr("data","3");
			 queryEggIntegralRecord(urId,3);
		})
		$(".span0").click(function() {
			$('#eggShop').empty();
			$(".prefecture").attr("data","2");
			$(".prefecture").attr("src","../../image/eggShop.jpg");
			 queryEggIntegralRecord(urId,2);
		})
		$(".Personal_title span").click(function() {
			$(this).addClass("special").siblings().removeClass("special");
			$(".Personal_centent").hide().eq($(this).index()).show();
		});
	});
	
    $(".prefecture").click(function(){
    	var flag=$(this).attr("data");
    	if(flag==2){
    		api.openWin({//金蛋商城列表
				name : 'eggstore',
				url : '../../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
    	}else if(flag==3){
    		api.openWin({//金蛋商城列表
				name : 'integralStore',
				url : '../../shangjia/integralStore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
    	}
    });
//  queryProductDealByUserNo(urId);
	//查询方法
	function queryEggIntegralRecord(urId,type) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
			needTrascation : true,
			funName : "queryEggIntegralRecord",
			form : {
				userNo : urId,
				type : type  
			},
			success : function(data) {
				api.hideProgress();
				console.log("兑换记录"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.recordList;
					var list = $api.strToJson(account);
					var nowli = "";
					var status="";
					var expressNo="";
					var show=""
					if (list == undefined || list == '' || list.length == '' || list.length == 0 || list.length == undefined) {
						api.toast({
								msg : '亲，您暂无兑换记录'
							});
					}else{
						for(var i=0; i<list.length;i++){
							if(list[i].status==0){
									status="无效";
								}else if(list[i].status==1){
									status="待发货";
								}else if(list[i].status==2){
									status="已发货";
								}else if(list[i].status==3){
									status="已完成";
								};
							if(list[i].deal_no=="" || list[i].deal_no==null || list[i].deal_no=="undefined"){
									expressNo="暂无"
								}else{
									expressNo=list[i].deal_no;
								};	
							if(type==2){
								show="颗金蛋"
							}else if(type==3){
								show="积分"
							}	
							nowli +='<div class="box">'
								+'<div class="bottom">'
								+'<div class="user" style="border-radius:5px 5px 0 0">'
								+'<div class="same">'
								+'<span>商家名称：</span>'
								+'<span>北京小客网络科技有限公司</span>'		
								+'</div>'	
								+'</div>'
								+'<div class="user" style="height:3.25rem;">'
								+'<div class="same">'
								+'<span>商品：</span>'
								+'<span>'+list[i].good_name+'</span>'	
								+'</div>'	
								+'</div>'
								+'<div class="commodity" >共'+list[i].num+'件商品,实付<a style="color:#ff6c00">'+list[i].amount+'</a>'+show+'</div>'
								+'<div class="user">'
								+'<div class="same">'
								+'<span>交易总额：</span>'
								+'<span style="color:#ff6c00">'+list[i].amount+show+'</span>'	
								+'</div>'	
								+'</div>'
								+'<div class="user">'
								+'<div class="same">'
								+'<span>订单号：</span>'
								+'<span>'+expressNo+'</span>'	
								+'</div>'	
								+'</div>'
								+'<div class="user">'
								+'<div class="same">'
								+'<span>创建时间：</span>'
								+'<span>'+list[i].create_time+'</span>'	
								+'</div>'	
								+'</div>'
								+'<div class="user" style="border-radius:0 0 5px 5px">'
								+'<div class="same">'
								+'<span>订单状态：</span>'
								+'<span>'+status+'</span>'	
								+'</div>'	
								+'</div>'
								+'</div>'
								+'</div>'
						}
						if(type==2){
							$("#eggShop").html(nowli)
						}else if(type==3){
							$("#integralShop").html(nowli)
						}
					}
				} else {
					api.hideProgress();
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	};
	
	 queryEggIntegralRecord(urId,2);
}
function goBack() {
	api.closeWin({
	});
}
