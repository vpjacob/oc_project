//
//  UploadOpenDoorService.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/12/4.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "UploadOpenDoorService.h"
#import "DevOpenLogManager.h"

@implementation UploadOpenDoorService

- (void)postOpenDoorRecordRequest:(NSMutableArray *)list
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
    [param setValue:[Config currentConfig].client_id forKey:@"client_id"];
    [param setValue:@"event" forKey:@"resource"];
    [param setValue:@"POST" forKey:@"operation"];
    [param setValue:list forKey:@"data"];
    
    [[CommonHttpClient afManager] POST:kString(kApphttp, kUploadOpenDoorUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        int ret = [responseObject[@"ret"] intValue];
        if (ret == SUCCESS) {  //上传成功更新本地记录的上传状态
            NSMutableArray *modelList = [NSMutableArray array];
            for (NSDictionary *dict in list) {
                DevOpenLogModel *model = [[DevOpenLogModel alloc] init];
                [model initOpenLogWithDic:dict];
                [modelList addObject:model];
            }
            [[DevOpenLogManager manager] updateOpenLogStatus:modelList];
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
    }];
}

- (void)getOpenDoorRecordRequest:(NSMutableDictionary *)dict
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    [param setValue:[Config currentConfig].client_id forKey:@"client_id"];
    [param setValue:@"event" forKey:@"resource"];
    [param setValue:@"GET" forKey:@"operation"];
    [param setValue:dict forKey:@"data"];
    
    [[CommonHttpClient afManager] POST:kString(kApphttp, kUploadOpenDoorUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSString *ret = [responseObject objectForKey:@"ret"];
        if ([ret integerValue] == 0) {
            OpenDoorDto *dto = [[OpenDoorDto alloc] init];
            [dto encodeFromDictionary:responseObject];
            [self getOpenDoorRecordRequestInfoItem:YES list:dto.dataArr errorMsg:nil];
        } else {
            [self getOpenDoorRecordRequestInfoItem:NO list:nil errorMsg:NSLocalizedString(@"NoData", @"")];
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        [self getOpenDoorRecordRequestInfoItem:NO list:nil errorMsg:NSLocalizedString(@"NoData", @"")];
    }];
}

- (void)getOpenDoorRecordRequestInfoItem:(BOOL)isSuccess
                                    list:(NSMutableArray *)list
                                errorMsg:(NSString *)errorMsg
{
    if (_delegate && [_delegate respondsToSelector:@selector(getOpenDoorRecordRequestInfoItem:list:errorMsg:)]) {
        [_delegate getOpenDoorRecordRequestInfoItem:isSuccess list:list errorMsg:errorMsg];
    }
}

@end
