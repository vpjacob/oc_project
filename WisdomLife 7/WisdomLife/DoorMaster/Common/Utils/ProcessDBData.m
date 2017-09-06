//
//  ProcessDBData.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/30.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "ProcessDBData.h"
#import "DeviceManager.h"
#import "DoorDto.h"
//#import "DevModel.h"
//#import "DevManager.h"
//#import "DoorModel.h"
//#import "DoorManager.h"
//#import "DoorRunModel.h"
//#import "DoorRunManager.h"
#import "MessageModel.h"
#import "MessageManager.h"
//#import "OptionModel.h"
//#import "OptionManager.h"
#import "UserManager.h"
//#import "DevLogIDManager.h"
//#import "DevOpenLogModel.h"
#import "DevOpenLogManager.h"
#import "UploadOpenDoorService.h"
//#include "RequestTool.h"

@interface ProcessDBData()

@end

@implementation ProcessDBData

//// 新增门到数据库公共处理方法
//+(BOOL) addDoorModelData:(NSDictionary*) doorDict
//{
//    if (doorDict[@"dev_mac"] == nil || [doorDict[@"dev_mac"] isEqualToString: @""]  || doorDict[@"dev_sn"] == nil || [doorDict[@"dev_sn"] isEqualToString: @""])
//    {
//        ERROR_PRINT(@"addDoorModelData error: mac or sn is empty");
//        return NO;
//    }
//    DoorModel *doorModel = [[DoorModel alloc] init];
//    DoorRunModel *doorRunModel = [[DoorRunModel alloc] init];
//    
//    doorRunModel.devSn = doorDict[@"dev_sn"];
//    doorRunModel.devMac = doorDict[@"dev_mac"];
//    doorRunModel.devId = [doorDict[@"dev_id"] intValue];
//    doorRunModel.showName = doorDict[@"show_name"];
//    [doorModel initDoor: doorRunModel];
//    [[DoorManager manager] addDoor:doorModel];
//    return YES;
//}

//// 新增设备到数据库公共处理方法
//+(BOOL) addDevModelData:(NSDictionary*) readerDict
//{
//    if (readerDict[@"dev_mac"] == nil || [readerDict[@"dev_mac"] isEqual: @""]  || readerDict[@"dev_sn"] == nil || [readerDict[@"dev_sn"] isEqual: @""] || readerDict[@"ekey"] == nil || [readerDict[@"ekey"] isEqual: @""])
//    {
//        ERROR_PRINT(@"addDoorModelData error: dev mac or sn or commKey is empty");
//        return NO;
//    }
//    if (readerDict[@"reader_sn"] == nil || [readerDict[@"reader_sn"] isEqual: @""]  || readerDict[@"reader_mac"] == nil || [readerDict[@"reader_mac"] isEqual: @""])
//    {
//        ERROR_PRINT(@"addDoorModelData error: reader mac or sn is empty");
//        return NO;
//    }
//    
//    
//    
//    DoorDto *model = [[DoorDto alloc] init];
//    [model encodeFromDictionary:readerDict];
//    if (IsArrEmpty(model.dataArr)) {
//        //            [self.view addSubview:self.messageLbl];
//    } else {
//        for (DoorListDto *dto in model.dataArr) { //标记门禁，默认为门口机
//            dto.type = ACCESS_DEVICE;
//        }
//        [[DeviceManager manager].list addObjectsFromArray:model.dataArr];
//    }
//    
//    
//    
////    DevModel *devModel = [[DevModel alloc] init];
////    devModel.devSn = readerDict[@"dev_sn"];
////    devModel.devMac = readerDict[@"dev_mac"];
////    devModel.cardno = readerDict[@"cardno"];
////    devModel.devId = [readerDict[@"dev_id"] intValue];
////    devModel.readerSn = readerDict[@"reader_sn"];
////    devModel.readerMac = readerDict[@"reader_mac"];
////    devModel.privilege = [readerDict[@"privilege"] intValue];
////    devModel.startDate = readerDict[@"start_date"];
////    devModel.endDate = readerDict[@"end_date"];
////    devModel.useCount = [readerDict[@"use_count"] intValue];
////    devModel.validMode = [readerDict[@"valid_type"] intValue];
////    devModel.openMode = [readerDict[@"open_type"] intValue];
////    devModel.eKey = readerDict[@"ekey"];
////    devModel.devType = [readerDict[@"dev_type"] intValue];
////    devModel.validMode = [readerDict[@"verified"] intValue];
////    
////    NSString *network = readerDict[@"network"];
////    devModel.network = (network != nil & [network intValue] == 1) ? YES : NO;
////    
////    [devModel initDev:devModel];
////    [[DevManager manager] addDev:devModel]; // 添加操作结果 ？
//    return YES;
//}

