//
//  KNBVideoPlayerController.m
//  KenuoTraining
//
//  Created by Robert on 16/3/2.
//  Copyright © 2016年 Robert. All rights reserved.
//

#import "KNBVideoPlayerController.h"
#import <AVFoundation/AVFoundation.h>
#import "KNBVideoPlayerView.h"

static const CGFloat kVideoPlayerControllerAnimationTimeinterval = 0.35f;


@interface KNBVideoPlayerController () <KNBVideoPlayerViewDelegate>

@property (nonatomic, strong) KNBVideoPlayerView *videoView;
@property (nonatomic, assign) BOOL isFullscreenMode;
@property (nonatomic, assign) CGRect originFrame;
@property (nonatomic, copy) NSString *videoTitle;
@property (nonatomic, assign) BOOL isShow;
@property (nonatomic, assign) CGFloat originSystemBrightness;
@property (nonatomic, strong) AVPlayer *avPlayer;
@property (nonatomic, strong) AVPlayerLayer *avPlayLayer;
@property (nonatomic, strong) AVPlayerItem *avPlayerItem;
@property (nonatomic, strong) id avPlayerObserver;
@property (nonatomic, strong) NSURL *contentURL;
// 解密文件存放路径
@property (nonatomic, copy) NSString *tmpVideoPath;

@end


@implementation KNBVideoPlayerController

- (void)dealloc {
    [self.avPlayer pause];
    [[NSNotificationCenter defaultCenter] removeObserver:self];

    [self.avPlayer replaceCurrentItemWithPlayerItem:nil];
    [self.avPlayerItem removeObserver:self forKeyPath:@"status"];
    //    [self.avPlayerItem removeObserver:self forKeyPath:@"loadedTimeRanges"];
    [self.avPlayer removeTimeObserver:self.avPlayerObserver];
}

- (instancetype)initWithFrame:(CGRect)frame title:(NSString *)title url:(NSURL *)url {
    self = [super init];
    if (self) {
        self.videoTitle = title;
            self.contentURL = url;
        self.view.frame = frame;

        self.view.backgroundColor = [UIColor blackColor];
        self.originSystemBrightness = [[UIScreen mainScreen] brightness];

        [self configPlayController];
        [self configObserver];

        [self.view addSubview:self.videoView];
    }
    return self;
}

#pragma mark - Publick Method
- (void)showInWindow {
    self.isShow = YES;
    UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    if (!keyWindow) {
        keyWindow = [[[UIApplication sharedApplication] windows] firstObject];
    }
    [keyWindow insertSubview:self.view atIndex:1];

    self.view.alpha = 0.0;
    [self.videoView setActivityIndicatorViewAnimation:true];
    [UIView animateWithDuration:kVideoPlayerControllerAnimationTimeinterval
        animations:^{
            self.view.alpha = 1.0;
        }
        completion:^(BOOL finished){

        }];
}

- (void)dismiss:(BOOL)animated {
   
//    if (!self.isShow) {
//        return;
//    }

    if (self.dismissCompleteBlock) {
        self.dismissCompleteBlock(self);
    }

    [self stop];
    [[UIScreen mainScreen] setBrightness:self.originSystemBrightness];
    if (animated) {
        [UIView animateWithDuration:kVideoPlayerControllerAnimationTimeinterval
            animations:^{
                self.view.alpha = 0.0;
            }
            completion:^(BOOL finished) {
//                [self.view removeFromSuperview];
[self.navigationController popViewControllerAnimated:YES];
            }];
    } else {
        [self.navigationController popViewControllerAnimated:YES];
    }

    [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];
}

- (void)startPlay {
    @synchronized(self) {
        [self.avPlayer play];
        [self.videoView playingVideo];
        if (self.startBlock) {
            self.startBlock(self);
        }
    }
}

- (void)pause {
    @synchronized(self) {
        [self.avPlayer pause];
        [self.videoView stopVideo];
        if (self.pauseBlock) {
            self.pauseBlock(self);
        }
    }
}

- (void)stop {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.avPlayer pause];
    });
}

