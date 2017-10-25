//
//  OpenDoorListViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/13.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "OpenDoorListViewController.h"
#import "OpenDoorViewCell.h"
#import "HomeService.h"
#import "DoorDto.h"
#import <DoorMasterSDK/DoorMasterSDK.h>
#import <AVFoundation/AVFoundation.h>
#import "DeviceManager.h"
#import "DoorDetailViewController.h"
#import "MJRefresh.h"
#import "DevOpenLogManager.h"
#import "DMLoginAction.h"

@interface OpenDoorListViewController () <AVAudioPlayerDelegate>

@property (nonatomic,strong)UIImageView *messageLbl;

@property (nonatomic,strong)UploadOpenDoorService *openDoorService;

@property (nonatomic, strong) AVAudioPlayer * avAudioPlayer;
@property (nonatomic, strong) AVAudioSession *audioSession;

@end

@implementation OpenDoorListViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(devListMsgReceved) name:DevListMsgReceved object:nil]; // 注册刷新设备列表接口
    
    self.dataSource = [[DeviceManager manager] getAllAccessDevice];
    self.commonNavBar.title = NSLocalizedString(@"guardList", @"");

    self.tableView.frame = CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight);
    self.tableView.backgroundColor = kBackgroundColor;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.view addSubview:IsArrEmpty(self.dataSource)?self.messageLbl:self.tableView];
    
    [self initPlayOpenDoorSound]; // 初始化开门声音
    
    //下拉刷新
    __weak typeof(self) weakSelf = self;
    self.tableView.header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        [weakSelf refreshTableView];
    }];
}

-(void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self refreshTableView];
}

-(void)refreshTableView
{
    __weak typeof(self) weakSelf = self;
    
//    NSDictionary *dic = [[NSUserDefaults standardUserDefaults] objectForKey:@"loginUserAcount"];
//
//    NSString *account = dic[@"account"];
//    NSString *password = dic[@"password"];
//    [DMLoginAction loginWithUsername:account andPwd:password withWebView:nil andScriptMessage:nil];
    
    int ret = [LibDevModel scanDevice:300];
    if (ret == SUCCESS) {
        [LibDevModel onScanOver:^(NSMutableDictionary *devDict) {
            [weakSelf.tableView.header endRefreshing];
            [[DeviceManager manager] updataOnlineDevice:devDict];
            weakSelf.dataSource = [[DeviceManager manager] getAllAccessDevice];
            [weakSelf.tableView reloadData];
        }];
    }else
    {
        [weakSelf.tableView reloadData];
    }
}

//设备变化是更新列表
-(void)devListMsgReceved
{
    //设备数据更新时，强制回到设备列表
    if (![self.navigationController.topViewController isKindOfClass:[OpenDoorListViewController class]]) {
        [self presentSheetOnKeyWindow:[UIApplication sharedApplication].keyWindow andTitle:NSLocalizedString(@"device_refresh", @"")];
        [self.navigationController popToViewController:self animated:YES];
    }
    self.dataSource = [[DeviceManager manager] getAllAccessDevice];
    [self refreshTableView];
}

-(void)nextVC:(UIButton *)sender
{
    DoorDetailViewController *dvc = [[DoorDetailViewController alloc] init];
    dvc.doorListDto = self.dataSource[sender.tag];
    [self.navigationController pushViewController:dvc animated:YES];
}

#pragma mark - UITableViewDelegate && UITableViewDataSource
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.dataSource.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellStr = @"OpenDoorViewCell";
    OpenDoorViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellStr];
    if (cell == nil) {
        cell = [[OpenDoorViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellStr];
    }
    [cell setDataWith:indexPath.row list:self.dataSource];
    [cell.detailBtn addTarget:self action:@selector(nextVC:) forControlEvents:UIControlEventTouchUpInside];
    cell.detailBtn.tag = indexPath.row;
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return jjSCREENH(60);
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return 0.000000001;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 0;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    DoorListDto *dto = [self.dataSource safeObjectAtIndex:indexPath.row];
    [self openDoor:dto andOpenType:1];
}

