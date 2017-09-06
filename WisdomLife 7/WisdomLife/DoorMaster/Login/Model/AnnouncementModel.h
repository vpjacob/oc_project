//
//  AnnouncementModel.h
//  SmartDoor
//
//  Created by 宏根 张 on 18/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AnnouncementModel : NSObject

@property (nonatomic, copy) NSString *community_code; //公告编码
@property (nonatomic, copy) NSString *name; //公告标题
@property (nonatomic, copy) NSString *start_date; //发布时间
@property (nonatomic, copy) NSString *end_date; //撤销时间
@property (nonatomic, copy) NSString *content; //广告内容

@end