- (void)setFullScreen:(BOOL)isFullScreen {
    self.isFullscreenMode = !isFullScreen;
    [self.videoView setFullScreen:isFullScreen];
}

#pragma mark - Private Method
- (void)configPlayController {
    //    AVAsset *avAsset = [AVAsset assetWithURL:self.contentURL];
    //    self.avPlayerItem = [AVPlayerItem playerItemWithAsset:avAsset];
    self.avPlayerItem = [AVPlayerItem playerItemWithURL:self.contentURL];
    self.avPlayer = [AVPlayer playerWithPlayerItem:self.avPlayerItem];
    self.avPlayLayer = [AVPlayerLayer playerLayerWithPlayer:self.avPlayer];
    self.avPlayLayer.frame = self.view.bounds;
    [self.view.layer addSublayer:self.avPlayLayer];
}

- (void)configObserver {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playbackFinished:) name:AVPlayerItemDidPlayToEndTimeNotification object:nil];
    [self.avPlayerItem addObserver:self forKeyPath:@"status" options:(NSKeyValueObservingOptionNew) context:nil];
    //    [self.avPlayerItem addObserver:self forKeyPath:@"loadedTimeRanges" options:(NSKeyValueObservingOptionNew) context:nil];
    __weak typeof(self) weakSelf = self;
    self.avPlayerObserver = [self.avPlayer addPeriodicTimeObserverForInterval:CMTimeMake(1, 1)
                                                                        queue:dispatch_get_main_queue()
                                                                   usingBlock:^(CMTime time) {
                                                                       [weakSelf.videoView setProgressSliderCurrentPlayValue:CMTimeGetSeconds(time)];
                                                                       [weakSelf setTimeLabelValues:CMTimeGetSeconds(time) totalTime:weakSelf.duration];
                                                                   }];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey, id> *)change context:(void *)context {
    if ([keyPath isEqualToString:@"status"]) {
        if (self.avPlayerItem.status == AVPlayerStatusReadyToPlay) {
            [self startPlay];
            [self setProgressSliderMaxMinValues];
            [self.videoView autoFadeOutControlBar];
            if (self.startTime && self.startTime < floor(self.duration)) {
                [self.avPlayerItem seekToTime:CMTimeMake(self.startTime, 1)];
            }
        } else if (self.avPlayerItem.status == AVPlayerStatusFailed) {
            NSLog(@"%@", self.avPlayerItem.error);
        } else if (self.avPlayerItem.status == AVPlayerStatusUnknown) {
            NSLog(@"%@", self.avPlayerItem.error);
        }
    }
}

- (void)playbackFinished:(NSNotification *)notification {
    NSLog(@"视频播放完成通知");
    [self.avPlayerItem seekToTime:kCMTimeZero]; // item 跳转到初始
    //[_player play]; // 循环播放
    [self pause];

    if (self.finishBlock) {
        self.finishBlock(self);
    }
}


#pragma mark - ABCVideoPlayerControlViewDelegate
- (void)didTapPlayerControlViewPlayButton {
    [self startPlay];
}

- (void)didTapPlayerControlViewPauseButton {
    [self pause];
}

- (void)didTapPlayerControlViewCloseButton {
    [self dismiss:YES];
//    [self.navigationController popViewControllerAnimated:YES];
    //发个通知
    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeButtonClick" object:self userInfo:nil];
}

- (void)didTapPlayerControlViewFullScreenButton {
    if (self.isFullscreenMode) {
        return;
    }
    [[UIApplication sharedApplication] setStatusBarHidden:YES withAnimation:UIStatusBarAnimationFade];

    self.originFrame = self.view.frame;
    CGFloat height = [[UIScreen mainScreen] bounds].size.width;
    CGFloat width = [[UIScreen mainScreen] bounds].size.height;
    CGRect frame = CGRectMake((height - width) / 2, (width - height) / 2, width, height);
    [self.videoView changeBarHeight];

    [UIView animateWithDuration:0.3f
        animations:^{
            self.frame = frame;
            self.avPlayLayer.frame = (CGRect){CGPointZero, frame.size};
            [self.view setTransform:CGAffineTransformMakeRotation(M_PI_2)];
        }
        completion:^(BOOL finished) {
            self.isFullscreenMode = YES;

        }];
}

