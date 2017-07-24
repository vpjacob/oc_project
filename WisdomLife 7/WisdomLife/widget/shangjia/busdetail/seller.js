var id;
apiready = function() {
	id = api.pageParam.id;
	console.log('=========='+id);
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	$("#Back").on('click', function() {
		api.closeWin();
	});
	$("#goH").on('click', function() {
		api.toast({
		    msg: '此功能暂未开通'
		});
	});
	function listInfo(fid){
//		/console.log(fid);
		AjaxUtil.exeScript({
	      script:"mobile.business.business",
	      needTrascation:true,
	      funName:"getBusinessById",
	      form:{
	         fid:fid
	      },
	      success:function (data) {
	      console.log($api.jsonToStr(data));
	       if (data.formDataset.checked == 'true') {
	       		var account = data.formDataset.comDTO;
	       		var list=$api.strToJson(account);
	       		//console.log('list.fid'+list);
	       		$('#headpic').attr('src', rootUrl+ list.shopurl);
//	       		$('#sjname').html(list.companyname);
//	       		$('#address').html(list.address);
//	       		$('#companytype').html(list.companytype);
//	       		$('#tel').html(list.tel);
//	       		$('#time').html(list.starttime + "-" + list.endtime);
//	       		$('#mainbusiness').html(list.mainbusiness);
//	       		$('#summary').html(list.summary);
//	       		$('#type').html(list.companytype);
	       		list.companyname==null?$('#sjname').html('无'):$('#sjname').html(list.companyname);
	       		list.address==null?$('#address').html('无'):$('#address').html(list.address);
	       		list.companytype==null?$('#companytype').html('无'):$('#companytype').html(list.companytype);
	       		list.tel==null?$('#tel').html('无'):$('#tel').html(list.tel);
	       		list.starttime==null?$('#time').html('无'):$('#time').html(list.starttime + "-" + list.endtime);
	       		list.endtime==null?$('#time').html('无'):$('#time').html(list.starttime + "-" + list.endtime);
	       		list.mainbusiness==null?$('#mainbusiness').html('无'):$('#mainbusiness').html(list.mainbusiness);
	       		list.companytype==null?$('#type').html('无'):$('#type').html(list.companytype);
	       		list.summary==null?$('#summary').html('无'):$('#summary').html(list.summary);
	         } else {
	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}
	
	listInfo(id);
	
}