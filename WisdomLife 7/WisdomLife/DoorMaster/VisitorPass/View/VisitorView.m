//
//  VisitorView.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/8.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "VisitorView.h"

@implementation VisitorView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.nameLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), kCurrentWidth(10), kDeviceWidth-kCurrentWidth(60), kCurrentWidth(25))];
        self.nameLbl.textAlignment = NSTextAlignmentLeft;
        self.nameLbl.text = NSLocalizedString(@"yoho_visitor_name", @"");
        self.nameLbl.font = kSystem(14);
        self.nameLbl.textColor = kLightGrayColor;
        [self addSubview:self.nameLbl];
        
        
        self.name = [[UITextField alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.nameLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60), kCurrentWidth(25))];
        self.name.textAlignment = NSTextAlignmentLeft;
        self.name.placeholder = NSLocalizedString(@"yoho_visitor_name_place_holder", @"");
        self.name.font = kSystem(15);
        [self addSubview:self.name];
        
        self.lineView1 = [[UIView alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.name.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60), 0.5)];
        self.lineView1.backgroundColor = kSepparteLineColor;
        [self addSubview:self.lineView1];
        
        self.describeLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.lineView1.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25))];
        self.describeLbl.textAlignment = NSTextAlignmentLeft;
        self.describeLbl.text = NSLocalizedString(@"yoho_visitor_description", @"");
        self.describeLbl.font = kSystem(14);
        self.describeLbl.textColor = kLightGrayColor;
        [self addSubview:self.describeLbl];
        
        self.describe = [[UIButton alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.describeLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(30), kCurrentWidth(25))];
        self.describe.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        [self.describe setTitle:NSLocalizedString(@"yoho_visitor_select_device", @"") forState:UIControlStateNormal];
        [self.describe setTitleColor:kLightGrayColor forState:UIControlStateNormal];
        self.describe.titleLabel.font = kSystem(15);
        [self addSubview:self.describe];
        
        self.numLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(10)+self.describeLbl.right, self.lineView1.bottom+kCurrentWidth(15), kCurrentWidth(160), kCurrentWidth(25))];
        self.numLbl.textAlignment = NSTextAlignmentLeft;
        self.numLbl.text = NSLocalizedString(@"yoho_visitor_access_count", @"");
        self.numLbl.font = kSystem(14);
        self.numLbl.textColor = kLightGrayColor;
//        [self addSubview:self.numLbl];
        
        self.number = [[UITextField alloc] initWithFrame:CGRectMake(self.numLbl.left, self.numLbl.bottom+kCurrentWidth(5), kCurrentWidth(160), kCurrentWidth(25))];
        self.number.textAlignment = NSTextAlignmentLeft;
        self.number.keyboardType = UIKeyboardTypeNumberPad;
        self.number.placeholder = NSLocalizedString(@"yoho_visitor_access_count", @"");
        self.number.font = kSystem(15);
//        [self addSubview:self.number];
        
        self.lineView2 = [[UIView alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.describe.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60), 0.5)];
        self.lineView2.backgroundColor = kSepparteLineColor;
        [self addSubview:self.lineView2];
        
        self.startDateLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.lineView2.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25))];
        self.startDateLbl.textAlignment = NSTextAlignmentLeft;
        self.startDateLbl.text = NSLocalizedString(@"yoho_visitor_start_date", @"");
        self.startDateLbl.font = kSystem(14);
        self.startDateLbl.textColor = kLightGrayColor;
//        [self addSubview:self.startDateLbl];
        
        self.startDate = [UIButton buttonWithType:UIButtonTypeCustom];
        self.startDate.frame = CGRectMake(kCurrentWidth(30), self.startDateLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        [self.startDate setTitle:NSLocalizedString(@"yoho_visitor_select_date", @"") forState:UIControlStateNormal];
        self.startDate.titleLabel.font = kSystem(13.5);
        [self.startDate setTitleColor:kBlackColor forState:UIControlStateNormal];
        [self.startDate setImage:[UIImage imageNamed:@"向下"] forState:UIControlStateNormal];
//        [self addSubview:self.startDate];
        
        self.endDateLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.lineView2.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25))];
//        self.endDateLbl = [[UILabel alloc] initWithFrame:CGRectMake(self.startDateLbl.right+kCurrentWidth(10), self.lineView2.bottom+kCurrentWidth(15), kCurrentWidth(160), kCurrentWidth(25))];
        self.endDateLbl.textAlignment = NSTextAlignmentLeft;
        self.endDateLbl.text = NSLocalizedString(@"yoho_visitor_end_date", @"");
        self.endDateLbl.font = kSystem(14);
        self.endDateLbl.textColor = kLightGrayColor;
        [self addSubview:self.endDateLbl];
        
        self.endDate = [UIButton buttonWithType:UIButtonTypeCustom];
        self.endDate.frame = CGRectMake(kCurrentWidth(30), self.startDateLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
//        self.endDate.frame = CGRectMake(self.endDateLbl.left, self.endDateLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        [self.endDate setTitle:NSLocalizedString(@"yoho_visitor_select_date", @"") forState:UIControlStateNormal];
        [self.endDate setTitleColor:kBlackColor forState:UIControlStateNormal];
        [self.endDate setImage:[UIImage imageNamed:@"向下"] forState:UIControlStateNormal];
        self.endDate.titleLabel.font = kSystem(13.5);
        self.endDate.imageEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 35);
        [self addSubview:self.endDate];
        
        self.lineView3 = [[UIView alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.startDate.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60), 0.5)];
        self.lineView3.backgroundColor = kSepparteLineColor;
        [self addSubview:self.lineView3];
        
        self.startTimeLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.lineView3.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25))];
        self.startTimeLbl.textAlignment = NSTextAlignmentLeft;
        self.startTimeLbl.text = NSLocalizedString(@"yoho_visitor_start_time", @"");
        self.startTimeLbl.font = kSystem(14);
        self.startTimeLbl.textColor = kLightGrayColor;
