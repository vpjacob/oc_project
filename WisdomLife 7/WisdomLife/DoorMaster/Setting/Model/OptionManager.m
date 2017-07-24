//
//  BaseManager.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "OptionManager.h"
#import "OptionModel.h"
#import "DeviceManager.h"
//#import "UserManager.h"

@interface OptionManager ()

@property (nonatomic, copy) NSString *optionFilePath;
@end

@implementation OptionManager

+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static OptionManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:zone];
    });
    
    return instance;
}

+ (instancetype)manager
{
    return [[self alloc] init];
}


/**
 *  懒加载optionFilePath
 */

- (NSString *)optionFilePath
{
    if (_optionFilePath == nil)
    {
        if ([Config currentConfig].phone != nil)
        {
            NSString *msgFile = [[Config currentConfig].phone stringByAppendingString:@"_optionFilePath"];
            _optionFilePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0] stringByAppendingPathComponent:msgFile];
        }
    }
    return _optionFilePath;
}

//归档
- (OptionModel *)optionModel
{
    if (_optionModel == nil)
    {
        if (self.optionFilePath == nil)
        {
            return nil;
        }
        _optionModel = [NSKeyedUnarchiver unarchiveObjectWithFile: self.optionFilePath];
        if (_optionModel == nil)
        {
            _optionModel = [[OptionModel alloc] init];
        }
    }
    return _optionModel;
}

- (BOOL) saveOption
{
    if (self.optionFilePath == nil) {
        return NO;
    }
    return [NSKeyedArchiver archiveRootObject:_optionModel toFile:self.optionFilePath];
}

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData
{
    self.optionModel = nil;
    self.optionFilePath = nil;
}

@end
