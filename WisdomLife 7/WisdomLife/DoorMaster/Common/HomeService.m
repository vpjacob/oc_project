//
//  HomeService.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "HomeService.h"

@implementation HomeService

+ (void)doorListWithSuccess:(SucessBlock) success failure:(FailureBlock) failure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    
    [param setValue:[Config currentConfig].client_id forKey:@"client_id"];
    
    [[CommonHttpClient afManager] GET:kString(kApphttp,kDoorInfoUrl) parameters:param progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSString *ret = [responseObject objectForKey:@"ret"];
        if ([ret intValue] == 0) {
            success(responseObject);
        } else if ([ret intValue] == 1028) {
            success(responseObject);
        } else {
            failure(nil);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        failure(error);
    }];
}

@end
