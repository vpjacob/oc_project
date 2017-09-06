//
//  VisitorView.h
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/8.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface VisitorView : UIView

@property (nonatomic,strong)UILabel *nameLbl;

@property (nonatomic,strong)UITextField *name;

@property (nonatomic,strong)UIView *lineView1;

@property (nonatomic,strong)UILabel *describeLbl;

@property (nonatomic,strong)UIButton *describe;

@property (nonatomic,strong)UILabel *numLbl;

@property (nonatomic,strong)UITextField *number;

@property (nonatomic,strong)UIView *lineView2;

@property (nonatomic,strong)UILabel *startDateLbl;

@property (nonatomic,strong)UIButton *startDate;

@property (nonatomic,strong)UILabel *endDateLbl;

@property (nonatomic,strong)UIButton *endDate;

@property (nonatomic,strong)UIView *lineView3;

@property (nonatomic,strong)UILabel *startTimeLbl;

@property (nonatomic,strong)UIButton *startTime;

@property (nonatomic,strong)UILabel *endTimeLbl;

@property (nonatomic,strong)UIButton *endTime;

@property (nonatomic,strong)UIView *lineView4;

@property (nonatomic,strong)UIButton *sureBtn;

-(void)refreshSubViewForAddSettingStartDate:(BOOL)isAddStartDate; //显示设置开始时间和使用次数，用于二维码的设置

@end
