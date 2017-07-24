var urId='';
var page = 1;
var pageCount = 1;
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
		// 获取维修类型
	queryMaintainType();
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		//保修列表
	});
	$(function() {
		$(".Personal_centent").hide().first().show();
		$(".step").hide().first().show();
		$(".span1").click(function() {
			$("#apply").hide();
//			保修列表获取
			$('#wxDetails').empty();
			page=1;
			maintainInfo(urId,1);
		})
		$(".span0").click(function() {
			$("#apply").show();
		})
		$(".Personal_title span").click(function() {
			$(this).addClass("special").siblings().removeClass("special");
			$(".Personal_centent").hide().eq($(this).index()).show();
		});
//		$("#wx").click(function() {
//			$(".black_box").show();
//			$(".tankuang_box").show();
//		})
		$("#close").click(function() {
			$(".black_box").hide();
			$(".tankuang_box").hide();
		});

		$("#apply").click(function() {
			var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
			var telephone = $("#telphone").val();
			var name = $("#name").val();
			if (name == null || name == "") {
				alert("联系人不能为空");
				return false;
			}else if (telephone == null || telephone == "") {
				alert("联系电话不能为空");
				return false;
			} else if (!mobileReg.test(telephone)) {
				alert("联系电话格式有误");
				return false;
			} else if ($("#address").val()=="") {
				alert("请填写维修房间信息");
				return false; 
			}else if ($("#role option:selected" ).val()=="0") {
				alert("请选择报修类型");
				return false;
			}else {
				regMaintain();
			}
		});

	})
	//}
	// 获取维修类型
	function queryMaintainType(){
           var data = {};
            $.ajax({  
                  url:rootUrls+'/maintain/queryMaintainType.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	  var data= result.data;
                  	 if(result.state==1){
                  	 	  var list='<option value="0">请选择</option>';
                  	 	for(var i=0;i<data.length;i++){
                  	 		list+= '<option value="'+data[i].fid+'">'+data[i].estateName+'</option>'
                  	 	}
                  	 	$('#role').html(list);
                      }else{  
//                        alert("2");
                      } 
                  }  
          }); 
	};

	//提交物业维修
	function regMaintain(){
           var data = {
           		"userNo":urId,
           		"maintainType":$("#role option:selected" ).val(),
           		"applyName":$("#name").val(),
           		"applyPhone":$("#telphone").val(),
           		"applyAddress":$('#address').val(),
           		"remark":$('#textarea').val()
           };
            $.ajax({  
                  url:rootUrls+'/maintain/regMaintain.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	  var data= result.data;
                  	 if(result.state==1){
                  	 	alert(result.msg);
                  	 	$("#name").val('');
                  	 	$("#telphone").val('');
                  	 	$("#address").val('');
                  	 	$("#textarea").val('');
                      }else{  
                       alert(result.msg);
                       $("#name").val('');
                  	 	$("#telphone").val('');
                  	 	$("#address").val('');
                  	 	$("#textarea").val('');
                      } 
                  }  
          }); 
	};
	//报修列表
	function maintainInfo(urId,pages){
           var data = {
           		"userNo":urId,
               "pageNo":pages,
               "pageSize":"10"
           };
            $.ajax({  
                  url:rootUrls+'/maintain/maintainInfo.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	  
                  	 if(result.state==1){
                  	 	var data= result.data.list;
                  	 	if(data==undefined||data==""||data.length==0||data.length==null||data.length==undefined||data==null){
	                      	if (pages == 1) {
									api.toast({
										msg : '暂无报修列表'
									});
								} else {
									api.toast({
										msg : '无更多报修列表'
									});
								}
                       }else{
                       	var nowList='';
                       	var grade='';//维修状态
                       	var gradeWord='';//维修字段显示
                       		for(var i = 0; i < data.length; i++){
                       			if(data[i].status==0){
	                        		grade='result';
	                        		gradeWord='待接收';
	                        	}else if(data[i].status==1){
	                        		grade='result';
	                        		gradeWord='已受理';
	                        	}else if(data[i].status==2){
	                        		grade='result1';
	                        		gradeWord='已维修';
	                        	}else if(data[i].status==3){
	                    			grade='result';
	                        		gradeWord='申请驳回';
	                    	}
                       			nowList+='<div class="waterwx"><div><span>'+data[i].maintainType+'</span><span class="'+grade+'">'+gradeWord+' </span></div></div><div style="border-bottom: 1px solid #E6E6E6" class="wxsame" id="'+data[i].fid+'"><span style="margin-left: 4px">维修详情</span></div><div><span style="margin-left: 4px">发布时间 <span style="margin-left: 15px">'+data[i].applyTimeStr+'</span></span></div>'
                       		}
                       		$('#wxDetails').append(nowList);
                       }
                       pageCount = result.data.count > 10 ? Math.ceil(result.data.count / 10) : 1;
                      }else{  
                       
                      } 
                  } 
          }); 
	};
	
	api.addEventListener({
		name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				maintainInfo(urId,page);
			} else {
				page = parseInt(pageCount) + 1;
			}
	});
	
	//调用维修详情   及弹出框显示
	$('.list_box').on('click', '.wxsame', function() {
			$(".black_box").show();
			$(".tankuang_box").show();
			//$(this).attr('id')
			wxInfo($(this).attr('id'));
			
	});
//	维修详情方法
	function wxInfo(wxId){
           var data = {
           	'fid':wxId
           };
            $.ajax({  
                  url:rootUrls+'/maintain/maintaindetail.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	  var data= result.data;
                  	 if(result.state==1){
                  	 	$('#wxName').html(data.applyName);
                  	 	$('#wxTel').html(data.applyPhone);
                  	 	$('#roomInfo').html(data.applyAddress);
                  	 	$('#wxTime').html(data.applyTimeStr);
                  	 	if(data.endTimeStr=="" || data.endTimeStr==null || data.endTimeStr=="undefined"){
                  	 		$('#endTime').html("暂无");
                  	 	}else{
                  	 		$('#endTime').html(data.endTimeStr);
                  	 	}
                  	 	if(data.status==0){
	                    		$('#wxstate').html('待接收');
	                    	}else if(data.status==1){
	                    		$('#wxstate').html('已受理');
	                    	}else if(data.status==2){
	                    		$('#wxstate').html('已维修');
	                    	}else if(data.status==3){
	                    		$('#wxstate').html('申请驳回');
	                    	}
                      }else{  
//                        alert("2");
                      } 
                  }  
          }); 
	};
}
function goBack() {
		api.closeWin({
		});
	}
