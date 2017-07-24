//
//  OpenRecordViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/13.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "OpenRecordViewController.h"
//#import "OpenRecordViewCell.h"
#import "DevOpenLogManager.h"
#import "GongGaoCell.h"

@interface OpenRecordViewController ()

//@property (nonatomic,strong)UploadOpenDoorService *openDoorService;

//@property (nonatomic,strong)NSMutableArray *dataSource;

@end

@implementation OpenRecordViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.commonNavBar.title = NSLocalizedString(@"open_door_record", @"");
    self.tableView.frame = CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight);
    self.tableView.backgroundColor = kBackgroundColor;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.view addSubview:self.tableView];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(updateOpenLog) name:OpenLogUpdate object:nil];
    
//    [self displayOverFlowActivityView];
//    [self.openDoorService getOpenDoorRecordRequest:nil];
}

-(void)updateOpenLog
{
    [self.groupTableView reloadData];
}

-(void)viewDidDisappear:(BOOL)animated
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - UITableViewDelegate && UITableViewDataSource
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [DevOpenLogManager manager].list.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellStr = @"OpenRecordViewCell";
//    OpenRecordViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellStr];
//    if (cell == nil) {
//        cell = [[OpenRecordViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellStr];
//    }
//    [cell setDataWith:indexPath.row list:self.dataSource];
    
    GongGaoCell *cell = [tableView dequeueReusableCellWithIdentifier:cellStr];
    if (cell == nil) {
        cell = [[GongGaoCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellStr];
    }
    
    DevOpenLogModel *openLogModel = [[DevOpenLogManager manager] getOpenLog:indexPath.row];
    [cell setOpenLog:openLogModel];
    
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return jjSCREENH(50);
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return 0.000000001;
}



- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 12;
}

//不使用以下从网络获取开门记录，直接读取本地开门记录即可
//- (void)getOpenDoorRecordRequestInfoItem:(BOOL)isSuccess list:(NSMutableArray *)list errorMsg:(NSString *)errorMsg
//{
//    [self removeOverFlowActivityView];
//    [self.dataSource removeAllObjects];
//    if (isSuccess) {
//        [self.dataSource addObjectsFromArray:list];
//    } else {
//        [self presentSheet:errorMsg];
//    }
//    [self.groupTableView reloadData];
//}

//不使用以下从网络获取开门记录，直接读取本地开门记录即可
//- (UploadOpenDoorService *)openDoorService
//{
//    if(!_openDoorService){
//        _openDoorService = [[UploadOpenDoorService alloc] init];
//        _openDoorService.delegate = self;
//    }
//    return _openDoorService;
//}

//- (NSMutableArray *)dataSource
//{
//    if (!_dataSource) {
//        _dataSource = [NSMutableArray array];
//    }
//    return _dataSource;
//}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
