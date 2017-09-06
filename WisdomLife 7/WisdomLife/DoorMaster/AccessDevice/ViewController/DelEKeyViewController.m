//
//  DelEKeyViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "DelEKeyViewController.h"
#import "EKeyCell.h"
#import "RequestService.h"
#import "MBProgressHUD+MJ.h"
#import "NewNav.h"

@interface DelEKeyViewController ()<UITableViewDataSource, UITableViewDelegate>
@property (nonatomic, strong) NSMutableArray *dataArray;
@property (nonatomic, strong) UITableView *delEKeyTableView;
@end

@implementation DelEKeyViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"delete_ekey", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"delete_ekey", @"");
    }
    // Do any additional setup after loading the view.
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    self.delEKeyTableView.rowHeight = 80.0f;
    //    self.delEKeyTableView.backgroundColor = self.view.backgroundColor;
    self.delEKeyTableView.tableFooterView = [[UIView alloc] init];
    
    self.delEKeyTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.dataArray = [[NSMutableArray alloc] init];
    [self getDevUserEKey];
}

- (UITableView *)delEKeyTableView
{
    if (!_delEKeyTableView) {
        _delEKeyTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_delEKeyTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_delEKeyTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _delEKeyTableView.scrollEnabled = YES;
        _delEKeyTableView.userInteractionEnabled = YES;
        _delEKeyTableView.delegate = self;
        _delEKeyTableView.dataSource = self;
//        _delEKeyTableView.backgroundColor = [UIColor whiteColor];
//        _delEKeyTableView.backgroundView = nil;
        [self.view addSubview:_delEKeyTableView];
    }
    return _delEKeyTableView;
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (self.dataArray == nil)
    {
        //        DEBUG_PRINT(@"=----dataArray=nil");
        return 0;
    }
    //    DEBUG_PRINT(@"=+++dataArray=%lu", (unsigned long)[self.dataArray count]);
    return [self.dataArray count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    //    DEBUG_PRINT(@"====tableView load");
    NSMutableDictionary *dataDict = self.dataArray[indexPath.row];
    EKeyCell *cell = [EKeyCell eKeyCellWithTableView:tableView];
    [cell setEKeyCell:dataDict[@"receiver"] startDate:dataDict[@"start_date"] endDate:dataDict[@"end_date"] privilege:[dataDict[@"privilege"] intValue] createDate:dataDict[@"create_date"]];
    return cell;
}

- (NSString *)tableView:(UITableView *)tableView titleForDeleteConfirmationButtonForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return NSLocalizedString(@"delete", @"");
}

- (UITableViewCellEditingStyle)tableView:(UITableView *)tableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return UITableViewCellEditingStyleDelete;
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self delDevUserEKey:indexPath.row];
    //    [self.dataArray removeObjectAtIndex: indexPath.row];
    //    [self.tableView reloadData];
}

- (void) getDevUserEKey
{
    [RequestService getDevEkeyUser:self.devSn success:^(NSDictionary *result) {
        int ret = [result[@"ret"] intValue];
        if (ret == 0)
        {
            
            self.dataArray = [result[@"data"] mutableCopy];
//            NSArray *dataArr = result[@"data"];
//            NSLog(@"%@", dataArr);
//            for (NSMutableDictionary *dataDict in dataArr)
//            {
//                [self.dataArray addObject: dataDict];
//            }
            [self.delEKeyTableView reloadData];
        }
        else
        {
            [MBProgressHUD showError:result[@"msg"]];
        }
    } failure:^(NSString *error) {
        [MBProgressHUD showError:error];
    }];
}

- (void) delDevUserEKey:(long)index
{
    NSMutableDictionary *dataDict = self.dataArray[index];
    
    [RequestService delDevEkeyUser:dataDict[@"receiver"] devSn:self.devSn success:^(NSDictionary *result) {
        int ret = [result[@"ret"] intValue];
        if (ret == 0)
        {
            [self.dataArray removeObjectAtIndex: index];
            [self.delEKeyTableView reloadData];
        }
        else
        {
            [MBProgressHUD showError:result[@"msg"]];
        }
    } failure:^(NSString *error) {
        [MBProgressHUD showError:error];
    }];
}

@end
