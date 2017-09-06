//
//  ServerCardOpViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "ServerCardOpViewController.h"
#import "MBProgressHUD+MJ.h"
#import "RequestService.h"
#import "NewNav.h"

@interface ServerCardOpViewController ()

@property (nonatomic, strong) NSMutableArray *cardnoList;
@property (nonatomic, strong) NSString *serverOpLastTime;
@property (nonatomic, strong) UIAlertView *calibrationAlert;
@property (nonatomic, strong) UITableView *serverCardOpTableView;

@end

@implementation ServerCardOpViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSString *titleName = [self.cardOpStatus isEqualToString:@"add"] ? @"cardno_register" : @"cardno_delete";
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(titleName, @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(titleName, @"");
    }
    [self.view addSubview:self.serverCardOpTableView];
    
    self.serverCardOpTableView.backgroundColor = self.view.backgroundColor;
    self.cardnoList = [[NSMutableArray alloc] init];
    [self setupSyncBtn];
    [self getServerCardCmd];
    // Do any additional setup after loading the view.
}

- (UITableView *)serverCardOpTableView
{
    if (!_serverCardOpTableView) {
        _serverCardOpTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        [_serverCardOpTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_serverCardOpTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _serverCardOpTableView.scrollEnabled = YES;
        _serverCardOpTableView.userInteractionEnabled = YES;
        _serverCardOpTableView.delegate = self;
        _serverCardOpTableView.dataSource = self;
        _serverCardOpTableView.backgroundColor = [UIColor whiteColor];
        _serverCardOpTableView.backgroundView = nil;
    }
    return _serverCardOpTableView;
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)setupSyncBtn
{
    UIButton *syncBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    
    [syncBtn setTitle:NSLocalizedString(@"sync",@"") forState:UIControlStateNormal];
    [syncBtn setTitleColor:[UIColor greenColor] forState:UIControlStateNormal];
    syncBtn.frame = CGRectMake(0, 0, 60, 30);
    [syncBtn addTarget:self action:@selector(syncBtnClick) forControlEvents:UIControlEventTouchUpInside];
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:syncBtn];
}

// 同步卡号操作
- (void)syncBtnClick
{
    if (self.cardnoList == nil || [self.cardnoList count] == 0)
    {
        return;
    }
    self.calibrationAlert = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"sync_cardno_tip", @"") message:nil delegate:self cancelButtonTitle:NSLocalizedString(@"cancel", @"") otherButtonTitles:NSLocalizedString(@"sync", @""), nil];
    [self.calibrationAlert show];
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
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.cardnoList count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *ID = @"SyncCardToDevice";
    // 从缓存队列中取出复用的cell
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:ID];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    
    cell.textLabel.text = self.cardnoList[indexPath.row];
    //    cell.detailTextLabel.text = NSLocalizedString(@"click_add", @"");
    return cell;
}

- (void) getServerCardCmd
{
    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"get_server_data", @"")];
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 600 * NSEC_PER_MSEC); // 延时600毫秒
    dispatch_after(popTime, dispatch_get_main_queue(), ^{
        
        [RequestService getServerCardCmd:self.libDevModel.devSn cmdStatus:self.cardOpStatus success:^(NSDictionary *result) {
            [hud hide:YES afterDelay:0];
            int ret = [result[@"ret"] intValue];
            if (ret == SUCCESS)
            {
                if (result[@"data"] == nil)
                {
                    [MBProgressHUD showTip:NSLocalizedString(@"no_sync_cardno", @"")];
                }
                else
                {
                    self.serverOpLastTime = result[@"data"][@"last_time"];
                    self.cardnoList = result[@"data"][@"card_list"];
                    if ([self.cardnoList count] == 0)
                    {
                        [MBProgressHUD showTip:NSLocalizedString(@"no_sync_cardno", @"")];
                    }
                    else
                    {
                        NSString *tips = [NSString stringWithFormat:NSLocalizedString(@"sync_cardno_count", @""), [self.cardnoList count]];
                        [MBProgressHUD showTip:tips];
                        [self.serverCardOpTableView reloadData];
                    }
                }
            }
        } failure:^(NSString *error) {
            [hud hide:YES afterDelay:0];
            [MBProgressHUD showError: error];
        }];
    });
}

// 在这里处理UIAlertView中的按钮被单击的事件
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    switch (buttonIndex) {
        case 0:{
            
        }break;
        case 1:{
            [self syncCardnoToDevice];
        }break;
            
        default:
            break;
    }
}

- (void) syncCardnoToDevice
{
    //    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"sync_cardno_wait", @"")];
    //    int ret = [self.cardOpStatus isEqualToString:@"add"] ? [LibDevModel writeCardToDevice:self.libDevModel andCards:self.cardnoList andAppend:YES] : [LibDevModel deleteCardFromDevice:self.libDevModel andCards:self.cardnoList];
    //    if (ret == SUCCESS)
    //    {
    //        // 接收操作结果--回调函数
    //        [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
    //            [hud hide:YES afterDelay:0];
    //            if (ret == SUCCESS)
    //            {
    //                [MBProgressHUD showTip:NSLocalizedString(@"sync_cardno_success", @"")];
    //            }
    //            else
    //            {
    //                NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
    //                [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
    //            }
    //        }];
    //
    //    }
    //    else
    //    {
    //        [hud hide:YES afterDelay:0];
    //        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
    //        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
    //    }
}

@end
