//
//  NSData+Addition.m
//  Line0
//
//  Created by line0 on 12-12-5.
//  Copyright (c) 2012年 line0. All rights reserved.
//

#import "NSData+Addition.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>

@implementation NSData (Addition)

- (NSData *)dataWithObject:(id)object
{
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:object];
    return data;
}

- (id)convertDataToObject
{
    NSArray *array = [NSKeyedUnarchiver unarchiveObjectWithData:self];
    return array;
}

+ (NSString *)contentTypeForImageData:(NSData *)data
{
    uint8_t c;
    [data getBytes:&c length:1];
    
    switch (c)
    {
        case 0xFF:
            return @"image/jpeg";
        case 0x89:
            return @"image/png";
        case 0x47:
            return @"image/gif";
        case 0x49:
        case 0x4D:
            return @"image/tiff";
    }
    return nil;
}

- (NSString *)MD5EncodedString
{
    unsigned char result[CC_MD5_DIGEST_LENGTH];
    CC_MD5([self bytes], (CC_LONG)[self length], result);
    return [NSString stringWithFormat:@"%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X",result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],result[8],result[9],result[10],result[11],result[12],result[13],result[14],result[15]];
}
- (NSData *)HMACSHA1EncodedDataWithKey:(NSString *)key;
{
    NSData *keyData = [key dataUsingEncoding:NSUTF8StringEncoding];
    void *buffer = malloc(CC_SHA1_DIGEST_LENGTH);
    CCHmac(kCCHmacAlgSHA1, [keyData bytes], [keyData length], [self bytes], [self length], buffer);
    
    NSData *encodedData = [NSData dataWithBytesNoCopy:buffer length:CC_SHA1_DIGEST_LENGTH freeWhenDone:YES];
    return encodedData;
}

+ (id)dataWithBase64EncodedString:(NSString *)string
{
    return [GTMBase64 decodeString:string];
}
- (NSString *)base64EncodingString
{
    return [GTMBase64 stringByEncodingData:self];
}
@end
