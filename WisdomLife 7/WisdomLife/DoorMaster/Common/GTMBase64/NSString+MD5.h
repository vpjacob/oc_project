//
//  NSString+MD5.h
//  smsmemberapp
//
//  Created by cnmobi on 16/1/25.
//  Copyright © 2016年 cnmobi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>

@interface NSString (MD5)

+ (NSString *)StringToMD5:(NSString *)str;

@end
