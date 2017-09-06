//
//  BaseManager.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OptionModel.h"

@interface OptionManager : NSObject

@property (nonatomic, strong) OptionModel *optionModel;

+ (instancetype)manager;

- (BOOL)saveOption;


// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData;

@end
