//
//  EKeyCell.m
//  DoorMaster
//
//  Created by 宏根 张 on 5/30/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import "EKeyCell.h"

@interface EKeyCell ()

@property (nonatomic, strong) UILabel *appAccountLabel; // 消息内容
@property (nonatomic, strong) UILabel *validDateLabel; // 消息发送时间
@property (nonatomic, strong) UILabel *createDateLabel; // 消息发送时间
@property (nonatomic, strong) UIButton *lockBtn; // 开锁按钮图片

@end

@implementation EKeyCell

+ (instancetype)eKeyCellWithTableView:(UITableView *)tableView{
    static NSString *ID = @"EKeyCell";
    EKeyCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil) {
        cell = [[EKeyCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        [cell.contentView addSubview:cell.lockBtn];
        [cell.contentView addSubview:cell.appAccountLabel];
        [cell.contentView addSubview:cell.validDateLabel];
        [cell.contentView addSubview:cell.createDateLabel];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    return cell;
}

-(UIButton *)lockBtn
{
    if (_lockBtn == nil) {
        _lockBtn = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 60, 60)];
        [_lockBtn setImage:[UIImage scaleImage:[UIImage imageNamed:@"设备2灰"] toSize:CGSizeMake(kCurrentWidth(30), kCurrentWidth(40))]  forState:UIControlStateNormal];
    }
    return _lockBtn;
}

-(UILabel *)appAccountLabel
{
    if (!_appAccountLabel) {
        _appAccountLabel = [[UILabel alloc] initWithFrame:CGRectMake(self.lockBtn.right + 5, 5, kDeviceWidth - 70, 20)];
        if ([[ContentUtils shareContentUtils] isCube]) {
            _appAccountLabel.textColor = kLightGrayColor;
            _appAccountLabel.font = kSystem(14);
        }
    }
    return _appAccountLabel;
}

-(UILabel *)validDateLabel
{
    if (!_validDateLabel) {
        _validDateLabel = [[UILabel alloc] initWithFrame:CGRectMake(self.lockBtn.right + 5, self.appAccountLabel.bottom, kDeviceWidth - 70, 20)];
        if ([[ContentUtils shareContentUtils] isCube]) {
            _validDateLabel.textColor = kLightGrayColor;
            _validDateLabel.font = kSystem(14);
        }
    }
    return _validDateLabel;
}

-(UILabel *)createDateLabel
{
    if (!_createDateLabel) {
        _createDateLabel = [[UILabel alloc] initWithFrame:CGRectMake(self.lockBtn.right + 5, self.validDateLabel.bottom, kDeviceWidth - 70, 20)];
        if ([[ContentUtils shareContentUtils] isCube]) {
            _createDateLabel.textColor = kLightGrayColor;
            _createDateLabel.font = kSystem(14);
        }
        
    }
    return _createDateLabel;
}

- (void)setEKeyCell:(NSString *)appAccount startDate:(NSString *)startDate endDate:(NSString *)endDate privilege:(int)privilege createDate:(NSString*)createDate
{
    self.appAccountLabel.text = appAccount;
    if ([startDate isEqualToString:@""])
    {
        self.validDateLabel.text = NSLocalizedString(@"forever", @"");
    }
    else
    {
        self.validDateLabel.text = [NSString stringWithFormat:@"%@:%@-%@", NSLocalizedString(@"validity", @""), startDate, endDate];
    }
    self.createDateLabel.text = [NSString stringWithFormat:@"%@:%@", NSLocalizedString(@"create_date", @""), createDate];
    NSString *imgName = privilege == SUPER_ADMIN_USER ? @"super_admin_close_gray" : privilege == ADMIN_USER ? @"admin_close_gray" : @"close_gray";
    [self.lockBtn setImage:[UIImage imageNamed:imgName] forState:UIControlStateSelected];
//    NSString *sendTime = [NSString stringWithFormat:@"%@", msgModel.sendTime];
//    NSString *showTime = [NSString stringWithFormat:@"%@:%@", [sendTime substringWithRange:NSMakeRange(8, 2)], [sendTime substringWithRange:NSMakeRange(10, 2)]]; // 取时间显示
//    self.sendTime.text = showTime;
//    // 判断是否显示新消息条数
//    int unreadCount = [[MessageManager manager] getUnreadCount:msgModel.sender];
//    if (unreadCount > 0)
//    {
//        self.msgCountBtn.hidden = FALSE;
//        [self.msgCountBtn setTitle:[NSString stringWithFormat:@"%d", unreadCount] forState:UIControlStateNormal];
//    }
//    else
//    {
//        self.msgCountBtn.hidden = YES;
//    }
//    return unreadCount;
}

@end
