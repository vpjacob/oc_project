//
//  LxxPlaySound.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/21.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import "LxxPlaySound.h"

@implementation LxxPlaySound

-(id)initForPlayingVibrate
{
    self = [super init];
    if (self)
    {
        soundID = kSystemSoundID_Vibrate;
    }
    return self;
}

-(id)initForPlayingSystemSoundEffectWith:(NSString *)resourceName ofType:(NSString *)type
{
    self = [super init];
    if (self)
    {
        NSString *path = [[NSBundle bundleWithIdentifier:@"com.apple.UIKit"] pathForResource:resourceName ofType:type];
        if (path)
        {
            SystemSoundID theSoundID;
            OSStatus error =  AudioServicesCreateSystemSoundID((__bridge CFURLRef)[NSURL fileURLWithPath:path], &theSoundID);
            if (error == kAudioServicesNoError)
            {
                soundID = theSoundID;
            }
            else
            {
                NSLog(@"-----Failed to create sound ");
            }
        }
    }
    return self;
}


-(id)initForPlayingSoundEffectWith:(NSString *)filename
{
    self = [super init];
    if (self)
    {
        NSURL *fileURL = [[NSBundle mainBundle] URLForResource:filename withExtension:nil];
        if (fileURL != nil)
        {
            SystemSoundID theSoundID;
            OSStatus error = AudioServicesCreateSystemSoundID((__bridge CFURLRef)fileURL, &theSoundID);
            if (error == kAudioServicesNoError)
            {
                soundID = theSoundID;
            }
            else
            {
                NSLog(@"-----Failed to create sound ");
            }
        }
    }
    return self;
}

-(void)play
{
    AudioServicesPlaySystemSound(soundID);
}

//-(id)initPlayOpenDoorSound
//{
//    self = [super init];
//    if (self)
//    {
//        NSString *string = [[NSBundle mainBundle] pathForResource:@"open_door_sound" ofType:@"wav"];
//        //把音频文件转换成url格式
//        NSURL *url = [NSURL fileURLWithPath:string];
//        //    BOOL fileExits = [[NSFileManager defaultManager] fileExistsAtPath:string];
//        //    DEBUG_PRINT(@"====fileExits:%d", fileExits);
////        //    //初始化音频类 并且添加播放文件
//        audioSession = [AVAudioSession sharedInstance];
//        [audioSession setCategory:AVAudioSessionCategoryPlayback error:nil];
//        [audioSession setActive:YES error:nil];
//        
//        avAudioPlayer = [[AVAudioPlayer alloc] init];
//        avAudioPlayer = [avAudioPlayer initWithContentsOfURL:url error:nil];
//        //设置代理
////        avAudioPlayer.delegate = self;
//        //设置初始音量大小
//        [avAudioPlayer setVolume:1.0];
//        //设置音乐播放次数  -1为一直循环
//        avAudioPlayer.numberOfLoops = 0;
//        [avAudioPlayer play];
//    }
//    return self;
//}
//
//-(void)playOpenDoorSound
//{
//    [avAudioPlayer play];
//}
//
//- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
//{
//    [audioSession setActive:NO error:nil];
//}

@end

