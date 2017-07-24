//
//  OpenDoorManager.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/15.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OpenDoorManager : NSObject

+ (OpenDoorManager *)shareInstance;

@property (nonatomic,strong)NSMutableArray *dataSource;

@end
