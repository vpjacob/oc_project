//
//  AppDelegate.m
//  WisdomLife
//
//  Created by 宏根 张 on 06/05/2017.
//  Copyright © 2017 wisdomlife. All rights reserved.
//

#import "AppDelegate.h"
#import "APIManager.h"
#import "DMHtmlListener.h"
#import "DMLoginAction.h"
#import "WisdomLife-Swift.h"
#import "OpenDoorListViewController.h"
#import "DoorListViewController.h"
#import <StoreKit/StoreKit.h>
#import "WXApi.h"
#import "MBProgressHUD.h"


//static NSString *postUrl = @"http://192.168.1.199:9020/xk/appStartImg.do";
//static NSString *imgUrlFront = @"http://192.168.1.199:8080";

static NSString *postUrl = @"http://xk.ppke.cn:9030/xk/appStartImg.do";
static NSString *imgUrlFront = @"http://www.ppke.cn";
//ca-app-pub-9554187975714748~4522907099
@interface AppDelegate ()<WXApiDelegate>
@property (nonatomic, strong)NSString *iosMsg;
@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    if ([Config currentConfig].phone != nil && [Config currentConfig].password != nil) {
        [DMLoginAction loginWithUsername:[Config currentConfig].phone andPwd:[Config currentConfig].password withWebView:nil andScriptMessage:nil];
    }
    
    [[APIManager sharedManager] initSDKWithLaunchOptions:launchOptions];
    
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    self.window.backgroundColor = [UIColor blackColor];
    self.window.rootViewController = (UIViewController *)[[DMHtmlListener manager] getAPIWidgetContainer];
    [self.window makeKeyAndVisible];
    
    [self thridDTouchInit];
    [self advertisementInit];
    [WXApi registerApp:@"wx467a7db3832c23fd"];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(SaveWXPayMsg:) name:@"WXPayMsg" object:nil];
    
    return YES;
}
- (void)SaveWXPayMsg:(NSNotification *)noti{
    self.iosMsg = noti.userInfo[@"iosMsg"];

}
- (void)advertisementInit{

    UIImage *image = [UIImage imageNamed:@"guanggao"];
    [SplashView showSplashView:5 defaultImage:image tapSplashImageBlock:^(NSString * urlStr) {
        NSArray* array = [urlStr componentsSeparatedByString:@"+"];
        NSString *skipNo = array[0];
        NSString *skipUrl = array[1];
        
        if (skipUrl != nil && skipNo != nil) {
                [[DMHtmlListener manager] nativeSendActionToH5:@"startAdvertisement" userInfo:@{@"skipNo":skipNo,@"skipUrl":skipUrl}];
        }
        
    } splashViewDismissBlock:^(BOOL complete) {
        
    }];
    
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.completionQueue = dispatch_get_global_queue(0, 0);
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    [manager POST:postUrl parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableContainers error:nil];
        NSLog(@"%@",dic);
        NSLog(@"-------------成功");
        NSArray *array = dic[@"data"];
        NSString *imgUrl = [imgUrlFront stringByAppendingString:array[0][@"imgUrl"]];
        NSString *skipUrl = array[0][@"skipUrl"];
        NSString *skipNo = array[0][@"skipNo"];
        NSString *skipNO_skipUrl = [NSString stringWithFormat:@"%@+%@",skipNo,skipUrl];
        [SplashView updateSplashData:imgUrl actUrl:skipNO_skipUrl];
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"-------------失败");
    }];

}


