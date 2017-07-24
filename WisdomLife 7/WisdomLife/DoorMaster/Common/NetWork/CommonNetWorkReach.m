//
//  CommonNetWorkReach.m
//  Storm
//
//  Created by 朱攀峰 on 15/12/5.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "CommonNetWorkReach.h"
#import "Reachability.h"

#define  kNetworkTestAddress     @"http://baidu.com"  //网络通畅测试地址

@implementation CommonNetWorkReach

@synthesize isNetReachAble = _isNetReachAble;
@synthesize isHostReach = _isHostReach;
@synthesize hostReach = _hostReach;
@synthesize reachAbleCount = _reachAbleCount;

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:kReachabilityChangedNotification object:nil];
}

- (void)initNetWork
{
    _isHostReach = NO;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reachabilityChanged:) name:kReachabilityChangedNotification object:nil];
    
    self.hostReach = [Reachability reachabilityWithHostName:kNetworkTestAddress];
    [self.hostReach startNotifier];
}

- (void)reachabilityChanged:(NSNotification *)note
{
    Reachability *curReach = [note object];
    NSParameterAssert([curReach isKindOfClass:[Reachability class]]);
    [self updaInterfaceWithReachability:curReach];
}
- (BOOL)isEnableWifi
{
    return [[Reachability reachabilityForLocalWiFi] currentReachabilityStatus] != NotReachable;
}
- (void)updaInterfaceWithReachability:(Reachability *)curReach
{
    if ([[Reachability reachabilityForLocalWiFi] currentReachabilityStatus] != NotReachable) {
        DLog(@"您目前处于WiFi环境");
        self.reachableOfSN = 1;
        return;
    }
    else if ([[Reachability reachabilityForInternetConnection] currentReachabilityStatus] != NotReachable)
    {
        DLog(@"您目前处于2G/3G/4G环境");
        self.reachableOfSN = 2;
        return;
    }
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(showNetworkAlertMessage) object:nil];
    if ([self.hostReach currentReachabilityStatus] == NotReachable) {
        self.reachableOfSN = 0;
        if ([UIApplication sharedApplication].applicationState == UIApplicationStateActive) {
            [self performSelector:@selector(showNetworkAlertMessage) withObject:nil afterDelay:2];
        }
    }
    else if ([self.hostReach currentReachabilityStatus] == ReachableViaWiFi)
    {
        self.reachableOfSN = 1;
    }
    else if ([self.hostReach currentReachabilityStatus] == ReachableViaWWAN)
    {
        self.reachableOfSN = 2;
    }
}
- (BOOL)isNetReachAble
{
    _isNetReachAble = self.isHostReach;
    return _isNetReachAble;
}
- (BOOL)isHostReach
{
    _isHostReach = [self.hostReach currentReachabilityStatus] != NotReachable;
    return _isHostReach;
}

- (void)showNetworkAlertMessage
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示"
                                                    message:@"没有联网"
                                                   delegate:nil
                                          cancelButtonTitle:@"确定"
                                          otherButtonTitles:nil, nil];
    [alert show];
    DLog(@"网络不可用，进行处理");
}
@end
