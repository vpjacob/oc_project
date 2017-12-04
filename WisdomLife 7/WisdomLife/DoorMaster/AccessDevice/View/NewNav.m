//
//  NewNav.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/7.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "NewNav.h"

@implementation NewNav

- (id)initWithTitle:(NSString *)title
{
    self = [super init];
    if (self) {
        self.frame = CGRectMake(0, 0, kDeviceWidth, kNavBarHeight);
        self.backgroundColor = [UIColor clearColor];
        
        UILabel *label;
        if (kDeviceHeight == 812.0){
            label = [[UILabel alloc] initWithFrame:CGRectMake((kDeviceWidth-kCurrentWidth(150))/2, kCurrentWidth(15) + 15, kCurrentWidth(150), 44)];
        }else{
            label = [[UILabel alloc] initWithFrame:CGRectMake((kDeviceWidth-kCurrentWidth(150))/2, kCurrentWidth(15), kCurrentWidth(150), 44)];
        }
        label.textColor = kBlackColor;
        label.text = title;
        label.font = [UIFont systemFontOfSize:15];
        label.textAlignment = NSTextAlignmentCenter;
        self.titleLB = label;
        [self addSubview:label];
        
        _escBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        if (kDeviceHeight == 812.0){
            _escBtn.frame = CGRectMake(0, 15, 64, 64);
        }else{
            _escBtn.frame = CGRectMake(0, 0, 64, 64);
        }
        [_escBtn setImage:[UIImage scaleImage:[UIImage imageNamed:@"关闭"] toSize:CGSizeMake(20, 20)] forState:UIControlStateNormal];
        _escBtn.imageEdgeInsets = UIEdgeInsetsMake(20, 0, 0, 0);
        [self addSubview:_escBtn];
        
        _exitBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _exitBtn.frame = CGRectMake(kDeviceWidth - 64, kNavBarHeight - 64, 64, 64);
        [_exitBtn setImage:[UIImage scaleImage:[UIImage imageNamed:@"退出"] toSize:CGSizeMake(20, 20)] forState:UIControlStateNormal];
        _exitBtn.imageEdgeInsets = UIEdgeInsetsMake(20, 0, 0, 0);
        _exitBtn.hidden = YES;
        [self addSubview:_exitBtn];
    }
    return self;
}

-(void)showExitBtn
{
    _exitBtn.hidden = NO;
}

-(void)hideEscBtn
{
    _escBtn.hidden = YES;
}

-(void)setTitleAlpha:(float)alpha
{
    self.titleLB.alpha = alpha;
}

-(void)setTitle:(NSString *)title
{
    self.titleLB.text = title;
}

@end
