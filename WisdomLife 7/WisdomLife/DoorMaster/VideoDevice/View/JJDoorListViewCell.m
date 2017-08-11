//
//  JJDoorListViewCell.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/9.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJDoorListViewCell.h"
#import "LoginDto.h"
#import "DeviceManager.h"
#import <DMVPhoneSDK/DMVPhoneSDK.h>
#import "Masonry.h"

@interface JJDoorListViewCell ()
@property (nonatomic, strong) UISwitch *sw;
@end

@implementation JJDoorListViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

+ (BOOL)requiresConstraintBasedLayout{
    return YES;
}

- (void)updateConstraints{
    
    [self.sw mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.mas_offset(-10);
    }];
    
    [super updateConstraints];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}
- (IBAction)switchAction:(UISwitch*)sender {
    
    NSLog(@"%zd",sender.tag);
    if (sender.tag == 0) {
        return;
    }
    
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:(sender.tag - 100)];
     NSLog(@"%zd",dto.dev_sn);
    NSDictionary *dico = [[NSUserDefaults standardUserDefaults] dictionaryForKey:@"refuseDic"];
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
    [dic addEntriesFromDictionary:dico];
    if (self.refuseSwitch.on) {
            self.refuseSwitch.on = NO;
        [dic setObject:@(NO) forKey:dto.dev_sn];
        }else{
            self.refuseSwitch.on = YES;
        [dic setObject:@(YES) forKey:dto.dev_sn];
        }
    NSUserDefaults *defalut = [NSUserDefaults standardUserDefaults];
    [defalut setObject:dic forKey:@"refuseDic"];
    [defalut synchronize];
}

- (void)swAction:(UISwitch*)sender {
    
    NSLog(@"%zd",sender.tag);
    if (sender.tag == 0) {
        return;
    }
    
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:(sender.tag - 100)];
    NSLog(@"%@",dto.dev_sn);
    NSDictionary *dico = [[NSUserDefaults standardUserDefaults] dictionaryForKey:@"refuseDic"];
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
    
    [dic addEntriesFromDictionary:dico];
    if (sender.on) {
        sender.on = NO;
        [DMCommModel modifyBlackList:dto.dev_sn isAdd:YES];
        [dic setObject:@(NO) forKey:dto.dev_sn];
    }else{
        sender.on = YES;
        [DMCommModel modifyBlackList:dto.dev_sn isAdd:NO];
        [dic setObject:@(YES) forKey:dto.dev_sn];
    }
    NSUserDefaults *defalut = [NSUserDefaults standardUserDefaults];
    [defalut setObject:dic forKey:@"refuseDic"];
    [defalut synchronize];
}



- (void)setDataWith:(NSInteger)index
{
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:index];
    self.nameLabel.text = [NSString stringWithFormat:@"%@",dto.dev_name];
    /*
    self.sw = [[UISwitch alloc] init];
    self.sw.frame = CGRectMake(kDeviceWidth - 50, self.centerY, 50, 30);
    self.sw.tag = index + 100;
    self.sw.on = YES;
    [self.contentView addSubview:self.sw];
//    self.accessoryView = self.sw;
    
    [self.sw addTarget:self action:@selector(swAction:) forControlEvents:UIControlEventValueChanged];
    self.refuseSwitch.tag = index + 100;
    NSUserDefaults *defalut = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *dic = [defalut objectForKey:@"refuseDic"];
//    NSLog(@"%zd",self.refuseSwitch.tag);
//    if (dic||dic[dto.dev_sn]) {
//        if ([dic[dto.dev_sn] boolValue] == YES) {
//            self.refuseSwitch.on = YES;
//        }else{
//            self.refuseSwitch.on = NO;
//        }
//    }else{
//        dic = [NSMutableDictionary new];
//        self.refuseSwitch.on = YES;
//        [dic setObject:@(YES) forKey:dto.dev_sn];
//    }
    
    
    NSLog(@"%zd",self.sw.tag);
    if (dic||dic[dto.dev_sn]) {
        if ([dic[dto.dev_sn] boolValue] == YES) {
            self.sw.on = YES;
        }else{
            self.sw.on = NO;
        }
    }else{
        dic = [NSMutableDictionary new];
        self.sw.on = YES;
        [dic setObject:@(YES) forKey:dto.dev_sn];
    }

    
    [defalut setObject:dic forKey:@"refuseDic"];
    [defalut synchronize];
     */
}

- (void)setRefuseSwitch:(UISwitch *)refuseSwitch{
    if (refuseSwitch.on) {
        
    }else{
        
    }
}

- (void)setRefuse:(NSString *)dev_sn{
    NSMutableArray *dev = [NSMutableArray new];
    [dev addObject:dev_sn];
    [DMCommModel setBlackList:dev];
}

@end
