//
//  NewNav.h
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/7.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NewNav : UIControl

- (id)initWithTitle:(NSString *)title;

@property (nonatomic,strong)UILabel *titleLB;
@property (nonatomic,strong)UIButton *escBtn;
@property (nonatomic,strong)UIButton *exitBtn;

-(void)showExitBtn;

-(void)hideEscBtn;

-(void)setTitleAlpha:(float)alpha;

-(void)setTitle:(NSString *)title;

@end
