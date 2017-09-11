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
#import "JJVersionCodeController.h"
#import "JFCityViewControllers.h"

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
    [LibDevModel initBluetoothNotShowPower];
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
    }else if ([scriptMessage.name isEqualToString:@"update"]) {//登入系统，account&pwd
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"itms-apps://itunes.apple.com/cn/app/id1182914885?mt=8"]];
    }else if ([scriptMessage.name isEqualToString:@"DeviceList"]) {//门禁钥匙
        OpenDoorListViewController *nextCtr = [[OpenDoorListViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }else if([scriptMessage.name isEqualToString:@"DoorVideoList"]) {//门口视频
        DoorListViewController *nextCtr = [[DoorListViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }else if([scriptMessage.name isEqualToString:@"NativeSelectCity"]) {//选择城市
        JFCityViewControllers *vc = [JFCityViewControllers new];
        [self.windowContainer pushViewController:vc animated:YES];
        vc.cityBlock = ^(NSString *cityName) {
            NSDictionary *dict = @{@"title":cityName};
            [webView sendResultWithCallback:scriptMessage.callback ret:dict err:nil delete:YES];
        };
    }else if([scriptMessage.name isEqualToString:@"OpenRecord"]) {//开门记录
        OpenRecordViewController *nextCtr = [[OpenRecordViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }else if([scriptMessage.name isEqualToString:@"VisitorPass"]) {//授权访客
        VisitorViewController *nextCtr = [[VisitorViewController alloc] init];
        [self.windowContainer pushViewController:nextCtr animated:YES];
    }else if([scriptMessage.name isEqualToString:@"Onceopen"]) {//一键开门
        [[NSNotificationCenter defaultCenter] postNotificationName:ScanOpenDoorReceved object:@"onceOpen"];
    }else if([scriptMessage.name isEqualToString:@"Setting"]) {//设置
        NewSetViewController *sVC = [[NewSetViewController alloc] init];
        [self.windowContainer pushViewController:sVC animated:YES];
    }else if([scriptMessage.name isEqualToString:@"logout"]) {//登出
        [DMLoginAction logout];
    }else if([scriptMessage.name isEqualToString:@"palyCarViedo"]) {//行车记录仪视频
        NSURL *url = [NSURL fileURLWithPath:scriptMessage.userInfo[@"path"]];
        _playVC = [[KNBVideoPlayerController alloc] initWithFrame:CGRectMake(0, 20, kDeviceWidth, kDeviceHeight - 20) title:scriptMessage.userInfo[@"name"] url:url];
        [_playVC setFullScreen:YES];
        [_playVC startPlay];
        [self.windowContainer pushViewController:_playVC animated:YES];
    }else if ([scriptMessage.name isEqualToString:@"ConnetToWiFi"]) {//连接WiFi
        NSURL *url;
        if ([[UIDevice currentDevice] systemVersion].floatValue < 10.0) {
            url = [NSURL URLWithString:@"prefs:root=WIFI"];
        }else{
            url = [NSURL URLWithString:@"app-Prefs:root=WIFI"];
        }
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url];
        }
    }else if ([scriptMessage.name isEqualToString:@"showVersionCode"]) {//版本信息
        JJVersionCodeController *VC = [JJVersionCodeController new];
        [self.windowContainer pushViewController:VC animated:YES];
    }else if([scriptMessage.name isEqualToString:@"ShowKey"]) {//
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
