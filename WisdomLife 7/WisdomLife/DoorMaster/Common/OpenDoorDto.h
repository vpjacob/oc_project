//
//  OpenDoorDto.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/12/4.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CommonDTO.h"
@interface OpenDoorDto : CommonDTO

@property (nonatomic,strong)NSMutableArray *dataArr;

@end

@interface OpenDoorListDto : CommonDTO

@property (nonatomic,strong)NSString *action_time;
@property (nonatomic,strong)NSString *dev_mac;
@property (nonatomic,strong)NSString *dev_name;
@property (nonatomic,strong)NSString *dev_sn;
@property (nonatomic,strong)NSString *event_time;
@property (nonatomic,strong)NSString *log_id;
@property (nonatomic,strong)NSString *op_ret;
@property (nonatomic,strong)NSString *op_time;
@property (nonatomic,strong)NSString *op_user;

@end
