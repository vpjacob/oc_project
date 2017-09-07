//
//  DoorDetailViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 10/05/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "DoorDetailViewController.h"
#import "DoorDto.h"
#import "MBProgressHUD+MJ.h"
#import "DevSystemInfoManager.h"
#import "RequestService.h"
#import "DeviceManager.h"
#import "SetWGFmtViewController.h"
#import "CardManagerViewController.h"
#import "EKeyManagerViewController.h"
#import "DeviceSettingViewController.h"
//#import "SendTempPwdViewController.h"
//#import "SendQRCodeViewController.h"
#import "VisitorViewController.h"

typedef enum {
    GROUP_DEV = 0,
    GROUP_DEV_MANAGER = 1,
    GROUP_OPEN_MODE = 2,
}DevGroupE;

typedef enum {
    DEV_MODIFY_NAME = 0,
    DEV_SYNC_TIME = 1,
    DEV_SET_DISTANCE = 2,
    DEV_REMOTE_OPEN = 3
}DevOperateE;
@interface DoorDetailViewController ()

@property (nonatomic, strong) NSArray *dataArr; // 操作菜单
@property (nonatomic, strong) NSMutableArray *detailContent; // 操作菜单对应内容
@property (nonatomic) BOOL calibrationResult;
@property (nonatomic,strong)DoorReaderDto *readerDto;
@property (nonatomic,strong) UIAlertView *calibrationAlert;
@property (nonatomic, strong) UIButton *delUserEKeyBtn;
@property (nonatomic, strong) UploadOpenDoorService *openDoorService;
@property (nonatomic,strong)UITableView *deviceInfoTableView;

@end

