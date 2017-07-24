//
//  VisitorViewController.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/7.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "VisitorViewController.h"
#import "NewNav.h"
#import "VisitorView.h"
#import "MBProgressHUD+MJ.h"
#import "SelectDeviceViewController.h"
#import "RequestService.h"
#import "QRCodeDetailViewController.h"
#import "DeviceManager.h"
#import "DoorDto.h"

typedef enum {
    DATETYPE = 0,
    TIMETYPE,
}TIMEPICKERTYPE;

@interface VisitorViewController ()<UIActionSheetDelegate, UIPickerViewDelegate, UIPickerViewDataSource>

@property (nonatomic,strong)UIImageView *markImg;

@property (nonatomic,strong)VisitorView *visitorView;

@property (nonatomic, strong) UIDatePicker *datePicker;

@property (nonatomic, assign) NSInteger selectedRow;

@property (nonatomic, strong) DoorReaderDto *readDto;

@end

@implementation VisitorViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
//    [self.view addSubview:self.markImg];
    
//    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"yoho_visitor_title", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
//    }else
//    {
//        self.commonNavBar.title = NSLocalizedString(@"visitor_authorization", @"");
//    }
//    
//    [self.view bringSubviewToFront:self.commonNavBar];
    
    [self.view addSubview:self.visitorView];
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (self.selectedDevName.length > 0) {
        [self.visitorView.describe setTitle:self.selectedDevName forState:UIControlStateNormal];
        if (![[ContentUtils shareContentUtils] isCube]) {
            DoorListDto *listDto = [[DeviceManager manager] getDeviceWithSn:self.selectedDevSn];
            if (listDto != nil) {
                self.readDto = listDto.readerArr.firstObject;
                if (self.readDto.dev_type.intValue == DEV_TYPE_QC200) {
                    [_visitorView refreshSubViewForAddSettingStartDate:YES];
                }else
                {
                    [_visitorView refreshSubViewForAddSettingStartDate:NO];
                }
            }
        }
    }
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    [self.visitorView.name resignFirstResponder];
    [self.visitorView.describe resignFirstResponder];
    [self.visitorView.number resignFirstResponder];
}

- (UIImageView *)markImg
{
    if (!_markImg) {
        _markImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, kCurrentWidth(174))];
        _markImg.image = [UIImage imageNamed:@"访客同行证"];
    }
    return _markImg;
}

- (VisitorView *)visitorView
{
    if (!_visitorView) {
        _visitorView = [[VisitorView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, kDeviceHeight-kNavBarHeight)];
        [_visitorView.sureBtn addTarget:self action:@selector(sureAction) forControlEvents:UIControlEventTouchUpInside];
        [_visitorView.startDate addTarget:self action:@selector(startDateAction) forControlEvents:UIControlEventTouchUpInside];
        [_visitorView.endDate addTarget:self action:@selector(endDateAction) forControlEvents:UIControlEventTouchUpInside];
        [_visitorView.startTime addTarget:self action:@selector(startTimeAction) forControlEvents:UIControlEventTouchUpInside];
        [_visitorView.endTime addTarget:self action:@selector(endTimeAction) forControlEvents:UIControlEventTouchUpInside];
        
        if (!self.isFromDeviceDetail) {
            [_visitorView.describe addTarget:self action:@selector(describeClick:) forControlEvents:UIControlEventTouchUpInside];
        }
//        _visitorView.describe.text = self.selectedDevName;
        if (self.type == 2) {
            _visitorView.name.text = [Config currentConfig].phone;
            _visitorView.name.userInteractionEnabled = NO;
        }
    }
    return _visitorView;
}

-(void)describeClick:(UIButton *)sender
{
    SelectDeviceViewController *selectVC = [[SelectDeviceViewController alloc] init];
    selectVC.viewController = self;
    [self.navigationController pushViewController:selectVC animated:YES];
}

