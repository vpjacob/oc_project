apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    
    change(1,'#first',urId);
	total(urId);
	
	$('#back').click(function(){
		api.closeWin({
        });
	})
	
	$("#choose").on('click', function() {
		var top = $(this).children().hasClass('icon-top');
		if (top) {
			$(".secondul").show();
			$(this).children().removeClass('icon-top').addClass('icon-down');
		} else {
			$(".secondul").hide();
			$(this).children().removeClass('icon-down').addClass('icon-top');
		}
	});
	
	$('#tab1').on('click','.same',function() {
		api.openWin({
			name : 'backinfo',
			url : 'backinfo.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : $(this).attr('id')
			}
		});
	});
	
	$('#tab2').on('click','.same',function() {
		api.openWin({
			name : 'backinfo',
			url : 'backinfo.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id :$(this).attr('id')
			}
		});
	});
	
	$('#tab3').on('click','.same',function() {
		api.openWin({
			name : 'backinfo',
			url : 'backinfo.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id :$(this).attr('id')
			}
		});
	});
	
	
	$("#a_tab1").on('click', function() {
		change(1,'#first');
		$('li').remove();	
	});
	$("#a_tab2").on('click', function() {
		change(2,'#second');
		$('li').remove();	
	});
	$("#a_tab3").on('click', function() {
		change(3,'#third');
		$('li').remove();	
	});
function change(flag,changeId){
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"queryBuyBackRecord",
	      form:{
	       userNo:urId,
	       status:flag
	      },
	      success:function (data) {
	      	var listInfo = data.formDataset.buyBackRecord;
			var list = eval(listInfo);
			console.log('listInfo' + listInfo);
		//	console.log('list.length' + list.length);
			if (data.formDataset.checked == 'true') {
				if (list.length==undefined ||list.length== 0 ||list.length==''||list==undefined || list=='') {
					api.toast({
					msg : "亲，您暂时没有相关数据！"
				});
				} else {
					//$('#ul_tab2').empty();
					
					for (var i = 0; i < list.length; i++) {
					var time=list[i].apply_time.split(' ');
						var nowli ='<li>'
								  +'<div class="same" id="'+list[i].id+'">'
								  +'<div class="left">'+time[0]+'</div>'
					  			  +'<div class="mid">'
								  +'<img src="../../image/jinbi.png"/>'
								  +'<span>'+list[i].actual_amount+'</span>'	
								  +'</div>'
								  +'<div class="right">'
								  +'<span>'+list[i].open_bank+'</span>'	
								  +'<i class="iconfont icon-xiangyou1" style="font-size: 22px;"></i>'	
								  +'</div>'
								  +'</div>'
								  +'</li>';
//								  api.setPrefs({
//									    key: 'countId',
//									    value: list[i].id
//									});
									
							$(changeId).append(nowli);
						}
					}
				} else {
						alert(data.formDataset.errorMsg);
					}
	       }
	    });
	}
	
function total(urId) {
	AjaxUtil.exeScript({
		script : "mobile.accountdetail.accountdetail",
		needTrascation : true,
		funName : "queryAlreadyBackAmount",
		form : {
			userNo : urId
		},
		success : function(data) {
			//var listInfo = data.formDataset;
			var list=$api.jsonToStr(data.formDataset);
			console.log('data.formDataset'+list);
			if (data.formDataset.checked == 'true') {
					data.formDataset.alreadyBackAmount==null?$('#alreadyBackAmount').html(0):$('#alreadyBackAmount').html(data.formDataset.alreadyBackAmount);
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}	
	
	
	
	
}