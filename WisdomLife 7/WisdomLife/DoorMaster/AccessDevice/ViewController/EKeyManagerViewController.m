//
//  EKeyManagerViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "EKeyManagerViewController.h"
#import "SendEKeyViewController.h"
#import "DelEKeyViewController.h"
#import "DoorDto.h"
#import "NewNav.h"

@interface EKeyManagerViewController ()

@property (nonatomic, strong) UIButton *sendUserEKeyBtn;
@property (nonatomic, strong) UIButton *delUserEKeyBtn;

@end

@implementation EKeyManagerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"ekey_manage", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"ekey_manage", @"");
    }
    
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
    CGFloat height = kCurrentWidth(44);
    
    // 发送电子钥匙
    self.sendUserEKeyBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.sendUserEKeyBtn setTitle:NSLocalizedString(@"send_ekey", @"") forState:UIControlStateNormal];
    self.sendUserEKeyBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 100, width, height); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.sendUserEKeyBtn.backgroundColor = myColorRGB;
    self.sendUserEKeyBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.sendUserEKeyBtn addTarget:self action:@selector(sendUserEKeyBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.sendUserEKeyBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    // 删除电子钥匙
    self.delUserEKeyBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.delUserEKeyBtn setTitle:NSLocalizedString(@"delete_ekey", @"") forState:UIControlStateNormal];
    self.delUserEKeyBtn.frame = CGRectMake((kDeviceWidth - width) / 2, 115+height, width, height); // x, y, width, height
//    self.delUserEKeyBtn.backgroundColor = [UIColor redColor];
    self.delUserEKeyBtn.backgroundColor = kGrayColor;
    [self.delUserEKeyBtn addTarget:self action:@selector(deleteUserEKeyBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.delUserEKeyBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
//    [GlobalTool addCornerForView: self.sendUserEKeyBtn];
//    [GlobalTool addCornerForView: self.delUserEKeyBtn];
    [self.view addSubview: self.sendUserEKeyBtn];
    [self.view addSubview: self.delUserEKeyBtn];
}

- (void)sendUserEKeyBtnClick:(id)sender
{
    //    UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
    //    SendEKeyViewController *sendEKey = [mainStoryboard instantiateViewControllerWithIdentifier:@"sendEKeyCtl"];
    //    sendEKey.devModel = self.devModel;
    //    [self.navigationController pushViewController:sendEKey animated:YES];
    SendEKeyViewController *sendEKey = [[SendEKeyViewController alloc] init];
    sendEKey.devModel = self.devModel;
    sendEKey.devName = self.devName;
    [self.navigationController pushViewController:sendEKey animated:YES];
    
}

- (void)deleteUserEKeyBtnClick:(id)sender
{
    DelEKeyViewController *delEKey = [[DelEKeyViewController alloc] init];
    delEKey.devSn = self.devModel.reader_sn;
    [self.navigationController pushViewController:delEKey animated:YES];
}

@end
