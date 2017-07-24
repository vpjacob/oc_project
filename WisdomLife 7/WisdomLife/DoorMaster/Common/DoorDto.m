//
//  DoorDto.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "DoorDto.h"
#import "MJExtension.h"

@implementation DoorDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    self.dataArr = [NSMutableArray array];
    
    id arr = [dic objectForKey:@"data"];
    if ([arr isKindOfClass:[NSArray class]]) {
        for (NSDictionary *dic in arr) {
            DoorListDto *model = [[DoorListDto alloc] init];
            [model encodeFromDictionary:dic];
            [self.dataArr addObject:model];
        }
    }
}

MJCodingImplementation

@end

@implementation DoorListDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    self.readerArr = [NSMutableArray array];
    
    self.dev_sn = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_sn"]];
    self.dev_mac = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_mac"]];
    self.dev_id = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_id"]];
    self.show_name = [NSString stringWithFormat:@"%@",[dic objectForKey:@"show_name"]];
    self.sn = self.dev_sn; //设置通用SN
    self.type = ACCESS_DEVICE; //设置类型
    
    id arr = [dic objectForKey:@"reader"];
    if ([arr isKindOfClass:[NSArray class]]) {
        for (NSDictionary *dic in arr) {
            DoorReaderDto *model = [[DoorReaderDto alloc] init];
            [model encodeFromDictionary:dic];
            [self.readerArr addObject:model];
        }
    }
}
MJCodingImplementation
@end

@implementation DoorReaderDto

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    [super encodeFromDictionary:dic];
    
    self.reader_sn = [NSString stringWithFormat:@"%@",[dic objectForKey:@"reader_sn"]];
    self.reader_mac = [NSString stringWithFormat:@"%@",[dic objectForKey:@"reader_mac"]];
    self.dev_type = [NSString stringWithFormat:@"%@",[dic objectForKey:@"dev_type"]];
    self.network = [NSString stringWithFormat:@"%@",[dic objectForKey:@"network"]];
    self.privilege = [NSString stringWithFormat:@"%@",[dic objectForKey:@"privilege"]];
    self.start_date = [NSString stringWithFormat:@"%@",[dic objectForKey:@"start_date"]];
    self.end_date = [NSString stringWithFormat:@"%@",[dic objectForKey:@"end_date"]];
    self.use_count = [NSString stringWithFormat:@"%@",[dic objectForKey:@"use_count"]];
    self.verified = [NSString stringWithFormat:@"%@",[dic objectForKey:@"verified"]];
    self.open_type = [NSString stringWithFormat:@"%@",[dic objectForKey:@"open_type"]];
    self.open_pwd = [NSString stringWithFormat:@"%@",[dic objectForKey:@"open_pwd"]];
    self.ekey = [NSString stringWithFormat:@"%@",[dic objectForKey:@"ekey"]];
    self.cardno = [NSString stringWithFormat:@"%@",[dic objectForKey:@"cardno"]];
    self.encryption = [NSString stringWithFormat:@"%@",[dic objectForKey:@"encryption"]];
    self.open_distance = [NSString stringWithFormat:@"%@",[dic objectForKey:@"open_distance"]];
}

+(LibDevModel *) initLibDevModel:(DoorReaderDto *) devModel
{
    LibDevModel *libDevModel = [[LibDevModel alloc] init];
    libDevModel.devSn = devModel.reader_sn;
    libDevModel.devMac = devModel.reader_mac;
    libDevModel.eKey = devModel.ekey;
    libDevModel.startDate = devModel.start_date;
    libDevModel.endDate = devModel.end_date;
    libDevModel.devType = [devModel.dev_type intValue];
    return libDevModel;
}
MJCodingImplementation
@end
