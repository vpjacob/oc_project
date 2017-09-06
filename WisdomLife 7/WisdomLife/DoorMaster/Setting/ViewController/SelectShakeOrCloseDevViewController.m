//
//  SelectShakeOrCloseDevViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 19/05/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SelectShakeOrCloseDevViewController.h"
#import "DeviceManager.h"
#import "DoorDto.h"
#import "NewNav.h"
//#import "ShakeViewController.h"
//#import "CloseViewController.h"
#import "SelectDeviceTableViewCell.h"

@interface SelectShakeOrCloseDevViewController ()

@property (nonatomic, strong) NSArray *allDevice;
@property (nonatomic, strong) UITableView *deviceTableView;
@property (nonatomic, strong) NSMutableArray *selectedArr;
@property (nonatomic, strong) NSMutableArray *btnArray;
@end

@implementation SelectShakeOrCloseDevViewController

- (void)viewDidLoad {
    self.btnArray = [NSMutableArray array];
    [super viewDidLoad];
    self.commonNavBar.title = @"选择设备";
    [self.view addSubview:self.commonNavBar];
    [self.view addSubview:self.deviceTableView];
    
    self.deviceTableView.tableHeaderView = [self getTableHeadView];
    
}



-(UIView *)getTableHeadView
{
    
    
    UIView *headView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 70)];
    
    UIView *lineV = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 0.5)];
    lineV.backgroundColor = [UIColor colorWithHexString:@"dddddd"];
    [headView addSubview:lineV];
    
    UIButton *selectAll = [[UIButton alloc] initWithFrame:CGRectMake(10, 5, (kDeviceWidth - 40) / 3.0, 60)];
    [selectAll setTitle:NSLocalizedString(@"select_device_all", @"") forState:UIControlStateNormal];
    [selectAll setTitleColor:[UIColor colorWithHexString:@"797979"] forState:UIControlStateNormal];
    [selectAll setTitleColor:[UIColor colorWithHexString:@"0eaae3"] forState:UIControlStateSelected];
    [selectAll addTarget:self action:@selector(selectAllAction:) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *selectNone = [[UIButton alloc] initWithFrame:CGRectMake(20 + (kDeviceWidth - 40) / 3.0, 5, (kDeviceWidth - 30) / 3.0, 60)];
    [selectNone setTitleColor:[UIColor colorWithHexString:@"797979"] forState:UIControlStateNormal];
    [selectNone setTitle:NSLocalizedString(@"select_device_none", @"") forState:UIControlStateNormal];
    [selectNone setTitleColor:[UIColor colorWithHexString:@"0eaae3"] forState:UIControlStateSelected];
    [selectNone addTarget:self action:@selector(selectNoneAction:) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *selectNegate = [[UIButton alloc] initWithFrame:CGRectMake(30 + (kDeviceWidth - 40) / 3.0 * 2.0, 5, (kDeviceWidth - 40) / 3.0, 60)];
    [selectNegate setTitle:NSLocalizedString(@"select_device_negate", @"") forState:UIControlStateNormal];
    [selectNegate setTitleColor:[UIColor colorWithHexString:@"797979"] forState:UIControlStateNormal];
    [selectNegate setTitleColor:[UIColor colorWithHexString:@"0eaae3"] forState:UIControlStateSelected];
    [selectNegate addTarget:self action:@selector(selectNegateAction:) forControlEvents:UIControlEventTouchUpInside];
    
    [headView addSubview:selectAll];
    [headView addSubview:selectNone];
    [headView addSubview:selectNegate];
    
    UIView *lineV2 = [[UIView alloc] initWithFrame:CGRectMake(0, 70, kDeviceWidth, 0.5)];
    lineV2.backgroundColor = [UIColor colorWithHexString:@"dddddd"];
    [headView addSubview:lineV2];
    [self.btnArray addObject:selectAll];
    [self.btnArray addObject:selectNone];
    [self.btnArray addObject:selectNegate];
    return headView;
}

-(void)selectAllAction:(UIButton *)sender
{
    for (int i = 0; i < self.selectedArr.count; i++) {
        self.selectedArr[i] = @(1);
    }
    [self saveAction];
    [self.deviceTableView reloadData];
    [self changeTextColor:sender];
}

-(void)selectNoneAction:(UIButton *)sender
{
    for (int i = 0; i < self.selectedArr.count; i++) {
        self.selectedArr[i] = @(0);
    }
    [self saveAction];
    [self.deviceTableView reloadData];
    [self changeTextColor:sender];
}

-(void)selectNegateAction:(UIButton *)sender
{
    for (int i = 0; i < self.selectedArr.count; i++) {
        if ([self.selectedArr[i] intValue] == 0) {
            self.selectedArr[i] = @(1);
        }else
        {
            self.selectedArr[i] = @(0);
        }
    }
    [self saveAction];
    [self.deviceTableView reloadData];
    [self changeTextColor:sender];
}

- (void)changeTextColor:(UIButton *)btn{
    
    for (UIButton * button in self.btnArray) {
        
        button.selected = NO;
        
        if (btn == button) {
            btn.selected = YES;
        }else{
            button.selected = NO;
        }
    }

}

-(void)saveAction
{

    if (self.type == SHAKETYPE) {
        for (int i = 0; i < self.selectedArr.count; i++) {
            if ([self.selectedArr[i] intValue] == 0) {
                ((DoorReaderDto *)((DoorListDto *)self.allDevice[i]).readerArr.firstObject).canUseShakeOpen = NO;
            }else
            {
                ((DoorReaderDto *)((DoorListDto *)self.allDevice[i]).readerArr.firstObject).canUseShakeOpen = YES;
            }
        }
    }else
    {
        for (int i = 0; i < self.selectedArr.count; i++) {
            if ([self.selectedArr[i] intValue] == 0) {
                ((DoorReaderDto *)((DoorListDto *)self.allDevice[i]).readerArr.firstObject).canUseNearOpen = NO;
            }else
            {
                ((DoorReaderDto *)((DoorListDto *)self.allDevice[i]).readerArr.firstObject).canUseNearOpen = YES;
            }
        }
    }


    [[DeviceManager manager] saveDevList];
}

-(NSArray *)allDevice
{
    if (!_allDevice) {
        _allDevice = [[DeviceManager manager] getAllAccessDevice];
    }
    return _allDevice;
}

-(NSMutableArray *)selectedArr
{
    if (!_selectedArr) {
        _selectedArr = [NSMutableArray array];

        if (self.type == SHAKETYPE) {
            for (DoorListDto *dto in self.allDevice) {
                DoorReaderDto *readDto = dto.readerArr.firstObject;
                if (!readDto.canUseShakeOpen) {
                    [_selectedArr addObject:@(0)];
                }else
                {
                    [_selectedArr addObject:@(1)];
                }
            }
        }else
        {
            for (DoorListDto *dto in self.allDevice) {
                DoorReaderDto *readDto = dto.readerArr.firstObject;
                if (!readDto.canUseNearOpen) {
                    [_selectedArr addObject:@(0)];
                }else
                {
                    [_selectedArr addObject:@(1)];
                }
            }
        }
    }
    return _selectedArr;
}

- (UITableView *)deviceTableView
{
    if (!_deviceTableView) {
        _deviceTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_deviceTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_deviceTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _deviceTableView.scrollEnabled = YES;
        _deviceTableView.userInteractionEnabled = YES;
        _deviceTableView.delegate = self;
        _deviceTableView.dataSource = self;
        _deviceTableView.backgroundColor = [UIColor whiteColor];
        _deviceTableView.backgroundView = nil;
    }
    return _deviceTableView;
}

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return kCurrentWidth(60);
}


