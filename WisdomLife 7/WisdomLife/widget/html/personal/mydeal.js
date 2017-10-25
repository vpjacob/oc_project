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
    queryProductDealByUserNo(urId);
	$(function() {
		$(".Personal_centent").hide().first().show();
		$(".span1").click(function() {
			$('#conversion').empty();
			 queryShopDealRecordByUserNo(urId);
		})
		$(".span0").click(function() {
			$('#order').empty();
			 queryProductDealByUserNo(urId);
		})
		$(".Personal_title span").click(function() {
			$(this).addClass("special").siblings().removeClass("special");
			$(".Personal_centent").hide().eq($(this).index()).show();
		});
	});	
	//查询普通区方法
	function queryProductDealByUserNo(urId) {
		api.showProgress({
		});
		var data = {
			'userNo' : urId
		};
		$.ajax({
			url : rootUrls + '/xk/queryProductDealByUserNo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				api.hideProgress();
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					if (data == undefined || data == '' || data.length == '' || data.length == 0 || data.length == undefined) {
						api.toast({
								msg : '亲，您暂无普通区物流记录'
							});
					}else{
						var nowList=""; 
						var status="";
						var expressName="";
						var expressNo="";
						var confirmTimeInfo="";
						for (var i = 0; i < data.length; i++) {
							if(data[i].status==0){
								status="无效";
							}else if(data[i].status==1){
								status="待发货";
							}else if(data[i].status==2){
								status="已发货";
							}else if(data[i].status==3){
								status="交易完成";
							};
							if(data[i].expressName=="" || data[i].expressName==null || data[i].expressName=="undefined"){
								expressName="暂无"
							}else{
								expressName=data[i].expressName;
							};
							if(data[i].expressNo=="" || data[i].expressNo==null || data[i].expressNo=="undefined"){
								expressNo="暂无"
							}else{
								expressNo=data[i].expressNo;
							};
							if(data[i].confirmTimeInfo =="" || data[i].confirmTimeInfo==null || data[i].confirmTimeInfo=="undefined"){
								confirmTimeInfo="暂无"
							}else{
								confirmTimeInfo=data[i].confirmTimeInfo;
							};
							nowList+='<div class="box">'
									+'<div class="bottom">'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>商家名称：</span>'
									+'<span>'+data[i].merchantName +'</span>'	
									+'</div>'
									+'</div>'
									+'<div class="user" style="height:3.25rem;">'
									+'<div class="same">'
									+'<span>'+data[i].goodName+'&nbsp'+ data[i].goodModel+'</span>'
									+'<span>¥'+ data[i].price +'</span>'
									+'</div>'
									+'</div>'
									+'<div class="commodity" >共' + data[i].num + '件商品,实付¥<a style="color:#ff6c00">'+data[i].amount+'</a></div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>交易总额：</span>'
									+'<span style="color:#ff6c00">'+data[i].amount+'</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>订单号：</span>'
									+'<span>' + data[i].dealNo + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>交易创建时间：</span>'
									+'<span>' + data[i].createTimeInfo+ '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>收货人：</span>'
									+'<span>' + data[i].userName + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>收货人号码：</span>'
									+'<span style="color:#ff6c00">' + data[i].userPhone + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>发货时间：</span>'
									+'<span>' + data[i].sendTimeInfo + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user other">'
									+'<div class="same">'
									+'<span>收货地址：</span>'
									+'<textarea disabled="disabled">' + data[i].userAddress + '</textarea>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>物流状态：</span>'
									+'<span>' + status + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>快递公司：</span>'
									+'<span>' + expressName + '</span>'	
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>快递单号：</span>'
									+'<span>' + expressNo + '</span>'	
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>交易完成时间：</span>'
									+'<span>' + confirmTimeInfo + '</span>'
									+'</div>'
									+'</div>'
									+'</div>'
									+'</div>'
						}
						$("#order").html(nowList);
					};
				} else {
					api.hideProgress();
					alert(result.msg);
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
	
	//查询兑换区记录方法
	function queryShopDealRecordByUserNo(urId) {
		api.showProgress({
		});
		var data = {
			'userNo' : urId
		};
		$.ajax({
			url : rootUrls + '/xk/queryShopDealRecordByUserNo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				api.hideProgress();
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					if (data == undefined || data == '' || data.length == '' || data.length == 0 || data.length == undefined) {
						api.toast({
								msg : '亲，您暂无兑换区物流记录'
							});
					}else{
						var nowList=""; 
						var status="";
						var expressName="";
						var expressNo="";
						var confirmTimeInfo="";
						var show="";
						for (var i = 0; i < data.length; i++) {
							if(data[i].status==0){
								status="无效";
							}else if(data[i].status==1){
								status="待发货";
							}else if(data[i].status==2){
								status="已发货";
							}else if(data[i].status==3){
								status="交易完成";
							};
							if(data[i].expressName=="" || data[i].expressName==null || data[i].expressName=="undefined"){
								expressName="暂无"
							}else{
								expressName=data[i].expressName;
							};
							if(data[i].expressNo=="" || data[i].expressNo==null || data[i].expressNo=="undefined"){
								expressNo="暂无"
							}else{
								expressNo=data[i].expressNo;
							};
							if(data[i].confirmTimeInfo =="" || data[i].confirmTimeInfo==null || data[i].confirmTimeInfo=="undefined"){
								confirmTimeInfo="暂无"
							}else{
								confirmTimeInfo=data[i].confirmTimeInfo;
							};
							if(data[i].type==2){
								show="颗金蛋"
							}else if(data[i].type==3){
								show="积分"
							}
							nowList+='<div class="box">'
									+'<div class="bottom">'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>商家名称：</span>'
									+'<span>北京小客网络科技有限公司</span>'	
									+'</div>'
									+'</div>'
									+'<div class="user" style="height:3.25rem;">'
									+'<div class="same">'
									+'<span>'+data[i].goodName+'&nbsp'+ data[i].goodModel+'</span>'
									+'<span>'+ data[i].price +show+'</span>'
									+'</div>'
									+'</div>'
									+'<div class="commodity" >共' + data[i].num + '件商品,实付<a style="color:#ff6c00">'+data[i].amount+'</a>'+show+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>交易总额：</span>'
									+'<span style="color:#ff6c00">'+data[i].amount+show+'</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>支付方式：</span>'
									+'<span>' + data[i].typeName + '支付</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>订单号：</span>'
									+'<span>' + data[i].dealNo + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>交易创建时间：</span>'
									+'<span>' + data[i].createTimeInfo+ '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>收货人：</span>'
									+'<span>' + data[i].userName + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>收货人号码：</span>'
									+'<span style="color:#ff6c00">' + data[i].userPhone + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>发货时间：</span>'
									+'<span>' + data[i].sendTimeInfo + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user other">'
									+'<div class="same">'
									+'<span>收货地址：</span>'
									+'<textarea disabled="disabled">' + data[i].userAddress + '</textarea>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>物流状态：</span>'
									+'<span>' + status + '</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>快递公司：</span>'
									+'<span>' + expressName + '</span>'	
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>快递单号：</span>'
									+'<span>' + expressNo + '</span>'	
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'
									+'<span>交易完成时间：</span>'
									+'<span>' + confirmTimeInfo + '</span>'
									+'</div>'
									+'</div>'
									+'</div>'
									+'</div>'
						}
						$("#conversion").html(nowList);
						
					};
				} else {
					api.hideProgress();
					alert(result.msg);
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
	

}
function goBack() {
	api.closeWin({
	});
}
