//
//  JJVersionCodeController.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/16.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJVersionCodeController.h"
#import "CommonSystemInfo.h"


@interface JJVersionCodeController ()
@property (weak, nonatomic) IBOutlet UILabel *versionCodeLabel;

@end

@implementation JJVersionCodeController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    self.commonNavBar.title = @"版本信息";
    [self.view addSubview:self.commonNavBar];
    self.view.backgroundColor = [UIColor lightGrayColor];
    self.versionCodeLabel.text = [CommonSystemInfo appVersion];
    self.versionCodeLabel.font = [UIFont systemFontOfSize:24];
//    self.versionCodeLabel.textColor = [UIColor redColor];
    
}



@end
