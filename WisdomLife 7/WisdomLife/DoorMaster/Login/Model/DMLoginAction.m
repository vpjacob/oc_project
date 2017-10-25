//
//  DMLoginAction.m
//  WisdomLife
//
//  Created by 宏根 张 on 07/06/2017.
//  Copyright © 2017 wisdomlife. All rights reserved.
//

#import "DMLoginAction.h"
#import "Config.h"
#import "HomeData.h"
#import <DMVPhoneSDK/DMVPhoneSDK.h>
#import "LoginService.h"
#import "APIWebView.h"
#import "APIScriptMessage.h"
#import "LoginDto.h"
#import "DeviceManager.h"
#import "UserManager.h"
#import "HomeService.h"
#import "DoorDto.h"
#import "GlobalTimer.h"
#import "SharkMotionManager.h"
#import "SessionData.h"

@implementation DMLoginAction

+(void)loginWithUsername:(NSString *)username andPwd:(NSString *)pwd withWebView:(APIWebView *)webView andScriptMessage:(APIScriptMessage *)scriptMessage
{
    [[HomeData shareInstance].doorArr removeAllObjects];
    [[HomeData shareInstance].roomArr removeAllObjects];
    [Config currentConfig].phone = username;
    [Config currentConfig].password = pwd;
    
    [DMCommModel initDMVPhoneSDK];//初始化DMVPhone
    
    //登录应用服务器，获取用户信息--Benson
    [LoginService loginWithUsername:username password:pwd success:^(NSDictionary *result) {
        NSNumber *code = [result objectForKey:@"ret"];
        if ([code integerValue] == 0) {//su
            
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(0), @"msg":@"Login success"} err:nil delete:YES];
            
            [self dealWithLoginDatas:result andUsername:username withWebView:webView andScriptMessage:scriptMessage]; //处理数据
            //            [[AppDelegate currentAppDelegate] loginSIPServer];
            
        }else if([code integerValue] == 1020)
        {//shibai
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(1020), @"msg":@"account_or_password_wrong"} err:nil delete:YES];
        }
        else {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@([code integerValue]), @"msg":result[@"msg"]} err:nil delete:YES];
        }
    } failure:^(NSError *error) {
        [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(-6000), @"msg":@"Login fail"} err:nil delete:YES];
    }];
}

+(void)loginDMVPhone:(NSString *)username andPwd:(NSString *)pwd withWebView:(APIWebView *)webView andScriptMessage:(APIScriptMessage *)scriptMessage
{
    //登录sip账号--Benson
    [DMCommModel loginServer:username passwd:pwd accountType:@(1) loginCallback:^(int ret, NSString *msg) {
        if (ret == 0) {
            
        }else
        {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(-6001), @"msg":@"Login video server fail"} err:nil delete:YES];
        }
    }];
}

+(void)dealWithLoginDatas:(NSDictionary *)result andUsername:(NSString *)username withWebView:(APIWebView *)webView andScriptMessage:(APIScriptMessage *)scriptMessage
{
    NSDictionary *dict = [result objectForKey:@"data"];
    
    LoginDto *dto = [[LoginDto alloc] init];
    [dto encodeFromDictionary:dict];
    [Config currentConfig].client_id = dto.client_id;
    //            [Config currentConfig].voipId = dto.voip_account;
    //            [Config currentConfig].voipPsw = dto.voip_pwd;
    [Config currentConfig].cardno = dto.cardno;
    [HomeData shareInstance].doorArr = dto.dev_list;
    [HomeData shareInstance].roomArr = dto.room_list;
    
    //将数据（门口机数据）存放于临时列表里，等获取全了再更新本地设备列表
    [[DeviceManager manager].tmpList removeAllObjects];
    [[DeviceManager manager].tmpList addObjectsFromArray:[HomeData shareInstance].doorArr];
    
    UserModel *user = [[UserManager manager] user];
    user.nickname = result[@"data"][@"nickname"];
    user.username = username;
    user.identity = result[@"data"][@"identity"];
    user.cardno = result[@"data"][@"cardno"];
    user.client_id = result[@"data"][@"client_id"];
    user.token_pwd = dto.token_pwd;
    
    // 1. 判断服务器参数开关
    if ([result[@"data"][@"auto_upload_event"] intValue] == 1)
    {
        user.autoUploadOpenLog = YES;
    }
    else
    {
        user.autoUploadOpenLog = NO;
    }
    [[UserManager manager] saveUser];
    
    //设置呼叫白名单
    [[Config currentConfig] setCallAccountDicWithArray:dto.dev_list];
    
    [self loginDMVPhone:username andPwd:dto.token_pwd withWebView:webView andScriptMessage:scriptMessage];
    
    //获取门禁设备列表
    [HomeService doorListWithSuccess:^(NSDictionary *result) {
        DoorDto *model = [[DoorDto alloc] init];
        [model encodeFromDictionary:result];
        if (IsArrEmpty(model.dataArr)) {
            [[DeviceManager manager] updateAllLocalDeviceList];
        } else {
            
            [[DeviceManager manager].tmpList addObjectsFromArray:model.dataArr];
            [[DeviceManager manager] updateAllLocalDeviceList];
        }
    } failure:^(NSError *error) {
    }];
    
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 100 * NSEC_PER_MSEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^{
        [GlobalTimer startNSTimer]; // 启动定时请求网咯任务
    });
}

+(void)logout
{
    [GlobalTimer stopNSTimer];
    [DMCommModel exitDMVPhoneSDK];
    [[SharkMotionManager manager] stopShakeMonitor];
    [LibDevModel stopBackgroundMode];
    [SessionData clearSessionData];
}

@end
