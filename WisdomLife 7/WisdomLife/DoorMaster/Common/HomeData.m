//
//  HomeData.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/10/29.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "HomeData.h"

@implementation HomeData

+ (HomeData *)shareInstance
{
    static HomeData *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[HomeData alloc] init];
    });
    return _instance;
}
- (instancetype)init
{
    self = [super init];
    if (self) {
        _doorArr = [NSMutableArray array];
        _roomArr = [NSMutableArray array];
        
        _titleArr = @[@"物业费催缴提醒",
                      @"邻里和谐注意事项提醒",
                      @"火灾防护安全公告",
                      @"失物招领启事",
                      @"高空抛物提醒",
                      @"免费体检通知",
                      @"天气转凉温馨提示"];
        
        NSDictionary *dic1 = @{@"buttonImage":@"密码开门",@"title":NSLocalizedString(@"Guest_authorized", @"")};
        NSDictionary *dic2 = @{@"buttonImage":@"小区公告",@"title":NSLocalizedString(@"announcement", @"")};
        NSDictionary *dic3 = @{@"buttonImage":@"联系物业",@"title":NSLocalizedString(@"tenement", @"")};
        NSDictionary *dic4 = @{@"buttonImage":@"门禁视频",@"title":NSLocalizedString(@"DoorVideo", @"")};
        NSDictionary *dic5 = @{@"buttonImage":@"开门记录",@"title":NSLocalizedString(@"open_door_record", @"")};
        NSDictionary *dic6 = @{@"buttonImage":@"main_record", @"title":NSLocalizedString(@"message", @"")};
        NSDictionary *dic7 = @{@"buttonImage":@"main_setting", @"title":NSLocalizedString(@"setting", @"")};
        
        NSDictionary *dic8 = @{@"buttonImage":@"全部",@"title":@"更多"};
        
        _buttonArr = [[NSMutableArray alloc] initWithObjects:dic1,dic2,dic3,dic4,dic5,dic6,dic7, nil];
    }
    return self;
}

@end
