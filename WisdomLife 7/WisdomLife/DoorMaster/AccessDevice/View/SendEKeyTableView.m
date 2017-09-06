//
//  SendEKeyTableView.m
//  DoorMaster
//  发送电子钥匙tableViewCell
//  Created by 宏根 张 on 5/25/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import "SendEKeyTableView.h"
#import "MBProgressHUD+MJ.h"
#import "RequestService.h"
#import "DoorDto.h"
#import "MBProgressHUD+MJ.h"
//#import "UserManager.h"
//#import <DoorMasterSDK/DoorMasterSDK.h>
//#import "LibDevModel.h"

typedef enum {
    GROUP_RECEIVER = 0,
    GROUP_PRIVILEGE = 1,
    GROUP_VALIDTIME = 2,
    GROUP_SELECTTIME = 3
}SuperAdminGroupE;

typedef enum {
    ADMIN_GROUP_RECEIVER = 0,
    ADMIN_GROUP_VALIDTIME = 1,
    ADMIN_GROUP_SELECTTIME = 2
}AdminGroupE;

@interface SendEKeyTableView()<UITableViewDataSource,UITableViewDelegate>

@property (nonatomic,strong) UIAlertView *calibrationAlert;
@property (nonatomic, strong) UITextField *receiverField;
@property (nonatomic, strong) UITextField *remarkField;
@property (nonatomic, strong) UIButton *sendEKeyBtn;

//@property (nonatomic, copy) NSString *receiver;
//@property (nonatomic, copy) NSString *remark;
@property (nonatomic) int privilege; // 权限
@property (nonatomic) BOOL limited; // 是否限时
@property (nonatomic, copy) NSString *startDate;
@property (nonatomic, copy) NSString *endDate;

@end

@implementation SendEKeyTableView

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self)
    {
        // Initialization code
        self.delegate   = self;
        self.dataSource = self;
    }
    return self;
}

-(id)initWithFrame:(CGRect)frame style:(UITableViewStyle)style
{
    self = [super initWithFrame:frame style:style];
    if (self)
    {
        // Initialization code
        self.delegate = self;
        self.dataSource = self;
    }
    
    [self setupTableFooter];
    [self addSetDateObserver];
    return self;
}

// 注册服务
- (void) addSetDateObserver
{
    // 先移除已存在的观察者，避免重复创建
    [[NSNotificationCenter defaultCenter] removeObserver:self name:SetStartDateValue object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:SetEndDateValue object:nil];
    //注册弹出日期控件
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setStartDateValue) name:SetStartDateValue object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setEndDateValue) name:SetEndDateValue object:nil];
}
-(void) setStartDateValue
{
    NSString *datePickerVal = [GlobalTool getGlobalDictValue:@"datePickerVal"];
    self.startDate = datePickerVal;
//    DEBUG_PRINT(@"====tableview startDate:%@", self.startDate);
    NSIndexPath *cellIndex = [NSIndexPath indexPathForRow:0 inSection: self.isSuperAdmin ? GROUP_SELECTTIME : ADMIN_GROUP_SELECTTIME];
    UITableViewCell *cell = [self cellForRowAtIndexPath:cellIndex];
    cell.detailTextLabel.text = self.startDate;
    if ([[ContentUtils shareContentUtils] isCube]) {
        cell.detailTextLabel.textColor = kLightGrayColor;
    }else
    {
        cell.detailTextLabel.textColor = kBlackColor;
    }
}
-(void) setEndDateValue
{
    NSString *datePickerVal = [GlobalTool getGlobalDictValue:@"datePickerVal"];
    self.endDate = datePickerVal;
//    DEBUG_PRINT(@"====tableview enddate:%@", self.endDate);
    NSIndexPath *cellIndex = [NSIndexPath indexPathForRow:1 inSection:self.isSuperAdmin ? GROUP_SELECTTIME : ADMIN_GROUP_SELECTTIME];
    UITableViewCell *cell = [self cellForRowAtIndexPath:cellIndex];
    cell.detailTextLabel.text = self.endDate;
    if ([[ContentUtils shareContentUtils] isCube]) {
        cell.detailTextLabel.textColor = kLightGrayColor;
    }else
    {
        cell.detailTextLabel.textColor = kBlackColor;
    }
}