-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.allDevice.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *cellIdentity = @"selectDeviceCell";
    SelectDeviceTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentity];
    if (!cell) {
        cell = [[SelectDeviceTableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:cellIdentity];
        cell.deviceImage.image = [UIImage imageNamed:@"lock"];
    }
    
    DoorListDto *readDto = (DoorListDto *)self.allDevice[indexPath.row];
    cell.deviceName.text = readDto.show_name;
    
    if ([self.selectedArr[indexPath.row] intValue] == 0) {
        cell.accessoryType = UITableViewCellAccessoryNone;
    }else
    {
        cell.accessoryType = UITableViewCellAccessoryCheckmark;
    }
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if ([self.selectedArr[indexPath.row] intValue] == 0) {
        self.selectedArr[indexPath.row] = @(1);
        if (self.type == SHAKETYPE) {
            ((DoorReaderDto *)((DoorListDto *)self.allDevice[indexPath.row]).readerArr.firstObject).canUseShakeOpen = YES;
        }else
        {
            ((DoorReaderDto *)((DoorListDto *)self.allDevice[indexPath.row]).readerArr.firstObject).canUseNearOpen = YES;
        }
    }else
    {
        self.selectedArr[indexPath.row] = @(0);
        if (self.type == SHAKETYPE) {
            ((DoorReaderDto *)((DoorListDto *)self.allDevice[indexPath.row]).readerArr.firstObject).canUseShakeOpen = NO;
        }else
        {
            ((DoorReaderDto *)((DoorListDto *)self.allDevice[indexPath.row]).readerArr.firstObject).canUseNearOpen = NO;
        }
    }
    [self.deviceTableView reloadData];
    [[DeviceManager manager] saveDevList];
}


@end
