//
//  KNBVideoPlayerController.h
//  KenuoTraining
//
//  Created by Robert on 16/3/2.
//  Copyright © 2016年 Robert. All rights reserved.
//


@interface KNBVideoPlayerController : UIViewController

/**
 *  视频隐藏回调
 */
@property (nonatomic, copy) void (^dismissCompleteBlock)(KNBVideoPlayerController *videoPlayer);

/**
 *  开始回调
 */
@property (nonatomic, copy) void (^startBlock)(KNBVideoPlayerController *videoPlayer);

/**
 *  暂停回调
 */
@property (nonatomic, copy) void (^pauseBlock)(KNBVideoPlayerController *videoPlayer);

/**
 *  播放结束回调
 */
@property (nonatomic, copy) void (^finishBlock)(KNBVideoPlayerController *videoPlayer);

/**
 *  视频开始时间
 */
@property (nonatomic, assign) double startTime;

/**
 视频观看时长
 */
@property (nonatomic, assign, readonly) NSTimeInterval currentPlaybackTime;

/**
 视频总时长
 */
@property (nonatomic, assign, readonly) NSTimeInterval duration;


- (instancetype)initWithFrame:(CGRect)frame title:(NSString *)title url:(NSURL *)url;

- (void)showInWindow;

- (void)dismiss:(BOOL)animated;

- (void)startPlay;

- (void)pause;

- (void)stop;

/**
 设置横屏
 */
- (void)setFullScreen:(BOOL)isFullScreen;

@end