-(void)sureAction
{
    if (_visitorView.name.text.length == 0)
    {
        [GlobalTool alertTipsView:@"empty_receiver"];
        return;
    }
    if ([_visitorView.endDate.titleLabel.text componentsSeparatedByString:@"-"].count != 3 || [_visitorView.endTime.titleLabel.text componentsSeparatedByString:@":"].count != 2) {
        [GlobalTool alertTipsView:@"empty_enddate"];
        return;
    }
    
    if (self.selectedDevSn == nil) {
        [GlobalTool alertTipsView:@"yoho_visitor_select_device"];
        return;
    }
    
    NSString *startDateStr = @"";
    if (self.readDto != nil && self.readDto.dev_type.intValue == DEV_TYPE_QC200) {
        if ([_visitorView.startDate.titleLabel.text componentsSeparatedByString:@"-"].count != 3 || [_visitorView.startTime.titleLabel.text componentsSeparatedByString:@":"].count != 2) {
            [GlobalTool alertTipsView:@"empty_startdate"];
            return;
        }else
        {
            startDateStr = [self getStringFromDateString:_visitorView.startDate.titleLabel.text andTimeString:_visitorView.startTime.titleLabel.text];
        }
    }
    
    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"loading", @"")];
    
    NSString *endDateStr = [self getStringFromDateString:_visitorView.endDate.titleLabel.text andTimeString:_visitorView.endTime.titleLabel.text];
    
    [RequestService applyVisitorPwd:self.selectedDevSn receiver:_visitorView.name.text andPwdType:self.type startDate:startDateStr endDate:endDateStr remark:@"" andUseCount:([_visitorView.number.text intValue] > 60 ? 60 : [_visitorView.number.text intValue]) success:^(NSDictionary *result) {
        [hud hide:YES afterDelay:0];
        int ret = [result[@"ret"] intValue];
        if (ret == 0)
        {
            [MBProgressHUD showTip: NSLocalizedString(@"send_pwd_success", @"")];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^{
                [self.navigationController popViewControllerAnimated:YES];
            });
            
            
//            NSString *qrStr = result[@"qrcode"];
//            if (qrStr.length > 0) {
//                QRCodeDetailViewController *qrVC = [[QRCodeDetailViewController alloc] init];
//                qrVC.qrStr = qrStr;
//                dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC);
//                dispatch_after(popTime, dispatch_get_main_queue(), ^{
//                    [self.navigationController pushViewController:qrVC animated:YES];
//                });
//                
//            }else
//            {
//                dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC);
//                dispatch_after(popTime, dispatch_get_main_queue(), ^{
//                    [self.navigationController popViewControllerAnimated:YES];
//                });
//            }
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

-(void)startDateAction
{
    [self alertDatePicker:DATETYPE andIsStart:YES];
}

-(void)endDateAction
{
    [self alertDatePicker:DATETYPE andIsStart:NO];
}

-(void)startTimeAction
{
//    [self alertDatePicker:TIMETYPE andIsStart:YES];
    [self alertTimeWithPickerView:YES];
}

-(void)endTimeAction
{
    
    [self alertTimeWithPickerView:NO];
//    [self alertDatePicker:TIMETYPE andIsStart:NO];
}

-(void)alertTimeWithPickerView:(BOOL)isStart
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"\n\n\n\n\n\n\n\n\n\n\n\n" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    UIPickerView *pickerView = [[UIPickerView alloc] initWithFrame:CGRectMake(kCurrentWidth(50), 0, kCurrentWidth(200), 216)];
    pickerView.showsSelectionIndicator = YES;
    pickerView.dataSource = self;
    pickerView.delegate = self;
    
    [alert.view addSubview:pickerView];
    
    self.selectedRow = 0;
    
    UIAlertAction *ok = [UIAlertAction actionWithTitle:NSLocalizedString(@"confirm", @"") style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        if (isStart) {
            [_visitorView.startTime setTitle:[NSString stringWithFormat:@"%02ld:00", (long)self.selectedRow] forState:UIControlStateNormal];
        }else
        {
            [_visitorView.endTime setTitle:[NSString stringWithFormat:@"%02ld:00", (long)self.selectedRow] forState:UIControlStateNormal];
        }
    }];
    
    UIAlertAction *cancel = [UIAlertAction actionWithTitle:NSLocalizedString(@"cancel", @"") style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        
    }];
    [alert addAction:ok];
    [alert addAction:cancel];
    [self presentViewController:alert animated:YES completion:^{ }];
}


