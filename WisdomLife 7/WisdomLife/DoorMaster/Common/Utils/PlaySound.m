//
//  PlaySound.m
//  DoorMaster
//
//  Created by 宏根 张 on 6/29/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import "PlaySound.h"

@implementation PlaySound

@synthesize avAudioPlayer;
@synthesize progressV;
@synthesize volumeSlider;
@synthesize timer;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    NSString *string = [[NSBundle mainBundle] pathForResource:@"open_door_sound" ofType:@"wav"];
    //把音频文件转换成url格式
    NSURL *url = [NSURL fileURLWithPath:string];
    //初始化音频类 并且添加播放文件
    avAudioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:nil];
    //设置代理
    avAudioPlayer.delegate = self;
    
    //设置初始音量大小
    // avAudioPlayer.volume = 1;
    
    //设置音乐播放次数  -1为一直循环
    avAudioPlayer.numberOfLoops = 0;
    
    //预播放
    [avAudioPlayer prepareToPlay];
}

//播放
- (void)play
{
    [avAudioPlayer play];
}
//暂停
- (void)pause
{
    [avAudioPlayer pause];
}
//停止
- (void)stop
{
    avAudioPlayer.currentTime = 0;  //当前播放时间设置为0
    [avAudioPlayer stop];
}
//播放进度条
- (void)playProgress
{
    //通过音频播放时长的百分比,给progressview进行赋值;
    progressV.progress = avAudioPlayer.currentTime/avAudioPlayer.duration;
}
//声音开关(是否静音)
- (void)onOrOff:(UISwitch *)sender
{
    avAudioPlayer.volume = sender.on;
}

//播放音量控制
- (void)volumeChange
{
    avAudioPlayer.volume = volumeSlider.value;
}

//播放完成时调用的方法  (代理里的方法),需要设置代理才可以调用
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    [timer invalidate]; //NSTimer暂停   invalidate  使...无效;
}


@end
