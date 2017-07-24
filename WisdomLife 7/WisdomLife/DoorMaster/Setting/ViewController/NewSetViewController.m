//
//  NewSetViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/7.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "NewSetViewController.h"
#import "ClickButton.h"
//#import "ShakeViewController.h"
//#import "CloseViewController.h"
//#import "NewAboutViewController.h"
//#import "NewAccuntViewController.h"
#import "NewNav.h"
//#import "SelectDeviceVC.h"
#import "ShakeOpenViewController.h"
#import "CloseOpenViewController.h"

@interface NewSetViewController ()

@property (nonatomic,strong)UIImageView *markImg;

@end

@implementation NewSetViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self initSubViews];
    
}

- (void)clickSender:(ClickButton *)sender
{
    switch (sender.tag) {
        case 5000:
        {
            if ([[ContentUtils shareContentUtils] isCube]) {
            }else
            {
                ShakeOpenViewController *shakeVC = [[ShakeOpenViewController alloc] init];
                [self pushViewController:shakeVC animated:YES];
            }
        }
            break;
        case 5001:
        {
            if ([[ContentUtils shareContentUtils] isCube]) {
            }else
            {
                CloseOpenViewController *closeVC = [[CloseOpenViewController alloc] init];
                [self pushViewController:closeVC animated:YES];
            }
        }
            break;
        default:
            break;
    }
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)initSubViews
{
//    self.commonNavBar.hidden = YES;
    self.commonNavBar.title = @"设定";
    [self.view addSubview:self.commonNavBar];
    [self.view addSubview:self.markImg];
    
    NSArray *titleArr = @[NSLocalizedString(@"yoho_setting_shaking_mode", @""),NSLocalizedString(@"yoho_setting_near_mode", @"")];
    NSArray *normalArr = @[@"shark",@"door_mobile"];
    NSArray *highlightedArr = @[@"shark",@"door_mobile"];
    
    for (int i = 0; i < 2; i++) {
        ClickButton *clickBtn = [[ClickButton alloc] initWithTitle:[titleArr safeObjectAtIndex:i] normalImage:[normalArr safeObjectAtIndex:i] highlightedImage:[highlightedArr safeObjectAtIndex:i] withSize:CGSizeMake(70, 70)];
        clickBtn.frame = CGRectMake(0+(i%2)*kDeviceWidth/2.0, self.markImg.bottom+(i/2)*kDeviceWidth/2.0, kDeviceWidth/2.0, kDeviceWidth/2.0);
        clickBtn.layer.borderWidth = 0.5;
        clickBtn.layer.borderColor = [UIColor colorWithHexString:@"dddddd"].CGColor;
        clickBtn.tag = 5000+i;
        [clickBtn addTarget:self action:@selector(clickSender:) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:clickBtn];
    }
}

- (UIImageView *)markImg
{
    if (!_markImg) {
        _markImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, 64, kDeviceWidth, jjSCREENW(150))];
        _markImg.image = [UIImage imageNamed:@"banner1"];
    }
    return _markImg;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
