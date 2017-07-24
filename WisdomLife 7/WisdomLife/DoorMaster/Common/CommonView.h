//
//  CommonView.h
//  框架
//
//  Created by 朱攀峰 on 15/10/19.
//  Copyright (c) 2015年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CommonView : UIView

@property (nonatomic,assign)id owner;

- (id)initWithFrame:(CGRect)frame andOwner:(id)owner;

- (id)initWithOwner:(id)owner;

- (void)setCornerRadius:(CGFloat)values;

@end
