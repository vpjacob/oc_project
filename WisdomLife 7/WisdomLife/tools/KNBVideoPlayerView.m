//
//  KNBVideoPlayerView.m
//  KenuoTraining
//
//  Created by Robert on 16/3/2.
//  Copyright © 2016年 Robert. All rights reserved.
//

#import "KNBVideoPlayerView.h"
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MPVolumeView.h>
#import "KNBVideoPlayerAlertView.h"
#import "Masonry.h"

static CGFloat kVideoControlBarHeight = 30.0;
static const CGFloat kVideoControlAnimationTimeinterval = 0.3;
static const CGFloat kVideoControlTimeLabelFontSize = 10.0;
static const CGFloat kVideoControlBarAutoFadeOutTimeinterval = 5.0;
static const CGFloat KVideoOffSet = 0.2;
static const CGFloat KVideoGap = 20.0;
static const CGFloat KVideoInset = 8.0;

static NSString *const KNBVideoPlayerClose = @"video-player-close";
static NSString *const KNBVideoPlayerPlay = @"video-player-play";
static NSString *const KNBVideoPlayerPause = @"video-player-pause";
static NSString *const KNBVideoPlayerFullscreen = @"video-player-fullscreen";
static NSString *const KNBVideoPlayerShrinkscreen = @"video-player-shrinkscreen";
static NSString *const KNBVideoPlayerPoint = @"video-player-point";


@interface KNBVideoPlayerView ()

@property (nonatomic, strong) UIView *topBar;
@property (nonatomic, strong) UIView *bottomBar;
@property (nonatomic, strong) UIView *displayView;
@property (nonatomic, strong) UIButton *playButton;
@property (nonatomic, strong) UIButton *pauseButton;
@property (nonatomic, strong) UIButton *fullScreenButton;
@property (nonatomic, strong) UIButton *shrinkScreenButton;
@property (nonatomic, strong) UISlider *progressSlider;
@property (nonatomic, strong) UIButton *closeButton;
@property (nonatomic, strong) UILabel *timeLabel;
@property (nonatomic, assign) BOOL isBarShowing;
@property (nonatomic, strong) UIActivityIndicatorView *indicatorView;
@property (nonatomic, strong) MPVolumeView *volumeView;
@property (nonatomic, strong) UISlider *MPVolumeSlider;
@property (nonatomic, assign) CGFloat systemVolume;
@property (nonatomic, assign) CGFloat systemBrightness;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, assign) CGPoint beginPoint;
@property (nonatomic, assign) CGFloat currentProgress;
@property (nonatomic, strong) KNBVideoPlayerAlertView *alertView;
@property (nonatomic, assign) BOOL isFullScreen;
@property (nonatomic, assign) BOOL isMoving;
@property (nonatomic, assign) CGFloat deltaX;
@property (nonatomic, assign) CGFloat deltaY;

@end


@implementation KNBVideoPlayerView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor clearColor];

        //顶边栏
        [self addSubview:self.topBar];

        //底边栏
        [self addSubview:self.bottomBar];

        //显示视图
        [self addSubview:self.displayView];

        //音量视图
        [self addSubview:self.volumeView];


        [self addAction];
    }
    return self;
}

