//
//  LxxPlaySound.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/21.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AudioToolbox/AudioToolbox.h>

@interface LxxPlaySound : NSObject
{
    SystemSoundID soundID;
}

// 为播放震动效果初始化
-(id)initForPlayingVibrate;

/**
 * 为播放系统音效初始化(无需提供音频文件)
 * resourceName 系统音效名称
 * type 系统音效类型
 */
-(id)initForPlayingSystemSoundEffectWith:(NSString *)resourceName ofType:(NSString *)type;

/**
 *  @brief  为播放特定的音频文件初始化（需提供音频文件）
 *  @param filename 音频文件名（加在工程中）
 */
-(id)initForPlayingSoundEffectWith:(NSString *)filename;

/**
 *  @brief  播放音效
 */
-(void)play;

@end