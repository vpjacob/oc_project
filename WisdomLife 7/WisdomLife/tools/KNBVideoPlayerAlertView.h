//
//  KNBVideoPlayerAlertView.h
//  KenuoTraining
//
//  Created by Robert on 16/3/2.
//  Copyright © 2016年 Robert. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSUInteger, KNBVideoAlertType) {
    KNBVideoAlertTypeVolume,
    KNBVideoAlertTypeVolumeShut,
    KNBVideoAlertTypeBrightness,
    KNBVideoAlertTypeProgressLeft,
    KNBVideoAlertTypeProgressRight
};


@interface KNBVideoPlayerAlertView : UIView

@property (nonatomic, assign) KNBVideoAlertType type;

@property (nonatomic, strong) UILabel *titleLabel;

- (instancetype)initWithType:(KNBVideoAlertType)type;

@end
