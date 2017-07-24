//
//  SharkMotionManager.h
//  DoorMaster
//  加速仪监控：摇一摇开门
//  Created by 宏根 张 on 6/29/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SharkMotionManager : NSObject

+ (instancetype)manager;

// 初始化
- (void)initMotionManager;

// 启动摇一摇监听操作
- (void)startShakeMonitor;

// 停止摇一摇监听
-(void)stopShakeMonitor;

@end
