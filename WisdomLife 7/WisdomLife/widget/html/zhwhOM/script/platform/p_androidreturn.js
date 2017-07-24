/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-07-02
 * Desc     :FF7在Apicloud开发环境下返回键的封装实现
 * Author   :Tuatua
 *******************************************************************************/
/**
 *  @namespace Auto517.AndroidReturn
 *  Method:
 *  Auto517.AndroidReturn.init();
 */
var _p_androidReturn = function() {
    var _windowName = null;
    var _frameName = null;
    var _eventName = null;
    var _message = null;
    var _appId = null;
    var _exitTime = null;
    //
    function _exitApp2() {
        api.addEventListener({
            name : 'keyback'
        }, function(ret, err) {
            var setViewFun = '_auto517_pl_appback();';
			
            api.execScript({
                name : 'initw',
                frameName : 'welcome',
                script : setViewFun
            });

//          api.addEventListener({
//              name : 'appback'
//          }, function(ret, err) {
//              _onEvent();
//          });
        });
    }
    //
    function _onEvent() {
        api.toast({
            msg : '再按一次返回键退出',
            duration : 2000,
            location : 'bottom'
        });
        api.addEventListener({
            name : 'keyback'
        }, function(ret, err) {
            api.closeWidget({
                id : 'A6921550712789',
                retData : {
                    name : 'closeWidget'
                },
                silent : true
            });
        });

        setTimeout(function() {
            _offEvent();
            _exitApp2();
        }, 2000);
    }
    //
    function _offEvent(key) {
        api.removeEventListener({
            name : key
        });
    }
    //
    return {
        "init" : _exitApp2
    };
}
//
Auto517.regist(_p_androidReturn, "AndroidReturn");