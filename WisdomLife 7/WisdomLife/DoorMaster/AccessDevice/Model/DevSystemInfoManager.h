//
//  DevSystemInfoManager.h
//  DoorMaster
//
//  Created by 宏根 张 on 8/5/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DevSystemInfoModel.h"

@interface DevSystemInfoManager : NSObject

@property (nonatomic, strong) DevSystemInfoModel *systemInfoModel;
@property (nonatomic, strong) NSMutableArray *list;

+ (instancetype)manager;

- (BOOL)saveDevSystemInfo;

- (DevSystemInfoModel *)getDevSystemInfo:(NSString*) devSn;

- (void)addDevSystemInfo:(DevSystemInfoModel*) systemInfoModel;

- (void)delDevSystemInfo:(NSString *) devSn;

- (void)delAll;

- (void )updateDevSystemInfo:(DevSystemInfoModel*) systemInfoModel;

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData;

@end
