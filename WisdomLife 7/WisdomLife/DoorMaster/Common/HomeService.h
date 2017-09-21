//
//  HomeService.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^SucessBlock)(NSDictionary *result);
typedef void(^FailureBlock)(NSError *error);

@interface HomeService : NSObject

/**
 门权限
 */
+ (void)doorListWithSuccess:(SucessBlock) success failure:(FailureBlock) failure;

/**
 *视频权限
 */
+ (void)videoDoorWithSuccess:(SucessBlock) success failure:(FailureBlock) failure;

@end
