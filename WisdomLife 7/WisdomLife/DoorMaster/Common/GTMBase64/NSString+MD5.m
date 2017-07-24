//
//  NSString+MD5.m
//  smsmemberapp
//
//  Created by cnmobi on 16/1/25.
//  Copyright © 2016年 cnmobi. All rights reserved.
//

#import "NSString+MD5.h"

@implementation NSString (MD5)

+ (NSString *)StringToMD5:(NSString *)str {
    const char *cStr = [str UTF8String];
    unsigned char result[32];
    CC_MD5(cStr, (CC_LONG)strlen(cStr), result);
    return [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
            result[0], result[1], result[2], result[3],
            result[4], result[5], result[6], result[7],
            result[8], result[9], result[10], result[11],
            result[12], result[13], result[14], result[15]];
   
}

@end
