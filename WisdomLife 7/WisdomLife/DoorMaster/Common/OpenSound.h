//
//  OpenSound.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/12/4.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OpenSound : NSObject

+ (OpenSound *)shareInstance;

- (void)playMusic;

@end
