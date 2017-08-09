//
//  JJRefuseManager.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/9.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJRefuseManager.h"
#import "UserManager.h"

@interface JJRefuseManager ()
@property (nonatomic, copy) NSString *filePath;
@end

@implementation JJRefuseManager
+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static JJRefuseManager *instance = nil;
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
            NSString *openLogFile = [[[UserManager manager] user].identity stringByAppendingString:@"_refuseLog"];
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

- (void)addOpenLog:(LoginDto*) logModel
{
    [self.list addObject:logModel];
//    [self notifyOpenLogListUpdate];
    [self save];
}

- (void)delDevAllOpenLog:(NSString*) devSn
{
    for (int i=0; i<_list.count; i++)
    {
        VoipDoorDto *logModel = _list[i];
        if ([logModel.dev_sn isEqualToString: devSn])
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

//向数组中添加模型
- (void) getRefuseLogWithDevSn:(NSString*) devSn
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
        VoipDoorDto *openLogModel = self.list[i];
        if ([openLogModel.dev_sn isEqualToString:devSn])
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
        VoipDoorDto *openLogModel = self.list[i];
        [self.devLogArray addObject:openLogModel];
    }
}


- (VoipDoorDto *) getOpenLog:(long) index
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
    VoipDoorDto *openLogModel = self.list[self.list.count - index - 1];
    return openLogModel;
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
