//
//  NSString+HW.m
//  StringDemo
//
//  Created by 何 振东 on 12-10-11.
//  Copyright (c) 2012年 wsk. All rights reserved.
//

#import "NSString+Addition.h"

@implementation NSString (Addition)

- (int)wordsCount
{
    int i,n = [self length], l = 0, a = 0, b = 0;
    unichar c;
    for(i = 0;i < n; i++)
    {
        c = [self characterAtIndex:i];
        if(isblank(c))
        {
            b++;
        }else if(isascii(c))
        {
            a++;
        }else{
            l++;
        }
    }
    if(a == 0 && l == 0) return 0;
    return l + (int)ceilf((float)(a + b) / 2.0);
}

- (NSString *)URLEncodedString
{
    NSString *result = (NSString *)CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(kCFAllocatorDefault,
                                                                           (CFStringRef)self,
                                                                           NULL,
                                                                           CFSTR("!*'();:@&=+$,/?%#[]"),
                                                                           kCFStringEncodingUTF8));
    return result;
}

- (NSString *)URLDecodedString
{
    NSString *result = (NSString *)CFBridgingRelease(CFURLCreateStringByReplacingPercentEscapesUsingEncoding(kCFAllocatorDefault,
                                                                                           (CFStringRef)self,
                                                                                           CFSTR(""),
                                                                                           kCFStringEncodingUTF8));
    return result;
}

- (NSString *)encodeStringWithUTF8
{
    NSStringEncoding encoding = CFStringConvertEncodingToNSStringEncoding(kCFStringEncodingISOLatin1);
    const char *c =  [self cStringUsingEncoding:encoding];
    NSString *str = [NSString stringWithCString:c encoding:NSUTF8StringEncoding];

    return str;
}

- (NSUInteger)byteLengthWithEncoding:(NSStringEncoding)encoding
{
    if (!self)
    {
        return 0;
    }
    
    const char *byte = [self cStringUsingEncoding:encoding];
    return strlen(byte);
}
+(NSString *)documentPathWith:(NSString *)fileName
{
    
    return [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)lastObject] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@",fileName]];
}
- (NSString *)urlByAppendingDict:(NSDictionary *)params
{
    NSURL *parsedURL = [NSURL URLWithString:self];
    NSString *queryPrefix = parsedURL.query ? @"&" : @"?";
    NSString *query = [self queryStringFromDictionary:params];
    return [NSString stringWithFormat:@"%@%@%@",self,queryPrefix,query];
}
- (NSString *)queryStringFromDictionary:(NSDictionary *)dict
{
    NSMutableArray *pairs = [NSMutableArray array];
    for (NSString *key in [dict keyEnumerator]) {
        id value = [dict valueForKey:key];
        if ([value isKindOfClass:[NSNumber class]]) {
            value = [value stringValue];
        }
        else if ([value isKindOfClass:[NSString class]])
        {
        
        }
        else
        {
            continue;
        }
        NSString *urlEncoding = [value URLEncodedString];
        [pairs addObject:[NSString stringWithFormat:@"%@=%@",key,urlEncoding]];
    }
    return [pairs componentsJoinedByString:@"&"];
}

- (CGSize)sizeWithFont:(UIFont *)font maxSize:(CGSize)maxSize
{
    NSDictionary *attrs = @{NSFontAttributeName : font};
    return [self boundingRectWithSize:maxSize options:NSStringDrawingUsesLineFragmentOrigin attributes:attrs context:nil].size;
}
@end
