//
//  ClickButton.h
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/6.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol ClickButtonDelegate <NSObject>

- (void)getClickEvrntsWith:(NSInteger)index;

@end

@interface ClickButton : UIButton

- (instancetype)initWithTitle:(NSString *)title normalImage:(NSString *)normalImage highlightedImage:(NSString *)highlightedImage withSize:(CGSize)size;

- (void)changeHighStates;

@property (nonatomic,weak)id <ClickButtonDelegate>delegate;

@end
