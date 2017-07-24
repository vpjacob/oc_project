//
//  NSString+ImageUrl.m
//  Storm
//
//  Created by 朱攀峰 on 15/12/4.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "NSString+ImageUrl.h"

@implementation NSString (ImageUrl)

+ (NSString *)stringWithImageUrl:(NSString *)imageUrl imageWidth:(NSInteger)imageWidth imageHeight:(NSInteger)imageHeight
{
    if (!IsNilOrNull(imageUrl) && !IsStrEmpty(imageUrl)) {
        NSString *imageSizeStr = [NSString stringWithFormat:@"_%zd_%zd",imageWidth,imageHeight];
        NSMutableString *imageStr = [[NSMutableString alloc] initWithFormat:@"%@",imageUrl];
        [imageStr insertString:imageSizeStr atIndex:imageStr.length-4];
        return imageStr;
    }
    return nil;
}

@end
