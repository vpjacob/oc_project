//
//  SendEKeyViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SendEKeyViewController.h"
#import "SendEKeyTableView.h"
#import "DoorDto.h"
#import "NewNav.h"

@interface SendEKeyViewController ()<UIActionSheetDelegate>

@property (nonatomic, strong) NSArray *dataArr; // 操作菜单
@property (nonatomic, strong) SendEKeyTableView *eKeyTableView;
@property (nonatomic, strong) UIDatePicker *datePicker;

@end

@implementation SendEKeyViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if ([[ContentUtils shareContentUtils] isCube]) {
        self.commonNavBar.hidden = YES;
        
        NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"send_ekey", @"")];
        [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:nav];
    }else
    {
        self.commonNavBar.title = NSLocalizedString(@"send_ekey", @"");
    }
    //注册弹出日期控件
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(alertDatePicker) name:SendEKeyAlertDatePicker object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(backToEkeyManageView) name:BackToEkeyManageView object:nil];
    
    // 1. 显示操作菜单
    NSMutableArray *showArray = [[NSMutableArray alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    // 第一组菜单：接收人，备注
    [array addObject: @"receiver"];
    [array addObject: @"remark"];
    [showArray addObject: array];
    // 超级管理员才能分配管理员，管理员只能分配普通用户：给默认值即可
    if ([self.devModel.privilege intValue] == SUPER_ADMIN_USER)
    {
        // 第二组菜单：管理员、用户
        array = [[NSMutableArray alloc] init];
        [array addObject: @"ekey_admin"];
        [array addObject: @"ekey_user"];
        [showArray addObject: array];
    }
    // 第三组菜单：永久、限时
    array = [[NSMutableArray alloc] init];
    [array addObject: @"ekey_forever"];
    [array addObject: @"ekey_limited"];
    [showArray addObject: array];
    self.dataArr = showArray;
    
    _eKeyTableView = [[SendEKeyTableView alloc] initWithFrame:CGRectMake(0.0f, kNavBarHeight, self.view.frame.size.width, self.view.frame.size.height) style:UITableViewStyleGrouped];
    _eKeyTableView.textLabel_MArray  = showArray;
    UIEdgeInsets contentInset = _eKeyTableView.contentInset;
    contentInset.top = 0;
    [_eKeyTableView setContentInset:contentInset];
    _eKeyTableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
    _eKeyTableView.devModel = self.devModel;
    _eKeyTableView.devName = self.devName;
    _eKeyTableView.isSuperAdmin = [self.devModel.privilege intValue] == SUPER_ADMIN_USER ? YES : NO;
    [self.view addSubview:_eKeyTableView];
    // Do any additional setup after loading the view.
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void) backToEkeyManageView
{
    [self.navigationController popViewControllerAnimated:YES];
}

// 弹出日期选择器
- (void)alertDatePicker
{
    NSString *datePickerVal = [GlobalTool getGlobalDictValue:@"datePickerVal"];
    NSDate *setDate = nil;
    if (datePickerVal != nil)
    {
        // 设置显示时间
        NSDateFormatter *inputFormatter = [[NSDateFormatter alloc] init];
        [inputFormatter setLocale:[NSLocale currentLocale]];
        [inputFormatter setDateFormat:@"yyyy/MM/dd/HH/mm"];
        setDate = [inputFormatter dateFromString:datePickerVal];
    }
    else
    {
        setDate = [NSDate date];
    }
    if (IOS8)
    {
        UIDatePicker *datePicker = [[UIDatePicker alloc] init];
        datePicker.datePickerMode = UIDatePickerModeDateAndTime; // 设置显示格式
        [datePicker setDate:setDate]; // 设置显示时间
        [datePicker setMinimumDate:[NSDate date]]; // 设置可选择最小时间
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"\n\n\n\n\n\n\n\n\n\n\n\n" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
        [alert.view addSubview:datePicker];
        UIAlertAction *ok = [UIAlertAction actionWithTitle:NSLocalizedString(@"confirm", @"") style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
            //实例化一个NSDateFormatter对象
            [dateFormat setDateFormat:@"yyyy/MM/dd/HH/mm"];//设定时间格式
            NSString *dateString = [dateFormat stringFromDate:datePicker.date];
            //求出当天的时间字符串
            //            DEBUG_PRINT(@"----datePicker str=%@",dateString);
            [self setDatePickerVal:dateString];
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
        _datePicker.date = setDate;
        _datePicker.minimumDate = [NSDate date];
        //[datePicker addTarget:self action:@selector(timeChange:) forControlEvents:UIControlEventValueChanged];
        UIActionSheet* startsheet = [[UIActionSheet alloc] initWithTitle:@"\n\n\n\n\n\n\n\n\n\n\n\n"
                                                                delegate:self
                                                       cancelButtonTitle:nil
                                                  destructiveButtonTitle:nil
                                                       otherButtonTitles:NSLocalizedString(@"confirm", @""),
                                     NSLocalizedString(@"cancel", @""), nil];
        startsheet.tag = 333;
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
                [dateFormat setDateFormat:@"yyyy/MM/dd/HH/mm"];//设定时间格式
                NSString *dateString = [dateFormat stringFromDate:_datePicker.date];
                //求出当天的时间字符串
                //                DEBUG_PRINT(@"----datePicker str=%@",dateString);
                [self setDatePickerVal:dateString];
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

- (void) setDatePickerVal:(NSString *)dateValue
{
    NSString *datePickerType = [GlobalTool getGlobalDictValue:@"datePickerType"]; // 从全局变量缓存中获取类型
    [GlobalTool setGlobalDictValue:@"datePickerVal" andValue:dateValue]; // 重新设置日期
    if ([datePickerType isEqualToString:@"startDatePicker"])
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName: SetStartDateValue object:nil];
        });
    }
    else
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName: SetEndDateValue object:nil];
        });
    }
}

@end
