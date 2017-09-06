//
//  DevSystemInfoModel.m
//  DoorMaster
//
//  Created by 宏根 张 on 8/5/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import "DevSystemInfoModel.h"
#import "MJExtension.h"

@implementation DevSystemInfoModel

-(void)initDevSystemInfo:(DevSystemInfoModel *)devSystemInfo
{
    self.openTime = devSystemInfo.openTime;
    self.cardCount = devSystemInfo.cardCount;
    self.userCount = devSystemInfo.userCount;
    self.maxCardCount = devSystemInfo.maxCardCount;
    self.lockSwitch = devSystemInfo.lockSwitch;
    self.wgfmt = devSystemInfo.wgfmt;
    self.version = devSystemInfo.version;
}

MJCodingImplementation
@end