- (void)addAction {
    [self.playButton addTarget:self action:@selector(playButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.pauseButton addTarget:self action:@selector(pauseButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.closeButton addTarget:self action:@selector(closeButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.fullScreenButton addTarget:self action:@selector(fullScreenButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.shrinkScreenButton addTarget:self action:@selector(shrinkScreenButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.progressSlider addTarget:self action:@selector(progressSliderValueChanged:) forControlEvents:UIControlEventValueChanged];
    [self.progressSlider addTarget:self action:@selector(progressSliderTouchBegan:) forControlEvents:UIControlEventTouchDown];
    [self.progressSlider addTarget:self action:@selector(progressSliderTouchEnded:) forControlEvents:UIControlEventTouchUpInside | UIControlEventTouchUpOutside | UIControlEventTouchDragInside | UIControlEventTouchDragOutside];

    UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(oneTap:)];

    UITapGestureRecognizer *doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(doubleTap:)];
    doubleTapGesture.numberOfTapsRequired = 2;

    [self addGestureRecognizer:tapGesture];
    [self addGestureRecognizer:doubleTapGesture];

    [[AVAudioSession sharedInstance] setActive:YES error:nil];
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];
    self.isBarShowing = YES;
}

- (void)animateHide {
    if (!self.isBarShowing) {
        return;
    }
    [UIView animateWithDuration:kVideoControlAnimationTimeinterval
        animations:^{
            self.topBar.alpha = 0.0;
            self.bottomBar.alpha = 0.0;
        }
        completion:^(BOOL finished) {
            self.isBarShowing = NO;
        }];
}

- (void)animateShow {
    if (self.isBarShowing) {
        return;
    }
    [UIView animateWithDuration:kVideoControlAnimationTimeinterval
        animations:^{
            self.topBar.alpha = 1.0;
            self.bottomBar.alpha = 1.0;
        }
        completion:^(BOOL finished) {
            self.isBarShowing = YES;
            [self autoFadeOutControlBar];
        }];
}

- (void)autoFadeOutControlBar {
    if (!self.isBarShowing) {
        return;
    }
    /// 停止菊花
    [self setActivityIndicatorViewAnimation:false];

    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(animateHide) object:nil];
    [self performSelector:@selector(animateHide) withObject:nil afterDelay:kVideoControlBarAutoFadeOutTimeinterval];
}

- (void)cancelAutoFadeOutControlBar {
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(animateHide) object:nil];
}

- (void)playingVideo {
    self.pauseButton.hidden = NO;
    self.playButton.hidden = YES;
    [self.indicatorView stopAnimating];
}

- (void)stopVideo {
    self.pauseButton.hidden = YES;
    self.playButton.hidden = NO;
}

- (void)setProgressSliderCurrentPlayValue:(double)value {
    self.progressSlider.value = ceil(value);
}

- (void)setProgressSliderDuringPlayValue:(double)value {
    self.progressSlider.minimumValue = 0.f;
    self.progressSlider.maximumValue = value;
}

- (void)setTimeLabelText:(NSString *)time {
    self.timeLabel.text = time;
}

- (void)setActivityIndicatorViewAnimation:(BOOL)isOn {
    if (isOn) {
        [self.indicatorView startAnimating];
    } else {
        [self.indicatorView stopAnimating];
    }
}

- (void)changeBarHeight {
    kVideoControlBarHeight = 50;
    [self setNeedsUpdateConstraints];
}

- (void)reloadBarHeight {
    kVideoControlBarHeight = 30;
    [self setNeedsUpdateConstraints];
}

- (void)setFullScreen:(BOOL)isFullScreen {
    if (isFullScreen) {
        [self fullScreenButtonClick];
    } else {
        [self shrinkScreenButtonClick];
    }
}

#pragma mark - Setter&&Getter

- (UIView *)topBar {
    if (!_topBar) {
        _topBar = [[UIView alloc] init];
        _topBar.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.3];

        [_topBar addSubview:self.closeButton];
        [_topBar addSubview:self.titleLabel];
    }
    return _topBar;
}

- (UIButton *)closeButton {
    if (!_closeButton) {
        _closeButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _closeButton.imageEdgeInsets = UIEdgeInsetsMake(KVideoInset, KVideoInset, KVideoInset, KVideoInset);
        [_closeButton setImage:[UIImage imageNamed:KNBVideoPlayerClose] forState:UIControlStateNormal];
    }
    return _closeButton;
}

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [UIColor whiteColor];
        _titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        _titleLabel.font = [UIFont systemFontOfSize:16];
    }
    return _titleLabel;
}

