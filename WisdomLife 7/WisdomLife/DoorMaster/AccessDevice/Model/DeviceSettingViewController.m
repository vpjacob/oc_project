//
//  DeviceSettingViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "DeviceSettingViewController.h"
#import "DoorDto.h"
#import "DeviceLockParamViewController.h"
#import "ModifyDevicePwdViewController.h"
#import "GetDeviceSystemInfoViewController.h"
#import "MBProgressHUD+MJ.h"
#import "NewNav.h"

typedef enum {
    CLEAR_CARDS_USERS = 0,
    DEVICE_RESET = 1,
}DevSettingE;

@interface DeviceSettingViewController ()<UITableViewDataSource, UITableViewDelegate>

@property (nonatomic) BOOL calibrationResult;
@property (nonatomic,strong) UIAlertView *calibrationAlert;
@property (nonatomic, strong) NSArray *dataArr;
@property (nonatomic, strong) UITableView *deviceInfoTableView;

@end

@implementation DeviceSettingViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"device_setting", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"device_setting", @"");
    }
    [self.view addSubview:self.deviceInfoTableView];
    self.deviceInfoTableView.backgroundColor = self.view.backgroundColor;
    
    NSMutableArray *menuArr = [[NSMutableArray alloc] init];
    [menuArr addObject: @"set_lock_param"]; // 设置控锁参数
    int type = [self.devModel.dev_type intValue];
    if (type == DEV_TYPE_BL100 || type == DEV_TYPE_AM100 || type == DEV_TYPE_AM160 || type == DEV_TYPE_AM200 || type == DEV_TYPE_AM260 || type == DEV_TYPE_QC200)
    {
        [menuArr addObject: @"modify_dev_pwd"]; // 更改设备密码
        if (self.devModel.privilege.intValue == SUPER_ADMIN_USER) {
            [menuArr addObject: @"clear_card_user"]; //超级管理员才有：清空卡、用户信息
        }
    }
    [menuArr addObject: @"get_dev_info"]; // 获取设备信息
    if (self.devModel.privilege.intValue == SUPER_ADMIN_USER) {
        [menuArr addObject: @"dev_reset"]; // 恢复出厂设置
    }
    
    self.dataArr = @[menuArr];
    // Do any additional setup after loading the view.
}

- (UITableView *)deviceInfoTableView
{
    if (!_deviceInfoTableView) {
        _deviceInfoTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_deviceInfoTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_deviceInfoTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _deviceInfoTableView.scrollEnabled = YES;
        _deviceInfoTableView.userInteractionEnabled = YES;
        _deviceInfoTableView.delegate = self;
        _deviceInfoTableView.dataSource = self;
        _deviceInfoTableView.backgroundColor = [UIColor whiteColor];
        _deviceInfoTableView.backgroundView = nil;
    }
    return _deviceInfoTableView;
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

// 调整section间的间距
//- (CGFloat) tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
//{
//    return section == 0 ? 10 : 2;
//}
//- (CGFloat) tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
//{
//    return section = 2;
//}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return self.dataArr.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.dataArr[section] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *ID = @"DeviceSetting";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    cell.textLabel.text = NSLocalizedString(self.dataArr[indexPath.section][indexPath.row], @"");
    cell.accessoryType= UITableViewCellAccessoryDisclosureIndicator;  // 添加右侧灰色小箭头
    if ([[ContentUtils shareContentUtils] isCube]) {
        cell.textLabel.textColor = kLightGrayColor;
        cell.textLabel.font = kSystem(14);
    }
    return cell;
}
// 单元行点击事件
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *operate = self.dataArr[indexPath.section][indexPath.row];
    if ([operate isEqualToString:@"set_lock_param"])  // 设置控锁参数
    {
        DeviceLockParamViewController *lockParamView = [[DeviceLockParamViewController alloc] init];
        lockParamView.devModel = self.devModel;
        [self.navigationController pushViewController:lockParamView animated:YES];
    }
    else if ([operate isEqualToString:@"modify_dev_pwd"]) // 更改设备密码
    {
        ModifyDevicePwdViewController *modifyPwdView = [[ModifyDevicePwdViewController alloc] init];
        modifyPwdView.devModel = self.devModel;
        [self.navigationController pushViewController:modifyPwdView animated:YES];
    }
    else if ([operate isEqualToString:@"clear_card_user"]) // 清空卡、用户信息
    {
        self.calibrationAlert = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"clear_card_user", @"") message:NSLocalizedString(@"clear_card_user_tip1", @"") delegate:self cancelButtonTitle:NSLocalizedString(@"cancel", @"") otherButtonTitles:NSLocalizedString(@"confirm", @""), nil];
        self.calibrationAlert.tag = CLEAR_CARDS_USERS;
        [self.calibrationAlert show];
        
    }
    else if ([operate isEqualToString:@"get_dev_info"]) // 获取设备信息
    {
        GetDeviceSystemInfoViewController *systemInfoView = [[GetDeviceSystemInfoViewController alloc] init];
        systemInfoView.devModel = self.devModel;
        [self.navigationController pushViewController:systemInfoView animated:YES];
    }
    else if ([operate isEqualToString:@"dev_reset"])  // 恢复出厂设置
    {
        self.calibrationAlert = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"dev_reset", @"") message:NSLocalizedString(@"dev_ret_tip1", @"") delegate:self cancelButtonTitle:NSLocalizedString(@"cancel", @"") otherButtonTitles:NSLocalizedString(@"confirm", @""), nil];
        self.calibrationAlert.tag = DEVICE_RESET;
        [self.calibrationAlert show];
        
    }
}

// 在这里处理UIAlertView中的按钮被单击的事件
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    switch (buttonIndex) {
            // cancel
        case 0:{
            
        }break;
        case 1:
        {
            if (alertView.tag == CLEAR_CARDS_USERS)
            {
                LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
                int ret = [LibDevModel controlDevice:libDevModel andOperation:CTRL_DEL_ALL_CARD_USER];
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
                        [MBProgressHUD showTip:NSLocalizedString(@"clear_card_user_success", @"")];
                    }
                    else
                    {
                        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
                        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
                    }
                }];
            }
            else if (alertView.tag == DEVICE_RESET)
            {
                LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
                int ret = [LibDevModel controlDevice:libDevModel andOperation:CTRL_INIT_DEV_OPTION];
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
                        [MBProgressHUD showTip:NSLocalizedString(@"dev_reset_success", @"")];
                    }
                    else
                    {
                        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
                        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
                    }
                }];
            }
            break;
        }
        default:
            break;
    }
}


@end
