//
//  QRCodeDetailView.m
//  DoorMaster
//
//  Created by 宏根 张 on 28/04/2017.
//  Copyright © 2017 zhiguo. All rights reserved.
//

#import "QRCodeDetailView.h"

@interface QRCodeDetailView ()

@property (nonatomic, strong) UILabel *tipLB;

@end

@implementation QRCodeDetailView

-(instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self addSubview:self.qrcodeImageView];
        [self addSubview:self.QQImageView];
        [self addSubview:self.WechatImageView];
        [self addSubview:self.tipLB];
    }
    return self;
}

-(UIImageView *)qrcodeImageView
{
    if (!_qrcodeImageView) {
        _qrcodeImageView = [[UIImageView alloc] initWithFrame:CGRectMake((kDeviceWidth - kCurrentHeight(200)) / 2.0, kCurrentHeight(70), kCurrentHeight(200), kCurrentHeight(200))];
    }
    return _qrcodeImageView;
}

-(UILabel *)tipLB
{
    if (!_tipLB) {
        _tipLB = [[UILabel alloc] initWithFrame:CGRectMake(10, kDeviceHeight - kCurrentWidth(160), kDeviceWidth, kCurrentWidth(20))];
        _tipLB.text = NSLocalizedString(@"touch_to_share", @"");
    }
    return _tipLB;
}

-(UIButton *)QQImageView
{
    if (!_QQImageView) {
        _QQImageView = [UIButton buttonWithType:UIButtonTypeCustom];
        _QQImageView.frame = CGRectMake(kCurrentWidth(40), kDeviceHeight - kCurrentWidth(120), kCurrentWidth(80), kCurrentWidth(80));
        [_QQImageView setImage:[UIImage imageNamed:@"qq"] forState:UIControlStateNormal];
    }
    return _QQImageView;
}

-(UIButton *)WechatImageView
{
    if (!_WechatImageView) {
        _WechatImageView = [UIButton buttonWithType:UIButtonTypeCustom];
        _WechatImageView.frame = CGRectMake(kDeviceWidth - kCurrentWidth(120), kDeviceHeight - kCurrentWidth(120), kCurrentWidth(80), kCurrentWidth(80));
        [_WechatImageView setImage:[UIImage imageNamed:@"wechat"] forState:UIControlStateNormal];
    }
    return _WechatImageView;
}

@end
