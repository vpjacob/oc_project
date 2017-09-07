//
//  SendTempPwdViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SendTempPwdViewController.h"
#import "MBProgressHUD+MJ.h"
#import "RequestService.h"
#import "NewNav.h"

@interface SendTempPwdViewController ()<UITableViewDataSource, UITableViewDelegate>

@property (nonatomic, strong) NSMutableArray *dataArray;
@property (nonatomic, strong) UITextField *receiverField;
@property (nonatomic, strong) UITextField *remarkField;
@property (nonatomic, strong) UIDatePicker *datePicker;
@property (nonatomic, strong) UILabel *endDateLabel;
@property (nonatomic, strong) UITableView *sendTmpPwdTableView;
@property (nonatomic, strong) UIButton *sendPwd;

@end

@implementation SendTempPwdViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"visitor_authorization", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else{
        self.commonNavBar.title = NSLocalizedString(@"visitor_authorization", @"");
    }
    
    self.dataArray = [[NSMutableArray alloc] init];
    NSMutableArray *tempArray = [[NSMutableArray alloc] init];
    [tempArray addObject:@"receiver"];
    [tempArray addObject:@"remark"];
    [self.dataArray addObject:tempArray];
    [self.view addSubview:self.sendTmpPwdTableView];
    [self setupView];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}


- (UITableView *)sendTmpPwdTableView
{
    if (!_sendTmpPwdTableView) {
        _sendTmpPwdTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight - kNavBarHeight) style:UITableViewStylePlain];
        [_sendTmpPwdTableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        [_sendTmpPwdTableView setIndicatorStyle:UIScrollViewIndicatorStyleWhite];
        _sendTmpPwdTableView.scrollEnabled = YES;
        _sendTmpPwdTableView.userInteractionEnabled = YES;
        _sendTmpPwdTableView.delegate = self;
        _sendTmpPwdTableView.dataSource = self;
        _sendTmpPwdTableView.backgroundColor = [UIColor whiteColor];
        _sendTmpPwdTableView.backgroundView = nil;
    }
    return _sendTmpPwdTableView;
}

// 调整section间的间距
//- (CGFloat) tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
//{
//    return section == 0 ? 8 : 3;
//}
//- (CGFloat) tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
//{
//    return section == 0 ? 8 : 3;
//}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return self.dataArray.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.dataArray[section] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    // 为其定义一个标识符，在重用机制中，标识符非常重要，这是系统用来匹配table各行cell的判断标准
    static NSString *ID = @"SendTempPwd";
    // 从缓存队列中取出复用的cell
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:ID];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    cell.textLabel.text = NSLocalizedString(self.dataArray[indexPath.section][indexPath.row], @"");
    
    if(indexPath.section == 0)
    {
        if (indexPath.row == 0)
        {
            self.receiverField = [self createTextFieldWithString:@"receiver_phone_email"];
            cell.accessoryView = self.receiverField;
        }
        else
        {
            self.remarkField = [self createTextFieldWithString:@"remark"];
            cell.accessoryView = self.remarkField;
        }
    }
    else
    {
        if (indexPath.row == 0)
        {
            cell.accessoryType = UITableViewCellAccessoryCheckmark;
        }
    }
    cell.clipsToBounds = YES;
    return cell;
}

//创建textfield
-(UITextField *)createTextFieldWithString:(NSString *)placeholder
{
    UITextField *textField = [[UITextField alloc] initWithFrame: CGRectMake(50, 100, 190, 40)];
    textField.returnKeyType = UIReturnKeyDone;
    textField.clearButtonMode = UITextFieldViewModeWhileEditing;
    [textField addTarget:self action:@selector(finishTextClick:) forControlEvents:UIControlEventEditingDidEndOnExit];
    //设置textfield占位符及内容字体的颜色--Benson
    textField.textColor = [UIColor blackColor];
    textField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:NSLocalizedString(placeholder, @"") attributes:@{NSForegroundColorAttributeName:[UIColor lightGrayColor]}];
    return textField;
}