// 弹出日期选择器
- (void)alertDatePicker:(TIMEPICKERTYPE)type andIsStart:(BOOL)isStart
{
    if (IOS8)
    {
        UIDatePicker *datePicker = [[UIDatePicker alloc] init];
        // 设置显示格式
        if (type == TIMETYPE) {
            datePicker.datePickerMode = UIDatePickerModeTime;
        }else if (type == DATETYPE)
        {
            datePicker.datePickerMode = UIDatePickerModeDate;
        }
        
        [datePicker setDate:[NSDate date]]; // 设置显示时间
        [datePicker setMinimumDate:[NSDate date]]; // 设置可选择最小时间
        
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"\n\n\n\n\n\n\n\n\n\n\n\n" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
        [alert.view addSubview:datePicker];
        UIAlertAction *ok = [UIAlertAction actionWithTitle:NSLocalizedString(@"confirm", @"") style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
            //实例化一个NSDateFormatter对象
            if (type == DATETYPE) {
                [dateFormat setDateFormat:@"yyyy/MM/dd"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:datePicker.date];
                
                if (isStart) {
                    [_visitorView.startDate setTitle:[self getDateStringFromString:dateString isDate:YES] forState:UIControlStateNormal];
                }else
                {
                    [_visitorView.endDate setTitle:[self getDateStringFromString:dateString isDate:YES] forState:UIControlStateNormal];
                }
                
            }else if (type == TIMETYPE){
                [dateFormat setDateFormat:@"HH/mm"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:datePicker.date];
                if (isStart) {
                    [_visitorView.startTime setTitle:[self getDateStringFromString:dateString isDate:NO] forState:UIControlStateNormal];
                }else
                {
                    [_visitorView.endTime setTitle:[self getDateStringFromString:dateString isDate:NO] forState:UIControlStateNormal];
                }
            }
        }];
        
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:NSLocalizedString(@"cancel", @"") style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            
        }];
        [alert addAction:ok];
        [alert addAction:cancel];
        [self presentViewController:alert animated:YES completion:^{ }];
    }
    else
    {
        _datePicker = [[UIDatePicker alloc] init];
        _datePicker.datePickerMode = UIDatePickerModeDate;
        _datePicker.date = [NSDate date];
        _datePicker.minimumDate = [NSDate date];
        //[datePicker addTarget:self action:@selector(timeChange:) forControlEvents:UIControlEventValueChanged];
        UIActionSheet* startsheet = [[UIActionSheet alloc] initWithTitle:@"\n\n\n\n\n\n\n\n\n\n\n\n"
                                                                delegate:self
                                                       cancelButtonTitle:nil
                                                  destructiveButtonTitle:nil
                                                       otherButtonTitles:NSLocalizedString(@"confirm", @""),
                                     NSLocalizedString(@"cancel", @""), nil];
        if (type == DATETYPE) {
            if (isStart) {
                startsheet.tag = 333;
            }else
            {
                startsheet.tag = 444;
            }
        }else if(type == TIMETYPE){
            if (isStart) {
                startsheet.tag = 555;
            }else
            {
                startsheet.tag = 666;
            }
        }
        [startsheet addSubview:_datePicker];
        [startsheet showInView:self.view];
    }
}

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex
{
    switch (actionSheet.tag)
    {
        case 333://设置出生日期
        {
            if (buttonIndex == 0)//确定
            {
                NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
                //实例化一个NSDateFormatter对象
                [dateFormat setDateFormat:@"yyyy/MM/dd"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:_datePicker.date];
                _visitorView.startDate.titleLabel.text = [self getDateStringFromString:dateString isDate:YES];
            }
        }
        case 444://设置出生日期
        {
            if (buttonIndex == 0)//确定
            {
                NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
                //实例化一个NSDateFormatter对象
                [dateFormat setDateFormat:@"yyyy/MM/dd"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:_datePicker.date];
                _visitorView.endDate.titleLabel.text = [self getDateStringFromString:dateString isDate:YES];
            }
        }
        case 555://设置出生日期
        {
            if (buttonIndex == 0)//确定
            {
                NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
                //实例化一个NSDateFormatter对象
                [dateFormat setDateFormat:@"HH/mm"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:_datePicker.date];
                _visitorView.startTime.titleLabel.text = [self getDateStringFromString:dateString isDate:NO];
            }
        }
        case 666://设置出生日期
        {
            if (buttonIndex == 0)//确定
            {
                NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
                //实例化一个NSDateFormatter对象
                [dateFormat setDateFormat:@"HH/mm"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:_datePicker.date];
                _visitorView.endTime.titleLabel.text = [self getDateStringFromString:dateString isDate:NO];
            }
        }
            break;
        default://退出登录
        {
        }
            break;
    }
    actionSheet.delegate=nil;
}

