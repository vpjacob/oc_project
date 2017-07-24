//
//  ContentUtils.h
//  DoorMaster
//
//  Created by 宏根 张 on 05/02/2017.
//  Copyright © 2017 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ContentUtils : NSObject

//获取单例
+(ContentUtils *)shareContentUtils;

//判断是否为Cube
-(BOOL)isCube;

//判断是否为Baocun
-(BOOL)isBaocun;

//判断是否为DoorMaster
-(BOOL)isTopKeeper;

//获取登录界面图标
-(NSString *)getLoginIconImage;

//获取app名称
-(NSString *)getAppName;

//获取access_token
-(NSString *)getAccessToken;

//获取极光推送的AppKey
-(NSString *)getJPushAppKey;

//获取微信的AppId
-(NSString *)getWeChatAppId;

//获取微信的secret
-(NSString *)getWeChatSecret;

//获取QQ的AppId
-(NSString *)getQQAppId;

//获取QQ的secret
-(NSString *)getQQSecret;

@end
