//
//  NSObject+MessageManager.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/10/23.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MessageModel.h"

@interface MessageManager : NSObject

@property (nonatomic, strong) MessageModel *msgModel;
@property (nonatomic, strong) NSMutableArray *list;
@property (nonatomic, strong) NSMutableArray *senderLastMsgArray; // 运行时消息列表，存同一个sender最后一条msgModel
@property (nonatomic, strong) NSMutableDictionary *runCellDict; // 运行时每一个发送人对应的消息cell

+ (instancetype)manager;

- (BOOL)saveMsg;

- (void)addMsg:(MessageModel*) msgModel;

- (void)delMsg:(long) index;

- (void)delAllMsg;

//- (void )updateMsg:(MessageModel*) msgModel;

//- (MessageModel *) getMsg:(long) index;

// 更新未读消息为已读状态
- (void )updateMsgStatus:(NSString*) sender;

- (MessageModel *) getMsgWithInit:(long) index;

// 获取发送者数量
- (NSInteger) getSenderCount;

// 获取未读消息条数
- (int) getUnreadCount:(NSString*) sender;

- (NSMutableArray*) getMsgWithSender:(NSString*) sender;

// 设置消息cell到Dict中
- (void) setRunCellDict:(NSString*) sender andCell:(id)cell ;

// 通过sender获取对应的cell
- (id) getRunCellWithSender:(NSString*) sender;

// 获取未读消息条数
- (int) getSumUnreadCount;

// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData;

@end
