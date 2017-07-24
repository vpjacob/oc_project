//
//  KeyView.m
//  SmartDoor
//
//  Created by 宏根 张 on 13/11/2016.
//  Copyright © 2016 朱攀峰. All rights reserved.
//

#import "KeyView.h"

@implementation KeyView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
//        [self addSubview:self.escBtn];
        [self addSubview:self.openDoorBtn];
        [self addSubview:self.devListBtn];
        [self addSubview:self.doorListBtn];
        [self addSubview:self.backImage];
    }
    return self;
}

- (void)escBtnClcik
{
    self.hidden = YES;
}

#pragma mark - Setter && Getter
- (UIButton *)escBtn
{
    if (!_escBtn) {
        _escBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _escBtn.frame = CGRectMake((kDeviceWidth-kCurrentWidth(60))/2, kDeviceHeight-kCurrentWidth(84)-kCurrentWidth(25), kCurrentWidth(60), kCurrentWidth(60));
        [_escBtn setBackgroundImage:[UIImage imageNamed:@"cross"] forState:UIControlStateNormal];
        [_escBtn addTarget:self action:@selector(escBtnClcik) forControlEvents:UIControlEventTouchUpInside];
    }
    return _escBtn;
}

- (UIButton *)openDoorBtn
{
    if (!_openDoorBtn) {
        _openDoorBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _openDoorBtn.frame = CGRectMake((kDeviceWidth-kCurrentWidth(100))/2, self.escBtn.top-kCurrentWidth(140), kCurrentWidth(100), kCurrentWidth(100));
        [_openDoorBtn setTitle:NSLocalizedString(@"open_door", @"") forState:UIControlStateNormal];
        [_openDoorBtn setTitleColor:kWhiteColor forState:UIControlStateNormal];
        _openDoorBtn.titleLabel.numberOfLines = 2;
        _openDoorBtn.backgroundColor = [UIColor red:120 green:183 blue:255 alpha:1.f];
        _openDoorBtn.layer.cornerRadius = kCurrentWidth(50);
        _openDoorBtn.layer.masksToBounds = YES;
    }
    return _openDoorBtn;
}

- (UIButton *)devListBtn
{
    if (!_devListBtn) {
        _devListBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _devListBtn.frame = CGRectMake(self.escBtn.right+(kDeviceWidth-kCurrentWidth(230))/4, self.escBtn.top+(self.escBtn.height-kCurrentWidth(44))/2-kCurrentWidth(25), kCurrentWidth(85), kCurrentWidth(44));
        [_devListBtn setTitle:NSLocalizedString(@"guardList", @"") forState:UIControlStateNormal];
        [_devListBtn setTitleColor:kWhiteColor forState:UIControlStateNormal];
        _devListBtn.backgroundColor = [UIColor red:120 green:183 blue:255 alpha:1.f];
        _devListBtn.layer.cornerRadius = kCurrentWidth(2);
        _devListBtn.titleLabel.font = kSystem(15);
        _devListBtn.layer.masksToBounds = YES;
    }
    return _devListBtn;
}

- (UIButton *)doorListBtn
{
    if (!_doorListBtn) {
        _doorListBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _doorListBtn.frame = CGRectMake((kDeviceWidth-kCurrentWidth(230))/4, self.devListBtn.top, kCurrentWidth(85), kCurrentWidth(44));
        [_doorListBtn setTitle:NSLocalizedString(@"DoorVideo", @"") forState:UIControlStateNormal];
        [_doorListBtn setTitleColor:kWhiteColor forState:UIControlStateNormal];
        _doorListBtn.backgroundColor = [UIColor red:120 green:183 blue:255 alpha:1.f];
        _doorListBtn.layer.cornerRadius = kCurrentWidth(2);
        _doorListBtn.titleLabel.font = kSystem(15);
        _doorListBtn.layer.masksToBounds = YES;
    }
    return _doorListBtn;
}

- (UIImageView *)backImage
{
    if (!_backImage) {
        _backImage = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, (kDeviceWidth), self.openDoorBtn.top-kCurrentWidth(50))];
        _backImage.image = [UIImage imageNamed:@"m_20140903142520607940.jpg"];
    }
    return _backImage;
}

@end
