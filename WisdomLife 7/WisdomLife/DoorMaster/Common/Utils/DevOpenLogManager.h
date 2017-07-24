//
//  DevOpenLogManager.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DevOpenLogModel.h"


@interface DevOpenLogManager : NSObject
@property (nonatomic, strong) NSMutableArray *list;
@property (nonatomic, strong) NSMutableArray *devLogArray; // 运行时同一个设备开门记录

+ (instancetype)manager;

- (BOOL)save;

//- (void)test;

- (void)addOpenLog:(DevOpenLogModel*) logModel;

- (void)delDevAllOpenLog:(NSString*) devSn;

// 更新记录状态为已上传
- (void)updateOpenLogStatus:(NSMutableArray*)logModelArray;

- (DevOpenLogModel *) getOpenLog:(long) index;

- (void) getOpenLogWithDevSn:(NSString*) devSn;

- (void) getAllOpenLog;

// 获取未上传的开门记录
- (NSMutableArray *) getUnuploadLog:(int)getCount;

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData;

- (void)print;


@end