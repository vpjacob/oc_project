//
//  TodayViewController.m
//  WisdomLifeToday
//
//  Created by 刘毅 on 2017/9/18.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "TodayViewController.h"
#import <NotificationCenter/NotificationCenter.h>

@interface TodayViewController () <NCWidgetProviding>

@end

@implementation TodayViewController

- (void)viewDidLoad {
    [super viewDidLoad];

}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    if ([[UIDevice currentDevice].systemVersion doubleValue] >= 10.0) {
        self.extensionContext.widgetLargestAvailableDisplayMode = NCWidgetDisplayModeCompact;
    }
    self.preferredContentSize = CGSizeMake([UIScreen mainScreen].bounds.size.width, 50);
}

- (UIEdgeInsets)widgetMarginInsetsForProposedMarginInsets:(UIEdgeInsets)defaultMarginInsets{
    return UIEdgeInsetsMake(0, 0, 0, 0);
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (IBAction)btnAction:(UIButton *)sender{
    NSURL *url;
    if (sender.tag == 200) {
        url = [NSURL URLWithString:@"WisdomLifeToday://red200"];
    }else if (sender.tag == 201){
        url = [NSURL URLWithString:@"WisdomLifeToday://red201"];
    }else if (sender.tag == 202){
        url = [NSURL URLWithString:@"WisdomLifeToday://red202"];
    }else if (sender.tag == 203){
        url = [NSURL URLWithString:@"WisdomLifeToday://red203"];
    }
    
    [self.extensionContext openURL:url completionHandler:^(BOOL success) {
        NSLog(@"isSuccessed %d",success);
    }];
    
}
- (void)widgetPerformUpdateWithCompletionHandler:(void (^)(NCUpdateResult))completionHandler {
    // Perform any setup necessary in order to update the view.
    
    // If an error is encountered, use NCUpdateResultFailed
    // If there's no update required, use NCUpdateResultNoData
    // If there's an update, use NCUpdateResultNewData

    completionHandler(NCUpdateResultNewData);
}

@end
