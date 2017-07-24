//
//  OpenDoorService.h
//  SmartDoor
//
//  Created by 宏根 张 on 17/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OpenDoorService : NSObject

+ (instancetype)manager;


+(void)startNearOpen;

-(void)clearNearOpenDeviceInfo; //清除靠近开门的设备信息

@end