@implementation DoorDetailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.commonNavBar.title = NSLocalizedString(@"device_information", @"");
    
    self.readerDto = self.doorListDto.readerArr.firstObject;
    [self setupButton];
    
    // 1. 显示操作菜单
    NSMutableArray *showArray = [[NSMutableArray alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    
    // 第一组菜单：设备类型，设备序列号，设备名称，有效期
    [array addObject:@"type"];
    [array addObject:@"sn"];
    [array addObject:@"name"];
    if (self.readerDto.start_date != nil && [self.readerDto.start_date isEqualToString:@""] == NO && self.readerDto.end_date != nil && [self.readerDto.end_date isEqualToString:@""] == NO)
    {
        [array addObject:@"start_date"];
        [array addObject:@"end_date"];
    }
    else
    {
        [array addObject:@"validity"];
    }
    [showArray addObject: array];
    
    // 第二组菜单：设备操作管理
    array = [[NSMutableArray alloc] init];
    //    [array addObject: @"open_record"]; // 手机开门记录
    int type = [self.readerDto.dev_type intValue];
    if (type  == DEV_TYPE_AM100 || type == DEV_TYPE_AM200 || type == DEV_TYPE_AM160 || type == DEV_TYPE_AM260 || type == DEV_TYPE_QC200)
    {
        [array addObject: @"visitor_authorization"]; // 访客授权
    }
    
    // 管理员以上权限才能操作
    if ([self.readerDto.privilege intValue] != GENERAL_USER)
    {
        [array addObject: @"ekey_manage"]; // 电子钥匙，管理员以上权限所有设备都支持
        if (type == DEV_TYPE_RD100 || type == DEV_TYPE_LC100 || type == DEV_TYPE_QD100)  // 读头设备
        {
            [array addObject: @"set_wgfmt"];
        }
        else if (type == DEV_TYPE_AM100 || type == DEV_TYPE_AM200 || type == DEV_TYPE_AM160 || type == DEV_TYPE_AM260 || type == DEV_TYPE_QC200)  // 带存储数据设备
        {
            [array addObject: @"sync_time"];
            [array addObject: @"card_manage"];
        }
        if ([self.readerDto.network isEqualToString:@"1"])
        {
            [array addObject: @"remote_open"]; // 远程开门
        }
        [array addObject: @"device_setting"]; // 设备设置
    }
    [showArray addObject: array];
    self.dataArr = showArray;
    
    // 2. 显示操作菜单对应内容
    self.detailContent = [[NSMutableArray alloc] init];
    NSArray *devType = @[NSLocalizedString(@"dev_D100",@""), NSLocalizedString(@"dev_AM100",@""), NSLocalizedString(@"dev_LC100",@""), NSLocalizedString(@"dev_BL100",@""), NSLocalizedString(@"dev_BC100",@""), NSLocalizedString(@"dev_acc_controller",@""), NSLocalizedString(@"dev_TC100",@""), NSLocalizedString(@"dev_QC200",@""), NSLocalizedString(@"dev_QD100",@""), NSLocalizedString(@"dev_AM160",@""), NSLocalizedString(@"dev_T200",@""), NSLocalizedString(@"dev_AM260",@""), NSLocalizedString(@"dev_AM200",@"")];
    if (type == 0 || type > devType.count)
    {
        [self.detailContent addObject: NSLocalizedString(@"unknown_dev",@"")];
    }
    else
    {
        [self.detailContent addObject: devType[type - 1]];
    }
    [self.detailContent addObject: self.doorListDto.dev_sn];
    [self.detailContent addObject: self.doorListDto.show_name == nil ? self.doorListDto.dev_sn : self.doorListDto.show_name];
    // 有效期显示
    if (self.readerDto.start_date != nil && [self.readerDto.start_date isEqualToString:@""] == NO && self.readerDto.end_date != nil && [self.readerDto.end_date isEqualToString:@""] == NO)
    {
        NSString *startDate = self.readerDto.start_date;
        NSString *endDate = self.readerDto.end_date;
        NSString *showStartDate = [NSString stringWithFormat:@"%@/%@/%@ %@:%@:%@", [startDate substringWithRange:NSMakeRange(0, 4)], [startDate substringWithRange:NSMakeRange(4, 2)], [startDate substringWithRange:NSMakeRange(6, 2)], [startDate substringWithRange:NSMakeRange(8, 2)], [startDate substringWithRange:NSMakeRange(10, 2)], [startDate substringWithRange:NSMakeRange(12, 2)]];
        NSString *showEndDate = [NSString stringWithFormat:@"%@/%@/%@ %@:%@:%@", [endDate substringWithRange:NSMakeRange(0, 4)], [endDate substringWithRange:NSMakeRange(4, 2)], [endDate substringWithRange:NSMakeRange(6, 2)], [endDate substringWithRange:NSMakeRange(8, 2)], [endDate substringWithRange:NSMakeRange(10, 2)], [endDate substringWithRange:NSMakeRange(12, 2)]];
        [self.detailContent addObject: showStartDate];
        [self.detailContent addObject: showEndDate];
    }
    else
    {
        [self.detailContent addObject: NSLocalizedString(@"forever",@"")];
    }
    
    [self.view addSubview:self.deviceInfoTableView];
    // Do any additional setup after loading the view.
}

-(void)setupButton
{
    // 删除电子钥匙
    self.deviceInfoTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 50)];
    self.delUserEKeyBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    CGFloat buttonW = kDeviceWidth - 20;
    CGFloat buttonH = 40;
    [self.delUserEKeyBtn setTitle:NSLocalizedString(@"del_dev", @"") forState:UIControlStateNormal];
    self.delUserEKeyBtn.frame = CGRectMake((kDeviceWidth - buttonW) / 2, (60 - buttonH) / 2, buttonW, buttonH);
    self.delUserEKeyBtn.backgroundColor = [UIColor redColor];
    [self.delUserEKeyBtn addTarget:self action:@selector(delEKeyBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    [GlobalTool addCornerForView:self.delUserEKeyBtn];
    self.delUserEKeyBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
    [self.deviceInfoTableView.tableFooterView addSubview:self.delUserEKeyBtn];
}

- (UITableView *)deviceInfoTableView
{
    if (!_deviceInfoTableView) {
        _deviceInfoTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 64, kDeviceWidth, kDeviceHeight - 64) style:UITableViewStylePlain];
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

- (void)delEKeyBtnClick:(id)sender
{
    UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"tips", @"") message:NSLocalizedString(@"whether_to_delete", @"") preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *alertEnsure = [UIAlertAction actionWithTitle:NSLocalizedString(@"confirm", @"") style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
        
        [RequestService delDevEkeyUser:[Config currentConfig].phone devSn:self.doorListDto.dev_sn success:^(NSDictionary *result) {
            [hud hide:YES afterDelay:0];
            int ret = [result[@"ret"] intValue];
            if (ret == SUCCESS) {
                [MBProgressHUD showTip:NSLocalizedString(@"del_dev_success", @"")];
                // 删除设备相关数据
                [[DevSystemInfoManager manager] delDevSystemInfo:self.doorListDto.dev_sn];
                [[DeviceManager manager] delDoorWithKey:self.doorListDto.dev_sn andDevMac:self.doorListDto.dev_mac];
                [[DeviceManager manager] setDeviceSerialNumber];
                [[DeviceManager manager] saveDevList];
                //删除设备相关数据
                [[DevSystemInfoManager manager] delDevSystemInfo:self.doorListDto.dev_sn];
//                dispatch_async(dispatch_get_main_queue(), ^{
//                    [[NSNotificationCenter defaultCenter] postNotificationName:DevListMsgReceved object:nil];
//                });
                [self.navigationController popViewControllerAnimated:YES];
            }else
            {
                [MBProgressHUD showError:result[@"msg"]];
            }
            
        } failure:^(NSString *error) {
            [hud hide:YES afterDelay:0];
            [MBProgressHUD showError:error];
        }];
    }];
    UIAlertAction *alertCancel = [UIAlertAction actionWithTitle:NSLocalizedString(@"cancel", @"") style:UIAlertActionStyleCancel handler:nil];
    [alertVC addAction:alertEnsure];
    [alertVC addAction:alertCancel];
    [self presentViewController:alertVC animated:YES completion:nil];
}

