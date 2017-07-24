/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-10-20
 * Desc     :F7的日期函数封装
 * Author   :Tuatua
 *******************************************************************************/
/**
 *  @namespace Auto517.Date
 *  Method:
 *  Auto517.Date().getDiffLabel();
 */
var _p_date = function() {
        //
        (function(){
            Date.prototype.Format = function(fmt) {
                var o = {
                    "M+": this.getMonth() + 1, //月份   
                    "d+": this.getDate(), //日   
                    "h+": this.getHours(), //小时   
                    "m+": this.getMinutes(), //分   
                    "s+": this.getSeconds(), //秒   
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
                    "S": this.getMilliseconds() //毫秒   
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        })();
        //
        function _getDiffLabel(startTime, endTime){
            var time1   = startTime;
            var time2   = endTime;
            var begin1  = time1.substr(0, 10).split("-");
            var end1    = time2.substr(0, 10).split("-");
            var date1   = new Date(begin1[0] + '-' + begin1[1] + '-' + begin1[2]);
            var date2   = new Date(end1[0] + '-' + end1[1] + '-' + end1[2]);
            var m       = parseInt(Math.abs(date2 - date1) / 1000 / 60);
            var min1    = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
            var min2    = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));
            var n       = min2 - min1;
            var diffMinutes = m + n;
            var label = ''
            var diffDays = 0;
            //
            if(diffMinutes < 60){
                label = Math.ceil(diffMinutes) + '分钟前';
                return label
            }else if(diffMinutes > 60 && diffMinutes/ 60 < 24){
                label = Math.ceil(diffMinutes/60) + '小时前';
                return label
            }

            diffDays  = parseInt(Math.abs(date1 - date2) / 1000 / 60 / 60 / 24);

            if(diffDays == 1){
                label = '昨天';
            }else if(diffDays == 2){
                label = '前天';
            }else{
                startTime = startTime.replace(/-/g, "/")
                label = new Date(startTime).Format('yyyy-MM-dd');
            }
            /*
            if(diffMinutes/60 >= 24 && diffMinutes/60 < 48){
                label = '昨天';  
            }else if(diffMinutes/60 >=48 && diffMinutes/60 < 72){
                label = '前天';
            }else if(diffMinutes/60 >=48 && diffMinutes/60 < 72){
                label = dt;
            }else{
                startTime = startTime.replace(/-/g, "/")
                label = new Date(startTime).Format('yyyy-MM-dd');
            }
            */
            return label;
        }
    //
    return {
        "getDiffLabel" : _getDiffLabel
    };
}
//
Auto517.regist(_p_date, "Date");