//
//  DevSystemInfoModel.h
//  DoorMaster
//  设备系统信息
//  Created by 宏根 张 on 8/5/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DevSystemInfoModel : NSObject

@property (nonatomic, copy) NSString *devSn; // 设备序列号
@property (nonatomic) int openTime; // 开门时长
@property (nonatomic) int cardCount; // 卡登记数
@property (nonatomic) int userCount; // 用户登记数
@property (nonatomic) int maxCardCount; // 卡容量
@property (nonatomic) int wgfmt; // 韦根格式
@property (nonatomic) int lockSwitch; // 锁开关信号
@property (nonatomic, copy) NSString *version; // 版本号

-(void)initDevSystemInfo:(DevSystemInfoModel *)devSystemInfo;

@end
