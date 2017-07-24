//
//  UserManager.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/8/29.
//  Copyright (c) 2015年 zhiguo. All rights reserved.
//


#import <Foundation/Foundation.h>
#import "UserModel.h"

@interface UserManager : NSObject

@property (nonatomic, strong) UserModel *user;

+ (instancetype)manager;

- (BOOL)clearUser;

- (BOOL)saveUser;

@end
