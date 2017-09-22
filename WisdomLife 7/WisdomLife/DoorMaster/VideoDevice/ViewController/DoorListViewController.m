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
#import "MJRefresh.h"
#import "Masonry.h"

@interface DoorListViewController ()<UITableViewDataSource,UITableViewDelegate,JJDoorListViewCellDelegate>

//@property (nonatomic,strong)NSMutableArray *dataSource;
@property (nonatomic,strong)NSArray *blackListArray;
@property (nonatomic, strong) NSMutableArray *isOnMutableArray;
@property (nonatomic, strong) UITableView *jjTabelView;
@property (nonatomic,strong)UIImageView *messageLbl;

@end

@implementation DoorListViewController

#define kCollectionViewCellReuseID @"kCollectionViewCellReuseID"



- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(devListMsgReceved) name:DevListMsgReceved object:nil]; // 注册刷新设备列表接口
    self.commonNavBar.title = NSLocalizedString(@"DoorList", @"");
    self.blackListArray = [DMCommModel getBlackList];
    NSLog(@"blackListArray：%@",self.blackListArray);
    [self initWithBlackList];
    [self.view addSubview:self.jjTabelView];
    __weak typeof(self) weakSelf = self;
    self.jjTabelView.header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        [weakSelf refreshCollectionView];
    }];
}



- (void)initWithBlackList{
//    NSLog(@"%@",[[DeviceManager manager] getAllVoipDevice]);
    for (int i = 0; i < [[DeviceManager manager] getAllVoipDevice].count; i++) {
        VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:i];
        
        if (self.blackListArray) {
            if ([self.blackListArray containsObject:dto.dev_sn]) {
                [self.isOnMutableArray addObject:@(NO)];
            }else{
                [self.isOnMutableArray addObject:@(YES)];
            }
        }else{
            [self.isOnMutableArray addObject:@(YES)];
        }
    }
}

-(void)devListMsgReceved
{
    [self.jjTabelView reloadData];
}

-(void)refreshCollectionView
{
    __weak typeof(self) weakSelf = self;
    
    [HomeService videoDoorWithSuccess:^(NSDictionary *result) {
        [weakSelf.jjTabelView.header endRefreshing];
        int ret = [result[@"ret"] intValue];
        if (ret == 0) {
            NSArray *dataArr = result[@"data"][@"dev_list"];
            NSMutableArray *voipDevices = [NSMutableArray array];
            if ([dataArr isKindOfClass:[NSArray class]]) {
                for (NSDictionary *dict in dataArr) {
                    VoipDoorDto *dto = [[VoipDoorDto alloc] init];
                    dto.community_code = dict[@"community_code"];
                    dto.dev_name = dict[@"dev_name"];
                    dto.dev_sn = dict[@"dev_sn"];
                    dto.sn = dto.dev_sn;
                    dto.dev_type = [dict[@"dev_type"] intValue];
                    VoipDoorDto *localDevice = [[DeviceManager manager] getVoipDeviceWithSn:dto.dev_sn];
                    if (localDevice != nil) {
                        dto.dev_voip_account = localDevice.dev_voip_account;
                    }
                    [voipDevices addObject:dto];
                }
                [[DeviceManager manager].tmpList removeAllObjects];
                [[DeviceManager manager].tmpList addObjectsFromArray:voipDevices];
                [[DeviceManager manager].tmpList addObjectsFromArray:[[DeviceManager manager] getAllAccessDevice]];
                [[DeviceManager manager] updateAllLocalDeviceList];
            }
        }else
        {
            [weakSelf presentTips:result[@"msg"]];
        }
        [weakSelf initWithBlackList];
    } failure:^(NSError *error) {
        [weakSelf.jjTabelView.header endRefreshing];
        [weakSelf presentTips:@"没有查找到用户信息"];
    }];
}

#pragma mark - UICollectionViewDelegate && UICollectionViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    if ([[DeviceManager manager] getAllVoipDevice].count >0) {
        [self.messageLbl removeFromSuperview];
    }else{
        [self.jjTabelView addSubview:self.messageLbl];
    }
    return [[DeviceManager manager] getAllVoipDevice].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    JJDoorListViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"JJDoorListViewCell"];
    if (cell ==nil) {
        cell = [[NSBundle mainBundle] loadNibNamed:@"JJDoorListViewCell" owner:self options:nil].lastObject;
    }
    
    cell.sw.tag = indexPath.row + 100;
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:indexPath.row];
    cell.nameLabel.text = [NSString stringWithFormat:@"%@",dto.dev_name];
    cell.sw.on = [self.isOnMutableArray[indexPath.row] boolValue];
    cell.delegate = self;
    return cell;
}

#pragma mark - JJDoorListViewCellDelegate
- (void)JJDoorListView:(JJDoorListViewCell *)doorListCell withSwitch:(UISwitch *)sw didSelectIndex:(NSInteger)index{
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:index];
    NSLog(@"%@",dto.dev_sn);
    NSLog(@"%zd",sw.on);
    if (sw.on) {
        [DMCommModel modifyBlackList:dto.dev_sn isAdd:NO];
        [self.isOnMutableArray replaceObjectAtIndex:index withObject:@(YES)];
    }else{
        [DMCommModel modifyBlackList:dto.dev_sn isAdd:YES];
        [self.isOnMutableArray replaceObjectAtIndex:index withObject:@(NO)];
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 100;
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

//给cell添加动画
-(void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    cell.layer.transform = CATransform3DMakeScale(0.1, 0.1, 1);
    [UIView animateWithDuration:0.3 animations:^{
        cell.layer.transform = CATransform3DMakeScale(1, 1, 1);
    }];
}


-(void)presentTips:(NSString *)title{
    [self presentSheet:title];
}

#pragma mark - Setter && Getter

- (UIImageView *)messageLbl
{
    if (!_messageLbl) {
        _messageLbl = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"nomoredata"]];
        _messageLbl.center = CGPointMake(kDeviceWidth*0.5, kDeviceHeight*0.3);
    }
    return _messageLbl;
}

- (UITableView *)jjTabelView{
    if (!_jjTabelView) {
        _jjTabelView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight) style:UITableViewStylePlain];
        _jjTabelView.dataSource = self;
        _jjTabelView.delegate = self;
        _jjTabelView.separatorStyle = UITableViewCellSeparatorStyleNone;
    }
    return _jjTabelView;
}


- (NSMutableArray *)isOnMutableArray{
    if (!_isOnMutableArray) {
        _isOnMutableArray = [NSMutableArray array];
    }
    return _isOnMutableArray;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
