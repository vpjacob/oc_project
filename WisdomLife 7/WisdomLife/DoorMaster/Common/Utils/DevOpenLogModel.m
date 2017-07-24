//
//  DevOpenLogModel.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "DevOpenLogModel.h"

#import "MJExtension.h"

@implementation DevOpenLogModel

-(void)initOpenLog:(DevOpenLogModel *) logModel
{
    self.devName = logModel.devName;
    self.devMac = logModel.devMac;
    self.devSn = logModel.devSn;
    self.logID = logModel.logID;
    self.eventTime = logModel.eventTime;
    self.actionTime = logModel.actionTime;
    self.operationTime = logModel.operationTime;
    self.operationRet = logModel.operationRet;
    self.operationUser = logModel.operationUser;
    self.cardno = logModel.cardno;
    self.status = logModel.status;
    self.eventType = logModel.eventType;
}

-(void)initOpenLogWithDic:(NSDictionary *)dict
{
    self.devName = dict[@"dev_name"];
    self.devMac = dict[@"dev_mac"];
    self.devSn = dict[@"dev_sn"];
    self.actionTime = [dict[@"action_time"] intValue];
    self.operationUser = [Config currentConfig].phone;
    self.eventTime = [NSDate date];
//    self.logID = [[DevLogIDManager manager] getMaxLogID: logModel.devSn];
    self.cardno = dict[@"cardno"];
    self.operationRet = [dict[@"op_ret"] intValue];
//    self.status = dict[@"dev_name"];
    self.eventType = [dict[@"event_type"] intValue]; // 1 手机开门， 2 远程开门
}

MJCodingImplementation
@end
