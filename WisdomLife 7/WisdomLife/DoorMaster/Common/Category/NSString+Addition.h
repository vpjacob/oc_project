//
//  NSString+HW.h
//  StringDemo
//
//  Created by 何 振东 on 12-10-11.
//  Copyright (c) 2012年 wsk. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (Addition)


/**
 根据字符串来计算label的尺寸。

 @param font    输入字符串的字体大小。
 @param maxSize maxSize

 @return 返回输入字符串的尺寸。
 */
- (CGSize)sizeWithFont:(UIFont *)font maxSize:(CGSize)maxSize;


/**
 计算字符串的字数
string:输入字符串。
 @return 返回输入字符串的字数。
 */
- (int)wordsCount;

- (NSString *)URLDecodedString;
- (NSString *)URLEncodedString;
- (NSString *)encodeStringWithUTF8;

- (NSString *)urlByAppendingDict:(NSDictionary *)params;
- (NSUInteger)byteLengthWithEncoding:(NSStringEncoding)encoding;
+(NSString *)documentPathWith:(NSString *)fileName;
@end
