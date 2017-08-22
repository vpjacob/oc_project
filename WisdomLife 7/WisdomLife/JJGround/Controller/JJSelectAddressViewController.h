//
//  JJSelectAddressViewController.h
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/18.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^JJSelectAddressBlock)(NSString *cityName);

@interface JJSelectAddressViewController : UIViewController

@property (nonatomic, copy)JJSelectAddressBlock cityNameBlock;

@end
