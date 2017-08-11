//
//  DoorListViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/10/29.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "DoorListViewController.h"
#import "JJDoorListViewCell.h"
//#import "CallViewController.h"
#import "HomeService.h"
#import "LoginDto.h"
#import "DeviceManager.h"
#import <DMVPhoneSDK/DMVPhoneSDK.h>

@interface DoorListViewController ()<UITableViewDataSource,UITableViewDelegate,JJDoorListViewCellDelegate>


@property (nonatomic,strong)NSMutableArray *dataSource;
@property (nonatomic, strong) UITableView *jjTabelView;
@property (nonatomic,strong)UILabel *messageLbl;

@end

@implementation DoorListViewController

#define kCollectionViewCellReuseID @"kCollectionViewCellReuseID"



- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(devListMsgReceved) name:DevListMsgReceved object:nil]; // 注册刷新设备列表接口
    self.commonNavBar.title = NSLocalizedString(@"DoorList", @"");
    [self.view addSubview:IsArrEmpty([[DeviceManager manager] getAllVoipDevice])?self.messageLbl:self.jjTabelView];
}

-(void)devListMsgReceved
{
//    [self.collectionView reloadData];
    [self.tableView reloadData];
}

#pragma mark - UICollectionViewDelegate && UICollectionViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return [[DeviceManager manager] getAllVoipDevice].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    JJDoorListViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"JJDoorListViewCell"];
    if (cell ==nil) {
        cell = [[NSBundle mainBundle] loadNibNamed:@"JJDoorListViewCell" owner:self options:nil].lastObject;
    }
    
    [cell setDataWith:indexPath.item];
    cell.sw.tag = indexPath.row + 100;
    NSArray *blackListArray = [DMCommModel getBlackList];
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:indexPath.row];
    cell.nameLabel.text = [NSString stringWithFormat:@"%@",dto.dev_name];
    
    if (blackListArray) {
        if ([blackListArray containsObject:dto.dev_sn]) {
            cell.sw.on = NO;
        }else{
            cell.sw.on = YES;
        }
    }else{
        cell.sw.on = YES;
    }
    cell.delegate = self;
    return cell;
}

#pragma mark - JJDoorListViewCellDelegate
- (void)JJDoorListView:(JJDoorListViewCell *)doorListCell withSwitch:(UISwitch *)sw didSelectIndex:(NSInteger)index{
        VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:index];
        NSLog(@"%@",dto.dev_sn);
        NSLog(@"%zd",sw.on);
        if (sw.on) {
//            sw.on = NO;
            [DMCommModel modifyBlackList:dto.dev_sn isAdd:NO];

        }else{
//            sw.on = YES;
            [DMCommModel modifyBlackList:dto.dev_sn isAdd:YES];

        }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 60;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:indexPath.item];
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    //呼叫--Benson
    [DMCommModel callAccount:dto.dev_sn callAccountType:@(2) callback:^(int ret, NSString *msg) {
        if (ret != 0) {
            [self performSelectorOnMainThread:@selector(presentTips:)  withObject:msg waitUntilDone:NO];//运行在主线程里，要不然没有runloop，定时器不起作用--Benson
        }else
        {
            DMCallViewController *nextCtr = [[DMCallViewController alloc]init];
            nextCtr.callType = 0;
            nextCtr.addStr = dto.dev_name;
            nextCtr.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
            [self presentViewController:nextCtr animated:YES completion:nil];
        }
    }];
}

/*
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:indexPath.item];
    [collectionView deselectItemAtIndexPath:indexPath animated:YES];
    //NSString *sipid = @"10429@112.124.51.161:7198";
    //NSString *sipid = @"sip:1031@www.seemorecloud.com:55060";
//    NSString *sipid = [NSString stringWithFormat:@"sip:%@@114.55.106.95:55060",dto.dev_voip_account];
//    LinphoneAddress *addr = [LinphoneUtils normalizeSipOrPhoneAddress:sipid];
//    [[LinphoneManager instance] call:addr];
//    
//    CallViewController *nextCtr = [[CallViewController alloc] init];
//    nextCtr.callType = DoorViewType;
//    nextCtr.addStr = dto.dev_name;
//    nextCtr.doorDto = dto;
    
    //呼叫--Benson
    [DMCommModel callAccount:dto.dev_sn callAccountType:@(2) callback:^(int ret, NSString *msg) {
        if (ret != 0) {
            [self performSelectorOnMainThread:@selector(presentTips:)  withObject:msg waitUntilDone:NO];//运行在主线程里，要不然没有runloop，定时器不起作用--Benson
        }else
        {
            DMCallViewController *nextCtr = [[DMCallViewController alloc]init];
            nextCtr.callType = 0;
            nextCtr.addStr = dto.dev_name;
            nextCtr.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
            [self presentViewController:nextCtr animated:YES completion:nil];
        }
    }];
    
}
*/


-(void)presentTips:(NSString *)title{
    [self presentSheet:title];
}

#pragma mark - Setter && Getter

- (UILabel *)messageLbl
{
    if (!_messageLbl) {
        _messageLbl = [[UILabel alloc] initWithFrame:CGRectMake(0, kCurrentWidth(150), kDeviceWidth, kCurrentWidth(20))];
        _messageLbl.text = NSLocalizedString(@"NoData", @"");
        _messageLbl.textAlignment = NSTextAlignmentCenter;
        _messageLbl.font = kSystem(15);
    }
    return _messageLbl;
}

- (UITableView *)jjTabelView{
    if (!_jjTabelView) {
        _jjTabelView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight) style:UITableViewStylePlain];
        _jjTabelView.dataSource = self;
        _jjTabelView.delegate = self;
        _jjTabelView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _jjTabelView.bounces = NO;
    }
    return _jjTabelView;
}

- (NSMutableArray *)dataSource
{
    if (!_dataSource) {
        _dataSource = [NSMutableArray array];
    }
    return _dataSource;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
