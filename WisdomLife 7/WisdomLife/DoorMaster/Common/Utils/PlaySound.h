//
//  PlaySound.h
//  DoorMaster
//
//  Created by 宏根 张 on 6/29/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@interface PlaySound : UIViewController<AVAudioPlayerDelegate>
{
    AVAudioPlayer *avAudioPlayer;   //播放器player
    UIProgressView *progressV;      //播放进度
    UISlider *volumeSlider;         //声音控制
    NSTimer *timer;                 //监控音频播放进度
}

- (void)viewDidLoad;
- (void)play;
- (void)pause;
- (void)stop;

@property AVAudioPlayer *avAudioPlayer;
@property UIProgressView *progressV;
@property UISlider *volumeSlider;
@property NSTimer *timer;


@end