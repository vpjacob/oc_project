//
//  KNBVideoPlayerView.h
//  KenuoTraining
//
//  Created by Robert on 16/3/2.
//  Copyright © 2016年 Robert. All rights reserved.
//

@protocol KNBVideoPlayerViewDelegate <NSObject>

- (void)didTapPlayerControlViewPlayButton;

- (void)didTapPlayerControlViewPauseButton;

- (void)didTapPlayerControlViewCloseButton;

- (void)didTapPlayerControlViewFullScreenButton;

- (void)didTapPlayerControlViewShrinkScreenButton;

- (void)didChangePlayerControlViewProgressSliderValue:(UISlider *)slider;

- (void)didDoubleTapPlayerControlView:(BOOL)isStop;

- (void)didChangedPlaybackTime:(CGFloat)time totalTime:(CGFloat)totalTime;

@optional
- (void)didTouchPlayerControlViewProgressSlide:(UISlider *)slider State:(UIControlEvents)state;

- (void)didChangePlaybackTimeBegin;

@end


@interface KNBVideoPlayerView : UIView

@property (nonatomic, weak) id<KNBVideoPlayerViewDelegate> delegate;

@property (nonatomic, copy) NSString *title;

- (void)animateHide;
- (void)animateShow;
- (void)autoFadeOutControlBar;
- (void)cancelAutoFadeOutControlBar;
- (void)playingVideo;
- (void)stopVideo;

- (void)setProgressSliderCurrentPlayValue:(double)value;
- (void)setProgressSliderDuringPlayValue:(double)value;
- (void)setTimeLabelText:(NSString *)time;
- (void)setActivityIndicatorViewAnimation:(BOOL)isOn;

- (void)changeBarHeight;
- (void)reloadBarHeight;
- (void)setFullScreen:(BOOL)isFullScreen;

@end