- (void)openDoor:(DoorListDto *)model andOpenType:(int)openType
{
    DoorReaderDto *readerDto = [model.readerArr safeObjectAtIndex:0];
    
    //    DevModel *devModel = [[DevManager manager] getDevBySn:devSn];
    if (readerDto == nil)
    {
        if (openType == 1)
        {
            [self presentSheet:NSLocalizedString(@"no_open_dev", @"")];
        }
        return;
    }
    [self displayOverFlowActivityView];

    // 调用sdk操作设备
    LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:readerDto];
    if ([readerDto.dev_type intValue] == DEV_TYPE_RD100 || [readerDto.dev_type intValue] == DEV_TYPE_LC100 || [readerDto.dev_type intValue] == DEV_TYPE_QD100)
    {
        libDevModel.cardno = [Config currentConfig].cardno;
    }
    
    int ret = [LibDevModel controlDevice:libDevModel andOperation:0x00];
    if (ret != SUCCESS)
    {
        //        if (openType == 1)
        //        {
        [self removeOverFlowActivityView];
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
        [self presentSheet:NSLocalizedString(errorCode, @"")];
        //        }
        return;
    }
    [self playOpenDoorSound];
    [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {

        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:model.show_name forKey:@"dev_name"];
        [dict setValue:model.dev_mac forKey:@"dev_mac"];
        [dict setValue:model.dev_sn forKey:@"dev_sn"];
        [dict setValue:[NSNumber numberWithInt:1] forKey:@"comm_id"];
        [dict setValue:[CommonSystemInfo systemTimeInfo] forKey:@"event_time"];
        
        [dict setValue:[Config currentConfig].phone forKey:@"op_user"];
        [dict setValue:[NSNumber numberWithInt:1] forKey:@"event_type"];//接口文档里面没有
        [dict setValue:readerDto.cardno forKey:@"cardno"];//接口文档里面没有
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
        //将开门记录保存到本地
        DevOpenLogModel *model = [[DevOpenLogModel alloc] init];
        [model initOpenLogWithDic:dict];
        [[DevOpenLogManager manager] addOpenLog:model];
        
        NSMutableArray *list = [NSMutableArray arrayWithObjects:dict, nil];
        [self.openDoorService postOpenDoorRecordRequest:list];

    }];
}


- (UIImageView *)messageLbl
{
    if (!_messageLbl) {
        _messageLbl = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"nomoredata"]];
        _messageLbl.center = self.view.center;
        
        
    }
    return _messageLbl;
}

- (UploadOpenDoorService *)openDoorService
{
    if (!_openDoorService) {
        _openDoorService = [[UploadOpenDoorService alloc] init];
    }
    return _openDoorService;
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

// 初始化开门声音
- (void)initPlayOpenDoorSound
{
    NSString *string = [[NSBundle mainBundle] pathForResource:@"open_door_sound" ofType:@"wav"];
    //把音频文件转换成url格式
    NSURL *url = [NSURL fileURLWithPath:string];
    self.audioSession = [AVAudioSession sharedInstance];
    [self.audioSession setCategory:AVAudioSessionCategoryPlayback error:nil];
    self.avAudioPlayer = [[AVAudioPlayer alloc] init];
    self.avAudioPlayer = [self.avAudioPlayer initWithContentsOfURL:url error:nil];
    //设置代理
    //        avAudioPlayer.delegate = self;
    //设置初始音量大小
    [self.avAudioPlayer setVolume:3.0];
    //设置音乐播放次数  -1为一直循环
    self.avAudioPlayer.numberOfLoops = 0;
}
// 播放开门声音
-(void)playOpenDoorSound
{
    [self.audioSession setActive:YES error:nil]; // 设置为YES，其他的播放类App如酷狗会中断
    [self.avAudioPlayer play];
}
// 代理开门声音session处理结果
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    [self.audioSession setActive:NO error:nil];
}
- (void)audioPlayerDecodeErrorDidOccur:(AVAudioPlayer *)player error:(NSError *)error
{
    [self.audioSession setActive:NO error:nil];
}
- (void) audioPlayerBeginInterruption:(AVAudioPlayer *)player
{
    [self.audioSession setActive:NO error:nil];
}
- (void) audioPlayerEndInterruption:(AVAudioPlayer *)player withOptions:(NSUInteger)flags
{
    [self.audioSession setActive:NO error:nil];
}

@end
