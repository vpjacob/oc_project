//
//  DevSystemInfoManager.m
//  DoorMaster
//
//  Created by 宏根 张 on 8/5/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import "DevSystemInfoManager.h"
#import "DevSystemInfoModel.h"

@interface DevSystemInfoManager()

@property (nonatomic, copy) NSString *devInfoFilePath;
@end

@implementation DevSystemInfoManager

// 单例模式，只一个DevSystemInfoManager instance
+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static DevSystemInfoManager *instance = nil;
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
 *  懒加载devInfoFilePath
 */

- (NSString *)devInfoFilePath
{
    if (_devInfoFilePath == nil)
    {
        if ([Config currentConfig].phone != nil)
        {
            NSString *devInfoFile = [[Config currentConfig].phone stringByAppendingString:@"_devSystemInfo"];
            _devInfoFilePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0] stringByAppendingPathComponent:devInfoFile];
        }
    }
    return _devInfoFilePath;
}

- (NSMutableArray *)list
{
    if (_list == nil)
    {
        if (self.devInfoFilePath == nil)
        {
            return nil;
        }
        _list = [NSKeyedUnarchiver unarchiveObjectWithFile:self.devInfoFilePath];
        if (_list == nil)
        {
            _list = [[NSMutableArray alloc] init];
        }
        else
        {
            for (DevSystemInfoModel *devInfoModel in _list)
            {
                [[DevSystemInfoManager manager] addDevSystemInfo: devInfoModel];
            }
        }
    }
    return _list;
}


//归档
- (DevSystemInfoModel *)systemInfoModel
{
    if (_systemInfoModel == nil) {
        _systemInfoModel = [NSKeyedUnarchiver unarchiveObjectWithFile:self.devInfoFilePath];
        if (_systemInfoModel == nil) {
            _systemInfoModel = [[DevSystemInfoModel alloc] init];
        }
    }
    return _systemInfoModel;
}


- (BOOL)saveDevSystemInfo
{
    if (self.devInfoFilePath == nil) {
        return NO;
    }
    return [NSKeyedArchiver archiveRootObject:_list toFile:self.devInfoFilePath];
}

- (DevSystemInfoModel *)getDevSystemInfo:(NSString*) devSn
{
    for (DevSystemInfoModel *infoModel in self.list)
    {
        if ([infoModel.devSn isEqualToString:devSn])
        {
            return infoModel;
        }
    }
    return nil;
}

- (void)addDevSystemInfo:(DevSystemInfoModel*) systemInfoModel
{
    for (DevSystemInfoModel *infoModel in self.list)
    {
        if ([infoModel.devSn isEqualToString:systemInfoModel.devSn])
        {
            return;
        }
    }
    [[self list] addObject:systemInfoModel];
    [self saveDevSystemInfo];
}

- (void)delDevSystemInfo:(NSString *) devSn
{
    for (int i = 0; i < self.list.count; i++)
    {
        DevSystemInfoModel *infoModel = _list[i];
        if ([infoModel.devSn isEqualToString:devSn])
        {
            [_list removeObjectAtIndex:i];
            [self saveDevSystemInfo];
            return;
        }
    }
}

- (void)delAll
{
    [_list removeAllObjects];
    [self saveDevSystemInfo];
}

- (void )updateDevSystemInfo:(DevSystemInfoModel*) systemInfoModel
{
    for (int i=0; i<self.list.count; i++)
    {
        DevSystemInfoModel *infoModel = _list[i];
        if ([infoModel.devSn isEqualToString:systemInfoModel.devSn])
        {
            infoModel.openTime = systemInfoModel.openTime;
            infoModel.cardCount = systemInfoModel.cardCount;
            infoModel.userCount = systemInfoModel.userCount;
            infoModel.maxCardCount = systemInfoModel.maxCardCount;
            infoModel.lockSwitch = systemInfoModel.lockSwitch;
            infoModel.wgfmt = systemInfoModel.wgfmt;
            infoModel.version = systemInfoModel.version;
            
            [self saveDevSystemInfo];
            return;
        }
    }
    [self addDevSystemInfo:systemInfoModel];
}

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData
{
    [self.list removeAllObjects];
    self.list = nil;
    self.devInfoFilePath = nil;
}

@end
