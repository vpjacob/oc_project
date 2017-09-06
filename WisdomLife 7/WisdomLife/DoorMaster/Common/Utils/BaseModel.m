//
//  BaseModel.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/8/29.
//  Copyright (c) 2015年 zhiguo. All rights reserved.
//

#import "BaseModel.h"

@implementation BaseModel


- (void)setValue:(id)value forUndefinedKey:(NSString *)key
{
}
- (void)setValue:(id)value forKey:(NSString *)key
{
    if ([key isEqualToString:@"id"]) {
        key = @"ID";
    }
    
    [super setValue:value forKey:key];
}

@end
