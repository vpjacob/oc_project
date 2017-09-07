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


//@property (nonatomic,strong)NSMutableArray *dataSource;
@property (nonatomic,strong)NSArray *blackListArray;
@property (nonatomic, strong) NSMutableArray *isOnMutableArray;
@property (nonatomic, strong) UITableView *jjTabelView;
@property (nonatomic,strong)UILabel *messageLbl;

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
    [self.view addSubview:IsArrEmpty([[DeviceManager manager] getAllVoipDevice])?self.messageLbl:self.jjTabelView];
}

- (void)initWithBlackList{
//    NSLog(@"%@",[[DeviceManager manager] getAllVoipDevice]);
    for (int i = 0; i < [[DeviceManager manager] getAllVoipDevice].count; i++) {
        VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:i];
        
        if (self.blackListArray) {
            if ([self.blackListArray containsObject:dto.dev_sn]) {
                [self.isOnMutableArray addObject:@(NO)];
            }else{
                //                cell.sw.on = YES;
                [self.isOnMutableArray addObject:@(YES)];
            }
        }else{
            //            cell.sw.on = YES;
            [self.isOnMutableArray addObject:@(YES)];
        }
    }
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
    
    //    [cell setDataWith:indexPath.item];
    cell.sw.tag = indexPath.row + 100;
    //    NSArray *blackListArray = [DMCommModel getBlackList];
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:indexPath.row];
    cell.nameLabel.text = [NSString stringWithFormat:@"%@",dto.dev_name];
    
    cell.sw.on = [self.isOnMutableArray[indexPath.row] boolValue];
    
    
    //    if (blackListArray) {
    //        if ([blackListArray containsObject:dto.dev_sn]) {
    //            cell.sw.on = NO;
    //        }else{
    //            cell.sw.on = YES;
    //        }
    //    }else{
    //        cell.sw.on = YES;
    //    }
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
        [self.isOnMutableArray replaceObjectAtIndex:index withObject:@(YES)];
    }else{
        //            sw.on = YES;
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
