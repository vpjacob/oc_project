//
//  Advertisement.h
//  SmartDoor
//
//  Created by 宏根 张 on 18/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Advertisement : NSObject

@property (nonatomic, copy) NSString *community_code; //广告编号
@property (nonatomic, copy) NSArray *image_link_list; //广告图标链接地址列表
@property (nonatomic, copy) NSString *start_date; //发布时间
@property (nonatomic, copy) NSString *end_date; //撤销时间

@end
