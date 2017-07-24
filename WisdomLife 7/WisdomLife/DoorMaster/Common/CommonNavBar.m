//
//  CommonNavBar.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/10/29.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "CommonNavBar.h"

@interface CommonNavBar ()

@property (nonatomic,strong)UILabel *titleLbl;

@end

@implementation CommonNavBar

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        [self addSubview:self.backBtn];
        
    }
    return self;
}

- (void)setTitle:(NSString *)title
{
    self.titleLbl.text = title;
    CGSize size = [self.titleLbl.text sizeWithFont:kSystem(17) maxSize:CGSizeMake(kDeviceWidth, kNavBarHeight)];
    self.titleLbl.frame = CGRectMake((kDeviceWidth-size.width)/2,(44-size.height)/2+20 , size.width, size.height);
    [self addSubview:self.titleLbl];
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] initWithFrame:CGRectZero];
        _titleLbl.textColor = [UIColor colorWithHexString:@"4d4d4d"];
    }
    return _titleLbl;
}

- (UIButton *)backBtn
{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _backBtn.frame = CGRectMake(12, 24, 30, 36);
        [_backBtn setImage:[UIImage imageNamed:@"nav_back"] forState:UIControlStateNormal];
    }
    return _backBtn;
}

@end
