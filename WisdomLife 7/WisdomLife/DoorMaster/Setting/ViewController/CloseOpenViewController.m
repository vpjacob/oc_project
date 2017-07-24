//
//  CloseOpenViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 19/05/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "CloseOpenViewController.h"
#import "NewNav.h"
#import "OptionManager.h"
#import "SelectShakeOrCloseDevViewController.h"
#import "DeviceManager.h"
#import "DoorDto.h"
#import "OpenDoorService.h"
#import "Masonry.h"

@interface CloseOpenViewController ()

@property (nonatomic,strong)UIImageView *markImg;
@property (nonatomic,strong)UISlider *slider;
@property (nonatomic,strong)UISwitch *kSwitch;
@property (nonatomic,strong)UISwitch *kLimitSwitch;
@property (nonatomic,strong)OptionModel *optionModel;

@end

@implementation CloseOpenViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self initSubViews];
    // Do any additional setup after loading the view.
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (![[DeviceManager manager] hasNearOpenDevice] && self.kSwitch != nil) {
        [self.kSwitch setOn:NO animated:YES];
        [self switchChange:self.kSwitch];
    }
}



- (void)initSubViews
{
    //导航旧
    self.commonNavBar.title = @"近场开锁";
    [self.view addSubview:self.commonNavBar];

    [self.view addSubview:self.markImg];
    self.optionModel = [[OptionManager manager] optionModel];
    //线
    UIView *lineViewName = [[UIView alloc] initWithFrame:CGRectMake(0, self.markImg.bottom, kDeviceWidth, 0.5)];
    lineViewName.backgroundColor = kSepparteLineColor;
    [self.view addSubview:lineViewName];
    //近场开锁功能
    UILabel *tipLbl1 = [[UILabel alloc] initWithFrame:CGRectMake(jjSCREENW(12), self.markImg.bottom, kCurrentWidth(150), kCurrentWidth(60))];
    tipLbl1.text = @"近场开锁功能";
    tipLbl1.textColor = [UIColor colorWithHexString:@"797979"];
    tipLbl1.font = kSystem(14);
    [self.view addSubview:tipLbl1];
    //线
    UIView *lineView = [[UIView alloc] initWithFrame:CGRectMake(0, tipLbl1.bottom, kDeviceWidth, 0.5)];
    lineView.backgroundColor = kSepparteLineColor;
    [self.view addSubview:lineView];
    
    //同一设备
    NSString *sameDeviceStr = NSLocalizedString(@"same_device", @"");
    NSDictionary *attrs = @{NSFontAttributeName:[UIFont systemFontOfSize:15]};
    CGSize strSize = [sameDeviceStr sizeWithAttributes:attrs];
    if (strSize.width > kCurrentWidth(120)) {
        strSize.width = kCurrentWidth(120);
    }
    UILabel *timeIntervalLB = [[UILabel alloc] initWithFrame:CGRectMake(jjSCREENW(12), lineView.bottom, strSize.width, kCurrentWidth(60))];
    timeIntervalLB.text = sameDeviceStr;
    timeIntervalLB.font = kSystem(14);
    timeIntervalLB.numberOfLines = 0;
    timeIntervalLB.textColor = [UIColor colorWithHexString:@"797979"];
    [self.view addSubview:timeIntervalLB];
    
    //同一设备最短开门间隔
//    UILabel *timeIntervalLB = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(12), lineView.bottom, jjSCREENW(150), kCurrentWidth(60))];
//    timeIntervalLB.text = @"同一设备最短开门间隔";
//    timeIntervalLB.textColor = [UIColor colorWithHexString:@"797979"];
//    timeIntervalLB.font = kSystem(14);
//    [self.view addSubview:timeIntervalLB];
    
    //时间TF
    UITextField *timeTF = [[UITextField alloc] initWithFrame:CGRectMake(timeIntervalLB.right + 5, timeIntervalLB.centerY - jjSCREENH(12), jjSCREENW(40), jjSCREENH(25))];
    [timeTF setFont:[UIFont systemFontOfSize:14]];
    timeTF.borderStyle = UITextBorderStyleRoundedRect;
    if (self.optionModel.nearOpenLimitInterval == 0) {
        timeTF.text = @"5";
    }else
    {
        timeTF.text = [NSString stringWithFormat:@"%d", self.optionModel.nearOpenLimitInterval];
    }
    [timeTF addTarget:self action:@selector(timeTFValueChange:) forControlEvents:UIControlEventAllEditingEvents];
    timeTF.keyboardType = UIKeyboardTypeNumberPad;
    timeTF.textColor = kLightGrayColor;
    [self.view addSubview:timeTF];

    //秒
    UILabel *timeIntervalLB2 = [[UILabel alloc] initWithFrame:CGRectMake(timeTF.right + 5, lineView.bottom, jjSCREENW(30), kCurrentWidth(60))];
//    UILabel *timeIntervalLB2 = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(21) + jjSCREENW(200), lineView.bottom, jjSCREENW(30), kCurrentWidth(60))];
    timeIntervalLB2.text = @" 秒";
    timeIntervalLB2.textColor = [UIColor colorWithHexString:@"797979"];
    timeIntervalLB2.font = kSystem(14);
    [self.view addSubview:timeIntervalLB2];
    
    //switch
    self.kLimitSwitch = [[UISwitch alloc] initWithFrame:CGRectMake(kDeviceWidth-kCurrentWidth(65), self.markImg.bottom+(kCurrentWidth(60)-28)/2 + kCurrentWidth(60), 0, 0)];
    [self.kLimitSwitch setOn:(self.optionModel.nearOpenLimit)];
    self.kLimitSwitch.onTintColor = [UIColor colorWithHexString:@"0eaae3"];
    self.kLimitSwitch.backgroundColor = kGrayColor;
    self.kLimitSwitch.tag = 1;
    self.kLimitSwitch.layer.cornerRadius = self.kLimitSwitch.height/2.0;
    self.kLimitSwitch.layer.masksToBounds = YES;
    [self.kLimitSwitch addTarget:self action:@selector(switchChange:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:self.kLimitSwitch];
    //线
    UIView *lineViewLimit = [[UIView alloc] initWithFrame:CGRectMake(0, timeIntervalLB.bottom, kDeviceWidth, 0.5)];
    lineViewLimit.backgroundColor = kSepparteLineColor;
    [self.view addSubview:lineViewLimit];
    
    //same_device   no_open_again
    //调整距离Lable
    UILabel *tipLbl2 = [[UILabel alloc] initWithFrame:CGRectMake(jjSCREENW(12), timeIntervalLB.bottom, kCurrentWidth(150), kCurrentWidth(60))];
    tipLbl2.text = @"调整距离";
    tipLbl2.font = kSystem(14);
    tipLbl2.textColor = [UIColor colorWithHexString:@"797979"];
    [self.view addSubview:tipLbl2];
    //switch
    self.kSwitch = [[UISwitch alloc] initWithFrame:CGRectMake(kDeviceWidth-kCurrentWidth(65), self.markImg.bottom+(kCurrentWidth(60)-28)/2, 0, 0)];
    [self.kSwitch setOn:(self.optionModel.useNearOpen)];
    self.kSwitch.onTintColor = [UIColor colorWithHexString:@"0eaae3"];
    self.kSwitch.backgroundColor = kGrayColor;
    self.kSwitch.layer.cornerRadius = self.kSwitch.height/2.0;
    self.kSwitch.layer.masksToBounds = YES;
    [self.kSwitch addTarget:self action:@selector(switchChange:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:self.kSwitch];
    
    //slider
    self.slider = [[UISlider alloc] initWithFrame:CGRectMake(kCurrentWidth(40), tipLbl2.bottom, kDeviceWidth-kCurrentWidth(80), 20)];
    self.slider.maximumValue = 40;
    self.slider.minimumValue = 1;
    self.slider.tintColor = kLightGrayColor;
    [self setSliderHighLight:NO];
    [self.slider setValue:self.optionModel.nearOpenDistance == 0 ? 25 : -50 - self.optionModel.nearOpenDistance];
    [self valueChange:self.slider]; //保存靠近开门距离
    [self.slider addTarget:self action:@selector(valueChange:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:self.slider];
    //距离line0.5
    UIView *distanceLineView = [[UIView alloc] initWithFrame:CGRectMake(0, self.slider.bottom + 10, kDeviceWidth, 0.5)];
    lineView.backgroundColor = kSepparteLineColor;
    [self.view addSubview:distanceLineView];
    //选择btn
    UIButton *selectDeviceBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    selectDeviceBtn.frame = CGRectMake(30, distanceLineView.bottom + 20, kDeviceWidth - 60, kCurrentWidth(44));
    [selectDeviceBtn addTarget:self action:@selector(selectDevice) forControlEvents:UIControlEventTouchUpInside];
    selectDeviceBtn.backgroundColor = [UIColor colorWithHexString:@"0eaae3"];
    [selectDeviceBtn setTitle:NSLocalizedString(@"yoho_select_device_title", @"") forState:UIControlStateNormal];
    selectDeviceBtn.layer.cornerRadius = 10;
    selectDeviceBtn.layer.masksToBounds = YES;
    [self.view addSubview:selectDeviceBtn];
    
    [self setSliderHighLight:(self.optionModel.useNearOpen)];
     
    
}

-(void)valueChange:(UISlider *)sender
{
    self.optionModel.nearOpenDistance =  -50 - sender.value;
    [[OptionManager manager] saveOption];
}

-(void)timeTFValueChange:(UITextField *)sender
{
    if (sender.text.length == 0) {
        self.optionModel.nearOpenLimitInterval = 5;
    }else
    {
        self.optionModel.nearOpenLimitInterval = [sender.text intValue];
    }
    [[OptionManager manager] saveOption];
    NSLog(@"%d", self.optionModel.nearOpenLimitInterval);
}

-(void)switchChange:(UISwitch *)sender
{
    if (sender.tag == 0) {
        if (sender.on) {
            
            if (![[DeviceManager manager] hasNearOpenDevice]) {
                [self presentSheet:NSLocalizedString(@"please_select_device", @"")];
                dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 500 * NSEC_PER_MSEC);
                dispatch_after(popTime, dispatch_get_main_queue(), ^{
                    [sender setOn:NO animated:YES];
                });
            }else
            {
                if (self.optionModel.useNearOpen == NO) {
                    self.optionModel.useNearOpen = YES;
                    [[OpenDoorService manager] clearNearOpenDeviceInfo]; //清空之前的靠近开门信息
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [[NSNotificationCenter defaultCenter] postNotificationName:NearOpenDoorReceved object:nil];
                    });
                }
                [self setSliderHighLight:YES];
            }
            
        }else
        {
            if (self.optionModel.useNearOpen == YES) {
                self.optionModel.useNearOpen = NO;
                [LibDevModel stopBackgroundMode];
            }
            [self setSliderHighLight:NO];
        }
    }else
    {
        if (sender.on) {
            self.optionModel.nearOpenLimit = YES;
            [[OpenDoorService manager] clearNearOpenDeviceInfo]; //开启限制时先清空之前的开门数据
        }else
        {
            self.optionModel.nearOpenLimit = NO;
        }
    }
    [[OptionManager manager] saveOption];
}

-(void)setSliderHighLight:(BOOL)highLight
{
    if (highLight) {
        self.slider.thumbTintColor = [UIColor colorWithHexString:@"0eaae3"];
        self.slider.minimumTrackTintColor =  [UIColor colorWithHexString:@"0eaae3"];
    }else
    {
        self.slider.thumbTintColor = kGrayColor;
        self.slider.minimumTrackTintColor = kLightGrayColor;
    }
}

-(void)selectDevice
{
    SelectShakeOrCloseDevViewController *SVC = [[SelectShakeOrCloseDevViewController alloc] init];
    SVC.type = NEAROPENTYPE;
    [self.navigationController pushViewController:SVC animated:YES];
    
}

- (UIImageView *)markImg
{
    if (!_markImg) {
        _markImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, 64, kDeviceWidth, jjSCREENH(150))];
        _markImg.image = [UIImage imageNamed:@"banner3"];
    }
    return _markImg;
}


@end
