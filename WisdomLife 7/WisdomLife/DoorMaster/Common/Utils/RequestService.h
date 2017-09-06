//
//  RequestService.h
//  SmartDoor
//
//  Created by 宏根 张 on 18/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^RequestSuccessBlock)(NSArray *result);
typedef void(^RequestSuccessBlockDiction)(NSDictionary *result);
typedef void(^RequestFailureBlock)(NSString *error);

@interface RequestService : NSObject

+(void)getHomeScrollViewImagesWithsuccess:(RequestSuccessBlock) success failure:(RequestFailureBlock) failure; //获取首页轮播图片

+(void)getHomeBottomImagesWithsuccess:(RequestSuccessBlock) success failure:(RequestFailureBlock) failure; //获取首页底部图片

+(void)getAnnouncementWithsuccess:(RequestSuccessBlock) success failure:(RequestFailureBlock) failure; //获取公告

/**
 *  管理员删除用户电子钥匙
 */
+ (void)delDevEkeyUser:(NSString *)receiver devSn:(NSString *)devSn success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 * 远程操作
 */
+(void)remoteCtrlDevice:(int)operate dataParam:(NSDictionary*)dataDict success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  申请访客临时密码（注意：不设置开始时间时，开始时间传入空字符串）
 */
+ (void)applyVisitorPwd:(NSString*)devSn receiver:(NSString *)receiver andPwdType:(int)pwdType  startDate:(NSString *)startDate endDate:(NSString*)endDate remark:(NSString*)remark andUseCount:(int)useCount success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  后台卡管理操作：批量发卡、批量删卡，获取后同步到设备
 *  暂时定义每次获取1000条数据
 */
+ (void)getServerCardCmd:(NSString*)devSn cmdStatus:(NSString *)cmdStatus success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  获取管理员账户发送的电子钥匙
 */
+ (void)getDevEkeyUser:(NSString *)devSn success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  app发送电子钥匙
 */
+ (void)sendUserDevEkey:(NSMutableDictionary *)eKeyDict success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  修改密码
 */
+ (void)modifyAccountPwd:(NSString *)oldPwd andNewPwd:(NSString*)newPwd  success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  获取实时消息
 */
+ (void)getRtdatasWithUser:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 *  更新获取的实时消息操作结果
 */
+ (void)updateRTdatasWithResult:(NSString *)resource status:(NSMutableArray *)status  success:(RequestSuccessBlockDiction) success failure:(RequestFailureBlock) failure;

/**
 * 获取实时消息数据定时器
 */
+(void)getRealTimeMsg;
@end
