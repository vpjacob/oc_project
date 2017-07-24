//
//  NSString+ImageUrl.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/4.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (ImageUrl)

+ (NSString *)stringWithImageUrl:(NSString *)imageUrl imageWidth:(NSInteger)imageWidth imageHeight:(NSInteger)imageHeight;

@end