-(NSString *)getDateStringFromString:(NSString *)string isDate:(BOOL)isDate
{
    //处理时间显示格式
    
    if (isDate) {
        NSString *year = [string substringWithRange:NSMakeRange(0, 4)];
        NSString *month = [string substringWithRange:NSMakeRange(5, 2)];
        NSString *day = [string substringWithRange:NSMakeRange(8, 2)];
        return [NSString stringWithFormat:@"%@-%@-%@", day, month, year];
    }
    
    NSString *hours = [string substringWithRange:NSMakeRange(0, 2)];
    NSString *min = [string substringWithRange:NSMakeRange(3, 2)];
    return [NSString stringWithFormat:@"%@-%@", hours, min];
    
}

-(NSString *)getStringFromDateString:(NSString *)dateString andTimeString:(NSString *)timeString
{
    NSString *day = [dateString substringWithRange:NSMakeRange(0, 2)];
    NSString *month = [dateString substringWithRange:NSMakeRange(3, 2)];
    NSString *year = [dateString substringWithRange:NSMakeRange(6, 4)];
    NSString *hours = [timeString substringWithRange:NSMakeRange(0, 2)];
    NSString *min = [timeString substringWithRange:NSMakeRange(3, 2)];
    
    NSString *timeStr = [NSString stringWithFormat:@"%@-%@-%@ %@:%@:00", year, month, day, hours, min];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"yyyy-MM-dd hh:mm:ss";
    NSDate *timeDate = [dateFormatter dateFromString:timeStr];
    
    NSDate *uploadTime = [NSDate dateWithTimeInterval:(-60 * 60) sinceDate:timeDate];
    
    dateFormatter.dateFormat = @"yyyyMMddhhmmss";
    
    return [dateFormatter stringFromDate:uploadTime];
}

#pragma mark - UIPickerView delegate and data source

-(NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    return 2;
}

-(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component
{
    if (component == 0) {
        return 24;
    }
    return 1;
}

-(CGFloat)pickerView:(UIPickerView *)pickerView widthForComponent:(NSInteger)component
{
    return kCurrentWidth(100);
}

-(void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component
{
    if (component == 0) {
        self.selectedRow = row;
    }
}

-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component
{
    if (component == 0) {
        return [NSString stringWithFormat:@"%02ld", (long)row];
    }
    return @"00";
}

@end
