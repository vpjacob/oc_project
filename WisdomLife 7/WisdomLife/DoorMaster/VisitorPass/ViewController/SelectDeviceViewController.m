//
//  SelectedViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 08/04/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SelectDeviceViewController.h"
#import "DeviceManager.h"
#import "DoorDto.h"
#import "VisitorViewController.h"
#import "NewNav.h"
#import "SelectDeviceTableViewCell.h"

@interface SelectDeviceViewController ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic,strong) UITableView *deviceTableView;
@property (nonatomic,strong) NSMutableArray *allAccessDevice;
@property (nonatomic,strong)UIImageView *markImg;

@end

@implementation SelectDeviceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
//    [self.view addSubview:self.markImg];
    
//    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"yoho_select_device_title", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
//    }else
//    {
//        self.commonNavBar.title = NSLocalizedString(@"yoho_select_device_title", @"");
//    }
//    
//    [self.view bringSubviewToFront:self.commonNavBar];
    
    NSMutableArray *tmpArr = [[DeviceManager manager] getAllAccessDevice];
    self.allAccessDevice = [NSMutableArray array];
    
    //筛选出能访客授权的设备
    for (DoorListDto * dto in tmpArr) {
        DoorReaderDto *readerDto = dto.readerArr.firstObject;
        int devType = [readerDto.dev_type intValue];
        if (devType == DEV_TYPE_AM100 || devType == DEV_TYPE_AM200 || devType == DEV_TYPE_AM160 || devType == DEV_TYPE_AM260 || devType == DEV_TYPE_QC200)
        {
            [self.allAccessDevice addObject: dto]; // 访客授权
        }
    }
    
    if (self.allAccessDevice.count == 0) {
        [self presentSheet:NSLocalizedString(@"no_authorize_device", @"")];
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1000 * NSEC_PER_MSEC);
        dispatch_after(popTime, dispatch_get_main_queue(), ^{
            [self.navigationController popViewControllerAnimated:YES];
        });
        return;
    }
    
    [self.view addSubview:self.deviceTableView];
    
    // Do any additional setup after loading the view.
}

- (UIImageView *)markImg
{
    if (!_markImg) {
        _markImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, kCurrentWidth(174))];
        _markImg.image = [UIImage imageNamed:@"访客同行证"];
    }
    return _markImg;
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

-(UITableView *)deviceTableView
{
    
    if (!_deviceTableView) {
        _deviceTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight) style:UITableViewStylePlain];
        [_deviceTableView setSeparatorStyle:UITableViewCellSeparatorStyleSingleLine];
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

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.allAccessDevice.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *cellIdentity = @"selectDeviceCell";
    SelectDeviceTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentity];
    if (!cell) {
        cell = [[SelectDeviceTableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:cellIdentity];
        cell.deviceImage.image = [UIImage imageNamed:@"close_blue"];
    }
    
    DoorListDto *readDto = (DoorListDto *)self.allAccessDevice[indexPath.row];
    cell.deviceName.text = readDto.show_name;
    
    return cell;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return kCurrentWidth(60);
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    DoorReaderDto *readDto = ((DoorListDto *)self.allAccessDevice[indexPath.row]).readerArr.firstObject;
    
    VisitorViewController *visitorVC = self.viewController;
    visitorVC.selectedDevName = ((DoorListDto *)self.allAccessDevice[indexPath.row]).show_name;
    int devType = [readDto.dev_type intValue];
    if (devType == DEV_TYPE_AM100 || devType == DEV_TYPE_AM200 || devType == DEV_TYPE_AM160 || devType == DEV_TYPE_AM260)
    {
        visitorVC.type = 1; //普通门禁设备
    }else
    {
        visitorVC.type = 2; //二维码设备
    }
    visitorVC.selectedDevSn = readDto.reader_sn;
    [self.navigationController popViewControllerAnimated:YES];
}

@end
