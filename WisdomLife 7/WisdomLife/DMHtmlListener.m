//
//  DMHtmlListener.m
//  WisdomLife
//
//  Created by 宏根 张 on 09/05/2017.
//  Copyright © 2017 wisdomlife. All rights reserved.
//

#import "DMHtmlListener.h"
#import "APIManager.h"
#import "APIWidgetContainer.h"
#import "APIEvent.h"
#import "APIWebView.h"
#import "APIScriptMessage.h"
#import "APIModuleMethod.h"
#import <DMVPhoneSDK/DMVPhoneSDK.h>
#import <DoorMasterSDK/DoorMasterSDK.h>
#import "DMLoginAction.h"
#import "OpenDoorListViewController.h"
#import "DoorListViewController.h"
#import "OpenRecordViewController.h"
#import "VisitorViewController.h"
#import "NewSetViewController.h"
#import "OpenDoorService.h"
#import "SharkMotionManager.h"
#import "DeviceManager.h"
#import "JJScanViewController.h"
#import "KNBVideoPlayerController.h"


static DMHtmlListener *instance = nil;

@interface DMHtmlListener ()<APIWebViewDelegate, APIModuleMethodDelegate, APIScriptMessageDelegate>

@property (nonatomic, strong) APIWidgetContainer *windowContainer;
@property(nonatomic,strong)KNBVideoPlayerController *playVC;
@end


@implementation DMHtmlListener

+(instancetype)allocWithZone:(struct _NSZone *)zone
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:zone];
        [instance addObserver];
        [instance initSetting]; //初始化设置
    });
    return instance;
}

+(instancetype)manager
{
    return [[self alloc] init];
}

-(APIWidgetContainer *)getAPIWidgetContainer
{
    return self.windowContainer;
}

-(void)addObserver
{
    [[APIEventCenter defaultCenter] addEventListener:self selector:@selector(handleCallEvent:) name:@"call"];
}

-(void)initSetting
{
    //初始化蓝牙
    [LibDevModel initBluetooth];
    [OpenDoorService manager]; //初始化服务
    [[SharkMotionManager manager] initMotionManager]; //初始化摇一摇监听
    [[SharkMotionManager manager] startShakeMonitor]; //根据保存数据判断是否继续执行摇一摇
    [OpenDoorService startNearOpen]; //开始判断是否要进行靠近开门
    
    //Register Receiver
    [DMCommModel registerReceiverCallWithCallingViewType:DEFAULTCALLINGVIEWTYPE];
    
    [[APIManager sharedManager] setWebViewDelegate:self];
    [[APIManager sharedManager] setModuleMethodDelegate:self];
    [[APIManager sharedManager] setScriptMessageDelegate:self];
     
    [self addObserver];
    
    // 这里的widget://表示widget的根目录路径
    NSString *url = @"widget://index.html";
    APIWidgetContainer *widgetContainer = [APIWidgetContainer widgetContainerWithUrl:url];
    [widgetContainer startLoad];
    self.windowContainer = widgetContainer;
}

#pragma mark - 监听html页面发送的事件
- (void)handleCallEvent:(APIEvent *)event {
    //接收到html页面发出的call消息，执行呼叫
    NSString *account = event.userInfo[@"account"];
    NSNumber *accountType = @([event.userInfo[@"accountType"] intValue]);
    [DMCommModel callByAutomaticalWithController:self.windowContainer andCallAccount:account callAccountType:accountType callback:^(int ret, NSString *msg) {
        
    }];
}

#pragma mark - APIWebViewDelegate
- (BOOL)webView:(APIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    NSString *url = request.URL.absoluteString;
    if ([url hasPrefix:@"http://www.taobao.com"]) {
        return NO;
    } else if ([url hasPrefix:@"http://www.baidu.com"]) {
        return YES;
    }
    return YES;
}