- (void)thridDTouchInit{
    //    3d touch
    if (IOS9) {
        UIApplicationShortcutIcon *onceOpen = [UIApplicationShortcutIcon iconWithTemplateImageName:@"3d_opendoor"];
        UIApplicationShortcutItem *item = [[UIApplicationShortcutItem alloc] initWithType:@"onceOpen" localizedTitle:@"一键开门" localizedSubtitle:nil icon:onceOpen userInfo:nil];
        [[UIApplication sharedApplication] setShortcutItems:@[item]];
    }
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    if ([[url absoluteString] hasPrefix:@"WisdomLifeToday"])
    {
        NSString *urlHost = [url host];
        if ([urlHost isEqualToString:@"red200"]) {
            DoorListViewController *nextCtr = [[DoorListViewController alloc] init];
            [(UINavigationController *)self.window.rootViewController pushViewController:nextCtr animated:YES];
        }else if ([urlHost isEqualToString:@"red201"]){
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[DMHtmlListener manager] nativeSendActionToH5:@"carRecoder" userInfo:nil];
            });
        }else if ([urlHost isEqualToString:@"red202"]){
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[DMHtmlListener manager] nativeSendActionToH5:@"shopping" userInfo:nil];
            });
        }else if ([urlHost isEqualToString:@"red203"]){
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[DMHtmlListener manager] nativeSendActionToH5:@"eggs" userInfo:nil];
            });
        }
        return  YES;
    }
    return [WXApi handleOpenURL:url delegate:self];
}

-(void) onReq:(BaseReq*)req{
    
}


-(void) onResp:(BaseResp*)resp{
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:self.window animated:YES];
    hud.mode = MBProgressHUDModeText;
    
    NSDictionary *dic = @{
                          @"msg":self.iosMsg
                          };
    
   
    
    if ([resp isKindOfClass:[PayResp class]]) {
        hud.margin = 15.f;
        hud.yOffset = 00.f;
        hud.removeFromSuperViewOnHide = YES;
        [hud hide:YES afterDelay:4];
        DLog(@"%@",self.iosMsg);
        switch (resp.errCode) {
            case WXSuccess:
                hud.labelText = @"支付成功";
                [[DMHtmlListener manager] nativeSendActionToH5:@"requestPushAction" userInfo:dic];
                break;
            case WXErrCodeCommon:
                hud.labelText = @"支付普通错误";
                break;
            case WXErrCodeUserCancel:
                hud.labelText = @"支付点击了取消";
                break;
            case WXErrCodeSentFail:
                hud.labelText = @"支付发送失败";
                break;
            case WXErrCodeAuthDeny:
                hud.labelText = @"支付授权失败";
                break;
            case WXErrCodeUnsupport:
                hud.labelText = @"支付微信不支持";
                break;
            default:
                break;
        }
    }else{
    
    hud.margin = 15.f;
    hud.yOffset = 00.f;
    hud.removeFromSuperViewOnHide = YES;
    [hud hide:YES afterDelay:4];
    
    switch (resp.errCode) {
        case WXSuccess:
        hud.labelText = @"成功";
        break;
        case WXErrCodeCommon:
        hud.labelText = @"普通错误";
        break;
        case WXErrCodeUserCancel:
        hud.labelText = @"点击了取消";
        break;
        case WXErrCodeSentFail:
        hud.labelText = @"发送失败";
        break;
        case WXErrCodeAuthDeny:
        hud.labelText = @"授权失败";
        break;
        case WXErrCodeUnsupport:
        hud.labelText = @"微信不支持";
        break;
        default:
        break;
    }
    }
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
}

//后台模式
- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    
    //    [DMCommModel applicationBackground];
    UIApplication *app = [UIApplication sharedApplication];
    __block UIBackgroundTaskIdentifier bgTask;
    bgTask = [app beginBackgroundTaskWithExpirationHandler:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            if (bgTask != UIBackgroundTaskInvalid) {
                bgTask = UIBackgroundTaskInvalid;
            }
        });
    }];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        if (bgTask != UIBackgroundTaskInvalid) {
            bgTask = UIBackgroundTaskInvalid;
        }
    });
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler {
    
    if ([shortcutItem.type isEqualToString:@"onceOpen"]) {//一键开门
        [[NSNotificationCenter defaultCenter] postNotificationName:ScanOpenDoorReceved object:@"onceOpen"];
    }
}

@end
