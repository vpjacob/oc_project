var _p_bmap = function() {
	var bMap = api.require('bMap');
	_bmap_getLocation(function(lat,lon){
		user_lat=lat;
		user_lon=lon;
		Auto517.bMap._bmap_getNameFromCoords(lat,lon,function(ret){
			user_address=ret.address;
			user_city=ret.city;
			user_district=ret.district;
			user_province=ret.province;
			user_streetName=ret.streetName;
			user_streetNumber=ret.streetNumber;
		});
		var _data = {
			script: "managers.om.user.user",
			needTrascation: false,
			funName: "updateUser",
			form: "{uid: '" + uid + "',lat:" + lat + ",lon: " + lon +  "}"
		};
	
		$$.ajax({
			url: rootUrl + "/api/execscript",
			method: 'post',
			dataType: 'json',
			data: _data,
			success: function(data) {
				
			},
			error: function(data) {
				api.toast({
				    msg: '定位失败',
				    duration: 2000,
				    location: 'middle'
				});
			}
		});
	})
	function _bmap_open(user_lon, user_lat) {
		bMap.open({
			rect: {
				x: 0,
				y: 0,
				w: 320,
				h: 300
			},
			center: {
				lon: user_lon,
				lat: user_lat
			},
			zoomLevel: 10,
			showUserLocation: true,
			fixedOn: 'ohmy',
			fixed: true
		}, function(ret) {
			if (ret.status) {
				api.toast({
				    msg: '地图打开成功',
				    duration: 2000,
				    location: 'middle'
				});
			}
		});
	}

	function _bmap_getLocation(callback) {
		if (typeof(bMap) != "undefined" && null != bMap) {
			bMap.getLocation({
			    accuracy: '100m',
			    autoStop: true,
			    filter: 1
			}, function(ret, err) {
			    if (ret.status) {
			        callback(ret.lat,ret.lon);
			    } else {
			        alert(err.code);
			    }
			});
		}
	}

	function _bmap_getNameFromCoords(lat_, lon_,callback) {
		if (typeof(bMap) != "undefined" && null != bMap) {
			bMap.getNameFromCoords({
				lon: lon_,
				lat: lat_
			}, function(ret, err) {
				if (ret.status) {
					callback(ret);
				}
			});
		}
	}
	/**
	 * 通过两个位置的经纬度算出两个位置的距离
	 * @param {Object} user_lon 用户的经纬度
	 * @param {Object} user_lat 用户的经纬度
	 * @param {Object} lonD  目标位置的经纬度
	 * @param {Object} latD	 目标位置的经纬度
	 * @param {Object} callback 回调函数
	 */
	function _bmap_getDistanceByLat(user_lon, user_lat, lonD, latD, callback) {
		if (typeof(bMap) != "undefined" && null != bMap) {
			bMap.getDistance({
				start: {
					lon: user_lon,
					lat: user_lat
				},
				end: {
					lon: lonD,
					lat: latD
				}
			}, function(ret) {
				if (ret.status) {
					callback(ret.distince / 1000);
				}
			});
		}

	}

	/**
	 * 关键词搜索的方法
	 * @param {Object} user_lon,user_lat 人的经纬度
	 * @param {Object} searchItem 关键词搜索
	 * @param {Object} callback
	 */
	function _bmap_getNearByLat(user_lon, user_lat, searchItem, callback) {
		if (typeof(bMap) != "undefined" && null != bMap) {
			bMap.searchNearby({
				keyword: searchItem,
				lon: user_lon,
				lat: user_lat,
				radius: 1000
			}, function(ret, err) {
				if (ret.status) {
					if (ret.results.length > 0) {
						callback(ret);
					}
				}
			});
		}
	}
	/**
	 * 将百度地图展示和隐藏
	 * @param {Object} temp 百度地图隐藏和展示的
	 */
	function _bmap_show_hide(temp) {
		if (typeof(bMap) != "undefined" && null != bMap) {
			if (temp = 'show') {
				bMap.show();
			} else {
				bMap.hide();
			}
		}

	}
	/**
	 * 关闭百度地图
	 */
	function _bmap_close() {
		if (typeof(bMap) != "undefined" && null != bMap) {
			bMap.close();
		}

	}

	return {
		"_bmap_open": _bmap_open,
		"_bmap_getLocation": _bmap_getLocation,
		"_bmap_getNameFromCoords": _bmap_getNameFromCoords,
		"_bmap_getDistanceByLat": _bmap_getDistanceByLat,
		"_bmap_getNearByLat": _bmap_getNearByLat,
		"_bmap_show_hide": _bmap_show_hide,
		"_bmap_close": _bmap_close
	};

}

Auto517.regist(_p_bmap, "bMap");