//
//  MessageModel.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/10/23.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MessageModel : NSObject

@property (nonatomic, copy) NSString *msgId;  // 主键，由 sendTime-comm_id 组成
@property (nonatomic, copy) NSString *sender; // 发送者
@property (nonatomic, copy) NSString *receiver; // 接收人
@property (nonatomic, copy) NSString *sendTime; // 发送时间
@property (nonatomic, copy) NSString *content; // 消息内容
@property (nonatomic, copy) NSString *imageBase64; // 照片base64字符串
@property (nonatomic) int status; // 消息状态(0 未读，1 已读)
@property (nonatomic, assign) CGFloat contentHeight; //消息内容的高度--Benson

-(void)initMessage:(MessageModel *) msgModel;

@end
