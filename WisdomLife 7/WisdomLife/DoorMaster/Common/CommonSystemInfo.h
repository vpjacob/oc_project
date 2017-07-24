//
//  CommonSystemInfo.h
//  Storm
//
//  Created by 朱攀峰 on 15/11/25.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CommonSystemInfo : NSObject

//系统版本
+ (NSString *)osVersion;

//唯一标示
+ (NSString *)uuid;

//屏幕分辨率
+ (NSString *)screenScale;

//硬件版本
+ (NSString *)platfrom;

//硬件版本名称
+ (NSString *)platfromString;

//系统当前时间 格式：yyyy-MM-dd HH:mm:ss
+ (NSString *)systemTimeInfo;

//软件版本
+ (NSString *)appVersion;

//是否是iPhone5
+ (BOOL)is_iPhone_5;

//是否越狱
+ (BOOL)isJailBorken;

//越狱版本
+ (NSString *)jailBreaker;

//系统版本是否小于5.0
+ (BOOL)isIosVersionBelow5;

+ (BOOL)isIosVersionBelow7;

+ (NSString *)iosVersion;

+ (BOOL)checkDevice:(NSString *)devcie;

//获取mac地址
+ (NSString *)getMacAddress;

@end
