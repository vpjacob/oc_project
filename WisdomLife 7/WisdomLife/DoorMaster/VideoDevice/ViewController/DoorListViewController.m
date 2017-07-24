//
//  DoorListViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/10/29.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "DoorListViewController.h"
#import "DoorListViewCell.h"
//#import "CallViewController.h"
#import "HomeService.h"
#import "LoginDto.h"
#import "DeviceManager.h"

@interface DoorListViewController ()<UICollectionViewDelegate,UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>

@property (nonatomic,strong)UICollectionView *collectionView;

@property (nonatomic,strong)NSMutableArray *dataSource;

@property (nonatomic,strong)UILabel *messageLbl;

@end

@implementation DoorListViewController

#define kCollectionViewCellReuseID @"kCollectionViewCellReuseID"

- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(devListMsgReceved) name:DevListMsgReceved object:nil]; // 注册刷新设备列表接口
    self.commonNavBar.title = NSLocalizedString(@"DoorList", @"");
    
    [self.view addSubview:IsArrEmpty([[DeviceManager manager] getAllVoipDevice])?self.messageLbl:self.collectionView];
}

-(void)devListMsgReceved
{
    [self.collectionView reloadData];
}

#pragma mark - UICollectionViewDelegate && UICollectionViewDataSource
- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
    return 1;
}
 
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return [[DeviceManager manager] getAllVoipDevice].count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    DoorListViewCell *cell = (DoorListViewCell *)[collectionView dequeueReusableCellWithReuseIdentifier:kCollectionViewCellReuseID forIndexPath:indexPath];
    [cell setDataWith:indexPath.item];
    return cell;
}
//item格子尺寸
- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return CGSizeMake((kDeviceWidth-1)/2, (kDeviceWidth-1)/2);
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section
{
    return 1;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section
{
    return 1;
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section
{
    return UIEdgeInsetsMake(1, 0, 0, 0);
}

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

-(void)presentTips:(NSString *)title{
    [self presentSheet:title];
}

#pragma mark - Setter && Getter
- (UICollectionView *)collectionView
{
    if (!_collectionView) {
        UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
        flowLayout.scrollDirection = UICollectionViewScrollDirectionVertical;

        _collectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight) collectionViewLayout:flowLayout];
        _collectionView.delegate = self;
        _collectionView.dataSource = self;
        [_collectionView registerClass:[DoorListViewCell class] forCellWithReuseIdentifier:kCollectionViewCellReuseID];
        _collectionView.backgroundColor = kBackgroundColor;
    }
    return _collectionView;
}

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
