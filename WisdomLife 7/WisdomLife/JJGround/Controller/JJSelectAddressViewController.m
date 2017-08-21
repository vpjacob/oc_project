//
//  JJSelectAddressViewController.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/18.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJSelectAddressViewController.h"

static NSString *rightCell = @"rightCell";
static NSString *leftCell = @"rightCell";
@interface JJSelectAddressViewController ()<UITableViewDelegate,UITableViewDataSource>



@property (nonatomic, strong) UITableView *leftTableView;
@property (nonatomic, strong) UITableView *rightTableView;

@property (nonatomic, strong) NSMutableArray *dateSource;
@property (nonatomic, strong) NSMutableArray *leftDateSource;
@property (nonatomic, strong) NSMutableArray *rightDateSource;
@property (nonatomic, strong) NSArray *dataArray;
@end

@implementation JJSelectAddressViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self initSubviews];
    
}

#pragma mark - init
- (void)initSubviews{
    self.dateSource = [NSMutableArray array];
    self.leftDateSource = [NSMutableArray array];
    self.rightDateSource = [NSMutableArray array];
    [self.view addSubview:self.leftTableView];
    [self.view addSubview:self.rightTableView];
    
    
    
    
    
    self.dataArray =     @[@{@"title":@"推荐",@"list":@[@"香港",@"澳门",@"东京",@"曼谷",@"台北",@"新加坡"]},
                           @{@"title":@"港澳台",@"list":@[@"香港",@"澳门",@"台湾"]},
                           @{@"title":@"新马泰",@"list":@[@"泰国",@"马来西亚",@"新加坡"]},
                           @{@"title":@"日韩",@"list":@[@"日本",@"韩国"]},
                           @{@"title":@"亚洲其他国家",@"list":@[@"菲律宾",@"越南",@"柬埔寨",@"斯里兰卡",@"印度",@"印度尼西亚",@"马尔代夫",@"尼泊尔"]},
                           @{@"title":@"美洲",@"list":@[@"美国",@"加拿大",@"墨西哥",@"巴西",@"阿根廷"]},
                           @{@"title":@"大洋洲",@"list":@[@"澳大利亚",@"新西兰",@"斐济"]},
                           @{@"title":@"欧洲",@"list":@[@"法国",@"意大利",@"德国",@"西班牙",@"英国",@"瑞士",@"荷兰",@"奥地利",@"捷克",@"希腊",@"俄罗斯",@"丹麦",@"匈牙利",@"瑞典",@"葡萄牙",@"挪威",@"比利时",@"芬兰",@"波兰",@"斯洛伐克",@"爱尔兰"]},
                           @{@"title":@"中东非洲",@"list":@[@"阿联酋",@"土耳其",@"沙特阿拉伯",@"毛里求斯",@"南非",@"以色列"]},
                           ];
    
    //                         @{@"title":@"第十组",@"list":@[@"10",@"one",@"two",@"three",@"foue",@"five"]},
    //                         @{@"title":@"第十一",@"list":@[@"11",@"one",@"two",@"three",@"foue",@"five"]},
    
    
    
    for (int i = 0; i < self.dataArray.count; i++) {
        [self.leftDateSource addObject:self.dataArray[i][@"title"]];
        [self.rightDateSource addObject:self.dataArray[i][@"list"]];
    }
    NSArray *arr = _rightDateSource[0];
    [self.dateSource addObjectsFromArray:arr];
}

#pragma mark - UITableViewDelegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    //    if (tableView == self.leftTableView) {
    return 1;
    //    }else{
    //        return _dataArray.count;
    //    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    //    NSDictionary *item = [_dataArray objectAtIndex:section];
    //    if (tableView == self.leftTableView) {
    //        return _dataArray.count;
    //    }else{
    //        return [[item objectForKey:@"list"]count];
    //    }
    
    if (tableView == self.leftTableView) {
        return _leftDateSource.count;
    }
    //    NSArray *arr = _rightDateSource[section];
    return self.dateSource.count;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    UITableViewCell * cell;
    if (tableView == self.leftTableView) {
        cell = [tableView dequeueReusableCellWithIdentifier:leftCell forIndexPath:indexPath];
        cell.textLabel.text = [_dataArray[indexPath.row]objectForKey:@"title"];
    }else{
        cell = [tableView dequeueReusableCellWithIdentifier:rightCell forIndexPath:indexPath];
        //        NSDictionary *item = [_dataArray objectAtIndex:indexPath.section];
        //        cell.textLabel.text = [item objectForKey:@"list"][indexPath.row];
        cell.textLabel.text = _dateSource[indexPath.row];
    }
    return cell;
    
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    if (tableView == self.leftTableView) {
        //        [self.rightTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForItem:0 inSection:indexPath.row]  atScrollPosition:UITableViewScrollPositionTop animated:YES];
        [self.dateSource removeAllObjects];
        NSArray *arr = _rightDateSource[indexPath.row];
        [self.dateSource addObjectsFromArray:arr];
        [self.rightTableView reloadData];
    }
    
}


#pragma mark - Setter&Getter
- (UITableView *)leftTableView{
    if (!_leftTableView) {
        CGFloat scrollerViewHeight = kDeviceHeight - 64 - 50;
        _leftTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth*0.25, scrollerViewHeight) style:UITableViewStylePlain];
        _leftTableView.dataSource = self;
        _leftTableView.delegate = self;
        
        [_leftTableView registerClass:[UITableViewCell class] forCellReuseIdentifier:leftCell];
    }
    return _leftTableView;
}

- (UITableView *)rightTableView{
    if (!_rightTableView) {
        CGFloat scrollerViewHeight = kDeviceHeight - 64 - 50;
        _rightTableView = [[UITableView alloc] initWithFrame:CGRectMake(kDeviceWidth*0.25, 0, kDeviceWidth*0.75, scrollerViewHeight) style:UITableViewStylePlain];
        _rightTableView.dataSource = self;
        _rightTableView.delegate = self;
        
        [_rightTableView registerClass:[UITableViewCell class] forCellReuseIdentifier:rightCell];
    }
    return _rightTableView;
}

@end
