//
//  BuildConfig.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/4.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#ifndef Storm_BuildConfig_h
#define Storm_BuildConfig_h

//应用环境开关
#define TAGGET_ENV_SIT  1
#define TAGGET_ENV_PRE  0
#define TAGGET_ENV_PRD  0

//日志打印开关
#define DEBUGLOG 0

#ifdef DEBUGLOG
#   define DLog(fmt,...) NSLog((@"%s [Line %d] " fmt),__PRETTY_FUNCTION__,__LINE__,##__VA_ARGS__);
#else
#   define DLog(...)
#endif


//开发调试开关
#define DEBUG_ENABLE  0

#endif
