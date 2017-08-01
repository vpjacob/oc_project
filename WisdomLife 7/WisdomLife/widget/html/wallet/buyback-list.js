var urId;
apiready = function() {
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			console.log('userNo为'+urId);
			bankList(urId);
		});
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}


	$('#addcards').click(function() {
		api.openWin({
			name : 'buyback-add',
			url : 'buyback-add.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#goback').click(function(){
		api.closeWin({
        });
//      api.execScript({//刷新银行卡列表页面
//			name : 'buyback',
//						//frameName : 'buyback-list',
//			script : 'refresh();'
//		});
	});
	
//	api.addEventListener({
//		name : 'keyback'
//	}, function(ret, err) {
//		api.closeWin();
//		api.execScript({//刷新我的界面金币总数的数据
//				name : 'buyback',
//				script : 'refresh();'
//			});
//			
//	});
	
	
	
//	获取银行列表
	function bankList(urId){
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"queryBankList",
	      form:{
	        userNo:urId
	      },
	      success:function (data) {
	      console.log($api.jsonToStr(data));
	       if (data.formDataset.checked == 'true') {
	       		var account = data.formDataset.bankList;
	       		var list=$api.strToJson(account);
//	       		var list=eval(account);
	       		console.log(list)
	       		//$api.jsonToStr(data)
				if(list.length==0){
					api.toast({
						msg : "您还没有添加银行卡！"
					});
				}else{
				var imgUlr='';
		       		for(var i=0;i<list.length;i++){
		       			if(list[i].open_bank=="中信银行"){
		       				imgUlr='<img src="../../image/bank1.png"/>'
		       			}else if(list[i].open_bank=="工商银行"){
		       				imgUlr='<img src="../../image/bank2.png"/>'
		       			}
		       			var nowli='<div class="jia" >'
		       					+'<div class="left">'
		       					+''+imgUlr+''
		       					+'</div>'
		       					+'<div class="middle">'
		       					+'<div><span>'+list[i].open_bank+'</span></div>'
            					+'<div><span>'+list[i].card_no+'</span></div>'
            					+'</div>'
            					+'<div class="last">'
            					+'<input type="checkbox" id="'+list[i].id+'" />'
            					+'</div>'
            					+'</div>';		       			
		       			$('#addcard').append(nowli);
		       			
		       		}
	       		}
	         } else {
	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}
	
//选择提交删除
	$('#delt').click(function(){
		list()
	})
	$('#add').click(function(){
		addlist()
	})
	
// 获取要删除选中的列表项
	function list(){
		var input=$('#addcard input');
		var arr=[];	
		for(var i=0;i<input.length;i++){
			if(input[i].checked==true){
				 arr.push(input[i]);   
			}
		}
		if(arr.length==1){
	        //console.log(arr[0].id);
	       // confirm('您要删除吗？');
	        api.confirm({
			    title: '提示',
			    msg: '您要删除吗？',
			    buttons: ['确定', '取消']
			}, function(ret, err) {
			    var index = ret.buttonIndex;
			    if(index==1){
			    	del(arr[0].id);
			    	
			    }
			});
	        
	    }else if(arr.length==0){
	        alert('请您选择一个银行卡');
	        return ;
	    }else{
	    	 alert('您只能选择一个银行卡');
	        return ;
	    }
	}

// 获取添加选中的列表项
	function addlist(){
		var input=$('#addcard input');
		var arr=[];	
		for(var i=0;i<input.length;i++){
			if(input[i].checked==true){
				 arr.push(input[i]);   
			}
		}
		if(arr.length==1){
	        //console.log(arr[0].id);
	       // confirm('您要删除吗？');
	        api.confirm({
			    title: '提示',
			    msg: '您要选择这张银行卡转入吗？',
			    buttons: ['确定', '取消']
			}, function(ret, err) {
			    var index = ret.buttonIndex;
			    if(index==1){
			    
			    api.setPrefs({
				    key: 'chooseId',
				    value: arr[0].id
				});
			    	console.log(arr[0].id);
			    	
			    	api.closeWin({
        				});
        			api.execScript({//刷新银行卡列表页面
						name : 'buyback',
						//frameName : 'buyback-list',
						script : 'refresh();'
					});	
			    }
			});
	        
	    }else if(arr.length==0){
	        alert('请您选择一个银行卡');
	        return ;
	    }else{
	    	 alert('您只能选择一个银行卡');
	        return ;
	    }
	}


// 传送后台id进行删除
	function del(urId){
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"bankDeleteFun",
	      form:{
	        //userNo:urId,
	        id:urId
	      },
	      success:function (data) {
		      	setTimeout(function(){
		      		location.reload();
		      	},100)
	       }
	    });
	}

}
