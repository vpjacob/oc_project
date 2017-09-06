//
//  DeviceLockParamViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 01/04/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "DeviceLockParamViewController.h"
#import "DoorDto.h"
#import "MBProgressHUD+MJ.h"
#import "NewNav.h"

@interface DeviceLockParamViewController ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) NSMutableArray *dataArray;
@property (nonatomic, strong) UITextField *openTimeField; // 开门时长
@property (nonatomic) int lockControl; // 锁控参数
@property (nonatomic, strong) UIButton *setLockParamBtn;
@property (nonatomic, strong) UITableView *deviceSettingTableView;

@end

@implementation DeviceLockParamViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"set_lock_param", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"set_lock_param", @"");
    }
    [self.view addSubview:self.deviceSettingTableView];
    self.deviceSettingTableView.backgroundColor = self.view.backgroundColor;
    self.deviceSettingTableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
    
    self.dataArray = [[NSMutableArray alloc] init];
    NSMutableArray *tempArray = [[NSMutableArray alloc] init];
    [tempArray addObject:@"lock_control"];
    [tempArray addObject:@"manually_control"];
    [self.dataArray addObject:tempArray];
    
    tempArray = [[NSMutableArray alloc] init];
    [tempArray addObject:@"open_time_label"];
    [self.dataArray addObject:tempArray];
    
    [self setupTableFooter];
    // Do any additional setup after loading the view.
}

- (UITableView *)deviceSettingTableView
{
    if (!_deviceSettingTableView) {
        _deviceSettingTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_deviceSettingTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_deviceSettingTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _deviceSettingTableView.scrollEnabled = YES;
        _deviceSettingTableView.userInteractionEnabled = YES;
        _deviceSettingTableView.delegate = self;
        _deviceSettingTableView.dataSource = self;
        _deviceSettingTableView.backgroundColor = [UIColor whiteColor];
        _deviceSettingTableView.backgroundView = nil;
    }
    return _deviceSettingTableView;
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

// 调整section间的间距
//- (CGFloat) tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
//{
//    return section == 0 ? 10 : 5;
//}
//- (CGFloat) tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
//{
//    return section == 0 ? 10 : 5;
//}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return self.dataArray.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.dataArray[section] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    // 为其定义一个标识符，在重用机制中，标识符非常重要，这是系统用来匹配table各行cell的判断标准
    static NSString *ID = @"LockParamSet";
    // 从缓存队列中取出复用的cell
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        if ([[ContentUtils shareContentUtils] isCube]) {
            cell.textLabel.textColor = kLightGrayColor;
            cell.textLabel.font = kSystem(14);
        }
    }
    cell.textLabel.text = NSLocalizedString(self.dataArray[indexPath.section][indexPath.row], @"");
    
    if(indexPath.section == 0)
    {
        if (indexPath.row == 0)
        {
            if (self.lockControl == 0)
            {
                cell.accessoryType = UITableViewCellAccessoryCheckmark;
                self.lockControl = 0;
            }
        }
        else
        {
            if (self.lockControl == 1)
            {
                cell.accessoryType = UITableViewCellAccessoryCheckmark;
                self.lockControl = 1;
            }
        }
    }
    else
    {
        if (self.lockControl == 0)
        {
            self.openTimeField = [[UITextField alloc] initWithFrame: CGRectMake(50, 100, 80, 50)];
            self.openTimeField.keyboardType = UIKeyboardTypeNumberPad;
            //        self.openTimeField.clearButtonMode = UITextFieldViewModeWhileEditing;
            self.openTimeField.text = @"5";
            //设置textfield占位符及内容字体的颜色--Benson
            
            NSDictionary *attributes = nil;
            if ([[ContentUtils shareContentUtils] isCube]) {
                self.openTimeField.textColor = kLightGrayColor;
                attributes = @{NSForegroundColorAttributeName:kLightGrayColor,NSFontAttributeName:kSystem(14)};
            }else
            {
                self.openTimeField.textColor = kBlackColor;
                attributes = @{NSForegroundColorAttributeName:kLightGrayColor};
            }
            self.openTimeField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:NSLocalizedString(@"please_enter", @"") attributes:attributes];
            cell.accessoryView = self.openTimeField;
        }
        else
        {
            
        }
    }
    
    return cell;
}

// 单元行点击事件
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == 0)
    {
        int otherPathRow = indexPath.row == 1 ? 0 : 1;
        NSIndexPath *anotherIndex = [NSIndexPath indexPathForRow:otherPathRow inSection:indexPath.section];
        UITableViewCell *anotherCell = [tableView cellForRowAtIndexPath:anotherIndex];
        anotherCell.accessoryType = UITableViewCellAccessoryNone;
        
        UITableViewCell *curCell = [tableView cellForRowAtIndexPath:indexPath];
        curCell.accessoryType = UITableViewCellAccessoryCheckmark;
        self.lockControl = indexPath.row == 0 ? 0 : 1;
        
        if (indexPath.row == 0)
        {
            if (self.dataArray.count != 2)
            {
                NSMutableArray *tempArray = [[NSMutableArray alloc] init];
                [tempArray addObject:@"open_time_label"];
                [self.dataArray addObject:tempArray];
                [self.deviceSettingTableView reloadData];
            }
        }
        else
        {
            if (self.dataArray.count == 2)
            {
                [self.dataArray removeObjectAtIndex:1];
                [self.deviceSettingTableView reloadData];
            }
        }
    }
}

// 设置按钮
- (void)setupTableFooter
{
    // 创建按钮
    self.deviceSettingTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 50)];
    _setLockParamBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    CGFloat buttonW = kDeviceWidth - 40;
//    CGFloat buttonH = 40;
    CGFloat buttonH = kCurrentWidth(44);
    [_setLockParamBtn setTitle:NSLocalizedString(@"setting", @"") forState:UIControlStateNormal];
    _setLockParamBtn.frame = CGRectMake((kDeviceWidth - buttonW) / 2, 20, buttonW, buttonH);
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    _setLockParamBtn.backgroundColor = myColorRGB;
    _setLockParamBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [_setLockParamBtn addTarget:self action:@selector(setLockParamBtnClick:) forControlEvents:UIControlEventTouchUpInside];
//    [GlobalTool addCornerForView:_setLockParamBtn];
    _setLockParamBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
    [self.deviceSettingTableView.tableFooterView addSubview:_setLockParamBtn];
}

- (void)setLockParamBtnClick:(id)sender
{
    if (self.openTimeField.text.length == 0)
    {
        [GlobalTool alertTipsView:@"empty_open_time"];
        return;
    }
    LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
    // 一体机默认只支持韦根34卡号
    int ret = [LibDevModel setDeviceParam:libDevModel andWGFmt:34 andOpenTime:[self.openTimeField.text intValue] andLockSwitch:self.lockControl];
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
            [MBProgressHUD showTip:NSLocalizedString(@"set_param_success", @"")];
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
