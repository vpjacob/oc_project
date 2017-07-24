//
//  DoorListViewCell.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/1.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "DoorListViewCell.h"
#import "LoginDto.h"
#import "DeviceManager.h"
#import "Masonry.h"

@implementation DoorListViewCell

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = kWhiteColor;
        [self addSubview:self.doorImg];
        [self addSubview:self.titleLbl];
        self.layer.borderWidth = 1;
        self.layer.borderColor = [UIColor colorWithHexString:@"dddddd"].CGColor;
    }
    return self;
}

#pragma mark - Layout
+ (BOOL)requiresConstraintBasedLayout{
    return true;
}

- (void)updateConstraints{
    
    [self.titleLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self);
        make.bottom.mas_equalTo(self).offset(-30);
    }];
    
    [self.doorImg mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self);
        make.top.mas_offset(29);
    }];
    
    [super updateConstraints];
}

- (void)setDataWith:(NSInteger)index
{
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:index];
    self.titleLbl.text = [NSString stringWithFormat:@"%@",dto.dev_name];
}

- (UIImageView *)doorImg
{
    if (!_doorImg) {
        _doorImg = [[UIImageView alloc] init];
        _doorImg.image = [UIImage imageNamed:@"vidio_pic"];
    }
    return _doorImg;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
        _titleLbl.font = kSystem(14);
        _titleLbl.text = @"五和大道35号1栋1单元前门";
        _titleLbl.numberOfLines = 2;
    }
    return _titleLbl;
}

@end
