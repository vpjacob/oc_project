//
//  ModifyDevicePwdViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 01/04/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "ModifyDevicePwdViewController.h"
#import "MBProgressHUD+MJ.h"
#import "DoorDto.h"
#import "NewNav.h"

@interface ModifyDevicePwdViewController ()

@property (nonatomic, weak) UITextField *oldPwdField;
@property (nonatomic, weak) UITextField *newpwdField;
@property (nonatomic, weak) UITextField *newpwdVerField;
@property (nonatomic, strong) UIButton *submitBtn;

@end

@implementation ModifyDevicePwdViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"modify_dev_pwd", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"modify_dev_pwd", @"");
    }
    [self setupView];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)setupView
{
    // 旧密码
    self.oldPwdField = [self createTextField:@"old_pwd" yIndex:90 uiWidth:kDeviceWidth];
    // 新密码
    self.newpwdField = [self createTextField:@"new_pwd" yIndex:130 uiWidth:kDeviceWidth];
    // 确认新密码
    self.newpwdVerField = [self createTextField:@"ensure_new_pwd" yIndex:170 uiWidth:kDeviceWidth];
    // 创建发送密码按钮
    self.submitBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.submitBtn setTitle:NSLocalizedString(@"submit", @"") forState:UIControlStateNormal];
//    self.submitBtn.frame = CGRectMake(10, 230, kDeviceWidth-20, 38); // x, y, width, height
    self.submitBtn.frame = CGRectMake(10, 230, kDeviceWidth-20, kCurrentWidth(44)); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.submitBtn.backgroundColor = myColorRGB;
    self.submitBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.submitBtn addTarget:self action:@selector(submitBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.submitBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
//    [GlobalTool addCornerForView: self.submitBtn];
    [self.view addSubview: self.submitBtn];
}

// 创建 textField
- (UITextField *)createTextField:(NSString *)placeholder yIndex:(int)yIndex uiWidth:(int)uiWidth
{
    UITextField *textField = [[UITextField alloc] initWithFrame: CGRectMake((kDeviceWidth - uiWidth + 10) / 2, yIndex, uiWidth-10, 35)];
    textField.placeholder = NSLocalizedString(placeholder,@"");
    textField.backgroundColor = [UIColor whiteColor];
    textField.autocorrectionType = UITextAutocorrectionTypeNo;
    textField.borderStyle = UITextBorderStyleRoundedRect;
    textField.font = [UIFont systemFontOfSize:14];
    textField.keyboardType = UIKeyboardTypeDefault;
    textField.returnKeyType = UIReturnKeyDone;
    textField.clearButtonMode = UITextFieldViewModeWhileEditing;
    textField.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
    textField.secureTextEntry = YES;
    textField.keyboardType = UIKeyboardTypeNumberPad;
    [GlobalTool addCornerForView: textField];
    [self.view addSubview: textField];
    return textField;
}

- (void)submitBtnClick:(id)sender
{
    if (self.newpwdField.text.length == 0)
    {
        [GlobalTool alertTipsView:@"empty_new_pwd"];
        return;
    }
    if (self.newpwdVerField.text.length == 0)
    {
        [GlobalTool alertTipsView:@"empty_ensure_new_pwd"];
        return;
    }
    if ([self.newpwdField.text isEqualToString: self.newpwdVerField.text] == NO)
    {
        [GlobalTool alertTipsView:@"not_sample_new_pwd"];
        return;
    }
    LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
    int ret = [LibDevModel modifyPwd:libDevModel andOldPwd:self.oldPwdField.text andNewPwd:self.newpwdField.text];
    if (ret != SUCCESS)
    {
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        return;
    }
    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
    [LibDevModel onControlOver:^(int ret, NSMutableDictionary *dataDict) {
        [hud hide:YES afterDelay:0];
        if (ret == SUCCESS)
        {
            [MBProgressHUD showTip:NSLocalizedString(@"modify_dev_pwd_success", @"")];
            [self.navigationController popViewControllerAnimated:YES];
        }
        else
        {
            NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
            [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        }
    }];
}

@end
