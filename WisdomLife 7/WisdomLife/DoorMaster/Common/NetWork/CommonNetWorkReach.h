//
//  CommonNetWorkReach.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/5.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>
@class Reachability;

@interface CommonNetWorkReach : NSObject


@property (nonatomic,readonly)BOOL isNetReachAble;
@property (nonatomic,readonly)BOOL isHostReach;
@property (nonatomic,readonly)NSInteger reachAbleCount;
@property (nonatomic,strong)Reachability *hostReach;
@property (nonatomic)NSInteger reachableOfSN;//0:没有连接，1：wifi.2：非wifi

- (void)initNetWork;
- (void)showNetworkAlertMessage;


@end
