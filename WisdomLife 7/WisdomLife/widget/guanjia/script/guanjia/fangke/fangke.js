var userDate =""
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}

	$('#details').click(function() {
		api.openWin({
			name : 'fangke',
			url : 'fangkexiangqing.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
	$('#date').click(function() {
		api.openPicker({
    		type: 'date',
		    date: '',
		    title: '选择时间'
		}, function(ret, err) {
			userDate = ret.year+"-"+ret.month+"-"+ret.day;
			//$("#show").attr('value', userDate);
			$("#show").html(userDate);
    		if (ret) {
    	} 
		});
	});
	
//	发送密码按钮
	$("#apply").click(function(){
		var telephone = $("#tel").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	   if (telephone == null || telephone == "") {
			alert("接收人电话或邮箱不能为空");
			return false;
		} else if (!mobileReg.test(telephone)) {
			alert("接收人电话格式有误");
			return false;
		} else {
			alert("提交成功");
		}
	});
	
//访客授权接口
	function fangke(){
			$.ajax({
                  url:propertyUrl+"/doormaster/server/video_devices/temp_pwd", 
                  type:"POST",   
                  async:true,
                  contentType: 'application/x-www-form-urlencoded',
                  data:$api.jsonToStr({
                    "access_token": access_token,
                    "operation": "POST",
                    "data":  {
                    	"dev_sn":"442c05e69b53",
                    	"start_datetime": "20170510103000", 
     					"end_datetime": "20170510103001",
 						"use_count":2,

                     }
                  }),
                  dataType:"json",   
                  success:function(req){
                      console.log("返回结果:"+$api.jsonToStr(req));
                      var result= req.temp_pwd;
                      console.log('result'+result);
                     
                  },
                  error:function(){
                      
                  }
              }); 
		
		}
	
	//fangke();
	

}
		function goBack() {
			api.closeWin({
			});
}