-(void)setTableViewFrame:(CGRect)tableViewFrame
{
    self.frame = tableViewFrame;// 设置tableView的frame为所传值
}

// 调整section间的间距
- (CGFloat) tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return section == 0 ? 10 : 5;
}
- (CGFloat) tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return section == 0 ? 10 : 5;
}

//// tableView页眉的值，同理，可为不同的分区设置不同的页眉，也可不写此方法
//-(NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
//{
//    return @"页眉";
//}

// 页脚
//-(NSString *)tableView:(UITableView *)tableView titleForFooterInSection:(NSInteger)section
//{
//    return @"页脚";
//}

// tableView分区数量，默认为1，可为其设置为多个分区
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return [_textLabel_MArray count];
}

// tableView每个分区的行数，可以为各个分区设置不同的行数，根据section的值判断即可
-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [_textLabel_MArray[section] count];
}

// 实现每一行Cell的内容，tableView重用机制
-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    // 为其定义一个标识符，在重用机制中，标识符非常重要，这是系统用来匹配table各行cell的判断标准
    static NSString *ID = @"SendEKey";
    NSString *cellName = self.textLabel_MArray[indexPath.section][indexPath.row];
    // 从缓存队列中取出复用的cell
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil)
    {
        if ([cellName isEqualToString:@"start_date"] || [cellName isEqualToString:@"end_date"])
        {
            cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:ID];
        }
        else
        {
            cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        }
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        if ([[ContentUtils shareContentUtils] isCube]) {
            cell.textLabel.font = kSystem(14);
            cell.textLabel.textColor = kLightGrayColor;
            cell.detailTextLabel.font = kSystem(14);
            cell.detailTextLabel.textColor = kLightGrayColor;
        }
    }
    cell.textLabel.text = NSLocalizedString(cellName, @"");
    
    if ([cellName isEqualToString:@"receiver"]) // 接收者
    {
        if (self.receiverField == nil) {
            self.receiverField = [self createTextFieldWithString:@"receiver_placeholder"];
        }
        cell.accessoryView = self.receiverField;
    }
    else if ([cellName isEqualToString:@"remark"]) // 备注
    {
        if (self.remarkField == nil) {
            self.remarkField = [self createTextFieldWithString:@"remark"];
        }
        cell.accessoryView = self.remarkField;
    }
    else if ([cellName isEqualToString:@"ekey_admin"] || [cellName isEqualToString:@"ekey_user"]) // 权限设置
    {
        if (indexPath.row == 1) // 默认选择用户权限
        {
            if (self.privilege == 0 || self.privilege == GENERAL_USER)
            {
                cell.accessoryType = UITableViewCellAccessoryCheckmark;
                self.privilege = GENERAL_USER;
            }
        }
    }
    else if ([cellName isEqualToString:@"ekey_forever"] || [cellName isEqualToString:@"ekey_limited"]) // 有效期设置
    {
        if (indexPath.row == 0) // 默认选择永久
        {
            if (self.limited == NO)
            {
                cell.accessoryType = UITableViewCellAccessoryCheckmark;
                self.limited = NO;
            }
        }
    }
    else if ([cellName isEqualToString:@"start_date"] || [cellName isEqualToString:@"end_date"]) // 设置开始时间、结束时间
    {
        cell.detailTextLabel.text = NSLocalizedString(indexPath.row == 0 ? @"startdate_placeholder" : @"enddate_placeholder", @"");
        cell.detailTextLabel.textColor = kLightGrayColor;
    }
    
    cell.clipsToBounds = YES;
    return cell;
}

//创建textfield
-(UITextField *)createTextFieldWithString:(NSString *)placeholder
{
    UITextField *textField = [[UITextField alloc] initWithFrame: CGRectMake(50, 100, 200, 40)];
    textField.clearButtonMode = UITextFieldViewModeWhileEditing;
    textField.returnKeyType = UIReturnKeyDone;
    [textField addTarget:self action:@selector(finishTextClick:) forControlEvents:UIControlEventEditingDidEndOnExit];
    
    //设置textfield占位符及内容字体的颜色--Benson
    NSDictionary *attributes = nil;
    if ([[ContentUtils shareContentUtils] isCube]) {
        attributes = @{NSForegroundColorAttributeName:kLightGrayColor, NSFontAttributeName:kSystem(14)};
        textField.textColor = kLightGrayColor;
    }else
    {
        attributes = @{NSForegroundColorAttributeName:kLightGrayColor};
        textField.textColor = kBlackColor;
    }
    textField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:NSLocalizedString(placeholder, @"") attributes:attributes];
    return textField;
}