#pragma mark - Table view data source

// 调整section间的间距
- (CGFloat) tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return section == 0 ? 10 : 5;
}
- (CGFloat) tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return section == 0 ? 10 : 5;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return self.dataArr.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.dataArr[section] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *ID = @"DoorInfo";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    
    if (cell == nil)
    {
        if (indexPath.section == GROUP_DEV)
        {
            cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:ID];
        }
        else
        {
            cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        }
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    cell.textLabel.text = NSLocalizedString(self.dataArr[indexPath.section][indexPath.row], @"");
    
    // 设备信息组
    if (indexPath.section == GROUP_DEV)
    {
        cell.detailTextLabel.text = [self.detailContent objectAtIndex:indexPath.row];
        if (indexPath.row == 2)
        {
            cell.detailTextLabel.textColor = KNB_RGB(25, 152, 213);
        }
    }
    else if(indexPath.section == GROUP_DEV_MANAGER)
    {
        cell.accessoryType= UITableViewCellAccessoryDisclosureIndicator; // 添加右侧灰色小箭头，其他格式：像对勾、删除什么类似，更改一下属性值即可
    }
    
    return cell;
}

// 单元行点击事件
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == GROUP_DEV && indexPath.row == 2)// 修改设备名称
    {
        self.calibrationAlert =  [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"modify_dev_name", @"") message:nil delegate:self cancelButtonTitle:NSLocalizedString(@"cancel", @"") otherButtonTitles:NSLocalizedString(@"confirm", @""), nil];
        self.calibrationAlert.alertViewStyle = UIAlertViewStylePlainTextInput;
        self.calibrationAlert.tag = DEV_MODIFY_NAME;
        UITextField *tf = [self.calibrationAlert textFieldAtIndex:0];
        tf.text = self.doorListDto.show_name;
        [self.calibrationAlert show];
        return;
    }
    if (indexPath.section == GROUP_DEV_MANAGER)
    {
        NSString *operate = self.dataArr[indexPath.section][indexPath.row];
        //        if ([operate isEqualToString:@"open_record"])
        //        {
        //            LockLogViewController *lockLog = [[LockLogViewController alloc] init];
        //            lockLog.devModel = self.devModel;
        //            [self.navigationController pushViewController:lockLog animated:YES];
        //        }
        if ([operate isEqualToString:@"set_wgfmt"])
        {
            SetWGFmtViewController *setWGFmt = [[SetWGFmtViewController alloc] init];
            setWGFmt.devModel = self.readerDto;
            [self.navigationController pushViewController:setWGFmt animated:YES];
        }
        else if ([operate isEqualToString:@"sync_time"])
        {
            self.calibrationAlert = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"sync_time_tip", @"") message:NSLocalizedString(@"sync_time_msg", @"") delegate:self cancelButtonTitle:NSLocalizedString(@"cancel", @"") otherButtonTitles:NSLocalizedString(@"sync", @""), nil];
            self.calibrationAlert.tag = DEV_SYNC_TIME;
            [self.calibrationAlert show];
        }
        else if ([operate isEqualToString:@"visitor_authorization"])
        {
            
            VisitorViewController *visitorVC = [[VisitorViewController alloc] init];
            if ([self.readerDto.dev_type intValue] == DEV_TYPE_QC200 || [self.readerDto.dev_type intValue] == DEV_TYPE_QD100)
            {
                visitorVC.type = 2;
            }
            else
            {
                visitorVC.type = 1;
            }
            visitorVC.selectedDevSn = self.readerDto.reader_sn;
            visitorVC.selectedDevName = self.doorListDto.show_name;
            visitorVC.isFromDeviceDetail = YES;
            [self.navigationController pushViewController:visitorVC animated:YES];
        }
        else if ([operate isEqualToString:@"card_manage"])
        {
            CardManagerViewController *cardManage = [[CardManagerViewController alloc] init];
            cardManage.devModel = self.readerDto;
            [self.navigationController pushViewController:cardManage animated:YES];
        }
        else if ([operate isEqualToString:@"ekey_manage"])
        {
            EKeyManagerViewController *ekeyManage = [[EKeyManagerViewController alloc] init];
            ekeyManage.devModel = self.readerDto;
            ekeyManage.devName = self.doorListDto.show_name;
            [self.navigationController pushViewController:ekeyManage animated:YES];
        }
        else if ([operate isEqualToString:@"remote_open"])
        {
            self.calibrationAlert = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"remote_open_tip", @"") message:NSLocalizedString(@"remote_open_msg", @"") delegate:self cancelButtonTitle:NSLocalizedString(@"cancel", @"") otherButtonTitles:NSLocalizedString(@"open", @""), nil];
            self.calibrationAlert.tag = DEV_REMOTE_OPEN;
            [self.calibrationAlert show];
        }
        else if ([operate isEqualToString:@"device_setting"])
        {
            DeviceSettingViewController *devSet = [[DeviceSettingViewController alloc] init];
            devSet.devModel = self.readerDto;
            [self.navigationController pushViewController:devSet animated:YES];
        }
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
            if (alertView.tag == DEV_MODIFY_NAME)
            {
                //得到输入框
                UITextField *tf=[alertView textFieldAtIndex:0];
                if (tf.text.length > 0)
                {
                    self.doorListDto.show_name = tf.text;
                    [[DeviceManager manager] updateVoipDoorName:self.doorListDto.dev_sn name:tf.text];
                    [self.deviceInfoTableView reloadData];
                    
                    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:2 inSection:0];
                    UITableViewCell *cell = [self.deviceInfoTableView cellForRowAtIndexPath:indexPath];
                    cell.detailTextLabel.text = tf.text;
                }
            }
            else if (alertView.tag == DEV_SYNC_TIME)
            {
                MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
                // 获取手机本地时间
                NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
                [dateFormatter setLocale:[NSLocale currentLocale]];
                [dateFormatter setDateFormat:@"yyyyMMddHHmmss"];
                
                NSDate *nowDate = [NSDate date];
                NSString *dateStr = [dateFormatter stringFromDate:nowDate];
                //                DEBUG_PRINT(@"nowDate==%@", dateStr);
                NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSGregorianCalendar];
                NSDateComponents *comps = [[NSDateComponents alloc] init];
                NSInteger unitFlags =NSYearCalendarUnit | NSMonthCalendarUnit |NSDayCalendarUnit | NSWeekdayCalendarUnit |
                NSHourCalendarUnit |NSMinuteCalendarUnit | NSSecondCalendarUnit;
                comps = [calendar components:unitFlags fromDate:nowDate];
                NSInteger weekday = [comps weekday] - 1;
                long devWeekDay = weekday == 0 ? 7 : weekday;
                //                DEBUG_PRINT(@"weekday==0%ld", devWeekDay);
                
                LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.readerDto];
                int ret = [LibDevModel syncDeviceTime:libDevModel andTime:[NSString stringWithFormat:@"%@0%ld", dateStr, devWeekDay]];
                if (ret != SUCCESS)
                {
                    [hud hide:YES afterDelay:0];
                    NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
                    [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
                }
                else
                {
                    [LibDevModel onControlOver:^(int ret, NSMutableDictionary *dataDict) {
                        [hud hide:YES afterDelay:0];
                        if (ret == SUCCESS)
                        {
                            [MBProgressHUD showTip:NSLocalizedString(@"sync_time_success", @"")];
                        }
                        else
                        {
                            NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
                            [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
                        }
                    }];
                }
            }
            else if(alertView.tag == DEV_REMOTE_OPEN)
            {
                MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
                NSDictionary *dataDict = @{@"dev_sn": self.doorListDto.dev_sn, @"door_no": @1, @"action_time": @5};
                [RequestService remoteCtrlDevice:REMOTE_OPEN dataParam:dataDict success:^(NSDictionary *result) {
                    [hud hide:YES afterDelay:0];
                    int ret = [result[@"ret"] intValue];
                    if (ret == SUCCESS)
                    {
                        [MBProgressHUD showTip: NSLocalizedString(@"remote_open_success", @"")];
                    }
                    else
                    {
                        [MBProgressHUD showError:result[@"msg"]];
                    }
                    [self uploadOpenRecord:ret];
                } failure:^(NSString *error) {
                    [hud hide:YES afterDelay:0];
                    [MBProgressHUD showError: error];
                }];
                
            }
            break;
        }
        default:
            break;
    }
}

