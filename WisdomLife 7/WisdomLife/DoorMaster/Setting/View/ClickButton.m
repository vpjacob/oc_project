//
//  ClickButton.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/6.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "ClickButton.h"
#import "UIImage+scale.h"

@interface ClickButton ()

@property (nonatomic) int bottomDistance;

@end

@implementation ClickButton

- (instancetype)initWithTitle:(NSString *)title normalImage:(NSString *)normalImage highlightedImage:(NSString *)highlightedImage withSize:(CGSize)size
{
    self = [super init];
    if (self) {
        self.width = 2*kDeviceWidth/3.0;
        self.height = kCurrentHeight(148);
        [self setTitle:title forState:UIControlStateNormal];
        [self setTitleColor:[UIColor colorWithHexString:@"626262"] forState:UIControlStateNormal];
        self.titleLabel.font = kSystem(13);
        self.titleLabel.alpha = 0.7;
        self.layer.borderColor = kBackgroundColor.CGColor;
        self.layer.borderWidth = 0.25;
        UIImage *normal = [UIImage imageNamed:normalImage];
        [self setImage:[UIImage scaleImage:normal toSize:size] forState:UIControlStateNormal];
//        [self setImage:[UIImage imageNamed:normalImage] forState:UIControlStateNormal];
        UIImage *highlighted = [UIImage imageNamed:highlightedImage];
        [self setImage:[UIImage scaleImage:highlighted toSize:size] forState:UIControlStateHighlighted];
//        [self setImage:[UIImage imageNamed:highlightedImage] forState:UIControlStateHighlighted];
        
        CGSize imageSize = self.imageView.frame.size;
        CGSize titleSize = self.titleLabel.frame.size;
        
        CGFloat totalHeight = (imageSize.height + titleSize.height + 6.0);
        
        if ([title isEqualToString:@"設備列表"]) { //上，左，下， 右
            self.imageEdgeInsets = UIEdgeInsetsMake(
                                                    - (totalHeight - imageSize.height), 0, 0.0, - titleSize.width-11);//iOS10
            self.titleEdgeInsets = UIEdgeInsetsMake(
                                                    0.0, - imageSize.width, - (totalHeight - titleSize.height)-6, 0.0);
        }
        if ([title isEqualToString:@"訪客通行證"]) {
            self.imageEdgeInsets = UIEdgeInsetsMake(
                                                    - (totalHeight - imageSize.height), -11, 0.0, - titleSize.width-11);//iOS10
            self.titleEdgeInsets = UIEdgeInsetsMake(
                                                    0.0, - imageSize.width, - (totalHeight - titleSize.height)-5, 0.0);
        }else
        {
            self.imageEdgeInsets = UIEdgeInsetsMake(
                                                    - (totalHeight - imageSize.height), -11, 0.0, - titleSize.width-11);//iOS10
        }
        self.titleEdgeInsets = UIEdgeInsetsMake(
                                                0.0, - imageSize.width, - (totalHeight - titleSize.height), 0.0);
        NSLog(@"%f", - (totalHeight - titleSize.height));
        if ([title isEqualToString:@"快鍵開鎖"] || [title isEqualToString:@"快捷开锁"] || [title isEqualToString:@"Quick Access"]) {
            self.imageEdgeInsets = UIEdgeInsetsMake(
                                                    - (totalHeight - imageSize.height), 10, 0.0, - titleSize.width-11);//iOS10
            
            [self.titleLabel removeFromSuperview];
            
            UILabel *titleLB = [[UILabel alloc] initWithFrame:CGRectMake((self.frame.size.width - 100)/2, self.frame.size.height - kCurrentHeight(25), 100, 20)];
            titleLB.text = title;
            titleLB.font = kSystem(13);
            titleLB.alpha = 0.7;
            titleLB.textColor = [UIColor colorWithHexString:@"626262"];
            titleLB.textAlignment = NSTextAlignmentCenter;
            [self addSubview:titleLB];
            
            
            
//            self.titleEdgeInsets = UIEdgeInsetsMake(
//                                                    0.0, - imageSize.width, -(kCurrentHeight(148)/2), 0.0);
//            NSLog(@"%f", - (totalHeight - titleSize.height));
//            CGRect frame = self.titleLabel.frame;
//            frame.origin.y = self.height - 10;
//            frame.origin.x = (self.width - frame.size.width) /2;
//            self.titleLabel.frame = frame;
        }
        [self addTarget:self action:@selector(touchUp:) forControlEvents:UIControlEventTouchUpInside];
    }
    return self;
}

//-(void)setFrame:(CGRect)frame
//{
//    [super setFrame:frame];
//    CGSize imageSize = self.imageView.frame.size;
//    CGSize titleSize = self.titleLabel.frame.size;
//    CGFloat totalHeight = (imageSize.height + titleSize.height + 6.0);
//    self.imageEdgeInsets = UIEdgeInsetsMake(
//                                            - (totalHeight - imageSize.height), 0.0, 0.0, - titleSize.width-11);//iOS10
//    self.titleEdgeInsets = UIEdgeInsetsMake(
//                                            0.0, - imageSize.width, - (totalHeight - titleSize.height), 0.0);
//}

- (void)touchUp:(UIButton *)sender
{
    if (_delegate && [_delegate respondsToSelector:@selector(getClickEvrntsWith:)]) {
        [_delegate getClickEvrntsWith:sender.tag];
    }
}

- (void)changeHighStates
{
    self.backgroundColor = kWhiteColor;
}

@end
