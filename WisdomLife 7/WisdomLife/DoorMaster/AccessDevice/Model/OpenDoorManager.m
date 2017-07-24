//
//  OpenDoorManager.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/15.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "OpenDoorManager.h"
#import "HomeService.h"
#import "DoorDto.h"
#import <DoorMasterSDK/DoorMasterSDK.h>

@implementation OpenDoorManager

+ (OpenDoorManager *)shareInstance
{
    static OpenDoorManager *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[OpenDoorManager alloc] init];
    });
    return _instance;
}
- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}



@end
