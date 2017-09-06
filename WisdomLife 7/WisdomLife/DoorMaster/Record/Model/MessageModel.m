//
//  MessageModel.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/10/23.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "MessageModel.h"

#import "MJExtension.h"

@implementation MessageModel

-(void)initMessage:(MessageModel *)msgModel;
{
    self.msgId = msgModel.msgId;
    self.sender = msgModel.sender;
    self.receiver = msgModel.receiver;
    self.sendTime = msgModel.sendTime;
    self.content = msgModel.content;
    self.imageBase64 = msgModel.imageBase64;
    self.status = msgModel.status;
    self.contentHeight = [self.content sizeWithFont:[UIFont systemFontOfSize:15] constrainedToSize:CGSizeMake(kDeviceWidth - 75, MAXFLOAT) lineBreakMode:UILineBreakModeWordWrap].height;
}

-(CGFloat)contentHeight
{
    if (_contentHeight == 0) {
        
    }
    _contentHeight = [self.content sizeWithFont:[UIFont systemFontOfSize:15] constrainedToSize:CGSizeMake(kDeviceWidth - 75, MAXFLOAT) lineBreakMode:UILineBreakModeWordWrap].height;
    return _contentHeight;
}

MJCodingImplementation
@end
