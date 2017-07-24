//
//  KNBVideoPlayerAlertView.m
//  KenuoTraining
//
//  Created by Robert on 16/3/2.
//  Copyright © 2016年 Robert. All rights reserved.
//

#import "KNBVideoPlayerAlertView.h"
#import "Masonry.h"

static NSString *const KNBVideoPlayerVolume = @"video-player-volume";
static NSString *const KNBVideoPlayerVolumeShut = @"video-player-volume－Shut";
static NSString *const KNBVideoPlayerBrightness = @"video-player-brightness";
static NSString *const KNBVideoPlayerProgressLeft = @"video-player-progress-left";
static NSString *const KNBVideoPlayerProgressRight = @"video-player-progress-right";

static const NSUInteger ABCVideoAlertFontSize = 23;


@interface KNBVideoPlayerAlertView ()

@property (nonatomic, strong) UIImageView *imageView;

@end


@implementation KNBVideoPlayerAlertView

- (instancetype)initWithType:(KNBVideoAlertType)type {
    if (self = [super init]) {
        self.backgroundColor = [UIColor blackColor];
        self.alpha = 0.8;
        self.type = type;
        [self addSubview:self.imageView];
        [self addSubview:self.titleLabel];
    }
    return self;
}

- (UIImageView *)imageView {
    if (!_imageView) {
        _imageView = [[UIImageView alloc] init];
    }
    return _imageView;
}

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.font = [UIFont boldSystemFontOfSize:ABCVideoAlertFontSize];
        _titleLabel.textColor = [UIColor whiteColor];
        _titleLabel.backgroundColor = [UIColor clearColor];
    }
    return _titleLabel;
}

- (void)setType:(KNBVideoAlertType)type {
    if (_type && _type == type) {
        return;
    } else {
        _type = type;
        switch (self.type) {
            case KNBVideoAlertTypeVolume:
                self.imageView.image = [UIImage imageNamed:KNBVideoPlayerVolume];
                break;
            case KNBVideoAlertTypeVolumeShut:
                self.imageView.image = [UIImage imageNamed:KNBVideoPlayerVolumeShut];
                break;
            case KNBVideoAlertTypeBrightness:
                self.imageView.image = [UIImage imageNamed:KNBVideoPlayerBrightness];
                break;
            case KNBVideoAlertTypeProgressLeft:
                self.imageView.image = [UIImage imageNamed:KNBVideoPlayerProgressLeft];
                break;
            case KNBVideoAlertTypeProgressRight:
                self.imageView.image = [UIImage imageNamed:KNBVideoPlayerProgressRight];
                break;
            default:
                break;
        }
    }
}

#pragma mark - Masonry
+ (BOOL)requiresConstraintBasedLayout {
    return YES;
}

- (void)updateConstraints {
    __weak typeof(self) weakSelf = self;

    [_imageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(weakSelf.mas_left);
        make.centerY.mas_equalTo(weakSelf.mas_centerY);
    }];

    [_titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(weakSelf.imageView.mas_right).offset(5);
        make.centerY.mas_equalTo(weakSelf.mas_centerY);
    }];

    [super updateConstraints];
}

@end
