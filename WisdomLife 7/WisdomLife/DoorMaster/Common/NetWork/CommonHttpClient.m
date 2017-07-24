//
//  CommonHttpClient.m
//  Storm
//
//  Created by 朱攀峰 on 15/12/1.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "CommonHttpClient.h"
#import "AFNetworking.h"
@implementation CommonHttpClient

+ (AFHTTPSessionManager *)afManager
{
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    
    AFSecurityPolicy *securityPolicy = [AFSecurityPolicy defaultPolicy];
    manager.securityPolicy = securityPolicy;
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    manager.responseSerializer = [AFJSONResponseSerializer serializer];
    manager.responseSerializer.acceptableContentTypes = [NSSet setWithObject:@"text/plain"];//设置相应内容类型
    return manager;
}


@end