- (UIView *)bottomBar {
    if (!_bottomBar) {
        _bottomBar = [UIView new];
        _bottomBar.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.3];

        [self.bottomBar addSubview:self.playButton];
        [self.bottomBar addSubview:self.pauseButton];
        [self.bottomBar addSubview:self.fullScreenButton];
        [self.bottomBar addSubview:self.shrinkScreenButton];
        [self.bottomBar addSubview:self.progressSlider];
        [self.bottomBar addSubview:self.timeLabel];
    }
    return _bottomBar;
}

- (UIButton *)playButton {
    if (!_playButton) {
        _playButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _pauseButton.imageEdgeInsets = UIEdgeInsetsMake(KVideoInset * 3, KVideoInset * 3, KVideoInset * 3, KVideoInset * 3);
        [_playButton setImage:[UIImage imageNamed:KNBVideoPlayerPlay] forState:UIControlStateNormal];
    }
    return _playButton;
}

- (UIButton *)pauseButton {
    if (!_pauseButton) {
        _pauseButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _pauseButton.imageEdgeInsets = UIEdgeInsetsMake(KVideoInset * 3, KVideoInset * 3, KVideoInset * 3, KVideoInset * 3);
        [_pauseButton setImage:[UIImage imageNamed:KNBVideoPlayerPause] forState:UIControlStateNormal];
        _pauseButton.hidden = YES;
    }
    return _pauseButton;
}

- (UIButton *)fullScreenButton {
    if (!_fullScreenButton) {
        _fullScreenButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _fullScreenButton.imageEdgeInsets = UIEdgeInsetsMake(KVideoInset, KVideoInset, KVideoInset, KVideoInset);
        [_fullScreenButton setImage:[UIImage imageNamed:KNBVideoPlayerFullscreen] forState:UIControlStateNormal];
    }
    return _fullScreenButton;
}

- (UIButton *)shrinkScreenButton {
    if (!_shrinkScreenButton) {
        _shrinkScreenButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _shrinkScreenButton.imageEdgeInsets = UIEdgeInsetsMake(KVideoInset, KVideoInset, KVideoInset, KVideoInset);
        [_shrinkScreenButton setImage:[UIImage imageNamed:KNBVideoPlayerShrinkscreen] forState:UIControlStateNormal];
        _shrinkScreenButton.hidden = YES;
    }
    return _shrinkScreenButton;
}

- (UISlider *)progressSlider {
    if (!_progressSlider) {
        _progressSlider = [[UISlider alloc] init];
        [_progressSlider setThumbImage:[UIImage imageNamed:KNBVideoPlayerPoint] forState:UIControlStateNormal];
        [_progressSlider setMinimumTrackTintColor:[UIColor whiteColor]];
        [_progressSlider setMaximumTrackTintColor:[UIColor lightGrayColor]];
        _progressSlider.value = 0.f;
        _progressSlider.continuous = YES;
    }
    return _progressSlider;
}

- (UILabel *)timeLabel {
    if (!_timeLabel) {
        _timeLabel = [UILabel new];
        _timeLabel.backgroundColor = [UIColor clearColor];
        _timeLabel.font = [UIFont systemFontOfSize:kVideoControlTimeLabelFontSize];
        _timeLabel.textColor = [UIColor whiteColor];
        _timeLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _timeLabel;
}

- (UIView *)displayView {
    if (!_displayView) {
        _displayView = [[UIView alloc] init];
        _displayView.backgroundColor = [UIColor clearColor];
        [_displayView addSubview:self.indicatorView];
        [_displayView addSubview:self.alertView];
    }
    return _displayView;
}

- (UIActivityIndicatorView *)indicatorView {
    if (!_indicatorView) {
        _indicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite];
        [_indicatorView stopAnimating];
    }
    return _indicatorView;
}

