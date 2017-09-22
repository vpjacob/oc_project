var urId;
var addressId=""
apiready = function() {
	var header = $api.byId('title');
//	var cc = $api.dom('.iosBox');
	var addressId = api.pageParam.id;
	var busid = api.pageParam.id;
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:1.1rem;');
	};
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryDeliveryList();
	
	  function queryDeliveryList(){
    	 AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryDeliveryList",
	        form:{
	           userNo:urId,
	        },
			success : function(data) {
				console.log("查询收货地址" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.deliveryList;
					var list = $api.strToJson(account);
					var nowlist='';
					var tag="";
					var showrHide='';
					if(list.length == "undefined" || list.length == 0 || list == "undefined" || list == '' || list.length == ''){
						api.toast({
								msg :'暂无收货地址'
							});
					}else{
					for(var i=0;i<list.length;i++){
						if(list[i].tags==1){
							tag="家"
						}else if(list[i].tags==2){
							tag="公司"
						}
						if(list[i].is_default==1){
							showrHide="display:''"
						}else if(list[i].is_default==2){
							showrHide="display:none"
						}
						nowlist+='<div class="user">'
								+'<div class="same">'
								+'<span>'+list[i].name+'</span>'	
								+'<span>'+list[i].phone+'</span>'
								+'<div class="default">'+tag+'</div>'
								+'<div class="default" style="'+showrHide+'">默认</div>'
								+'<img src="../image/changeAdd.png" alt="" id="'+list[i].id+'" />'
								+'<div class="addressInfo" data="'+list[i].id+'">'+list[i].province_name+'&nbsp'+list[i].city_name+'&nbsp'+list[i].district_name+'&nbsp'+list[i].address+'</div>'
								+'</div>'
								+'</div>'
					}
						$("#addressList").html(nowlist);
						
	
					}
				} else {
					console.log(data.formDataset.errorMsg);
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
	
	//添加收货地址	
	$("#save").click(function() {
			api.openWin({//详情界面
				name : 'createAddress',
				url : 'createAddress.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
			});
	});
	
	//点击相应的图跳转到相应的详情页
	$(".box").on("click", "img", function() {
		api.openWin({//详情界面
			name : 'editAddress',
			url : 'editAddress.html',
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
	
	$(".box").on("click", ".addressInfo", function() {
		var addressInfoId = $(this).attr("data");
		api.confirm({
			title : '提示',
			msg : '你想选择这条收货地址吗？',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {
				queryAddressById(addressInfoId)
			}
		});
	}); 

		
    function queryAddressById(addressInfoId) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryAddressById",
			        form:{
			           goodId:busid,
			           userNo:urId,
			           id:addressInfoId
			        },
			success : function(data) {
				api.hideProgress();
				console.log("上一页邮费价格地址" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.address;
					var list = $api.strToJson(account);
				var result = {
					province : list.province_name,
					city : list.city_name,
					district : list.district_name,
					name : list.name,
					phone : list.phone,
					address : list.address,
					postage:data.formDataset.postage,
					isDelivery:data.formDataset.isDelivery
				};
				api.execScript({
					    name: 'entranceGuardInfo',
					    script: 'funcGoto('+JSON.stringify(result)+')'
					});
					api.closeWin({
					});
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
	
}

function goBack() {
	api.closeWin({
	});
}
