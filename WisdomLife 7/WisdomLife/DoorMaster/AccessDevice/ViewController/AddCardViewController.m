//
//  AddCardViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "AddCardViewController.h"
#import "MBProgressHUD+MJ.h"
#import "ServerCardOpViewController.h"
#import "NewNav.h"

@interface AddCardViewController ()

@property (nonatomic, strong) UIButton *punchRegBtn; // 刷卡登记
@property (nonatomic, strong) UIButton *cardnoRegBtn; // 卡号登记
@property (nonatomic, strong) UIButton *exitBtn; // 退出刷卡登记
@property (nonatomic, strong) UILabel *tipLabel; // 提示

@end

@implementation AddCardViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"register_card", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"register_card", @"");
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
    self.punchRegBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.punchRegBtn setTitle:NSLocalizedString(@"punch_register", @"") forState:UIControlStateNormal];
    self.punchRegBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 100, width, height); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.punchRegBtn.backgroundColor = myColorRGB;
    self.punchRegBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.punchRegBtn addTarget:self action:@selector(punchRegBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.punchRegBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
//    [GlobalTool addCornerForView: self.punchRegBtn];
    // 卡号登记按钮
    self.cardnoRegBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.cardnoRegBtn setTitle:NSLocalizedString(@"cardno_register", @"") forState:UIControlStateNormal];
    self.cardnoRegBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 155, width, height); // x, y, width, height
//    self.cardnoRegBtn.backgroundColor = myColorRGB;
    self.cardnoRegBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.cardnoRegBtn addTarget:self action:@selector(cardnoRegBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.cardnoRegBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    [GlobalTool addCornerForView: self.cardnoRegBtn];
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
    
    //设置字体颜色--Benson
    self.tipLabel.textColor = kBlackColor;
    [self.view addSubview: self.punchRegBtn];
    //    [self.view addSubview: self.cardnoRegBtn];
}

// 刷卡登记
- (void)punchRegBtnClick:(id)sender
{
    [self.view addSubview: self.tipLabel];
    [self.view addSubview: self.exitBtn];
    [self.punchRegBtn removeFromSuperview];
    [self.cardnoRegBtn removeFromSuperview];
    
    int ret = [LibDevModel controlDevice:self.libDevModel andOperation:CTRL_ENTER_CARD_REGISTER_MODE];
    if (ret == SUCCESS)
    {
        // 接收操作结果--回调函数
        [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
            if (ret == SUCCESS)
            {
                [self.tipLabel removeFromSuperview];
                [MBProgressHUD showTip:NSLocalizedString(@"enter_add_card_tip", @"")];
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

// 卡号登记
- (void)cardnoRegBtnClick:(id)sender
{
    ServerCardOpViewController *cardOpView = [[ServerCardOpViewController alloc] init];
    cardOpView.libDevModel = self.libDevModel;
    cardOpView.cardOpStatus = @"add";
    [self.navigationController pushViewController:cardOpView animated:YES];
}

- (void)exitBtnClick:(id)sender
{
    [self.view addSubview: self.tipLabel];
    int ret = [LibDevModel controlDevice:self.libDevModel andOperation:CTRL_EXIT_CARD_REGISTER_MODE];
    if (ret == SUCCESS)
    {
        // 接收操作结果--回调函数
        [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
            if (ret == SUCCESS)
            {
                [MBProgressHUD showTip:NSLocalizedString(@"exit_add_card_tip", @"")];
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