- (MPVolumeView *)volumeView {
    if (!_volumeView) {
        _volumeView = [[MPVolumeView alloc] init];
        _volumeView.frame = CGRectMake(kDeviceWidth * 2, kDeviceHeight * 2, 0, 0);
        for (UIView *view in [_volumeView subviews]) {
            if ([view.class.description isEqualToString:@"MPVolumeSlider"]) {
                self.MPVolumeSlider = (UISlider *)view;
                break;
            }
        }
        //        float systemVolume = self.MPVolumeSlider.value;
        float systemVolume = [[AVAudioSession sharedInstance] outputVolume];

        [self.MPVolumeSlider setValue:systemVolume animated:NO];

        [self.MPVolumeSlider sendActionsForControlEvents:UIControlEventTouchUpInside];
    }
    return _volumeView;
}

- (KNBVideoPlayerAlertView *)alertView {
    if (!_alertView) {
        _alertView = [[KNBVideoPlayerAlertView alloc] initWithType:KNBVideoAlertTypeVolume];
        _alertView.hidden = YES;
    }
    return _alertView;
}


- (void)setTitle:(NSString *)title {
    _title = [title copy];
    self.titleLabel.text = _title;
}

#pragma mark - Action

- (void)playButtonClick {
    [self playingVideo];
    if (_delegate && [_delegate respondsToSelector:@selector(didTapPlayerControlViewPlayButton)]) {
        [_delegate didTapPlayerControlViewPlayButton];
    }
}

- (void)pauseButtonClick {
    [self stopVideo];
    if (_delegate && [_delegate respondsToSelector:@selector(didTapPlayerControlViewPauseButton)]) {
        [_delegate didTapPlayerControlViewPauseButton];
    }
}

- (void)closeButtonClick {
    //    添加关闭横屏操作通知
    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeButtonClick" object:self userInfo:nil];
    self.isFullScreen = NO;
    if (_delegate && [_delegate respondsToSelector:@selector(didTapPlayerControlViewCloseButton)]) {
        [_delegate didTapPlayerControlViewCloseButton];
    }
}

- (void)fullScreenButtonClick {
    self.fullScreenButton.hidden = YES;

    //    在此处让输入框消失
    //    添加进行横屏操作通知
    [[NSNotificationCenter defaultCenter] postNotificationName:@"fullScreenButtonClick" object:self userInfo:nil];

    self.shrinkScreenButton.hidden = NO;
    self.isFullScreen = YES;
    if (_delegate && [_delegate respondsToSelector:@selector(didTapPlayerControlViewFullScreenButton)]) {
        [_delegate didTapPlayerControlViewFullScreenButton];
    }
}

- (void)shrinkScreenButtonClick {
    self.fullScreenButton.hidden = NO;
    [[NSNotificationCenter defaultCenter] postNotificationName:@"shrinkScreenButtonClick" object:self userInfo:nil];
    self.shrinkScreenButton.hidden = YES;
    self.isFullScreen = NO;
    if (_delegate && [_delegate respondsToSelector:@selector(didTapPlayerControlViewShrinkScreenButton)]) {
        [_delegate didTapPlayerControlViewShrinkScreenButton];
    }
}

- (void)progressSliderTouchBegan:(UISlider *)slider {
    if (_delegate && [_delegate respondsToSelector:@selector(didTouchPlayerControlViewProgressSlide:State:)]) {
        [_delegate didTouchPlayerControlViewProgressSlide:slider State:UIControlEventTouchDown];
    }
}

- (void)progressSliderTouchEnded:(UISlider *)slider {
    if (_delegate && [_delegate respondsToSelector:@selector(didTouchPlayerControlViewProgressSlide:State:)]) {
        [_delegate didTouchPlayerControlViewProgressSlide:slider State:UIControlEventTouchUpInside];
    }
}

- (void)progressSliderValueChanged:(UISlider *)slider {
    if (_delegate && [_delegate respondsToSelector:@selector(didChangePlayerControlViewProgressSliderValue:)]) {
        [_delegate didChangePlayerControlViewProgressSliderValue:slider];
    }
}

- (void)oneTap:(UITapGestureRecognizer *)gesture {
    if (gesture.state == UIGestureRecognizerStateRecognized) {
        if (self.isBarShowing) {
            [self animateHide];
        } else {
            [self animateShow];
        }
    }
}

