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


@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
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

    return YES;
}

- (void)advertisementInit{
//        [SplashView updateSplashData:@"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=996278178,3084539720&fm=26&gp=0.jpg" actUrl:@"http://www.baidu.com"];
    UIImage *image = [UIImage imageNamed:@"guanggao"];
    [SplashView showSplashView:5 defaultImage:image tapSplashImageBlock:^(NSString * urlStr) {
        
    } splashViewDismissBlock:^(BOOL complete) {
        
//10        [SKStoreReviewController requestReview];
//10以下        NSString  * nsStringToOpen = [NSString  stringWithFormat: @"itms-apps://itunes.apple.com/app/id%@?action=write-review",@"1182914885"];//替换为对应的APPID
//        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:nsStringToOpen]];
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
            OpenDoorListViewController *nextCtr = [[OpenDoorListViewController alloc] init];
            [(UINavigationController *)self.window.rootViewController pushViewController:nextCtr animated:YES];
        }else if ([urlHost isEqualToString:@"red202"]){
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[DMHtmlListener manager] nativeSendActionToH5:@"shopping"];
            });
        }else if ([urlHost isEqualToString:@"red203"]){
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[DMHtmlListener manager] nativeSendActionToH5:@"eggs"];
            });
        }
    }
    return  YES;
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
