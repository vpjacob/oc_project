//
//  CardManagerViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "CardManagerViewController.h"
#import "DoorDto.h"
#import "AddCardViewController.h"
#import "DelCardViewController.h"
#import "NewNav.h"

@interface CardManagerViewController ()

@property (nonatomic, strong) UIButton *registerCardBtn;
@property (nonatomic, strong) UIButton *deleteCardBtn;
@property (nonatomic, strong) LibDevModel *libDevModel;

@end

@implementation CardManagerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"card_manage", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"card_manage", @"");
    }
    self.libDevModel = [DoorReaderDto initLibDevModel:self.devModel];
    [self setupButton];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)setupButton
{
    CGFloat width = kDeviceWidth - 60;
//    CGFloat height = 38;
    CGFloat height = kCurrentWidth(44);
    // 登记卡按钮
    self.registerCardBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.registerCardBtn setTitle:NSLocalizedString(@"register_card", @"") forState:UIControlStateNormal];
    self.registerCardBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 100, width, height); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.registerCardBtn.backgroundColor = myColorRGB;
    self.registerCardBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.registerCardBtn addTarget:self action:@selector(registerCardBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.registerCardBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    // 删除卡按钮
    self.deleteCardBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.deleteCardBtn setTitle:NSLocalizedString(@"delete_card", @"") forState:UIControlStateNormal];
    self.deleteCardBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 115+height, width, height); // x, y, width, height
//    self.deleteCardBtn.backgroundColor = [UIColor redColor];
    self.deleteCardBtn.backgroundColor = [UIColor grayColor];
    [self.deleteCardBtn addTarget:self action:@selector(deleteCardBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.deleteCardBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
//    [GlobalTool addCornerForView: self.registerCardBtn];
//    [GlobalTool addCornerForView: self.deleteCardBtn];
    [self.view addSubview: self.registerCardBtn];
    [self.view addSubview: self.deleteCardBtn];
}

- (void)registerCardBtnClick:(id)sender
{
    AddCardViewController *addCard = [[AddCardViewController alloc] init];
    addCard.libDevModel = self.libDevModel;
    [self.navigationController pushViewController:addCard animated:YES];
}

- (void)deleteCardBtnClick:(id)sender
{
    DelCardViewController *delCard = [[DelCardViewController alloc] init];
    delCard.libDevModel = self.libDevModel;
    [self.navigationController pushViewController:delCard animated:YES];
}


@end
