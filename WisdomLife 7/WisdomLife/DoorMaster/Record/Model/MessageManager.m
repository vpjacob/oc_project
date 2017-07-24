//
//  NSObject+MessageManager.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/10/23.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "MessageManager.h"
#import "UserManager.h"


@interface MessageManager()

@property (nonatomic, copy) NSString *msgFilePath;
@end

@implementation MessageManager

// 单例模式，只一个MessageManager instance
+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static MessageManager *instance = nil;
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
 *  懒加载msgFilePath
 */

- (NSString *)msgFilePath
{
    if (_msgFilePath == nil)
    {
        if ([[UserManager manager] user].identity != nil)
        {
            NSString *msgFile = [[[UserManager manager] user].identity stringByAppendingString:@"_msg"];
            _msgFilePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0] stringByAppendingPathComponent:msgFile];
        }
    }
    return _msgFilePath;
}

- (NSMutableArray *)list
{
    if (_list == nil)
    {
        if (self.msgFilePath == nil)
        {
            return nil;
        }
        _list = [NSKeyedUnarchiver unarchiveObjectWithFile:self.msgFilePath];
        if (_list == nil)
        {
            _list = [[NSMutableArray alloc] init];
        }
    }
    return _list;
}

//归档
- (MessageModel *)msgModel
{
    if (_msgModel == nil) {
        _msgModel = [NSKeyedUnarchiver unarchiveObjectWithFile:self.msgFilePath];
        if (_msgModel == nil) {
            _msgModel = [[MessageModel alloc] init];
        }
    }
    return _msgModel;
}

// 维护消息列表显示的最后一条消息
- (NSMutableArray *)senderLastMsgArray
{
    if (_senderLastMsgArray != nil)
    {
        return _senderLastMsgArray;
    }
    if (self.list.count <= 0)
    {
        return _senderLastMsgArray;
    }
    _senderLastMsgArray = [[NSMutableArray alloc] init];
    NSMutableDictionary *tmpDict = [[NSMutableDictionary alloc] init];
    
    MessageModel *msgModel = nil;
    int len = (int)self.list.count;
    for (int i = len; i > 0; i--)
    {
        msgModel = _list[i-1];
        
        if (tmpDict[msgModel.sender] == nil)
        {
            tmpDict[msgModel.sender] = msgModel;
            [_senderLastMsgArray addObject:msgModel];
        }
    }
    return _senderLastMsgArray;
}

// 单例模式，初始化 runCellDict
- (NSMutableDictionary *)runCellDict
{
    if (_runCellDict == nil)
    {
        _runCellDict = [[NSMutableDictionary alloc] init];
    }
    return _runCellDict;
}

- (BOOL)saveMsg
{
    if (self.msgFilePath == nil) {
        return NO;
    }
    return [NSKeyedArchiver archiveRootObject:_list toFile:self.msgFilePath];
}

- (void) addMsg:(MessageModel*) msgModel
{
    for (MessageModel *msg in self.list)
    {
        if ([msg.msgId isEqualToString: msgModel.msgId])
        {
            return;
        }
    }
    MessageModel *newMsg = [[MessageModel alloc] init];
    [newMsg initMessage:msgModel];
    
    [_list addObject:newMsg];
    
    // 更新维护的消息
    MessageModel *delMsg = nil;
    for (MessageModel *msg in self.senderLastMsgArray)
    {
        if ([msg.sender isEqualToString: msgModel.sender])
        {
            delMsg = msg;
            break;
        }
    }
    if (delMsg != nil)
    {
        [_senderLastMsgArray removeObject: delMsg];
    }
    [_senderLastMsgArray insertObject:msgModel atIndex:0];
    
    [self saveMsg];
}


// 删除消息
- (void) delMsg:(long) index
{
    // 先通过index从senderLastMsgArray中找出sender
    MessageModel *delMsg = nil;
    for (int i = 0; i < _senderLastMsgArray.count; i++)
    {
        if (i == index)
        {
            delMsg = _senderLastMsgArray[i];
            break;
        }
    }

    if (delMsg != nil)
    {
        NSMutableArray *tempArray = [[NSMutableArray alloc] initWithArray:_list];
        for (MessageModel *msgModel in tempArray)
        {
            if ([msgModel.sender isEqualToString: delMsg.sender])
            {
                [_list removeObject: msgModel];
            }
        }
        [self saveMsg];
        [_senderLastMsgArray removeObject: delMsg];
        [self.runCellDict removeObjectForKey:delMsg.sender];
    }
}


- (void)delAllMsg
{
    [_list removeAllObjects];
    [_senderLastMsgArray removeAllObjects];
    [self saveMsg];
}


//// 更新消息状态
//- (void )updateMsg:(MessageModel*) msgModel
//{
//    [self saveMsg];
//}
//
//// 通过index获取消息
//- (MessageModel *) getMsg:(long) index
//{
//    int j = 0;
//    for (int i=0; i<self.list.count; i++)
//    {
//        if (j == index)
//        {
//            MessageModel *msgModel = _list[i];
//            return msgModel;
//        }
//        j++;
//    }
//    return nil;
//}

// 更新未读消息为已读状态
- (void )updateMsgStatus:(NSString*) sender
{
    int count = 0;
    for (MessageModel *msgModel in self.list)
    {
        if ([msgModel.sender isEqualToString: sender] && msgModel.status == NO)
        {
            msgModel.status = YES;
            count+=1;

        }
    }
    
    if (count > 0)
    {
        [self saveMsg];
    }
}

// 初始化加载，取同一个sender的最后一条msg，倒序
- (MessageModel *) getMsgWithInit:(long) index
{
    for (int i = 0; i < _senderLastMsgArray.count; i++)
    {
        if (i == index)
        {
            MessageModel *msgModel = _senderLastMsgArray[i];
            return msgModel;
        }
    }
    return nil;
}

// 获取消息发送人条数，初始化消息列表
- (NSInteger) getSenderCount
{
    NSInteger count = self.senderLastMsgArray.count;
    return count;
}

// 获取未读消息条数
- (int) getUnreadCount:(NSString*) sender
{
    int count = 0;
    for (MessageModel *msgModel in self.list)
    {
        if ([msgModel.sender isEqualToString:sender] && msgModel.status == NO)
        {
            count+=1;
        }
    }
    return count;
}
// 获取未读消息条数
- (int) getSumUnreadCount
{
    int count = 0;
    for (MessageModel *msgModel in self.list)
    {
        if (msgModel.status == NO)
        {
            count++;
        }
    }
    return count;
}

// 获取同一个发送者的消息集合
- (NSMutableArray*) getMsgWithSender:(NSString*) sender
{
    NSMutableArray *msgArray = [[NSMutableArray alloc] init];
    for (MessageModel *msgModel in self.list)
    {
        if ([msgModel.sender isEqualToString: sender])
        {
            [msgArray addObject:msgModel];
        }
    }
    return msgArray;
}

// 设置消息cell到Dict中
- (void) setRunCellDict:(NSString*) sender andCell:(id)cell
{
    self.runCellDict[sender] = cell;
}

// 通过sender获取对应的cell
- (id) getRunCellWithSender:(NSString*) sender
{
    return self.runCellDict[sender];
}

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData
{
    [self.senderLastMsgArray removeAllObjects];
    self.senderLastMsgArray = nil;
    [self.list removeAllObjects];
    self.list = nil;
    [self.runCellDict removeAllObjects];
    self.msgFilePath = nil;
    self.msgModel = nil;
    self.runCellDict = nil;
}

@end
