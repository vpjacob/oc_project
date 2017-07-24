// 开门记录
//  DevOpenLogManager.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "DevOpenLogManager.h"
#import "DevOpenLogModel.h"
#import "UserManager.h"


@interface DevOpenLogManager()

@property (nonatomic, copy) NSString *filePath;

@end

@implementation DevOpenLogManager

+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static DevOpenLogManager *instance = nil;
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
 *  懒加载filePath
 */

- (NSString *)filePath
{
    if (_filePath == nil)
    {
        if ([[UserManager manager] user].identity != nil)
        {
            NSString *openLogFile = [[[UserManager manager] user].identity stringByAppendingString:@"_openLog"];
            _filePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0] stringByAppendingPathComponent:openLogFile];
        }
    }
    return _filePath;
}

- (NSMutableArray *)list
{
    if (_list == nil)
    {
        if (self.filePath == nil)
        {
            return nil;
        }
        _list = [NSKeyedUnarchiver unarchiveObjectWithFile:self.filePath];
        if (_list == nil)
        {
            _list = [[NSMutableArray alloc] init];
        }
    }
    return _list;
}

- (void)addOpenLog:(DevOpenLogModel*) logModel
{
    [self.list addObject:logModel];
    [self notifyOpenLogListUpdate];
    [self save];
}

- (void)delDevAllOpenLog:(NSString*) devSn
{
    for (int i=0; i<_list.count; i++)
    {
        DevOpenLogModel *logModel = _list[i];
        if ([logModel.devSn isEqualToString: devSn])
        {
            [_list removeObjectAtIndex:i];
        }
    }
    [self notifyOpenLogListUpdate];
    [self save];
    return;
//    [_list removeAllObjects];
//    [self save];
}

- (void) getOpenLogWithDevSn:(NSString*) devSn
{
    if (self.devLogArray == nil)
    {
        self.devLogArray = [[NSMutableArray alloc] init];
    }
    else
    {
        [self.devLogArray removeAllObjects];
    }
    long len = self.list.count;
    for (long i = len-1; i >= 0; i--)
    {
        DevOpenLogModel *openLogModel = self.list[i];
        if ([openLogModel.devSn isEqualToString:devSn])
        {
            [self.devLogArray addObject:openLogModel];
        }
    }
}

- (void) getAllOpenLog
{
//    if (self.devLogArray == nil)
//    {
//        self.devLogArray = [[NSMutableArray alloc] init];
//    }
//    else
//    {
//        [self.devLogArray removeAllObjects];
//    }
    long len = self.list.count;
    for (long i = len-1; i >= 0; i--)
    {
        DevOpenLogModel *openLogModel = self.list[i];
        [self.devLogArray addObject:openLogModel];
    }
}

// 获取未上传的开门记录
- (NSMutableArray *) getUnuploadLog:(int)getCount
{
    NSMutableArray *logModelArray = [[NSMutableArray alloc] init];
    
    for (DevOpenLogModel *logModel in self.list)
    {
        if (logModel.status == 0)
        {
            [logModelArray addObject:logModel];
            if (logModelArray.count == getCount)
            {
                return logModelArray;
            }
        }
    }
    return logModelArray;
}

- (DevOpenLogModel *) getOpenLog:(long) index
{
//    if (self.devLogArray.count - index <= 0)
//    {
//        return nil;
//    }
//    DevOpenLogModel *openLogModel = self.devLogArray[index];
//    return openLogModel;
    if (self.list.count - index <= 0)
    {
        return nil;
    }
    DevOpenLogModel *openLogModel = self.list[self.list.count - index - 1];
    return openLogModel;
}

// 更新记录状态为已上传
- (void)updateOpenLogStatus:(NSMutableArray*)logModelArray
{
    for (DevOpenLogModel *logModel in self.list)
    {
        if (logModel.status == 0)
        {
            for (DevOpenLogModel *updateLogModel in logModelArray)
            {
                if ([logModel.devSn isEqualToString: updateLogModel.devSn] && logModel.logID == updateLogModel.logID)
                {
                    logModel.status = 1;
                }
            }
        }
    }
    [self save];
}

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData
{
    [self.list removeAllObjects];
    self.list = nil;
    self.filePath = nil;
    [self notifyOpenLogListUpdate];
}

- (BOOL)save
{
    if (self.filePath == nil) {
        return NO;
    }
    return [NSKeyedArchiver archiveRootObject:_list toFile:self.filePath];
}

//发出开门记录有更新的通知
-(void)notifyOpenLogListUpdate
{
    [[NSNotificationCenter defaultCenter] postNotificationName:OpenLogUpdate object:nil];
}

- (void)print
{
    
}

@end


