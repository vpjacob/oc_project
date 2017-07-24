//
//  DevOpenLogModel.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//
#import <Foundation/Foundation.h>

@interface DevOpenLogModel : NSObject

@property (nonatomic, copy) NSString *devName; // 设备名称
@property (nonatomic, copy) NSString *devMac; // 设备MAC地址
@property (nonatomic, copy) NSString *devSn; // 设备序列号
@property (nonatomic, copy) NSString *operationUser; // 开锁操作用户
@property (nonatomic, copy) NSString *cardno; // 卡号
@property (nonatomic, copy) NSDate *eventTime; // 操作时间
@property (nonatomic) int logID; // 记录流水号，从1开始递增
@property (nonatomic) int actionTime; // 开锁时长，锁打开时间，单位：秒
@property (nonatomic) int operationRet; // 开锁结果(0 成功，1 失败， 2 没响应)
@property (nonatomic) int operationTime; // 操作时长（点击开锁到结束所需的时间，单位秒）
@property (nonatomic) int eventType; // 事件类型（1 手机开门， 2 远程开门）
@property (nonatomic) int status; // 记录状态（0 未上传， 1 已上传服务器）

-(void)initOpenLog:(DevOpenLogModel *) logModel;

-(void)initOpenLogWithDic:(NSDictionary *)dict;

@end
