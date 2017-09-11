//
//  CommonViewController.m
//  Storm
//
//  Created by 朱攀峰 on 15/11/27.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "CommonViewController.h"
#import "HdMsgBox.h"
#import "MBProgressHUD.h"
@interface CommonViewController ()<MBProgressHUDDelegate>

@property (nonatomic,assign)BOOL isPresentSheet;

@property (strong, nonatomic) MBProgressHUD *hud;

@end

@implementation CommonViewController
- (void)dealloc
{
    _tableView.delegate = nil;
    _tableView.dataSource = nil;
    _tableView = nil;
    
    _groupTableView.delegate = nil;
    _groupTableView.dataSource = nil;
    _groupTableView = nil;
    
    _tpTableView.delegate = nil;
    _tpTableView.dataSource = nil;
    _tpTableView = nil;
    
    _tpGroupTableView.delegate = nil;
    _tpGroupTableView.dataSource = nil;
    _tpGroupTableView = nil;
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self.navigationController setNavigationBarHidden:YES animated:YES];
    if (!self.isHiddenBackBtn) {
        [self initBackBtn];
    }
    [self.view addSubview:self.commonNavBar];
}
- (void)initBackBtn
{
    UIButton *back = [UIButton buttonWithType:UIButtonTypeCustom];
    [back setFrame:CGRectMake(0, 0, 60.0, self.navigationController.navigationBar.height)];
    [back setImage:[UIImage imageNamed:@"navi_back"] forState:UIControlStateNormal];
    [back setImageEdgeInsets:UIEdgeInsetsMake(0, -45, 0, 0)];
    [back addTarget:self action:@selector(backNavItemTapped) forControlEvents:UIControlEventTouchUpInside];
    back.backgroundColor = [UIColor clearColor];
    
    UIBarButtonItem *backButtonItem = [[UIBarButtonItem alloc] initWithCustomView:back];
    self.navigationItem.leftBarButtonItem = backButtonItem;
    
}
- (void)backNavItemTapped
{
    [self.navigationController popViewControllerAnimated:YES];
}
- (CommonNavBar *)commonNavBar
{
    if (!_commonNavBar) {
        _commonNavBar = [[CommonNavBar alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, kNavBarHeight)];
        UIView *lineView = [[UIView alloc] initWithFrame:CGRectMake(0, 63.5, kDeviceWidth, 0.5)];
        lineView.backgroundColor = [UIColor colorWithHexString:@"dddddd"];
        [_commonNavBar addSubview:lineView];
        [_commonNavBar.backBtn addTarget:self action:@selector(backNavItemTapped) forControlEvents:UIControlEventTouchUpInside];
    }
    return _commonNavBar;
}
- (UITableView *)tableView
{
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        [_tableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_tableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _tableView.scrollEnabled = YES;
        _tableView.userInteractionEnabled = YES;
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.backgroundColor = [UIColor whiteColor];
        _tableView.backgroundView = nil;
    }
    return _tableView;
}
- (UITableView *)groupTableView
{
    if (!_groupTableView) {
        _groupTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStyleGrouped];
        [_groupTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_groupTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _groupTableView.scrollEnabled = YES;
        _groupTableView.userInteractionEnabled = YES;
        _groupTableView.delegate = self;
        _groupTableView.dataSource = self;
        _groupTableView.backgroundColor = [UIColor whiteColor];
        _groupTableView.backgroundView = nil;
    }
    return _groupTableView;
}
- (TPKeyboardAvoidingTableView *)tpTableView
{
    if (!_tpTableView) {
        _tpTableView = [[TPKeyboardAvoidingTableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        [_tpTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_tpTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _tpTableView.scrollEnabled = YES;
        _tpTableView.userInteractionEnabled = YES;
        _tpTableView.delegate = self;
        _tpTableView.dataSource = self;
        _tpTableView.backgroundColor = [UIColor whiteColor];
        _tpTableView.backgroundView = nil;
    }
    return _tpTableView;
}
- (TPKeyboardAvoidingTableView *)tpGroupTableView
{
    if (!_tpGroupTableView) {
        _tpGroupTableView = [[TPKeyboardAvoidingTableView alloc] initWithFrame:CGRectZero style:UITableViewStyleGrouped];
        [_tpGroupTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_tpGroupTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _tpGroupTableView.scrollEnabled = YES;
        _tpGroupTableView.userInteractionEnabled = YES;
        _tpGroupTableView.delegate = self;
        _tpGroupTableView.dataSource = self;
        _tpGroupTableView.backgroundColor = [UIColor whiteColor];
        _tpGroupTableView.backgroundView = nil;
    }
    return _tpGroupTableView;
}
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 0;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 0;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return [[UITableViewCell alloc] init];
}

- (void)presentSheet:(NSString *)title
{
    self.isPresentSheet = YES;
    [self removeOverFlowActivityView];
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.labelText = title;
    hud.margin = 15.f;
    hud.yOffset = 00.f;
    hud.removeFromSuperViewOnHide = YES;
    [hud hide:YES afterDelay:3];
    
}

- (void)presentSheetOnKeyWindow:(UIWindow *)window andTitle:(NSString *)title
{
    self.isPresentSheet = YES;
    [self removeOverFlowActivityView];
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:window animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.labelText = title;
    hud.margin = 15.f;
    hud.yOffset = 00.f;
    hud.removeFromSuperViewOnHide = YES;
    [hud hide:YES afterDelay:3];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self.view endEditing:YES];
    if (self.isPresentSheet) {
        [self removeOverFlowActivityView];
    }
}
- (void)displayOverFlowActivityView
{
    self.isPresentSheet = NO;
    _hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    _hud.mode = MBProgressHUDModeIndeterminate;
    _hud.margin = 20.f;
    _hud.yOffset = 30.f;
    _hud.opacity = 0.7;
    _hud.removeFromSuperViewOnHide = YES;
    
}
- (void)removeOverFlowActivityView
{
    [_hud hide:YES];
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    if ([self respondsToSelector:@selector(interactivePopGestureRecognizer)]) {
        self.navigationController.interactivePopGestureRecognizer.enabled = NO;
    }
    viewController.hidesBottomBarWhenPushed = YES;
    [self.navigationController pushViewController:viewController animated:animated];
    UIViewController *vc = [self.navigationController.viewControllers objectAtIndex:0];
    vc.hidesBottomBarWhenPushed = NO;
}
- (void)performBlock:(void(^)())block afterDelay:(NSTimeInterval)delay {
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC));
    dispatch_after(popTime, dispatch_get_main_queue(), block);
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
