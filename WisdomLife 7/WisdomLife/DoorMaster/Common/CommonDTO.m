//
//  CommonDTO.m
//  Storm
//
//  Created by 朱攀峰 on 15/11/26.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "CommonDTO.h"
#import "MJExtension.h"

SN_EXTERN id DMEncodeObjectFromDic(NSDictionary *dic, NSString *key)
{
    id obj = [dic objectForKey:key];
    if ([obj isKindOfClass:[NSNull class]]) {
        return nil;
    }
    return obj;
}

SN_EXTERN NSString* DMEncodeStringFromDic(NSDictionary *dic,NSString *key)
{
    id temp = [dic objectForKey:key];
    if ([temp isKindOfClass:[NSString class]]) {
        return temp;
    }
    else if ([temp isKindOfClass:[NSNumber class]])
    {
        return [temp stringValue];
    }
    return nil;
}

SN_EXTERN NSNumber* DMEncodeNumberFromDic(NSDictionary *dic,NSString *key)
{
    id temp = [dic objectForKey:key];
    if ([temp isKindOfClass:[NSNumber class]]) {
        return temp;
    }
    else if ([temp isKindOfClass:[NSString class]])
    {
        return [NSNumber numberWithDouble:[(NSString *)temp doubleValue]];
    }
    return nil;
}
SN_EXTERN NSDictionary* DMEncodeDicFromDic(NSDictionary *dic,NSString *key)
{
    id temp = [dic objectForKey:key];
    if ([temp isKindOfClass:[NSDictionary class]]) {
        return temp;
    }
    return nil;
}
SN_EXTERN NSArray* DMEncodeArrayFromDic(NSDictionary *dic,NSString *key)
{
    id temp = [dic objectForKey:key];
    if ([temp isKindOfClass:[NSArray class]]) {
        return temp;
    }
    return nil;
}
@implementation CommonDTO

- (void)encodeFromDictionary:(NSDictionary *)dic
{
    if (dic == nil) {
        return;
    }
}

+ (id)dtoFromDic:(NSDictionary *)dic
{
    id dto = [[self alloc] init];
    [dto encodeFromDictionary:dic];
    return dto;
}

MJCodingImplementation
@end
