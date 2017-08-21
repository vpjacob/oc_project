//
//  KNBBillingRecordSliderView.h
//  KenuoTraining
//
//  Created by 妖狐小子 on 2017/3/9.
//  Copyright © 2017年 Robert. All rights reserved.
//

#import <UIKit/UIKit.h>

@class KNBBillingRecordSliderView;
@protocol KNBBillingRecordSliderViewDelegate <NSObject>

- (void)sliderButtonView:(KNBBillingRecordSliderView *)view
             selectIndex:(NSInteger)index;

@end


@interface KNBBillingRecordSliderView : UIView

@property (nonatomic, weak) id<KNBBillingRecordSliderViewDelegate> delegate;

/**
  未选中按钮的颜色 默认是黑色
 */
@property (nonatomic, strong) UIColor *unSelectTextColor;

/**
  指示线的宽度  默认是屏幕宽的一半
 */
@property (nonatomic, assign) CGFloat indexLineWidth;

- (instancetype)initWithFrame:(CGRect)frame
                 buttonTitles:(NSArray *)titles;

- (void)selectLiveButton;


@end