- (void)doubleTap:(UITapGestureRecognizer *)gesture {
    [self animateShow];
    [self stopVideo];
    if (_delegate && [_delegate respondsToSelector:@selector(didDoubleTapPlayerControlView:)]) {
        [_delegate didDoubleTapPlayerControlView:_isBarShowing];
    }
}

#pragma mark - Masonry
+ (BOOL)requiresConstraintBasedLayout {
    return YES;
}

- (void)updateConstraints {
    __weak typeof(self) weakSelf = self;
    [_topBar mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(weakSelf.mas_top);
        make.left.and.right.mas_equalTo(weakSelf);
        make.width.mas_equalTo(weakSelf.mas_width);
        make.height.mas_equalTo(kVideoControlBarHeight);
    }];

    [_bottomBar mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_equalTo(weakSelf.mas_bottom);
        make.left.and.right.mas_equalTo(weakSelf);
        make.width.mas_equalTo(weakSelf.mas_width);
        make.height.mas_equalTo(kVideoControlBarHeight);
    }];

    [_playButton mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(weakSelf.bottomBar.mas_left).offset(KVideoGap);
        make.centerY.mas_equalTo(weakSelf.bottomBar.mas_centerY);
        make.width.and.height.mas_equalTo(@(16 + KVideoInset * 6));
    }];

    [_pauseButton mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(weakSelf.bottomBar.mas_left).offset(KVideoGap);
        make.centerY.mas_equalTo(weakSelf.bottomBar.mas_centerY);
        make.width.and.height.mas_equalTo(@(16 + KVideoInset * 6));
    }];

    [_fullScreenButton mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(weakSelf.bottomBar.mas_right).offset(-KVideoGap);
        make.centerY.mas_equalTo(weakSelf.bottomBar.mas_centerY);
        make.width.and.height.mas_equalTo(@(19 + KVideoInset * 2));
    }];

    [_shrinkScreenButton mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(weakSelf.bottomBar.mas_right).offset(-KVideoGap);
        make.centerY.mas_equalTo(weakSelf.bottomBar.mas_centerY);
        make.width.and.height.mas_equalTo(@(19 + KVideoInset * 2));
    }];

    [_progressSlider mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(weakSelf.playButton.mas_right).offset(KVideoGap);
        make.right.mas_equalTo(weakSelf.fullScreenButton.mas_left).offset(-KVideoGap);
        make.centerY.mas_equalTo(weakSelf.bottomBar.mas_centerY);
    }];

    [_timeLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_equalTo(weakSelf.progressSlider.mas_top).offset(3);
        make.centerX.mas_equalTo(weakSelf.progressSlider.mas_centerX);
        make.width.mas_equalTo(weakSelf.progressSlider.mas_width);
        make.height.mas_equalTo(kVideoControlTimeLabelFontSize);
    }];

    [_closeButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(weakSelf.topBar.mas_right).offset(-KVideoGap);
        make.centerY.mas_equalTo(weakSelf.topBar.mas_centerY);
        make.width.and.height.mas_equalTo(@(15 + KVideoInset * 2));
    }];

    [_titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(weakSelf.topBar.mas_left).offset(20);
        make.top.mas_equalTo(weakSelf.topBar.mas_top).offset(8);
        make.width.mas_equalTo(weakSelf.mas_width).multipliedBy(0.5);
    }];

    [_displayView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(weakSelf.topBar.mas_bottom);
        make.bottom.mas_equalTo(weakSelf.bottomBar.mas_top);
        make.left.and.right.mas_equalTo(weakSelf);
    }];

    //    [_volumeView mas_makeConstraints:^(MASConstraintMaker *make) {
    //        make.right.mas_equalTo(weakSelf.mas_left).offset(1000);
    //        make.width.and.height.mas_equalTo(weakSelf.height / 3);
    //    }];

    [_indicatorView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.mas_equalTo(weakSelf.displayView);
    }];

    [_alertView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.mas_equalTo(weakSelf.displayView);
    }];


    [super updateConstraints];
}