- (BOOL)finishTextClick:(id)sender
{
    return YES;
}

// 单元行点击事件
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == 1)
    {
        int otherPathRow = indexPath.row == 1 ? 0 : 1;
        NSIndexPath *anotherIndex = [NSIndexPath indexPathForRow:otherPathRow inSection:indexPath.section];
        UITableViewCell *anotherCell = [tableView cellForRowAtIndexPath:anotherIndex];
        anotherCell.accessoryType = UITableViewCellAccessoryNone;
        
        UITableViewCell *curCell = [tableView cellForRowAtIndexPath:indexPath];
        curCell.accessoryType = UITableViewCellAccessoryCheckmark;
    }
}

- (void)setupView
{
    // 创建结束时间标签提示
    self.endDateLabel = [self createLabel:@"pwd_end_date" yIndex:(kCurrentHeight(88)+64) uiWidth:kDeviceWidth-10];
    // 创建时间选择器
    self.datePicker = [[UIDatePicker alloc] initWithFrame:CGRectMake(0.0, (kCurrentHeight(88)+95), kDeviceWidth, 220)];
    self.datePicker.backgroundColor = [UIColor whiteColor];
    self.datePicker.datePickerMode = UIDatePickerModeDateAndTime; // 设置显示格式
    [self.datePicker setMinimumDate:[NSDate date]]; // 设置可选择最小时间
    
    // 创建发送密码按钮
    self.sendPwd = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.sendPwd setTitle:NSLocalizedString(@"send_pwd", @"") forState:UIControlStateNormal];
//    self.sendPwd.frame = CGRectMake(10, kCurrentHeight(88)+315, kDeviceWidth-20, 38); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.sendPwd.backgroundColor = myColorRGB;
    self.sendPwd.frame = CGRectMake(10, kCurrentHeight(88)+315, kDeviceWidth-20, kCurrentWidth(44)); // x, y, width, height
    self.sendPwd.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.sendPwd addTarget:self action:@selector(sendPwdBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.sendPwd.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
//    [GlobalTool addCornerForView: self.sendPwd];
    [self.view addSubview: self.datePicker];
    [self.view addSubview: self.sendPwd];
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return kCurrentHeight(44);
}

// 创建label提示
- (UILabel *)createLabel:(NSString *)tips yIndex:(int)yIndex uiWidth:(int)uiWidth
{
    UILabel *label = [[UILabel alloc] initWithFrame: CGRectMake((kDeviceWidth - uiWidth) / 2, yIndex, uiWidth, 30)];
    label.text = NSLocalizedString(tips,@"");
    label.font = [UIFont systemFontOfSize:14];
    label.textColor = [UIColor grayColor];
    [self.view addSubview: label];
    return label;
}

- (void)sendPwdBtnClick:(id)sender
{
    if (self.receiverField.text.length == 0)
    {
        [GlobalTool alertTipsView:@"empty_receiver"];
        return;
    }
    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
    NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
    [dateFormat setDateFormat:@"yyyyMMddHHmmss"];//设定时间格式
    NSTimeInterval time = 60 * 60;
    NSDate *endDate = [self.datePicker.date dateByAddingTimeInterval:-time]; //减去一个钟
    NSString *endDateStr = [dateFormat stringFromDate:endDate];
    
    [RequestService applyVisitorPwd:self.devSn receiver:self.receiverField.text andPwdType:1 startDate:@"" endDate:endDateStr remark:self.remarkField.text andUseCount:0 success:^(NSDictionary *result) {
        [hud hide:YES afterDelay:0];
        int ret = [result[@"ret"] intValue];
        if (ret == 0)
        {
            [MBProgressHUD showTip: NSLocalizedString(@"send_pwd_success", @"")];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^{
                [self.navigationController popViewControllerAnimated:YES];
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
}

@end
