//
//  JJAdvertisementApi.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/9/20.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJAdvertisementApi.h"

@interface JJAdvertisementApi ()
@property (nonatomic, strong) NSString *ids;
@end

@implementation JJAdvertisementApi
- (NSString *)requestUrl{
    return @"http://192.168.1.199:9020/xk/appStartImg.do";
}



@end
