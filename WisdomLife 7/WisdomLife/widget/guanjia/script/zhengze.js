$(function(){
	function check(string,type,result){
		var mobileReg=/^1[3|4|5|7|8][0-9]\\d{8}/;
		var tel=/^(\d{3,4}-)\d{7,8}$/;
		var sfz=/\d{14}[[0-9],0-9xX]/;							  //验证身份证号（15位或18位数字）
		var email=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		var sy=/^[A-Za-z0-9]+$/;                                  //只能数字与字母
		var zx=/^[0-9]+([.][0-9]+){0,1}$/;                        //只能整数或小数
		var zs=/^[0-9]*$/;                                        //只能数字
		var ns=/^\d{n}$/;                                         //只能输入n位的数字
		var zns=/^\d{n,}$/;										  //只能输入至少n位的数字
		var mns=/^\d{m,n}$/;									  //只能输入m~n位的数字  
		var lf=/^(0|[1-9][0-9]*)$/;                                //只能输入零和非零开头的数字
		var lxs=/^[0-9]+(\.[0-9]{2})?$/;						  //只能输入有两位小数的正实数
		var ysx=/^[0-9]+(\.[0-9]{1,3})?$/;						  //只能输入有1~3位小数的正实数
		var nzint=/^\+?[1-9][0-9]*$/;							  //只能输入非零的正整数
		var nzzs=/^\-[1-9][0-9]*$/;								  //只能输入非零的负整数
		var onlyLenchar=/^.{3}$/;								  //能输入长度为3的字符
		var onlyEngChar=/^[A-Za-z]+$/;							  //只能输入由26个英文字母组成的字符串
		var onlyBEngChar=/^[A-Z]+$/;							  //只能输入由26个大写英文字母组成的字符串
		var onlySEngChar=/^[a-z]+$/;							  //只能输入由26个小写英文字母组成的字符串
		var onlyChinese=/^[\u4e00-\u9fa5]{0,}$/                   //只能输入汉字
		if (!type.test(string)) {
			alert(result);
			return false;
		}
	}
})