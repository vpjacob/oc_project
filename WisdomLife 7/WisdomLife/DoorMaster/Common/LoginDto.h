//
//  LoginDto.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "CommonDTO.h"

@interface LoginDto : CommonDTO

@property (nonatomic,strong)NSString *client_id;

//@property (nonatomic,strong)NSString *voip_account;

//@property (nonatomic,strong)NSString *voip_pwd;

@property (nonatomic,strong)NSString *token_pwd;

@property (nonatomic,strong)NSString *cardno;

@property (nonatomic,strong)NSMutableArray *dev_list;

@property (nonatomic,strong)NSMutableArray *room_list;

@end

@interface VoipDoorDto : CommonDTO

@property (nonatomic,strong)NSString *community_code;

@property (nonatomic,strong)NSString *dev_name;

@property (nonatomic,strong)NSString *dev_sn;

@property (nonatomic,strong)NSString *dev_voip_account;

@property (nonatomic,assign)int dev_type;

@end

@interface RoomListDto : CommonDTO

@property (nonatomic,strong)NSString *building;

@property (nonatomic,strong)NSString *call_forward_num;

@property (nonatomic,strong)NSString *community_code;

@property (nonatomic,strong)NSString *end_datetime;

@property (nonatomic,strong)NSString *room_code;

@property (nonatomic,strong)NSString *room_id;

@property (nonatomic,strong)NSString *room_name;

@property (nonatomic,strong)NSString *start_datetime;

@property (nonatomic,strong)NSString *community;

@end
