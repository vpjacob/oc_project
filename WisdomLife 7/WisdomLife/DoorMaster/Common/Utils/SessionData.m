//
//  SessionData.m
//  DoorMaster
//
//  Created by 宏根 张 on 16/1/14.
//  Copyright © 2016年 zhiguo. All rights reserved.
//

#import "SessionData.h"
#import "DeviceManager.h"
#import "UserManager.h"
#import "DevOpenLogManager.h"
#import "MessageManager.h"
#import "OptionManager.h"
#import "UserManager.h"
#import "DevSystemInfoManager.h"
#import "GlobalTimer.h"
#import "Config.h"

@interface SessionData()

@end

@implementation SessionData

+ (void) clearSessionData
{
    //清除本地的用户数据，跳转到登录窗口
    [[DeviceManager manager] clearSessionData];
    [[Config currentConfig] clearSessionData];
    [[DevOpenLogManager manager] clearSessionData];
    [[MessageManager manager] clearSessionData];
    [[OptionManager manager] clearSessionData];
    [[DevSystemInfoManager manager] clearSessionData];
    [[UserManager manager] clearUser]; // 删除当前保存的人员信息数据，登录重新获取
    [GlobalTimer stopNSTimer];
}

@end