-(void)uploadOpenRecord:(int)ret
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    [dict setValue:self.doorListDto.show_name forKey:@"dev_name"];
    [dict setValue:self.doorListDto.dev_mac forKey:@"dev_mac"];
    [dict setValue:self.doorListDto.dev_sn forKey:@"dev_sn"];
    [dict setValue:[NSNumber numberWithInt:1] forKey:@"comm_id"];
    [dict setValue:[CommonSystemInfo systemTimeInfo] forKey:@"event_time"];
    
    [dict setValue:[Config currentConfig].phone forKey:@"op_user"];
    [dict setValue:[NSNumber numberWithInt:2] forKey:@"event_type"];//接口文档里面没有
    [dict setValue:self.readerDto.cardno forKey:@"cardno"];//接口文档里面没有
    [self removeOverFlowActivityView];
    if (ret == SUCCESS)
    {
        [self presentSheet:NSLocalizedString(@"open_door_success", @"")];
        [[OpenSound shareInstance] playMusic];
        
        [dict setValue:[NSNumber numberWithInt:5] forKey:@"action_time"];
        [dict setValue:[NSNumber numberWithInt:2] forKey:@"op_time"];
        [dict setValue:[NSNumber numberWithInt:0] forKey:@"op_ret"];
        
    }
    else
    {
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
        [self presentSheet:NSLocalizedString(errorCode, @"")];
        
        [dict setValue:[NSNumber numberWithInt:0] forKey:@"action_time"];
        [dict setValue:[NSNumber numberWithInt:0] forKey:@"op_time"];
        [dict setValue:[NSNumber numberWithInt:1] forKey:@"op_ret"];
        
        
    }
    NSMutableArray *list = [NSMutableArray arrayWithObjects:dict, nil];
    [self.openDoorService postOpenDoorRecordRequest:list];
    
}

- (UploadOpenDoorService *)openDoorService
{
    if (!_openDoorService) {
        _openDoorService = [[UploadOpenDoorService alloc] init];
    }
    return _openDoorService;
}

@end
