//
//  ShakeOpenViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 19/05/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "ShakeOpenViewController.h"
#import "NewNav.h"
#import "OptionManager.h"
#import "SharkMotionManager.h"
#import "SelectShakeOrCloseDevViewController.h"
#import "DeviceManager.h"
#import "DoorDto.h"

@interface ShakeOpenViewController ()

@property (nonatomic,strong)UIImageView *markImg;
@property (nonatomic,strong)UISlider *slider;
@property (nonatomic,strong)UISwitch *kSwitch;
@property (nonatomic,strong)OptionModel *optionModel;

@end

@implementation ShakeOpenViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self initSubViews];
    // Do any additional setup after loading the view.
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (![[DeviceManager manager] hasShakeDevice] && self.kSwitch != nil) {
        [self.kSwitch setOn:NO animated:YES];
        [self switchChange:self.kSwitch];
    }
}

- (void)escBtnClicl
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)initSubViews
{
    self.commonNavBar.title = @"摇动开锁";
    [self.view addSubview:self.commonNavBar];
    
    [self.view addSubview:self.markImg];
    self.optionModel = [[OptionManager manager] optionModel];
    
//    NewNav *nav = [[NewNav alloc] initWithTitle:NSLocalizedString(@"yoho_setting_shaking_mode", @"")];
//    [nav.escBtn addTarget:self action:@selector(escBtnClicl) forControlEvents:UIControlEventTouchUpInside];
    
    UIView *lineViewName = [[UIView alloc] initWithFrame:CGRectMake(0, self.markImg.bottom, kDeviceWidth, 0.5)];
    lineViewName.backgroundColor = [UIColor colorWithHexString:@"c8c8c8"];
    [self.view addSubview:lineViewName];
    //1摇动开锁功能
    UILabel *tipLbl1 = [[UILabel alloc] initWithFrame:CGRectMake(jjSCREENW(20), self.markImg.bottom, kCurrentWidth(150), kCurrentWidth(60))];
    tipLbl1.text = NSLocalizedString(@"yoho_shaking_switch", @"");
    tipLbl1.textColor = [UIColor colorWithHexString:@"797979"];
    tipLbl1.font = kSystem(15);
    [self.view addSubview:tipLbl1];
    
    UIView *lineView = [[UIView alloc] initWithFrame:CGRectMake(0, tipLbl1.bottom, kDeviceWidth, 0.5)];
    lineView.backgroundColor = [UIColor colorWithHexString:@"c8c8c8"];
    [self.view addSubview:lineView];
    
//    UILabel *timeIntervalLB = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), lineView.bottom, kCurrentWidth(150), kCurrentWidth(60))];
//    timeIntervalLB.text = NSLocalizedString(@"", @"");
//    timeIntervalLB.font = kSystem(14);
//    timeIntervalLB.textColor = kLightGrayColor;
//    [self.view addSubview:timeIntervalLB];
    
    //2调整距离
    UILabel *tipLbl2 = [[UILabel alloc] initWithFrame:CGRectMake(jjSCREENW(20), lineView.bottom, kCurrentWidth(150), kCurrentWidth(60))];
    tipLbl2.text = NSLocalizedString(@"yoho_shaking_distance", @"");
    tipLbl2.font = kSystem(15);
    tipLbl2.textColor = [UIColor colorWithHexString:@"797979"];
    [self.view addSubview:tipLbl2];
    
    self.kSwitch = [[UISwitch alloc] initWithFrame:CGRectMake(kDeviceWidth-kCurrentWidth(65), self.markImg.bottom+(kCurrentWidth(60)-28)/2, 0, 0)];
    [self.kSwitch setOn:(self.optionModel.useShake)];
    self.kSwitch.onTintColor = [UIColor colorWithHexString:@"0eaae3"];
    self.kSwitch.backgroundColor = [UIColor grayColor];
    self.kSwitch.layer.cornerRadius = self.kSwitch.height/2.0;
    self.kSwitch.layer.masksToBounds = YES;
    [self.kSwitch addTarget:self action:@selector(switchChange:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:self.kSwitch];
    
    
    self.slider = [[UISlider alloc] initWithFrame:CGRectMake(kCurrentWidth(40), tipLbl2.bottom, kDeviceWidth-kCurrentWidth(80), 20)];
    self.slider.maximumValue = 70;
    self.slider.minimumValue = 1;
    self.slider.tintColor = [UIColor lightGrayColor];
    [self setSliderHighLight:NO];
    [self.slider setValue:self.optionModel.shakeOpenDistance == 0 ? 50 : -50 - self.optionModel.shakeOpenDistance];
    [self valueChange:self.slider];
    [self.slider addTarget:self action:@selector(valueChange:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:self.slider];
    
    UIView *distanceLineView = [[UIView alloc] initWithFrame:CGRectMake(0, self.slider.bottom + 10, kDeviceWidth, 0.5)];
    lineView.backgroundColor = [UIColor colorWithHexString:@"c8c8c8"];
    [self.view addSubview:distanceLineView];
    
    //选择按钮
    UIButton *selectDeviceBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    selectDeviceBtn.frame = CGRectMake(30, distanceLineView.bottom + 20, kDeviceWidth - 60, kCurrentWidth(44));
    [selectDeviceBtn addTarget:self action:@selector(selectDevice) forControlEvents:UIControlEventTouchUpInside];
    selectDeviceBtn.backgroundColor = [UIColor colorWithHexString:@"0eaae3"];
    [selectDeviceBtn setTitle:NSLocalizedString(@"yoho_select_device_title", @"") forState:UIControlStateNormal];
    selectDeviceBtn.layer.cornerRadius = 10;
    selectDeviceBtn.layer.masksToBounds = YES;
    [self.view addSubview:selectDeviceBtn];
    
    [self setSliderHighLight:(self.optionModel.useShake)];
}

-(void)valueChange:(UISlider *)sender
{
    self.optionModel.shakeOpenDistance =  -50 - sender.value;
    [[OptionManager manager] saveOption];
}

-(void)switchChange:(UISwitch *)sender
{
    if (sender.on) {
        
        if (![[DeviceManager manager] hasShakeDevice]) {
            [self presentSheet:NSLocalizedString(@"please_select_device", @"")];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 500 * NSEC_PER_MSEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^{
                [sender setOn:NO animated:YES];
            });
        }else
        {
            if (self.optionModel.useShake == NO) {
                self.optionModel.useShake = YES;
                [[SharkMotionManager manager] startShakeMonitor];
            }
            [self setSliderHighLight:YES];
        }
        
    }else
    {
        if (self.optionModel.useShake == YES) {
            self.optionModel.useShake = NO;
            [[SharkMotionManager manager] stopShakeMonitor];
        }
        [self setSliderHighLight:NO];
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
        self.slider.thumbTintColor = [UIColor grayColor];
        self.slider.minimumTrackTintColor = [UIColor lightGrayColor];
    }
}

-(void)selectDevice
{
    SelectShakeOrCloseDevViewController *SVC = [[SelectShakeOrCloseDevViewController alloc] init];
    SVC.type = SHAKETYPE;
    [self.navigationController pushViewController:SVC animated:YES];
    
}

//-(void)saveAction
//{
//    DoorListDto *dto = [[DeviceManager manager] getDeviceWithSn:self.devSn];
//    if (dto == nil) {
//        
//    }else
//    {
//        ((DoorReaderDto *)dto.readerArr.firstObject).canUseShakeOpen = [self.kSwitch isOn];
//        ((DoorReaderDto *)dto.readerArr.firstObject).shakeOpenDistance = -50 - self.slider.value;
//        OptionModel *optionModel = [[OptionManager manager] optionModel];
//        if ([self.kSwitch isOn]) {
//            optionModel.useShake = YES;
//            [[SharkMotionManager manager] startShakeMonitor];
//        }else
//        {
//            if (![[DeviceManager manager] hasShakeDevice]) {
//                optionModel.useShake = NO;
//                [[SharkMotionManager manager] stopShakeMonitor];
//            }
//        }
//        [[DeviceManager manager] saveDevList];
//        [[OptionManager manager] saveOption];
//    }
//    [self.navigationController popViewControllerAnimated:YES];
//}

- (UIImageView *)markImg
{
    if (!_markImg) {
        _markImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, kNavBarHeight, kDeviceWidth, jjSCREENH(150))];
        _markImg.image = [UIImage imageNamed:@"banner2"];
    }
    return _markImg;
}


@end
