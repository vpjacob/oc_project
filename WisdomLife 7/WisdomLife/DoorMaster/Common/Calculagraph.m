//
//  Calculagraph.m
//  Storm
//
//  Created by 朱攀峰 on 15/12/7.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "Calculagraph.h"

@interface Calculagraph()
{
#if TARGET_OS_IPHONE && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_4_0
    UIBackgroundTaskIdentifier backGroundTask;
    
#endif
}
@property (nonatomic,strong)NSTimer *timer;
@end

@implementation Calculagraph

@synthesize time = time_;

@synthesize timer = timer_;

@synthesize timeOut = timeOut_;

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.time = 0.0;
    }
    return self;
}
- (void)dealloc
{
    [self stop];
}
#if TARGET_OS_IPHONE
+ (BOOL)isMultitaskingSupport
{
    BOOL multitaskingSupport = NO;
    if ([[UIDevice currentDevice] respondsToSelector:@selector(isMultitaskingSupport)]) {
        multitaskingSupport = [(id)[UIDevice currentDevice] isMultitaskingSupported];
    }
    return multitaskingSupport;
}
#endif
- (void)start
{
    [self stop];
    self.time = 0.0;
#if TARGET_OS_IPHONE && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_4_0
    if ([Calculagraph isMultitaskingSupport]) {
        if (!backGroundTask || backGroundTask == UIBackgroundTaskInvalid) {
            backGroundTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
                dispatch_async(dispatch_get_main_queue(), ^{
                    if (backGroundTask != UIBackgroundTaskInvalid) {
                        [[UIApplication sharedApplication]endBackgroundTask:backGroundTask];
                        backGroundTask = UIBackgroundTaskInvalid;
                    }
                });
            }];
        }
    }
    
#endif
    
    NSTimer *timer;
    
    NSDate *date = [NSDate date];
    timer = [[NSTimer alloc] initWithFireDate:date interval:1.0 target:self selector:@selector(refreshTime) userInfo:nil repeats:YES];
    [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
    self.timer = timer;
    
    _validate = YES;
}
- (void)refreshTime
{
    self.time += 1.0;
    if (timeOut_ > 0 && self.time >= timeOut_) {
        [self stop];
    }
}
- (void)stop
{
    if (self.timer && [self.timer isValid]) {
        [self.timer invalidate];
        self.timer = nil;
        _validate = NO;
        
#if TARGET_OS_IPHONE && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_4_0
        if ([Calculagraph isMultitaskingSupport]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (backGroundTask != UIBackgroundTaskInvalid) {
                    [[UIApplication sharedApplication] endBackgroundTask:backGroundTask];
                    backGroundTask = UIBackgroundTaskInvalid;
                }
            });
        }
        
#endif
    }

}
- (CGFloat)seconds
{
    return self.time;
}
- (BOOL)isValidate
{
    return _validate;
}
@end
