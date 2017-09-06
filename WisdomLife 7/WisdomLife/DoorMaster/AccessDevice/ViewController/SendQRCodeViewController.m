//
//  SendQRCodeViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SendQRCodeViewController.h"
#import "MBProgressHUD+MJ.h"
#import "RequestService.h"
#import "NewNav.h"

@interface SendQRCodeViewController ()

@property (nonatomic, strong) UIDatePicker *datePicker;
@property (nonatomic, weak) UILabel *endDateLabel;
@property (nonatomic, strong) UIButton *sendQRCode;

@end

@implementation SendQRCodeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"visitor_authorization", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"visitor_authorization", @"");
    }
    
    [self setupView];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)setupView
{
    // 创建结束时间标签提示
    self.endDateLabel = [self createLabel:@"pwd_end_date" yIndex:(10 + kNavBarHeight) uiWidth:kDeviceWidth-10];
    // 创建时间选择器
    self.datePicker = [[UIDatePicker alloc] initWithFrame:CGRectMake(0.0, (38 + kNavBarHeight), kDeviceWidth, 220)];
    self.datePicker.backgroundColor = [UIColor whiteColor];
    self.datePicker.datePickerMode = UIDatePickerModeDateAndTime; // 设置显示格式
    [self.datePicker setMinimumDate:[NSDate date]]; // 设置可选择最小时间
    
    // 创建发送按钮
    self.sendQRCode = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.sendQRCode setTitle:NSLocalizedString(@"send_qrcode", @"") forState:UIControlStateNormal];
//    self.sendQRCode.frame = CGRectMake(10, (268 + kNavBarHeight), kDeviceWidth-20, 38); // x, y, width, height
//    UIColor *myColorRGB = [[UIColor alloc] initWithRed:0.0 green:0.6 blue:1.0 alpha:1.0];
//    self.sendQRCode.backgroundColor = myColorRGB;
    self.sendQRCode.frame = CGRectMake(10, (268 + kNavBarHeight), kDeviceWidth-20, kCurrentWidth(44)); // x, y, width, height
    self.sendQRCode.backgroundColor = [UIColor colorWithHexString:@"ffa600"];
    [self.sendQRCode addTarget:self action:@selector(sendPwdBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    self.sendQRCode.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    
    [self.view addSubview: self.datePicker];
    [self.view addSubview: self.sendQRCode];
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
    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
    NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
    [dateFormat setDateFormat:@"yyyyMMddHHmmss"];//设定时间格式
    NSTimeInterval time = 60 * 60;
    NSDate *endDate = [self.datePicker.date dateByAddingTimeInterval:-time]; //减去一个钟
    NSString *endDateStr = [dateFormat stringFromDate:endDate];
    
    [RequestService applyVisitorPwd:self.devSn receiver:@"" andPwdType:2 startDate:@"" endDate:endDateStr remark:@"" andUseCount:0 success:^(NSDictionary *result) {
        [hud hide:YES afterDelay:0];
        int ret = [result[@"ret"] intValue];
        if (ret == 0)
        {
            [MBProgressHUD showTip: NSLocalizedString(@"send_qrcode_success", @"")];
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
