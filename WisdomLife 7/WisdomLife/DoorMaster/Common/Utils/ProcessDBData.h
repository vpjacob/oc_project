//
//  ProcessDBData.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/30.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ProcessDBData : NSObject

//// 新增门到数据库公共处理方法
//+(BOOL) addDoorModelData:(NSDictionary*) dataDict;

// 新增设备到数据库公共处理方法
//+(BOOL) addDevModelData:(NSDictionary*) dataDict;

+(NSMutableArray*) addMessage:(NSArray*) dataDict;

//// 保存开锁记录，并上传到服务器中
//+(void) saveOpenLockEvent:(NSString*)devSn andDevMac:(NSString*)devMac andDevName:(NSString *)devName andEventType:(int)eventType andOpRet:(int)operationRet;
//
// 定时器检查未上传记录上传
+(void)autoUploadOpenLogTimer;

@end
