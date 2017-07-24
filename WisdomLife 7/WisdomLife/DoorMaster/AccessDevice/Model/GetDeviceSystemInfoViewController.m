//
//  GetDeviceSystemInfoViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 01/04/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "GetDeviceSystemInfoViewController.h"
#import "MBProgressHUD+MJ.h"
#import "DevSystemInfoModel.h"
#import "DevSystemInfoManager.h"
#import "DoorDto.h"
#import "NewNav.h"

@interface GetDeviceSystemInfoViewController ()

@property (nonatomic, strong) NSArray *dataArray;
@property (nonatomic, strong) UIButton *getSystemInfoBtn;
@property (nonatomic, strong) UITableView *getSystemInfoTableView;

@end

@implementation GetDeviceSystemInfoViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"get_dev_info", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"get_dev_info", @"");
    }
    
    [self.view addSubview:self.getSystemInfoTableView];
    self.getSystemInfoTableView.backgroundColor = self.view.backgroundColor;
    self.getSystemInfoTableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
    
    self.dataArray = @[@[@"open_time", @"count_of_cards", @"count_of_users", @"max_card_capacity", @"lock_switch_signal", @"device_version"]];
    
    [self setupTableFooter];
    
    DevSystemInfoModel *infoModel = [[DevSystemInfoManager manager] getDevSystemInfo:self.devModel.reader_sn];
    if (infoModel != nil)
    {
        [self setCellDetailText:infoModel];
    }
    // Do any additional setup after loading the view.
}

- (UITableView *)getSystemInfoTableView
{
    if (!_getSystemInfoTableView) {
        _getSystemInfoTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_getSystemInfoTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_getSystemInfoTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _getSystemInfoTableView.scrollEnabled = YES;
        _getSystemInfoTableView.userInteractionEnabled = YES;
        _getSystemInfoTableView.delegate = self;
        _getSystemInfoTableView.dataSource = self;
        _getSystemInfoTableView.backgroundColor = [UIColor whiteColor];
        _getSystemInfoTableView.backgroundView = nil;
    }
    return _getSystemInfoTableView;
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
    static NSString *ID = @"getSystemInfo";
    // 从缓存队列中取出复用的cell
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:ID];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        if ([[ContentUtils shareContentUtils] isCube]) {
            cell.textLabel.textColor = kLightGrayColor;
            cell.textLabel.font = kSystem(14);
            cell.detailTextLabel.textColor = kLightGrayColor;
            cell.detailTextLabel.font = kSystem(14);
        }
    }
    cell.textLabel.text = NSLocalizedString(self.dataArray[indexPath.section][indexPath.row], @"");
    return cell;
}

// 设置按钮
- (void)setupTableFooter
{
    // 创建按钮
    self.getSystemInfoTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 50)];
    _getSystemInfoBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    CGFloat buttonW = kDeviceWidth - 40;
//    CGFloat buttonH = 40;
    CGFloat buttonH = kCurrentWidth(44);
    [_getSystemInfoBtn setTitle:NSLocalizedString(@"retrieve_dev_info", @"") forState:UIControlStateNormal];
    _getSystemInfoBtn.frame = CGRectMake((kDeviceWidth - buttonW) / 2, 20, buttonW, buttonH);
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    _getSystemInfoBtn.backgroundColor = myColorRGB;
    _getSystemInfoBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [_getSystemInfoBtn addTarget:self action:@selector(getSystemInfoBtnClick:) forControlEvents:UIControlEventTouchUpInside];
//    [GlobalTool addCornerForView:_getSystemInfoBtn];
    _getSystemInfoBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
    [self.getSystemInfoTableView.tableFooterView addSubview:_getSystemInfoBtn];
}

- (void)getSystemInfoBtnClick:(id)sender
{
    LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
    int ret = [LibDevModel controlDevice:libDevModel andOperation:CTRL_GET_DEV_INFO];
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
            [MBProgressHUD showTip:NSLocalizedString(@"get_dev_info_success", @"")];
            
            DevSystemInfoModel *infoModel = [[DevSystemInfoModel alloc] init];
            infoModel.devSn = self.devModel.reader_sn;
            infoModel.wgfmt = [dataDict[@"wgfmt"] intValue];
            infoModel.openTime = [dataDict[@"openTime"] intValue];
            infoModel.lockSwitch = [dataDict[@"lockSwitch"] intValue];
            infoModel.cardCount = [dataDict[@"cardCount"] intValue];
            infoModel.maxCardCount = [dataDict[@"maxCardCount"] intValue];
            infoModel.userCount = [dataDict[@"userCount"] intValue];
            infoModel.version = dataDict[@"version"];
            [[DevSystemInfoManager manager] updateDevSystemInfo:infoModel];
            [self setCellDetailText:infoModel];
        }
        else
        {
            NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
            [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        }
    }];
}

-(void) setCellDetailText:(DevSystemInfoModel *)infoModel
{
    NSString *lockSwitch = infoModel.lockSwitch == 0 ? @"lock_control" : @"manually_control";
    NSArray *cellDetailArray = @[[NSString stringWithFormat:@"%d", infoModel.openTime], [NSString stringWithFormat:@"%d", infoModel.cardCount], [NSString stringWithFormat:@"%d", infoModel.userCount], [NSString stringWithFormat:@"%d", infoModel.maxCardCount], NSLocalizedString(lockSwitch, @""), infoModel.version];
    for (int i = 0; i < cellDetailArray.count; i++)
    {
        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:i inSection:0];
        UITableViewCell *curCell = [self.getSystemInfoTableView cellForRowAtIndexPath:indexPath];
        curCell.detailTextLabel.text = cellDetailArray[i];
    }
}


@end