- (BOOL)finishTextClick:(id)sender
{
    return YES;
}

// 单选项切换
- (void)cellCheckmarkAndNone:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    int otherPathRow = indexPath.row == 1 ? 0 : 1;
    NSIndexPath *anotherIndex = [NSIndexPath indexPathForRow:otherPathRow inSection:indexPath.section];
    UITableViewCell *anotherCell = [tableView cellForRowAtIndexPath:anotherIndex];
    anotherCell.accessoryType = UITableViewCellAccessoryNone;
    
    UITableViewCell *curCell = [tableView cellForRowAtIndexPath:indexPath];
    curCell.accessoryType = UITableViewCellAccessoryCheckmark;
}

// 单元行点击事件
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellName = self.textLabel_MArray[indexPath.section][indexPath.row];
    if ([cellName isEqualToString:@"ekey_admin"] || [cellName isEqualToString:@"ekey_user"])
    {
        [self cellCheckmarkAndNone:tableView didSelectRowAtIndexPath:indexPath];
        self.privilege = indexPath.row == 0 ? ADMIN_USER : GENERAL_USER;
        return;
    }
    if ([cellName isEqualToString:@"ekey_forever"] || [cellName isEqualToString:@"ekey_limited"])
    {
        [self cellCheckmarkAndNone:tableView didSelectRowAtIndexPath:indexPath];
        // 永久、限时切换时，会清空文本输入框的值，先缓存
//        self.receiver = self.receiverField.text;
//        self.remark = self.remarkField.text;
        if (indexPath.row == 0) // 永久
        {
            if (self.limited == YES)
            {
                self.limited = NO;
                [self.textLabel_MArray removeObjectAtIndex: self.textLabel_MArray.count-1];
                [self reloadData];
            }
        }
        else // 限时
        {
            if (self.limited == NO)
            {
                self.limited = YES;
                NSMutableArray *array = [[NSMutableArray alloc] init];
                [array addObject: @"start_date"];
                [array addObject: @"end_date"];
                [self.textLabel_MArray addObject:array];
                [self reloadData];
            }
        }
        return;
    }
    if ([cellName isEqualToString:@"start_date"] || [cellName isEqualToString:@"end_date"])
    {
        [GlobalTool setGlobalDictValue:@"datePickerType" andValue: indexPath.row == 0 ? @"startDatePicker" : @"endDatePicker"];
        [GlobalTool setGlobalDictValue:@"datePickerVal" andValue: indexPath.row == 0 ? self.startDate : self.endDate];
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:SendEKeyAlertDatePicker object:nil];
        });
    }
}

// 设置按钮
- (void)setupTableFooter
{
    // 创建按钮
    self.tableFooterView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, 50)];
    _sendEKeyBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    CGFloat buttonW = kDeviceWidth - 20;
//    CGFloat buttonH = 40;
    CGFloat buttonH = kCurrentWidth(44);
    [_sendEKeyBtn setTitle:NSLocalizedString(@"send_ekey", @"") forState:UIControlStateNormal];
    _sendEKeyBtn.frame = CGRectMake((kDeviceWidth - buttonW) / 2, 20, buttonW, buttonH);
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    _sendEKeyBtn.backgroundColor = myColorRGB;
    _sendEKeyBtn.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [_sendEKeyBtn addTarget:self action:@selector(sendEKeyBtnClick:) forControlEvents:UIControlEventTouchUpInside];
//    [GlobalTool addCornerForView:_sendEKeyBtn];
    _sendEKeyBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
    [self.tableFooterView addSubview:_sendEKeyBtn];
}

