var urId='';
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	var roomId=api.pageParam.id;
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		queryTenementApplyByRoom(urId,100);
		
	});
	
	//14，根据租户房屋申请id查找租户信息		
		function queryTenementApplyById(tempId){
           var data = {
               "id": tempId,
          };
            $.ajax({  
                  url:rootUrls+'/xk/queryTenementApplyById.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result)); 
                  	 var data = result.data; 
                  	 if(result.state==1){
						$('#userName').html(data.userName);
						$('#userPhone').html(data.userPhone);
						$('#communityName').html(data.communityName);
						$('#unitName').html(data.unitName);
						$('#buildingName').html(data.buildingName);
						$('#roomName').html(data.roomName);
						$('#startTime').html(data.startTime);
						$('#endTime').html(data.endTime);
                      }else{  

                      } 
                  }  
          }); 
	}
	//查找当前登录人有关的所有的房屋的租户申请信息
	function queryTenementApplyByRoom(urId,type) {
		var data = {
			"userNo" : urId,
			"status" : type ,
			"roomId" : roomId
		};
		$.ajax({
			url : rootUrls + '/xk/queryTenementApplyByRoom.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
						api.toast({
							msg : '暂无相关信息'
						});
						return false;
					} else {
						var nowli = '';
						var test ='';
						var statusColor='';
						var statusWord='';
						for (var i = 0; i < data.length; i++) {
							test=data[i].communityName+"&nbsp"+data[i].unitName+data[i].buildingName+"&nbsp"+data[i].roomName;
							if(data[i].status==0 || data[i].status==2){   //申请状态
								statusColor='lrColor';
							};
							if(data[i].status==0 || data[i].status==3){   //申请状态
								statusWord='查看';
							}
							if(data[i].status==2){   //申请状态
								statusWord='详情';
							}
							nowli+='<div class="same">'
								+'<div class="sameBox">'	
								+'<div class="top">'
								+'<span>'+data[i].userName+'</span>'	
								+'<span>'+data[i].userPhone+'</span>'
								+'</div>'
								+'<div class="mid">'
								+'<span>'+test+'</span>'
								+'</div>'	
								+'<div class="last">'
								+'<div class="last_left">'
								+'<span class="status statcolor" id='+data[i].id+'>'+statusWord+'</span>'
								+'</div>'
								+'<div class="last_right">'
								+'<span class="'+statusColor+'">'+data[i].statusName+'</span>'
								+'</div>'
								+'</div>'
								+'</div>'
								+'</div>'
						}
						$('#showList').html(nowli);
						$('.same').on('click','.status',function(){
							var tempId=$(this).attr('id');
							$('.tankuang_box').show();
							$('.black_box').show();
							queryTenementApplyById($(this).attr('id'));
							if($(this).html()=='详情'){
								$('#about').show();
								$('#agree').click(function(){
									submitTenementApply(tempId,0);
								});
								$('#noAgree').click(function(){
									submitTenementApply(tempId,3);
								})
							};
							if($(this).html()=='查看'){
								$('#about').hide();
							};
														
						});
					}
				} else {
					// 
				}
			}
		});
	}
	//筛选
	$('#waitting').click(function(){
		$('#showList').empty();
		queryTenementApplyByRoom(urId,2);
		$(".secondul").hide();
	});
	$('#sucess').click(function(){
		$('#showList').empty();
		queryTenementApplyByRoom(urId,0);
		$(".secondul").hide();
	});
	$('#failed').click(function(){
		$('#showList').empty();
		queryTenementApplyByRoom(urId,3);
		$(".secondul").hide();
	})
	
	//确认租户审核信息
	function submitTenementApply(agreeId,type){
           var data = {
               "id": agreeId,
               "status":type
          };
            $.ajax({  
                  url:rootUrls+'/xk/submitTenementApply.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result)); 
                  	 var data = result.data; 
                  	 if(result.state==1){
                  	 	$('.tankuang_box').hide();
						$('.black_box').hide();
                  	 	 alert(result.msg);
                       	location.reload();
                      }else{  
						alert(result.msg);
                      } 
                  }  
          }); 
	}
}

function goBack() {
	api.closeWin({
	});
}
var flag=true;
$("#choose").click(function() {
		if (flag==true) {
			$(".secondul").show();
			flag=false;
		} else {
			$(".secondul").hide();
			flag=true;
		}
	});
$('.same').on('click','.status',function(){
	$('.tankuang_box').show();
	$('.black_box').show();
})
$('#close').click(function(){
	$('.tankuang_box').hide();
	$('.black_box').hide();
})
