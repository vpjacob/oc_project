var urId='';
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    iamMemberList(urId);

	//24.我是成员的所有业主房屋信息
		function iamMemberList(urId){
           var data = {
               "userNo": urId,
          };
            $.ajax({  
                  url:rootUrls+'/xk/iamMemberList.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result)); 
                  	 var data= result.data; 
                  	 if(result.state==1){
						if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
		       				api.toast({
		                       msg:'暂无相关信息'
	                     });
								return false;
						}else{
							var nowli='';
							for (var i = 0; i < data.length; i++) {
									var addressInfo='';//地址信息
										addressInfo=data[i].communityName+"&nbsp"+data[i].buildingName+data[i].unitName+"&nbsp"+data[i].roomName;
										if(data[i].typeName==''||data[i].typeName==undefined||data[i].typeName==null){
											data[i].typeName='暂无'
										}
										 nowli += '<div class="same">'
												+'<div class="sameBox">'
												+'<div class="top">'
												+'<span>'+data[i].parentName+'</span>'
												+'<span>'+data[i].parentPhone+'</span>'
												+'</div>'
												+'<div class="mid">'
												+'<span>'+addressInfo+'</span>'
												+'</div>'
												+'<div class="last">'
												+'<div class="last_left">'
												+'<span>关系类型:</span>'
												+'<span>'+data[i].typeName+'</span>'
												+'</div>'
												+'</div>'
												+'</div>'
												+'</div>'
							}
							$('#showList').html(nowli);
						}
                      }else{  
                       alert(result.msg);
                      } 
                  }  
          }); 
	};
	
	
	$("#scan").click(function() {
		var FNScanner = api.require('FNScanner');
		FNScanner.openScanner({
			autorotation : true
		}, function(ret, err) {
			if (ret.content) {
				api.openWin({
					pageParam : {
						info:ret.content
					},
					name : 'ownerRwm',
					url : '../fangwu/ownerRwm.html',
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					},
					
				});
			} else {
				console.log(JSON.stringify(err));
			}
		});
	}); 

//	$("#scan").click(function() {
//		var scanner = api.require('scanner');
//			scanner.open(function(ret, err) {
//			    if (ret.eventType=='success') {
//			    	api.openWin({
//						pageParam : {
//							info:ret.msg
//						},
//						name : 'ownerRwm',
//						url : '../fangwu/ownerRwm.html',
//						slidBackEnabled : true,
//						animation : {
//							type : "push", //动画类型（详见动画类型常量）
//							subType : "from_right", //动画子类型（详见动画子类型常量）
//							duration : 300 //动画过渡时间，默认300毫秒
//						},
//						
//				});
//					
//			        alert(JSON.stringify(ret));
//			    } else {
////			        alert(JSON.stringify(err));
//			    }
//			});
//	}); 


}
function goBack() {
		api.closeWin({
		});
	}