//        [self addSubview:self.startTimeLbl];
        
        self.startTime = [UIButton buttonWithType:UIButtonTypeCustom];
        self.startTime.frame = CGRectMake(kCurrentWidth(30), self.startTimeLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        [self.startTime setTitle:NSLocalizedString(@"yoho_visitor_select_time", @"") forState:UIControlStateNormal];
        [self.startTime setTitleColor:kBlackColor forState:UIControlStateNormal];
        [self.startTime setImage:[UIImage imageNamed:@"向下"] forState:UIControlStateNormal];
        self.startTime.titleLabel.font = kSystem(13.5);
        self.startTime.imageEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 35);
//        [self addSubview:self.startTime];
        
        self.endTimeLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.lineView3.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25))];
//        self.endTimeLbl = [[UILabel alloc] initWithFrame:CGRectMake(self.startTimeLbl.right+kCurrentWidth(10), self.lineView3.bottom+kCurrentWidth(15), kCurrentWidth(160), kCurrentWidth(25))];
        self.endTimeLbl.textAlignment = NSTextAlignmentLeft;
        self.endTimeLbl.text = NSLocalizedString(@"yoho_visitor_end_time", @"");
        self.endTimeLbl.font = kSystem(14);
        self.endTimeLbl.textColor = kLightGrayColor;
        [self addSubview:self.endTimeLbl];
        
        self.endTime = [UIButton buttonWithType:UIButtonTypeCustom];
        self.endTime.frame = CGRectMake(self.endDateLbl.left, self.endTimeLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        [self.endTime setTitle:NSLocalizedString(@"yoho_visitor_select_time", @"") forState:UIControlStateNormal];
        [self.endTime setTitleColor:kBlackColor forState:UIControlStateNormal];
        [self.endTime setImage:[UIImage imageNamed:@"向下"] forState:UIControlStateNormal];
        self.endTime.titleLabel.font = kSystem(13.5);
        self.endTime.imageEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 35);
        [self addSubview:self.endTime];
        
        self.lineView4 = [[UIView alloc] initWithFrame:CGRectMake(kCurrentWidth(30), self.endTime.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60), 0.5)];
        self.lineView4.backgroundColor = kSepparteLineColor;
        [self addSubview:self.lineView4];
        
        self.sureBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        self.sureBtn.frame = CGRectMake(kCurrentWidth(30), self.height-kCurrentWidth(74), kDeviceWidth-kCurrentWidth(60), kCurrentWidth(44));
        [self.sureBtn setTitle:NSLocalizedString(@"yoho_visitor_create_pass", @"") forState:UIControlStateNormal];
        [self.sureBtn setTitleColor:kWhiteColor forState:UIControlStateNormal];
        [self.sureBtn setBackgroundColor:[UIColor colorWithHexString:@"ffa600"]];
        self.sureBtn.titleLabel.font = kSystem(16);
        [self addSubview:self.sureBtn];
    }
    return self;
}

-(void)refreshSubViewForAddSettingStartDate:(BOOL)isAddStartDate
{
    if (isAddStartDate) {
        [self addSubview:self.numLbl];
        [self addSubview:self.number];
        
        [self addSubview:self.startDateLbl];
        [self addSubview:self.startDate];
        self.endDateLbl.frame = CGRectMake(self.startDateLbl.right+kCurrentWidth(10), self.lineView2.bottom+kCurrentWidth(15), kCurrentWidth(160), kCurrentWidth(25));
        self.endDate.frame = CGRectMake(self.endDateLbl.left, self.endDateLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        
        [self addSubview:self.startTimeLbl];
        [self addSubview:self.startTime];
        self.endTimeLbl.frame = CGRectMake(self.startTimeLbl.right+kCurrentWidth(10), self.lineView3.bottom+kCurrentWidth(15), kCurrentWidth(160), kCurrentWidth(25));
        self.endTime.frame = CGRectMake(self.endDateLbl.left, self.endTimeLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
    }else
    {
        [self.numLbl removeFromSuperview];
        [self.number removeFromSuperview];
        [self.startDateLbl removeFromSuperview];
        [self.startDate removeFromSuperview];
        [self.startTimeLbl removeFromSuperview];
        [self.startTime removeFromSuperview];
        
        self.endDateLbl.frame = CGRectMake(kCurrentWidth(30), self.lineView2.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        self.endDate.frame = CGRectMake(kCurrentWidth(30), self.startDateLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        self.endTimeLbl.frame = CGRectMake(kCurrentWidth(30), self.lineView3.bottom+kCurrentWidth(15), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
        self.endTime.frame = CGRectMake(self.endDateLbl.left, self.endTimeLbl.bottom+kCurrentWidth(5), kDeviceWidth-kCurrentWidth(60)-kCurrentWidth(170), kCurrentWidth(25));
    }
    
}

@end