+(NSMutableArray*) addMessage:(NSArray *)dataArray
{
    NSTimeZone *zone = [NSTimeZone systemTimeZone];
    NSDateFormatter *fm = [[NSDateFormatter alloc] init];
    [fm setLocale:[NSLocale currentLocale]];
    [fm setDateFormat:@"yyyyMMddHHmmss"];
    NSTimeInterval zoneTime;
    NSDate *msgDate = nil;
    
    NSMutableArray *msgItems = [NSMutableArray arrayWithCapacity:2]; // 定义可变数组
    MessageModel *msgModel = nil;
    for (NSDictionary *dataDict in dataArray)
    {
        NSNumber *commId = dataDict[@"comm_id"];
        if ([dataDict[@"show_msg"] intValue] == 1)
        {
            NSString *sendTime = [NSString stringWithFormat:@"%@", dataDict[@"send_time"]];
            msgDate = [fm dateFromString:sendTime];
            zoneTime = [zone secondsFromGMTForDate:msgDate];
            msgDate = [msgDate dateByAddingTimeInterval:zoneTime];
//
            msgModel = [[MessageModel alloc] init];
            msgModel.msgId = [NSString stringWithFormat:@"%@-%@", sendTime, commId];
            msgModel.sender = dataDict[@"sender"];
            msgModel.sendTime = [fm stringFromDate:msgDate];
            msgModel.content = dataDict[@"content"];
            msgModel.status = 0; // 未读消息
            if (dataDict[@"attach_content"] != nil)
            {
//                if (dataDict[@"attach_content"][@"card_section_key"] != nil)
                if (dataDict[@"attach_content"][@"new_cardno"] != nil)
                {
                    [UserManager manager].user.cardno = dataDict[@"attach_content"][@"new_cardno"];
                    [[UserManager manager] saveUser];
                }
                // 迷你仓需求：扫描设备请求开门
                if (dataDict[@"attach_content"][@"request_open"] != nil)
                {
                    // pass
                }
                // 删除用户
                if (dataDict[@"attach_content"][@"del_userinfo"] != nil)
                {
//                    [[DevManager manager] delDevWithDbnameCompany: dataDict[@"attach_content"][@"del_userinfo"]];
//                    [[DoorManager manager] delDoorWithDbnameComapny: dataDict[@"attach_content"][@"del_userinfo"]];
                    [UserManager manager].user.cardno = @"";
                    [[UserManager manager] saveUser];
                    [[DeviceManager manager].list removeAllObjects];
                    
                }
                if (dataDict[@"attach_content"][@"qrcode_img"] != nil)
                {
                    msgModel.imageBase64 = dataDict[@"attach_content"][@"qrcode_img"];
                }
                if (dataDict[@"attach_content"][@"update_dev"] != nil)
                {
                    NSString *devSn = dataDict[@"attach_content"][@"update_dev"][@"dev_sn"];
                    if (devSn != nil)
                    {
                        
                        DoorListDto *dto = [[DeviceManager manager] getDeviceWithSn:devSn];
                        
                        
                        
                        
//                        DoorModel *doorModel = [[DoorManager manager] getDoorWithDevSn:devSn];
                        if (dto != nil)
                        {
                            dto.show_name = dataDict[@"attach_content"][@"update_dev"][@"dev_name"];
                            dispatch_async(dispatch_get_main_queue(), ^{
                                [[NSNotificationCenter defaultCenter] postNotificationName:DevListMsgReceved object:nil];
                            });
                        }
                    }
                }
            }
            [[MessageManager manager] addMsg:msgModel]; // 添加操作结果 ？
        }
        else
        {
            if (dataDict[@"attach_content"] != nil)
            {
                if (dataDict[@"attach_content"][@"auto_upload_event"] != nil)
                {
                    UserModel *user = [[UserManager manager] user];
                    
                    if ([dataDict[@"attach_content"][@"auto_upload_event"] intValue] == 1)
                    {
                        user.autoUploadOpenLog = YES;
                    }
                    else
                    {
                        user.autoUploadOpenLog = NO;
                    }
                    [[UserManager manager] saveUser];
                }
            }
        }
        [msgItems addObject:commId]; // 先默认成功
    }
    return msgItems;
}

