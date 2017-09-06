//
//  JJRefuseManager.h
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/9.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "LoginDto.h"
@interface JJRefuseManager : NSObject


@property (nonatomic, strong) NSMutableArray *list;
@property (nonatomic, strong) NSMutableArray *devLogArray; // 运行时同一个设备开门记录

+ (instancetype)manager;

- (BOOL)save;

//- (void)test;

- (void)addOpenLog:(VoipDoorDto*) refuseModel;

- (void)delDevAllOpenLog:(NSString*) devSn;


- (VoipDoorDto *) getOpenLog:(long) index;

- (void) getRefuseLogWithDevSn:(NSString*) devSn;

- (void) getAllOpenLog;

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData;

- (void)print;

@end
