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

@interface JJDoorListViewCell ()
@end

@implementation JJDoorListViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}



- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}
- (IBAction)switchAction:(UISwitch*)sender {
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:(sender.tag - 100)];
    
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

- (void)setDataWith:(NSInteger)index
{
    VoipDoorDto *dto = [[[DeviceManager manager] getAllVoipDevice] safeObjectAtIndex:index];
    self.nameLabel.text = [NSString stringWithFormat:@"%@",dto.dev_name];
    self.refuseSwitch.tag = index + 100;
    NSUserDefaults *defalut = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *dic = [defalut objectForKey:@"refuseDic"];

    if (dic||dic[dto.dev_sn]) {
        if ([dic[dto.dev_sn] boolValue] == YES) {
            self.refuseSwitch.on = YES;
        }else{
            self.refuseSwitch.on = NO;
        }
    }else{
        dic = [NSMutableDictionary new];
        self.refuseSwitch.on = YES;
        [dic setObject:@(YES) forKey:dto.dev_sn];
    }
    
    [defalut setObject:dic forKey:@"refuseDic"];
    [defalut synchronize];
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
