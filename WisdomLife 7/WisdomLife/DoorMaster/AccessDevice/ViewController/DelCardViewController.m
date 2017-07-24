//
//  DelCardViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "DelCardViewController.h"
#import "MBProgressHUD+MJ.h"
#import "ServerCardOpViewController.h"
#import "NewNav.h"

@interface DelCardViewController ()

@property (nonatomic, strong) UIButton *delRegisterBtn; // 刷卡删除
@property (nonatomic, strong) UIButton *cardnoDelBtn; // 卡号删除
@property (nonatomic, strong) UIButton *exitBtn; // 退出刷卡删除
@property (nonatomic, strong) UILabel *tipLabel; // 提示

@end

@implementation DelCardViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"delete_card", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"delete_card", @"");
    }
    [self setupButton];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)setupButton
{
    CGFloat width = kDeviceWidth - 60;
//    CGFloat height = 38;
    CGFloat height = kCurrentWidth(44);
    
    // 刷卡登记按钮
    self.delRegisterBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.delRegisterBtn setTitle:NSLocalizedString(@"punch_delete", @"") forState:UIControlStateNormal];
    self.delRegisterBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 100, width, height); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.delRegisterBtn.backgroundColor = myColorRGB;
    self.delRegisterBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.delRegisterBtn addTarget:self action:@selector(delRegisterBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.delRegisterBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    [GlobalTool addCornerForView: self.delRegisterBtn];
    // 卡号删除按钮
    self.cardnoDelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.cardnoDelBtn setTitle:NSLocalizedString(@"cardno_delete", @"") forState:UIControlStateNormal];
    self.cardnoDelBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 155, width, height); // x, y, width, height
//    self.cardnoDelBtn.backgroundColor = myColorRGB;
    self.cardnoDelBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.cardnoDelBtn addTarget:self action:@selector(cardnoDelBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.cardnoDelBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    [GlobalTool addCornerForView: self.cardnoDelBtn];
    // 退出按钮
    self.exitBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.exitBtn setTitle:NSLocalizedString(@"exit", @"") forState:UIControlStateNormal];
    self.exitBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 100, width, height); // x, y, width, height
//    self.exitBtn.backgroundColor = [UIColor redColor];
    self.exitBtn.backgroundColor = kGrayColor;
    [self.exitBtn addTarget:self action:@selector(exitBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.exitBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
//    [GlobalTool addCornerForView: self.exitBtn];
    // 提示label
    self.tipLabel = [[UILabel alloc] initWithFrame: CGRectMake((kDeviceWidth - width) / 2, 70, width, 30)];
    self.tipLabel.text = NSLocalizedString(@"connecting_device", @"");
    self.tipLabel.font = [UIFont systemFontOfSize:16];
    
    [self.view addSubview: self.delRegisterBtn];
    //    [self.view addSubview: self.cardnoDelBtn];s
}

- (void)delRegisterBtnClick:(id)sender
{
    [self.view addSubview: self.tipLabel];
    [self.view addSubview: self.exitBtn];
    [self.delRegisterBtn removeFromSuperview];
    [self.cardnoDelBtn removeFromSuperview];
    
    int ret = [LibDevModel controlDevice:self.libDevModel andOperation:CTRL_ENTER_CARD_DEL_MODE];
    if (ret == SUCCESS)
    {
        // 接收操作结果--回调函数
        [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
            if (ret == SUCCESS)
            {
                [self.tipLabel removeFromSuperview];
                [MBProgressHUD showTip:NSLocalizedString(@"enter_del_card_tip", @"")];
            }
            else
            {
                NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
                //                self.tipLabel.text = NSLocalizedString(errorCode, @"");
                [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
                [self.navigationController popViewControllerAnimated:YES];
            }
        }];
    }
    else
    {
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        [self.navigationController popViewControllerAnimated:YES];
    }
}

// 卡号删除
- (void)cardnoDelBtnClick:(id)sender
{
    ServerCardOpViewController *cardOpView = [[ServerCardOpViewController alloc] init];
    cardOpView.libDevModel = self.libDevModel;
    cardOpView.cardOpStatus = @"del";
    [self.navigationController pushViewController:cardOpView animated:YES];
}

- (void)exitBtnClick:(id)sender
{
    [self.view addSubview: self.tipLabel];
    int ret = [LibDevModel controlDevice:self.libDevModel andOperation:CTRL_EXIT_CARD_DEL_MODE];
    if (ret == SUCCESS)
    {
        // 接收操作结果--回调函数
        [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
            if (ret == SUCCESS)
            {
                [MBProgressHUD showTip:NSLocalizedString(@"exit_del_card_tip", @"")];
            }
            else
            {
                NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
                [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
            }
            [self.navigationController popViewControllerAnimated:YES];
        }];
    }
    else
    {
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        [self.navigationController popViewControllerAnimated:YES];
    }
}

@end
