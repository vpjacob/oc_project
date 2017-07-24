//
//  LoginDto.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "LoginDto.h"
#import "MJExtension.h"

@implementation LoginDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    
    self.dev_list = [NSMutableArray array];
    self.room_list = [NSMutableArray array];
    
    self.client_id = [NSString stringWithFormat:@"%@",[dic objectForKey:@"client_id"]];
//    self.voip_account = [NSString stringWithFormat:@"%@",[dic objectForKey:@"voip_account"]];
//    self.voip_pwd = [NSString stringWithFormat:@"%@",[dic objectForKey:@"voip_pwd"]];
    self.token_pwd = [NSString stringWithFormat:@"%@",[dic objectForKey:@"token_pwd"]];
    self.cardno = [NSString stringWithFormat:@"%@",[dic objectForKey:@"cardno"]];
    
    id arr = dic[@"community_info"][@"dev_list"];
    if ([arr isKindOfClass:[NSArray class]]) {
        for (NSDictionary *dic in arr) {
            VoipDoorDto *model = [[VoipDoorDto alloc] init];
            [model encodeFromDictionary:dic];
            [self.dev_list addObject:model];
        }
    }
    
    id arr1 = dic[@"community_info"][@"room_list"];
    if ([arr1 isKindOfClass:[NSArray class]]) {
        for (NSDictionary *dic in arr1) {
            RoomListDto *model = [[RoomListDto alloc] init];
            [model encodeFromDictionary:dic];
            [self.room_list addObject:model];
        }
    }
}
MJCodingImplementation
@end

@implementation VoipDoorDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    self.community_code = [NSString stringWithFormat:@"%@",[dic objectForKey:@"community_code"]];
    self.dev_name = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_name"]];
    self.dev_sn = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_sn"]];
    self.sn = self.dev_sn;
    self.dev_voip_account = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_voip_account"]];
}
MJCodingImplementation
@end

@implementation RoomListDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    self.building = [NSString stringWithFormat:@"%@",[dic objectForKey:@"building"]];
    self.call_forward_num = [NSString stringWithFormat:@"%@",[dic objectForKey:@"call_forward_num"]];
    self.community = [NSString stringWithFormat:@"%@",[dic objectForKey:@"community"]];
    self.room_code = [NSString stringWithFormat:@"%@",[dic objectForKey:@"room_code"]];
    self.community_code = [NSString stringWithFormat:@"%@",[dic objectForKey:@"community_code"]];
    self.end_datetime = [NSString stringWithFormat:@"%@",[dic objectForKey:@"room_code"]];
    self.room_id = [NSString stringWithFormat:@"%@",[dic objectForKey:@"room_id"]];
    self.room_name = [NSString stringWithFormat:@"%@",[dic objectForKey:@"room_name"]];
    self.start_datetime = [NSString stringWithFormat:@"%@",[dic objectForKey:@"start_datetime"]];
}
MJCodingImplementation
@end
