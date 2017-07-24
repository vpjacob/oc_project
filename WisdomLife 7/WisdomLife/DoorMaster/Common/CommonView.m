//
//  CommonView.m
//  框架
//
//  Created by 朱攀峰 on 15/10/19.
//  Copyright (c) 2015年 朱攀峰. All rights reserved.
//

#import "CommonView.h"

@implementation CommonView

@synthesize owner = _owner;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
    }
    return self;
}

- (id)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame andOwner:(id)owner
{
    self = [super initWithFrame:frame];
    if (self) {
        self.owner = owner;
    }
    return self;
}

- (instancetype)initWithOwner:(id)owner
{
    self = [super init];
    if (self) {
        self.owner = owner;
    }
    return self;
}

- (instancetype)initWithOwnerWithEvent:(id)owner touch:(SEL)event
{
    self = [super init];
    if (self) {
        self.owner = owner;
    }
    return self;
}
- (void)setCornerRadius:(CGFloat)values
{
    self.layer.masksToBounds = YES;
    self.layer.cornerRadius = values;
}
@end