//// 保存开锁记录，并上传到服务器中
//+(void) saveOpenLockEvent:(NSString*)devSn andDevMac:(NSString*)devMac andDevName:(NSString *)devName andEventType:(int)eventType andOpRet:(int)operationRet
//{
//    UserModel *user = [[UserManager manager] user];
//    
//    DevOpenLogModel *logModel = [[DevOpenLogModel alloc] init];
//    logModel.devName = devName;
//    logModel.devMac = devMac;
//    logModel.devSn = devSn;
//    logModel.actionTime = 5;
//    logModel.operationUser = [[UserManager manager] user].username;
//    logModel.eventTime = [NSDate date];
//    logModel.logID = [[DevLogIDManager manager] getMaxLogID: logModel.devSn];
//    logModel.cardno = user.cardno;
//    logModel.operationRet = operationRet;
//    logModel.status = 0;
//    logModel.eventType = eventType; // 1 手机开门， 2 远程开门
//    
//    // 1. 插入到本地文件中
//    [[DevOpenLogManager manager] addOpenLog: logModel];
//    // 2. 上传到服务器
//    if ([[OptionManager manager] optionModel].autoUploadOpenLog == YES)
//    {
//        NSMutableArray *logModelArray = [[NSMutableArray alloc] init];
//        [logModelArray addObject:logModel];
//        [ProcessDBData uploadOpenLogToServer:logModelArray];
//    }
//}
//
// 上传记录到后台服务器
+(void)uploadOpenLogToServer:(NSMutableArray*)logModelArray
{
    NSMutableArray *openLogArray = [[NSMutableArray alloc] init];
    // 日期时间格式
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"YYYY-MM-dd hh:mm:ss"];
    NSDictionary *eventData = nil;
    for (DevOpenLogModel *logModel in logModelArray)
    {
        
        NSString *dateString = [dateFormatter stringFromDate:logModel.eventTime];
        eventData = @{
                      @"dev_name": logModel.devName == nil ? logModel.devSn : logModel.devName,
                      @"dev_mac": logModel.devMac,
                      @"dev_sn": logModel.devSn,
                      @"comm_id": [NSNumber numberWithInt: logModel.logID],
                      @"event_time": dateString,
                      @"action_time": [NSNumber numberWithInt: logModel.actionTime],
                      @"op_time": [NSNumber numberWithInt: logModel.operationTime],
                      @"op_ret": [NSNumber numberWithInt: logModel.operationRet],
                      @"event_type": [NSNumber numberWithInt: logModel.eventType],
                      @"op_user": logModel.operationUser,
                      @"cardno": logModel.cardno
                      };
        [openLogArray addObject:eventData];
    }
    UploadOpenDoorService *upload = [[UploadOpenDoorService alloc] init];
    [upload postOpenDoorRecordRequest:openLogArray];
//    [RequestTool uploadOpenLogWithLockName:openLogArray success:^(NSDictionary *result)
//     {
//         int ret = [result[@"ret"] intValue];
//         if (ret == SUCCESS)
//         {
//             [[DevOpenLogManager manager] updateOpenLogStatus:logModelArray];
//         }
//     }
//     failure:^(NSError *error) {
//         //[MBProgressHUD showError:error.localizedDescription];
//     }];
}

// 定时器检查未上传记录上传
+(void)autoUploadOpenLogTimer
{
    NSMutableArray *logModelArray =[[DevOpenLogManager manager] getUnuploadLog:20];
    if (logModelArray.count > 0)
    {
        [ProcessDBData uploadOpenLogToServer:logModelArray];
    }
}

@end
