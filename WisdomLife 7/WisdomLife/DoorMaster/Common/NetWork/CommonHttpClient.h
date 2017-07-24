//
//  CommonHttpClient.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/1.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>

#define AFRequestMethodPost @"POST"
#define AFRequestMethodGet @"GET"

@interface CommonHttpClient : NSObject

+ (AFHTTPSessionManager *)afManager;

@end