// 发送钥匙
- (void)sendEKeyBtnClick:(id)sender
{
    if (self.receiverField.text.length == 0)
    {
        [GlobalTool alertTipsView:@"receiver_placeholder"];
        return;
    }
    if ([self.receiverField.text isEqualToString:[Config currentConfig].phone])
    {
        [GlobalTool alertTipsView:@"send_yourself_error"];
        return;
    }
    NSString *commitStartDate = @"";
    NSString *commitEndDate = @"";
    if (self.limited)
    {
        if (self.startDate == nil)
        {
            [GlobalTool alertTipsView:@"empty_startdate"];
            return;
        }
        if (self.endDate == nil)
        {
            [GlobalTool alertTipsView:@"empty_enddate"];
            return;
        }
        commitStartDate = [self formatDateVal:self.startDate];
        commitEndDate = [self formatDateVal:self.endDate];
        
//        //马基为达要求提前一个钟截止--Benson
//        NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
//        //实例化一个NSDateFormatter对象
//        [dateFormat setDateFormat:@"yyyy/MM/dd"];//设定时间格式
//        NSDate *endDateTmp = [dateFormat dateFromString:self.endDate];
//        NSTimeInterval time = 60*60;
//        endDateTmp = [endDateTmp dateByAddingTimeInterval:-time];
//        commitEndDate = [self formatDateVal:[dateFormat stringFromDate:endDateTmp]];
        
        if ([commitStartDate intValue] > [commitEndDate intValue])
        {
            [GlobalTool alertTipsView:@"end_lessthan_start"];
            return;
        }
        commitStartDate = [NSString stringWithFormat:@"%@00", commitStartDate];
        commitEndDate = [NSString stringWithFormat:@"%@59", commitEndDate];
    }
    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
    NSMutableDictionary *eKeyDict = [[NSMutableDictionary alloc] init];
    eKeyDict[@"receiver"] = self.receiverField.text;
    eKeyDict[@"remark"] = self.remarkField.text;
    eKeyDict[@"devName"] = self.devName == nil ? self.devModel.reader_sn : self.devName;
    eKeyDict[@"devSn"] = self.devModel.reader_sn;
    eKeyDict[@"privilege"] = [NSString stringWithFormat:@"%d", self.privilege == 0 ? GENERAL_USER : self.privilege];
    eKeyDict[@"startDate"] = commitStartDate;
    eKeyDict[@"endDate"] = commitEndDate;
    NSDictionary *dataDict = [LibDevModel getEkeyIdentityAndResource:self.devModel.ekey];
    eKeyDict[@"keyResource"] = dataDict[@"resource"];
    eKeyDict[@"resIdentity"] = dataDict[@"resIdentity"];
    
    [RequestService sendUserDevEkey:eKeyDict success:^(NSDictionary *result) {
        [hud hide:YES afterDelay:0];
        int ret = [result[@"ret"] intValue];
        if (ret == 0)
        {
            [MBProgressHUD showTip: NSLocalizedString(@"send_ekey_success", @"")];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^{
                dispatch_async(dispatch_get_main_queue(), ^{
                    [[NSNotificationCenter defaultCenter] postNotificationName:BackToEkeyManageView object:nil];
                });
            });
        }
        else
        {
            [MBProgressHUD showError:result[@"msg"]];
        }
    } failure:^(NSString *error) {
        [hud hide:YES afterDelay:0];
        [MBProgressHUD showError:error];
    }];
    [hud hide:YES afterDelay:1];
}

//- (void) alertTipsView:(NSString*)msg
//{
//    UIAlertView *alter = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"tips", @"") message:NSLocalizedString(msg, @"") delegate:nil cancelButtonTitle:NSLocalizedString(@"confirm", @"") otherButtonTitles:nil];
//    [alter show];
//}

// 转化日期格式： yyyy/MM/dd/HH/mm -> yyyyMMddHHmm
- (NSString *)formatDateVal:(NSString *)dateVal
{
    NSString *retDate = [NSString stringWithFormat:@"%@%@%@%@%@", [dateVal substringWithRange:NSMakeRange(0, 4)], [dateVal substringWithRange:NSMakeRange(5, 2)], [dateVal substringWithRange:NSMakeRange(8, 2)], [dateVal substringWithRange:NSMakeRange(11, 2)], [dateVal substringWithRange:NSMakeRange(14, 2)]];
    return retDate;
}

@end
