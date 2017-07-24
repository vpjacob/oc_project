//
//  LoginService.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/2.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "LoginService.h"

@implementation LoginService

- (void)getLoginRequestInfo:(NSString *)user
                   password:(NSString *)password
{
    
}

/**
 登陆
 */
+ (void)loginWithUsername:(NSString *)username password:(NSString *)password
                  success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
    [param setValue:username forKey:@"username"];
    [param setValue:password forKey:@"password"];

    [[CommonHttpClient afManager] POST:kString(kApphttp,kLoginUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

/**
 *  申请访客临时密码
 */
+ (void)applyVisitorPwd:(NSString*)devSn receiver:(NSString *)receiver andPwdType:(int)pwdType endDate:(NSString*)endDate remark:(NSString*)remark success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSString *language = @"zh-CN";
    NSDictionary *param = @{@"client_id" : [Config currentConfig].client_id,
                            @"resource" : @"password",
                            @"operation" : @"POST",
                            @"data" : @{
                                    @"verifynum": @"",
                                    @"dev_sn": devSn,
                                    @"receiver": receiver,
                                    @"pwd_type": [NSString stringWithFormat:@"%d", pwdType],
                                    @"end_date": endDate,
                                    @"remark": remark,
                                    @"language": language
                                    }
                            };
    
    [[CommonHttpClient afManager] POST:kString(kApphttp,kOpenCode) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

/**
 验证码
 */
+ (void)codeRequestWithUsername:(NSString *)phone type:(NSString *)type
                        success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
    [param setValue:phone forKey:@"phone"];
    [param setValue:type forKey:@"type"];
    
    [[CommonHttpClient afManager] GET:kString(kApphttp,kCodeUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

/**
 检测账号是否已注册
 */
+ (void)isRegisterWithUsername:(NSString *)phone
                       success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
    [param setValue:phone forKey:@"account"];
    
    [[CommonHttpClient afManager] GET:kString(kApphttp,kRegisterUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

/**
 注册手机账号
 */
+ (void)registerWithUsername:(NSString *)username password:(NSString *)password
                    nickname:(NSString *)nickname verifynum:(NSString *)verifynum
                     success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
    [param setValue:@"phone" forKey:@"method"];
    [param setValue:nickname forKey:@"nickname"];
    [param setValue:username forKey:@"phone"];
    [param setValue:password forKey:@"password"];
    [param setValue:verifynum forKey:@"verifynum"];
    
    [[CommonHttpClient afManager] POST:kString(kApphttp,kRegisterUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSString *ret = [responseObject objectForKey:@"ret"];
        if ([ret intValue] == 0) {
            success(responseObject);
        } else {
            failure(nil);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

/**
 注册邮箱账号
 */
+ (void) emailRegister:(NSString *)email andNickname:(NSString *)nickname andPwd:(NSString *)password success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSString *accessToken = [GlobalTool getAccessToken];
    NSString *language = [GlobalTool getI18nLanguage];
    NSDictionary *param = @{@"access_token" : accessToken,
                            @"nickname" : nickname,
                            @"email" : email,
                            @"password" : password,
                            @"language" : language
                            };
//    [[CommonHttpClient afManager] POST:[self urlStrWithTail:@"doormaster/app/users?method=email"] parameters:param success:^(AFHTTPRequestOperation *operation, id responseObject) {
//        success(responseObject);
//    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
//        failure(error);
//    }];
    
    [[CommonHttpClient afManager] POST:kString(kApphttp,kRegisterEmailUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
    
}

/**
 忘记密码
 */
+ (void)forgetWithUsername:(NSString *)username new_pwd:(NSString *)new_pwd
                 verifynum:(NSString *)verifynum success:(SucessBlock) success
                   failure:(FailureBlock) failure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
//    [param setValue:@"forgot" forKey:@"method"];
    [param setValue:[GlobalTool getAccessToken] forKey:@"access_token"];
    [param setValue:username forKey:@"phone"];
    [param setValue:new_pwd forKey:@"new_pwd"];
    [param setValue:verifynum forKey:@"verifynum"];
    
//    [[CommonHttpClient afManager] POST:kString(kApphttp,kForgetPswUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
//        NSString *ret = [responseObject objectForKey:@"ret"];
//        if ([ret intValue] == 0) {
//            success(responseObject);
//        } else {
//            failure(nil);
//        }
//    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
//        failure(error);
//    }];
    
    //忘记密码--Benson
    [[CommonHttpClient afManager] PUT:kString(kApphttp,kForgetPswUrl) parameters:param success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSString *ret = [responseObject objectForKey:@"ret"];
        if ([ret intValue] == 0) {
            success(responseObject);
        } else {
            failure(nil);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}


/**
 *  邮箱账号忘记密码
 */
+ (void)emailForgotPwd:(NSString *)email success:(SucessBlock) success failure:(FailureBlock) failure
{
    NSString *accessToken = [GlobalTool getAccessToken];
    NSString *language = [GlobalTool getI18nLanguage];
    NSDictionary *param = @{@"access_token": accessToken,
                            @"email" : email,
                            @"language" : language
                            };
    
    [[CommonHttpClient afManager] PUT:kString(kApphttp,kForgetPswUrl) parameters:param success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

- (void)getLoginRequestInfoItem:(BOOL)isSuccess
                       errorMsg:(NSString *)errorMsg
{
    if (_delegate && [_delegate respondsToSelector:@selector(getLoginRequestInfoItem:errorMsg:)]) {
        [_delegate getLoginRequestInfoItem:isSuccess errorMsg:errorMsg];
    }
}

@end
