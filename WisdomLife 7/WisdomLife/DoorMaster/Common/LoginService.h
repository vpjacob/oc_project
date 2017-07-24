//
//  LoginService.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/2.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^SucessBlock)(NSDictionary *result);
typedef void(^FailureBlock)(NSError *error);

@protocol LoginServiceDelegate <NSObject>

- (void)getLoginRequestInfoItem:(BOOL)isSuccess
                       errorMsg:(NSString *)errorMsg;

@end

@interface LoginService : NSObject

@property (nonatomic,weak)id<LoginServiceDelegate>delegate;


/**
 登陆
 */
+ (void)loginWithUsername:(NSString *)username password:(NSString *)password
                  success:(SucessBlock) success failure:(FailureBlock) failure;

/**
 验证码
 */
+ (void)codeRequestWithUsername:(NSString *)phone type:(NSString *)type
                        success:(SucessBlock) success failure:(FailureBlock) failure;

/**
 检测账号是否已注册
 */
+ (void)isRegisterWithUsername:(NSString *)phone
                       success:(SucessBlock) success failure:(FailureBlock) failure;

/**
 注册手机账号
 */
+ (void)registerWithUsername:(NSString *)username password:(NSString *)password
                    nickname:(NSString *)nickname verifynum:(NSString *)verifynum
                     success:(SucessBlock) success failure:(FailureBlock) failure;

/**
 注册邮箱账号
 */
+ (void) emailRegister:(NSString *)email andNickname:(NSString *)nickname andPwd:(NSString *)password success:(SucessBlock) success failure:(FailureBlock) failure;

/**
 忘记密码 手机账号
 */
+ (void)forgetWithUsername:(NSString *)username new_pwd:(NSString *)new_pwd
                 verifynum:(NSString *)verifynum success:(SucessBlock) success
                   failure:(FailureBlock) failure;

/**
 忘记密码 邮箱账号
 */
+ (void)emailForgotPwd:(NSString *)email success:(SucessBlock) success failure:(FailureBlock) failure;

/**
 *  申请访客临时密码
 */
+ (void)applyVisitorPwd:(NSString*)devSn receiver:(NSString *)receiver andPwdType:(int)pwdType endDate:(NSString*)endDate remark:(NSString*)remark success:(SucessBlock) success failure:(FailureBlock) failure;

- (void)getLoginRequestInfo:(NSString *)user
                   password:(NSString *)password;

@end