#pragma mark - Touch
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    if (!self.isFullScreen) {
        return;
    }

    [super touchesBegan:touches withEvent:event];

    UITouch *oneTouch = [touches anyObject];

    self.beginPoint = [oneTouch locationInView:oneTouch.view];
    self.systemVolume = [[AVAudioSession sharedInstance] outputVolume];
    self.systemBrightness = [[UIScreen mainScreen] brightness];
    self.currentProgress = self.progressSlider.value;
    self.isMoving = false;
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    if (!self.isFullScreen) {
        return;
    }

    if (_delegate && [_delegate respondsToSelector:@selector(didChangePlaybackTimeBegin)] && !self.isMoving) {
        self.isMoving = YES;
        [_delegate didChangePlaybackTimeBegin];
    }

    [super touchesMoved:touches withEvent:event];

    UITouch *oneTouch = [touches anyObject];

    CGPoint currentPoint = [oneTouch locationInView:oneTouch.view];

    CGFloat deltaX = currentPoint.x - self.beginPoint.x;
    CGFloat deltaY = currentPoint.y - self.beginPoint.y;
    float delta = 0.0f;

    self.alertView.hidden = NO;

    if (abs((int)deltaX) > abs((int)deltaY)) {
        //左右滑动
        delta = deltaX * KVideoOffSet;
        NSString *deltaString = nil;

        if (delta > 0.0f) {
            deltaString = [NSString stringWithFormat:@"+%d", (int)delta];
            self.alertView.type = KNBVideoAlertTypeProgressRight;
        } else {
            deltaString = [NSString stringWithFormat:@"%d", (int)delta];
            self.alertView.type = KNBVideoAlertTypeProgressLeft;
        }

        self.alertView.titleLabel.text = deltaString;
        self.deltaX = delta;
    } else {
        //上下滑动
        delta = -deltaY / (kDeviceWidth);
        self.deltaY = delta;
        if (self.beginPoint.x < kDeviceWidth / 2) {
            CGFloat changedBrightness = delta + self.systemBrightness > 0 ? delta + self.systemBrightness : 0;

            if (changedBrightness >= 1.0f) {
                changedBrightness = 1.0f;
            }

            self.alertView.type = KNBVideoAlertTypeBrightness;
            self.alertView.titleLabel.text = [NSString stringWithFormat:@"%02.0f%%", changedBrightness * 100];

            [[UIScreen mainScreen] setBrightness:changedBrightness];
        } else if (self.beginPoint.x >= kDeviceWidth / 2) {
            CGFloat changedVolume = delta + self.systemVolume > 0 ? delta + self.systemVolume : 0;

            if (changedVolume >= 1.0f) {
                changedVolume = 1.0f;
            }

            if (changedVolume == 0.0f) {
                self.alertView.type = KNBVideoAlertTypeVolumeShut;
            } else {
                self.alertView.type = KNBVideoAlertTypeVolume;
            }

            self.alertView.titleLabel.text = [NSString stringWithFormat:@"%02.0f%%", (changedVolume)*100];

            [self.MPVolumeSlider setValue:changedVolume animated:NO];
        }
    }
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    if (!self.isFullScreen) {
        return;
    }

    [super touchesCancelled:touches withEvent:event];

    [self hideAllAlertView];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    if (!self.isFullScreen) {
        return;
    }
    if (abs((int)self.deltaX) > abs((int)self.deltaY)) {
        self.progressSlider.value += self.deltaX / 100;
        if (_delegate && [_delegate respondsToSelector:@selector(didChangedPlaybackTime:totalTime:)]) {
            [_delegate didChangedPlaybackTime:self.deltaX totalTime:self.progressSlider.maximumValue];
        }
    }

    [super touchesEnded:touches withEvent:event];
    [self hideAllAlertView];
    self.deltaX = self.deltaY = 0.0f;
}

- (void)hideAllAlertView {
    if (!self.alertView.hidden) {
        self.alertView.hidden = YES;
    }
}

@end