#pragma mark - APIScriptMessageDelegate
- (void)webView:(APIWebView *)webView didReceiveScriptMessage:(APIScriptMessage *)scriptMessage {
    
    if ([scriptMessage.name isEqualToString:@"loginAccount"]) {//登入系统，account&pwd
        NSString *account = scriptMessage.userInfo[@"account"];
        NSString *password = scriptMessage.userInfo[@"pwd"];
        [DMLoginAction loginWithUsername:account andPwd:password withWebView:webView andScriptMessage:scriptMessage];
    }
    
    if ([scriptMessage.name isEqualToString:@"DeviceList"]) {//门禁钥匙
        OpenDoorListViewController *nextCtr = [[OpenDoorListViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }
    
    if ([scriptMessage.name isEqualToString:@"DoorVideoList"]) {//门口视频
        
        DoorListViewController *nextCtr = [[DoorListViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }
    
    if ([scriptMessage.name isEqualToString:@"OpenRecord"]) {//开门记录
        OpenRecordViewController *nextCtr = [[OpenRecordViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }
    
    if ([scriptMessage.name isEqualToString:@"VisitorPass"]) {//授权访客
        VisitorViewController *nextCtr = [[VisitorViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }
    
    if ([scriptMessage.name isEqualToString:@"Onceopen"]) {//一键开门
    [[NSNotificationCenter defaultCenter] postNotificationName:ScanOpenDoorReceved object:@"onceOpen"];
    }
    
    if ([scriptMessage.name isEqualToString:@"Setting"]) {//设置
        NewSetViewController *sVC = [[NewSetViewController alloc] init];
        [self.windowContainer pushViewController:sVC animated:YES];
    }
    
    if ([scriptMessage.name isEqualToString:@"logout"]) {//登出
        [DMLoginAction logout];
    }
    if ([scriptMessage.name isEqualToString:@"palyCarViedo"]) {
        
        NSURL *url = [NSURL fileURLWithPath:scriptMessage.userInfo[@"path"]];
        _playVC = [[KNBVideoPlayerController alloc] initWithFrame:CGRectMake(0, 20, kDeviceWidth, kDeviceHeight - 20) title:scriptMessage.userInfo[@"name"] url:url];
        [_playVC setFullScreen:YES];
        [_playVC startPlay];
        [self.windowContainer pushViewController:_playVC animated:YES];
    }
    
    if ([scriptMessage.name isEqualToString:@"NativeScan"]) {//
        JJScanViewController *scanVC = [[JJScanViewController alloc] init];
        
        scanVC.QRCodeMessage = ^(NSString *qrcodeMessage) {

            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"result":qrcodeMessage} err:nil delete:YES];
        };
        
        [self.windowContainer pushViewController:scanVC animated:YES];
    }
    if ([scriptMessage.name isEqualToString:@"ShowKey"]) {
        NSArray *deviceList = [DeviceManager manager].list;
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        dict[@"ret"] = @(0);
        if (deviceList != nil && deviceList.count > 0) {
            dict[@"msg"] = @"true";
        }else
        {
            dict[@"msg"] = @"false";
        }
        [webView sendResultWithCallback:scriptMessage.callback ret:dict err:nil delete:YES];
    }
    /*
     
     智果暂时不用
     
    if ([scriptMessage.name isEqualToString:@"loginDMVPhoneSDK"]) {//登入
        //初始化DMVPhoneSDK
        [DMCommModel initDMVPhoneSDK];
        NSString *account = scriptMessage.userInfo[@"account"];
        NSString *password = scriptMessage.userInfo[@"password"];
        NSNumber *accountType = @([scriptMessage.userInfo[@"accountType"] intValue]);
        [DMCommModel loginServer:account passwd:password accountType:accountType loginCallback:^(int ret, NSString *msg) {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":msg} err:nil delete:YES];
        }];
    }
    
    
    if ([scriptMessage.name isEqualToString:@"call"]) {//呼叫
        NSString *account = scriptMessage.userInfo[@"account"];
        NSNumber *accountType = @([scriptMessage.userInfo[@"accountType"] intValue]);
        [DMCommModel callByAutomaticalWithController:self.windowContainer andCallAccount:account callAccountType:accountType callback:^(int ret, NSString *msg) {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":msg} err:nil delete:YES];
        }];
    }
    
    //退出DMVPhoneSDK
    if ([scriptMessage.name isEqualToString:@"exitDMVPhoneSDK"]) {
        int ret = [DMCommModel exitDMVPhoneSDK];
        if (ret == 0) {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":@"Exit success"} err:nil delete:YES];
        }else
        {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":@"Exit fail"} err:nil delete:YES];
        }
    }
    
    //开门
    if ([scriptMessage.name isEqualToString:@"openDoor"]) {
        LibDevModel *device = [self getDevModelByDict:scriptMessage.userInfo];
        int ret = [LibDevModel controlDevice:device andOperation:0];
        if (ret != 0) {
            NSDictionary *retDict = @{@"ret":@(ret), @"msg":@"open door fail"};
            [webView sendResultWithCallback:scriptMessage.callback ret:retDict err:nil delete:YES];
            return;
        }
        [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":msgDict[@"msg"]} err:nil delete:YES];
        }];
    }
    
    
    //扫描
    if ([scriptMessage.name isEqualToString:@"scanDevice"]) {
        int scanTime = [scriptMessage.userInfo[@"scanTime"] intValue];
        int ret = [LibDevModel scanDevice:scanTime];
        if (ret == 0)
        {
            [LibDevModel onScanOver:^(NSMutableDictionary *scanDevDict) {
                [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":@"Scan success", @"devRssiDict":scanDevDict} err:nil delete:YES];
            }];
        }else
        {
            [webView sendResultWithCallback:scriptMessage.callback ret:@{@"ret":@(ret), @"msg":@"Scan fail"} err:nil delete:YES];
        }
    }
    */
    
//    
//    if ([scriptMessage.name isEqual:@"abc"]) {
//        NSString *msg = [NSString stringWithFormat:@"收到来自Html5的操作请求，访问的名称标识为%@，传入的参数为:%@", scriptMessage.name, scriptMessage.userInfo];
//                UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"" message:msg delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
//                [alert show];
//        
//        [webView sendResultWithCallback:scriptMessage.callback ret:@{@"result":@"value"} err:nil delete:YES];
//    } else if ([scriptMessage.name isEqual:@"requestEvent"]) {
//        [[APIEventCenter defaultCenter] sendEventWithName:@"fromNative" userInfo:@{@"value":@"哈哈哈，我是来自Native的事件"}];
//    }
}

#pragma mark - APIModuleMethodDelegate
- (BOOL)shouldInvokeModuleMethod:(APIModuleMethod *)moduleMethod {
    if ([moduleMethod.module isEqualToString:@"api"] && [moduleMethod.method isEqualToString:@"sms"]) {
        return NO;
    }
    return YES;
}

- (void)nativeSendActionToH5:(NSString*)action{
    [[APIEventCenter defaultCenter] sendEventWithName:action userInfo:nil];
}

/*
 *模型转换
 */
-(LibDevModel *)getDevModelByDict:(NSDictionary *)devDict
{
    LibDevModel * device = [[LibDevModel alloc] init];
    device.devSn = devDict[@"devSn"];
    device.devMac = devDict[@"devMac"];
    device.eKey = devDict[@"eKey"];
    device.devType = [devDict[@"devType"] intValue];
    device.endDate = devDict[@"endDate"];
    device.startDate = devDict[@"startDate"];
    device.cardno = devDict[@"cardno"];
    return device;
}


@end
