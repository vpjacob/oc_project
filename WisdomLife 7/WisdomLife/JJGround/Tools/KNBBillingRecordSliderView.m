//
//  KNBBillingRecordSliderView.m
//  KenuoTraining
//
//  Created by 妖狐小子 on 2017/3/9.
//  Copyright © 2017年 Robert. All rights reserved.
//

#import "KNBBillingRecordSliderView.h"

static const NSInteger knbSliderButtonTag = 2017;


@interface KNBBillingRecordSliderView ()

@property (nonatomic, strong) UIButton *leftButton;  //云币充值
@property (nonatomic, strong) UIButton *rightButton; //兑换记录
//@property (nonatomic, strong) UIView *intervalLine;  //间隔线
@property (nonatomic, strong) UIView *indexLine;     //指示线
@property (nonatomic, strong) UIView *bottomLine;    //底部分隔线

@property (nonatomic, assign) CGSize viewSize;
@property (nonatomic, strong) NSArray *buttonTitles;

@end


@implementation KNBBillingRecordSliderView

- (instancetype)initWithFrame:(CGRect)frame
                 buttonTitles:(NSArray *)titles {
    self = [super initWithFrame:frame];
    if (self) {
        [self configView];
        self.buttonTitles = titles;
    }
    return self;
}

- (void)configView {
    self.backgroundColor = [UIColor whiteColor];

    [self addSubview:self.leftButton];
//    [self addSubview:self.intervalLine];
    [self addSubview:self.rightButton];
    [self addSubview:self.bottomLine];
    [self addSubview:self.indexLine];

    self.indexLineWidth = (kDeviceWidth - 0.5) / 2;
}

#pragma mark---- ButtonAction

- (void)selectSliderButtonAction:(UIButton *)button {
    NSInteger tag = button.tag - knbSliderButtonTag;
    self.leftButton.selected = !tag;
    self.rightButton.selected = tag;
    [self scrollToIndex:tag];
    if (_delegate && [_delegate respondsToSelector:@selector(sliderButtonView:selectIndex:)]) {
        [_delegate sliderButtonView:self selectIndex:tag];
    }
}

- (void)scrollToIndex:(NSInteger)index {
    [UIView animateWithDuration:.5
                     animations:^{
                         self.indexLine.frame = CGRectMake((_leftButton.width - _indexLineWidth) / 2 + index * (_leftButton.width + 0.5), self.height - 2, _indexLineWidth, 2);
                     }];
}

- (void)selectLiveButton {
    self.leftButton.selected = NO;
    self.rightButton.selected = YES;
    [self scrollToIndex:1];
    if (_delegate && [_delegate respondsToSelector:@selector(sliderButtonView:selectIndex:)]) {
        [_delegate sliderButtonView:self selectIndex:1];
    }
}


#pragma mark---- Setter && Getter

- (UIButton *)leftButton {
    if (!_leftButton) {
        _leftButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _leftButton.frame = CGRectMake(0, 0, (self.width - 0.5) / 2, self.height);
        [_leftButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [_leftButton setTitleColor:[UIColor colorWithHexString:@"0eaee3"] forState:UIControlStateSelected];
        
        _leftButton.titleLabel.font = [UIFont systemFontOfSize:14];
        _leftButton.tag = 0 + knbSliderButtonTag;
        _leftButton.selected = YES;
        [_leftButton addTarget:self action:@selector(selectSliderButtonAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _leftButton;
}

- (UIButton *)rightButton {
    if (!_rightButton) {
        _rightButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _rightButton.frame = CGRectMake(_leftButton.width + 0.5, 0, (kDeviceWidth - 0.5) / 2, self.height);
        [_rightButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [_rightButton setTitleColor:[UIColor colorWithHexString:@"0eaee3"] forState:UIControlStateSelected];
        _rightButton.titleLabel.font = [UIFont systemFontOfSize:14];
        _rightButton.tag = 1 + knbSliderButtonTag;
        [_rightButton addTarget:self action:@selector(selectSliderButtonAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightButton;
}

//- (UIView *)intervalLine {
//    if (!_intervalLine) {
//        _intervalLine = [[UIView alloc] initWithFrame:CGRectMake(_leftButton.width, (40 - 22) / 2, 0.5, 22)];
//        _intervalLine.backgroundColor = KNB_RGB(224, 224, 224);
//    }
//    return _intervalLine;
//}

- (UIView *)indexLine {
    if (!_indexLine) {
        _indexLine = [[UIView alloc] initWithFrame:CGRectMake(20, self.height - 2, _leftButton.width - 40, 2)];
        _indexLine.backgroundColor = [UIColor colorWithHexString:@"0eaee3"];
    }
    return _indexLine;
}

- (UIView *)bottomLine {
    if (!_bottomLine) {
        _bottomLine = [[UIView alloc] initWithFrame:CGRectMake(0, self.height - 0.5, self.width, 0.5)];
        _bottomLine.backgroundColor = KNB_RGB(224, 224, 224);
    }
    return _bottomLine;
}

- (void)setButtonTitles:(NSArray *)buttonTitles {
    _buttonTitles = buttonTitles;
    if (_buttonTitles.count >= 2) {
        [self.leftButton setTitle:buttonTitles[0] forState:UIControlStateNormal];
        [self.rightButton setTitle:buttonTitles[1] forState:UIControlStateNormal];
    }
}

- (void)setIndexLineWidth:(CGFloat)indexLineWidth {
    _indexLineWidth = indexLineWidth;
    self.indexLine.frame = CGRectMake((_leftButton.width - indexLineWidth) / 2, self.height - 2, indexLineWidth, 2);
}

- (void)setUnSelectTextColor:(UIColor *)unSelectTextColor {
    _unSelectTextColor = unSelectTextColor;
    [self.leftButton setTitleColor:unSelectTextColor forState:UIControlStateNormal];
    [self.rightButton setTitleColor:unSelectTextColor forState:UIControlStateNormal];
}


@end