- (void)didTapPlayerControlViewShrinkScreenButton {
    if (!self.isFullscreenMode) {
        return;
    }

    [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];

    [self.videoView reloadBarHeight];
    [UIView animateWithDuration:0.3f
        animations:^{
            [self.view setTransform:CGAffineTransformIdentity];
            self.frame = self.originFrame;
            self.avPlayLayer.frame = (CGRect){CGPointZero, self.originFrame.size};
        }
        completion:^(BOOL finished) {
            self.isFullscreenMode = NO;
        }];
}

- (void)didChangePlayerControlViewProgressSliderValue:(UISlider *)slider {
    double currentTime = floor(slider.value);
    double totalTime = floor(self.duration);
    [self setTimeLabelValues:currentTime totalTime:totalTime];
    [self.avPlayerItem seekToTime:CMTimeMake(currentTime, 1)
                completionHandler:^(BOOL finished) {
                    [self.videoView autoFadeOutControlBar];
                    [self setTimeLabelValues:currentTime totalTime:totalTime];
                    [self startPlay];
                }];
}

- (void)didChangedPlaybackTime:(CGFloat)time totalTime:(CGFloat)totalTime {
    NSTimeInterval playBackTime = floor(time) + self.currentPlaybackTime;
    if (playBackTime <= 0) {
        playBackTime = 0;
    }
    if (playBackTime >= totalTime) {
        playBackTime = totalTime;
    }
    [self.avPlayerItem seekToTime:CMTimeMake(playBackTime, 1)
                completionHandler:^(BOOL finished) {
                    [self.videoView autoFadeOutControlBar];
                    [self setTimeLabelValues:playBackTime totalTime:totalTime];
                    [self startPlay];
                }];
}

- (void)didDoubleTapPlayerControlView:(BOOL)isStop {
    if (isStop) {
        [self pause];
    } else {
        [self startPlay];
    }
}

#pragma mark - Private Method
- (void)setTimeLabelValues:(double)currentTime totalTime:(double)totalTime {
    double minutesElapsed = floor(currentTime / 60.0);
    double secondsElapsed = fmod(currentTime, 60.0);
    NSString *timeElapsedString = [NSString stringWithFormat:@"%02.0f:%02.0f", minutesElapsed, secondsElapsed];
    double minutesRemaining = floor(totalTime / 60.0);
    ;
    double secondsRemaining = floor(fmod(totalTime, 60.0));
    ;
    NSString *timeRmainingString = [NSString stringWithFormat:@"%02.0f:%02.0f", minutesRemaining, secondsRemaining];

    [self.videoView setTimeLabelText:[NSString stringWithFormat:@"%@/%@", timeElapsedString, timeRmainingString]];
}

- (void)setProgressSliderMaxMinValues {
    CGFloat duration = self.duration;
    [self.videoView setProgressSliderDuringPlayValue:floorf(duration)];
}

#pragma mark - Setter&&Getter

- (KNBVideoPlayerView *)videoView {
    if (!_videoView) {
        _videoView = [[KNBVideoPlayerView alloc] initWithFrame:self.view.bounds];
        _videoView.title = self.videoTitle;
        _videoView.delegate = self;
    }
    return _videoView;
}

- (void)setFrame:(CGRect)frame {
    [self.view setFrame:frame];
    [self.videoView setFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
    [self.videoView setNeedsLayout];
    [self.videoView layoutIfNeeded];
}

- (NSTimeInterval)currentPlaybackTime {
    NSTimeInterval current = CMTimeGetSeconds(self.avPlayerItem.currentTime);
    if (isnan(current)) {
        return 0;
    }
    return current;
}

- (NSTimeInterval)duration {
    NSTimeInterval duration = CMTimeGetSeconds(self.avPlayerItem.duration);
    if (isnan(duration)) {
        return 0;
    }
    return duration;
}

@end
