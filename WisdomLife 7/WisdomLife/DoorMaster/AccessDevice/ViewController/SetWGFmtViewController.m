//
//  SetWGFmtViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SetWGFmtViewController.h"
#import "MBProgressHUD+MJ.h"
#import "DoorDto.h"
#import "NewNav.h"

@interface SetWGFmtViewController ()

@property (nonatomic, strong) NSArray *dataArray;
@property (nonatomic) int wgfmt; // 韦根格式：26、34
@property (nonatomic, strong) UIButton *setWgFmtBtn;
@property (nonatomic, strong) UITableView *setWgFmtTableView;

@end

@implementation SetWGFmtViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"set_wgfmt", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"set_wgfmt", @"");
    }
    
    self.dataArray = @[NSLocalizedString(@"wg_26", @""), NSLocalizedString(@"wg_34", @"")];
    self.setWgFmtTableView.backgroundColor = self.view.backgroundColor;
    [self.view addSubview:self.setWgFmtTableView];
    [self setupTableFooter];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (UITableView *)setWgFmtTableView
{
    if (!_setWgFmtTableView) {
        _setWgFmtTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_setWgFmtTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_setWgFmtTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _setWgFmtTableView.scrollEnabled = YES;
        _setWgFmtTableView.userInteractionEnabled = YES;
        _setWgFmtTableView.delegate = self;
        _setWgFmtTableView.dataSource = self;
        _setWgFmtTableView.backgroundColor = [UIColor whiteColor];
        _setWgFmtTableView.backgroundView = nil;
    }
    return _setWgFmtTableView;
}

// 调整section间的间距
- (CGFloat) tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return section == 0 ? 10 : 5;
}
- (CGFloat) tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return section == 0 ? 10 : 5;
}

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.dataArray count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    // 为其定义一个标识符，在重用机制中，标识符非常重要，这是系统用来匹配table各行cell的判断标准
    static NSString *ID = @"SetWGFmt";
    // 从缓存队列中取出复用的cell
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    cell.textLabel.text = self.dataArray[indexPath.row];
    if (indexPath.row == 0)
    {
        cell.accessoryType = UITableViewCellAccessoryCheckmark;
        self.wgfmt = 26;
    }
    return cell;
}

// 单元行点击事件
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    int otherPathRow = indexPath.row == 1 ? 0 : 1;
    NSIndexPath *anotherIndex = [NSIndexPath indexPathForRow:otherPathRow inSection:indexPath.section];
    UITableViewCell *anotherCell = [tableView cellForRowAtIndexPath:anotherIndex];
    anotherCell.accessoryType = UITableViewCellAccessoryNone;
    
    UITableViewCell *curCell = [tableView cellForRowAtIndexPath:indexPath];
    curCell.accessoryType = UITableViewCellAccessoryCheckmark;
    self.wgfmt = indexPath.row == 0 ? 26 : 34;
}

// 设置按钮
- (void)setupTableFooter
{
    // 创建按钮
    self.setWgFmtTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 50)];
    _setWgFmtBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    CGFloat buttonW = kDeviceWidth - 40;
    CGFloat buttonH = 40;
    [_setWgFmtBtn setTitle:NSLocalizedString(@"setting", @"") forState:UIControlStateNormal];
    _setWgFmtBtn.frame = CGRectMake((kDeviceWidth - buttonW) / 2, 20, buttonW, buttonH);
    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
    _setWgFmtBtn.backgroundColor = myColorRGB;
    [_setWgFmtBtn addTarget:self action:@selector(setWgFmtBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    [GlobalTool addCornerForView:_setWgFmtBtn];
    _setWgFmtBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
    [self.setWgFmtTableView.tableFooterView addSubview:_setWgFmtBtn];
}

- (void)setWgFmtBtnClick:(id)sender
{
    LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
    int ret = [LibDevModel setDeviceParam:libDevModel andWGFmt:self.wgfmt andOpenTime:5 andLockSwitch:0];
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
            [MBProgressHUD showTip:NSLocalizedString(@"set_wg_success", @"")];
        }
        else
        {
            NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
            [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        }
    }];
}

@end
