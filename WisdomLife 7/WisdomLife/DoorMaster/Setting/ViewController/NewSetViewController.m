//
//  NewSetViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/7.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "NewSetViewController.h"
#import "ClickButton.h"
//#import "ShakeViewController.h"
//#import "CloseViewController.h"
//#import "NewAboutViewController.h"
//#import "NewAccuntViewController.h"
#import "NewNav.h"
//#import "SelectDeviceVC.h"
#import "ShakeOpenViewController.h"
#import "CloseOpenViewController.h"
#import <DMVPhoneSDK/DMVPhoneSDK.h>
#import "JJSettingBlackListCell.h"

@interface NewSetViewController ()<UICollectionViewDelegate,UICollectionViewDataSource>

@property (nonatomic,strong)UIImageView *markImg;
@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) NSArray *titleArr;
@property (nonatomic, strong) NSArray *normalArr;
@end

@implementation NewSetViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.titleArr = @[NSLocalizedString(@"yoho_setting_shaking_mode", @""),NSLocalizedString(@"yoho_setting_near_mode", @"")];
    self.normalArr = @[@"shark",@"door_mobile"];
    
    self.commonNavBar.title = @"设定";
    [self.view addSubview:self.commonNavBar];
    [self.view addSubview:self.markImg];
    [self.view addSubview:self.collectionView];
    

    
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    return self.titleArr.count;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    JJSettingBlackListCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"JJSettingBlackListCell" forIndexPath:indexPath];
    cell.iconImageView.image = [UIImage imageNamed:self.normalArr[indexPath.row]];
    cell.nameLabel.text = self.titleArr[indexPath.row];    
    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    [collectionView deselectItemAtIndexPath:indexPath animated:YES];
    [self clickSender:indexPath.row];
}

- (void)clickSender:(NSInteger)row
{
    switch (row) {
        case 0:
        {//摇一摇
            if ([[ContentUtils shareContentUtils] isCube]) {
            }else
            {
                ShakeOpenViewController *shakeVC = [[ShakeOpenViewController alloc] init];
                [self pushViewController:shakeVC animated:YES];
            }
        }
            break;
        case 1:
        {//近场开门
            if ([[ContentUtils shareContentUtils] isCube]) {
            }else
            {
                CloseOpenViewController *closeVC = [[CloseOpenViewController alloc] init];
                [self pushViewController:closeVC animated:YES];
            }
        }
            break;
        default:
            break;
    }
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)initSubViews
{
//    self.commonNavBar.hidden = YES;
    NSArray *titleArr = @[NSLocalizedString(@"yoho_setting_shaking_mode", @""),NSLocalizedString(@"yoho_setting_near_mode", @"")];
    NSArray *normalArr = @[@"shark",@"door_mobile"];
    NSArray *highlightedArr = @[@"shark",@"door_mobile"];
    
    for (int i = 0; i < 2; i++) {
        ClickButton *clickBtn = [[ClickButton alloc] initWithTitle:[titleArr safeObjectAtIndex:i] normalImage:[normalArr safeObjectAtIndex:i] highlightedImage:[highlightedArr safeObjectAtIndex:i] withSize:CGSizeMake(70, 70)];
        clickBtn.frame = CGRectMake(0+(i%2)*kDeviceWidth/2.0, self.markImg.bottom+(i/2)*kDeviceWidth/2.0, kDeviceWidth/2.0, kDeviceWidth/2.0);
        clickBtn.layer.borderWidth = 0.5;
        clickBtn.layer.borderColor = [UIColor colorWithHexString:@"dddddd"].CGColor;
        clickBtn.tag = 5000+i;
        [clickBtn addTarget:self action:@selector(clickSender:) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:clickBtn];
    }
}

- (UIImageView *)markImg
{
    if (!_markImg) {
        _markImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, jjSCREENW(150))];
        _markImg.image = [UIImage imageNamed:@"banner1"];
    }
    return _markImg;
}


- (UICollectionView *)collectionView{
    if (!_collectionView) {
        UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
        flowLayout.itemSize = CGSizeMake(kDeviceWidth * 0.5, kDeviceWidth * 0.5);
        flowLayout.minimumLineSpacing = 0;
        flowLayout.minimumInteritemSpacing = 0;
        _collectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(self.markImg.frame),kDeviceWidth, kDeviceHeight - CGRectGetMaxY(self.markImg.frame))  collectionViewLayout:flowLayout];
        [_collectionView registerNib:[UINib nibWithNibName:@"JJSettingBlackListCell" bundle:nil] forCellWithReuseIdentifier:@"JJSettingBlackListCell"];
        _collectionView.delegate = self;
        _collectionView.dataSource = self;
        _collectionView.backgroundColor = [UIColor whiteColor];
    }
    return _collectionView;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
