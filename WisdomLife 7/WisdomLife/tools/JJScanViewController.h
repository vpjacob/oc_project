//
//  JJScanViewController.h
//  WisdomLife
//
//  Created by 刘毅 on 2017/7/11.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import <UIKit/UIKit.h>


#define TOP (SCREEN_HEIGHT-220)/2
#define LEFT (SCREEN_WIDTH-220)/2
#define kScanRect CGRectMake(LEFT, TOP, 220, 220)
#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height
#define SCREEN_WIDTH  [UIScreen mainScreen].bounds.size.width
#define SCREEN_BOUNDS  [UIScreen mainScreen].bounds


@interface JJScanViewController : UIViewController

@property(nonatomic,copy)void(^QRCodeMessage)(NSString *qrcodeMessage);
@end
