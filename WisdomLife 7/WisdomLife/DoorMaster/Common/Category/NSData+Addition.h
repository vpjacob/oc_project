//
//  NSData+Addition.h
//  Line0
//
//  Created by line0 on 12-12-5.
//  Copyright (c) 2012年 line0. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GTMBase64.h"

@interface NSData (Addition)
- (NSData *)dataWithObject:(id)object;
- (id)convertDataToObject;
+ (NSString *)contentTypeForImageData:(NSData *)data;

- (NSString *)MD5EncodedString;
- (NSData *)HMACSHA1EncodedDataWithKey:(NSString *)key;

+ (id)dataWithBase64EncodedString:(NSString *)string;
- (NSString *)base64EncodingString;

@end
