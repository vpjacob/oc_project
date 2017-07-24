//
//  HttpURLConstant.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/4.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#ifndef Storm_HttpURLConstant_h
#define Storm_HttpURLConstant_h

#import "BuildConfig.h"

#if TAGGET_ENV_SIT

   #define kApphttp    @"https://www.doormaster.me:9099"

#elif TAGGET_ENV_PRE

   #define kApphttp    @"http://...."

#elif TAGGET_ENV_PRD

   #define kApphttp    @"http://...."

#endif

#endif
