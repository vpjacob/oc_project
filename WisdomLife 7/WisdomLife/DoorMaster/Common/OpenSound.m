//
//  OpenSound.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/12/4.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "OpenSound.h"
#import <AudioToolbox/AudioToolbox.h>
@implementation OpenSound

+ (OpenSound *)shareInstance
{
    static OpenSound *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[OpenSound alloc] init];
    });
    return _instance;
}

- (void)playMusic
{
    UInt32 soundID;
    NSBundle *bundle = [NSBundle mainBundle];
    NSString *path = [bundle pathForResource:@"open_door_sound" ofType:@"wav"];
    if(![[NSFileManager defaultManager] fileExistsAtPath:path]) return;
    NSURL *url = [NSURL fileURLWithPath:path];
    AudioServicesCreateSystemSoundID((__bridge CFURLRef)url,&soundID);
    AudioServicesPlaySystemSound(soundID);
}

@end
