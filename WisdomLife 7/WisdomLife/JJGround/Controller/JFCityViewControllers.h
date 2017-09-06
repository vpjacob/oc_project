//
//  JFCityViewControllers.h
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/17.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "CommonViewController.h"

typedef void(^JFCityBlock)(NSString *cityName);

@protocol JFCityViewControllerDelegate <NSObject>

- (void)cityName:(NSString *)name;

@end

@interface JFCityViewControllers : CommonViewController

@property (nonatomic, weak) id<JFCityViewControllerDelegate> delegate;
@property (nonatomic, copy)JFCityBlock cityBlock;

@end
