//
//  OpenDoorDto.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/12/4.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "OpenDoorDto.h"

@implementation OpenDoorDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    
    id arr = [dic objectForKey:@"data"];
    if ([arr isKindOfClass:[NSArray class]]) {
        for (NSDictionary *dic in arr) {
            OpenDoorListDto *model = [[OpenDoorListDto alloc] init];
            [model encodeFromDictionary:dic];
            [self.dataArr addObject:model];
        }
    }
}

- (NSMutableArray *)dataArr
{
    if (!_dataArr) {
        _dataArr = [NSMutableArray array];
    }
    return _dataArr;
}

@end

@implementation OpenDoorListDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    
    self.action_time = [NSString stringWithFormat:@"%@",[dic objectForKey:@"action_time"]];
    self.dev_mac = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_mac"]];
    self.dev_name = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_name"]];
    self.dev_sn = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_sn"]];
    self.event_time = [NSString stringWithFormat:@"%@",[dic objectForKey:@"event_time"]];
    self.log_id = [NSString stringWithFormat:@"%@",[dic objectForKey:@"log_id"]];
    self.op_ret = [NSString stringWithFormat:@"%@",[dic objectForKey:@"op_ret"]];
    self.op_time = [NSString stringWithFormat:@"%@",[dic objectForKey:@"op_time"]];
    self.op_user = [NSString stringWithFormat:@"%@",[dic objectForKey:@"op_user"]];
}

@end
