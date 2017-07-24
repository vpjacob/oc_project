//
//  GongGaoCell.m
//  SmartDoor
//
//  Created by 朱攀峰 on 17/2/27.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "GongGaoCell.h"
#import "AnnouncementModel.h"
#import "MessageManager.h"
#import "DevOpenLogModel.h"
#import "Masonry.h"

@interface GongGaoCell ()

@property (nonatomic, copy) NSDateFormatter *dateFormat;
@property (nonatomic, strong) NSString *successM;
@property(nonatomic,strong)UIImageView *statusImageView;
@end

@implementation GongGaoCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self.contentView addSubview:self.bigTimeLbl];
//        [self addSubview:self.smallTimeLbl];
        [self.contentView addSubview:self.messageLbl];
        [self.contentView addSubview:self.statusImageView];
//        [self addObserver:self forKeyPath:@"selected" options:NSKeyValueObservingOptionNew|NSKeyValueObservingOptionOld context:NULL];

        
    }
    return self;
}



#pragma mark - Layout
+ (BOOL)requiresConstraintBasedLayout{
    return true;
}

- (void)updateConstraints{
    [self.bigTimeLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.mas_equalTo(self).offset(-12);
    }];
    
    [self.messageLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.left.mas_equalTo(self).offset(15);
    }];
    
    [self.statusImageView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.left.mas_equalTo(self.messageLbl.mas_right).mas_offset(5);
        make.size.mas_equalTo(CGSizeMake(20, 20));
    }];
    
    [super updateConstraints];
}

- (void)drawRect:(CGRect)rect {
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [UIColor clearColor].CGColor);
    CGContextFillRect(context, rect);
    CGContextSetStrokeColorWithColor(context, [UIColor colorWithHexString:@"d3d3d3"].CGColor);
    CGContextStrokeRect(context, CGRectMake(0, 0, rect.size.width, 0.5));
}


- (UILabel *)bigTimeLbl
{
    if (!_bigTimeLbl) {
        _bigTimeLbl = [[UILabel alloc] init];
        _bigTimeLbl.numberOfLines = 1;
        _bigTimeLbl.text = @"20-01-2017";
        _bigTimeLbl.font = [UIFont systemFontOfSize:12];
        _bigTimeLbl.textColor = [UIColor colorWithHexString:@"c0c0c0"];
    }
    return _bigTimeLbl;
}

- (UIImageView *)statusImageView{
    if (!_statusImageView) {
        _statusImageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 20, 20)];
        
    }
    return _statusImageView;
}

- (UILabel *)messageLbl
{
    if (!_messageLbl) {
        _messageLbl = [[UILabel alloc] init];
//        _messageLbl.textColor = [UIColor colorWithHexString:@"0eaae3"];
        _messageLbl.font = [UIFont systemFontOfSize:13];
        _messageLbl.text = @"小区1栋1单元：成功开门";
    }
    return _messageLbl;
}

//-(UILabel *)smallTimeLbl
//{
//    if (!_smallTimeLbl) {
//        _smallTimeLbl = [[UILabel alloc] initWithFrame:CGRectMake(kCurrentWidth(25), self.bigTimeLbl.bottom - 5, kCurrentWidth(70), 20)];
//        _smallTimeLbl.numberOfLines = 1;
//        _smallTimeLbl.text = @"15:02:53";
//        _smallTimeLbl.font = [UIFont systemFontOfSize:11];
//        _smallTimeLbl.textColor = kLightGrayColor;
//    }
//    return _smallTimeLbl;
//}


-(void)setAnnouncementModel:(AnnouncementModel *)announcementModel
{
    _announcementModel = announcementModel;
    NSString *startDate = _announcementModel.start_date;
    
    //处理时间显示格式
    NSString *year = [startDate substringWithRange:NSMakeRange(0, 4)];
    NSString *month = [startDate substringWithRange:NSMakeRange(4, 2)];
    NSString *day = [startDate substringWithRange:NSMakeRange(6, 2)];
//    NSString *hour = [startDate substringWithRange:NSMakeRange(8, 2)];
//    NSString *min = [startDate substringWithRange:NSMakeRange(10, 2)];
//    NSString *second = [startDate substringWithRange:NSMakeRange(12, 2)];
    
    self.bigTimeLbl.text = [NSString stringWithFormat:@"%@-%@-%@", year, month, day];
    
//    self.smallTimeLbl.text = [NSString stringWithFormat:@"%@:%@:%@", hour, min, second];
    
    self.messageLbl.text = _announcementModel.name;
    
}

-(void)setMessage:(MessageModel *)message
{
    NSString *startDate = message.sendTime;
    
    //处理时间显示格式
    NSString *year = [startDate substringWithRange:NSMakeRange(0, 4)];
    NSString *month = [startDate substringWithRange:NSMakeRange(4, 2)];
    NSString *day = [startDate substringWithRange:NSMakeRange(6, 2)];
//    NSString *hour = [startDate substringWithRange:NSMakeRange(8, 2)];
//    NSString *min = [startDate substringWithRange:NSMakeRange(10, 2)];
//    NSString *second = [startDate substringWithRange:NSMakeRange(12, 2)];
    
    self.bigTimeLbl.text = [NSString stringWithFormat:@"%@-%@-%@", year, month, day];
    
//    self.smallTimeLbl.text = [NSString stringWithFormat:@"%@:%@:%@", hour, min, second];
    
    self.messageLbl.text = [NSString stringWithFormat:@"%@ : %@", message.sender, message.content];
    
    
}

// 操作结果
-(void)setOpenLog:(DevOpenLogModel *)openLog
{
    if (self.dateFormat == nil)
    {
        self.dateFormat = [[NSDateFormatter alloc] init];
        [self.dateFormat setDateFormat:@"yyyy/MM/dd HH:mm:ss"];//设定时间格式
    }
    
    NSString *startDate = [self.dateFormat stringFromDate:openLog.eventTime];
    NSLog(@"%@",startDate);
    //处理时间显示格式
    NSString *year = [startDate substringWithRange:NSMakeRange(0, 4)];
    NSString *month = [startDate substringWithRange:NSMakeRange(5, 2)];
    NSString *day = [startDate substringWithRange:NSMakeRange(8, 2)];
    NSString *hour = [startDate substringWithRange:NSMakeRange(11, 2)];
    NSString *min = [startDate substringWithRange:NSMakeRange(14, 2)];
    NSString *second = [startDate substringWithRange:NSMakeRange(17, 2)];
    
    self.bigTimeLbl.text = [NSString stringWithFormat:@"%@-%@-%@  %@:%@:%@", year, month, day,hour, min, second];
    
//    self.smallTimeLbl.text = [NSString stringWithFormat:@"%@:%@:%@", hour, min, second];
    
    NSString *operationResult = nil;
    
    if (openLog.operationRet == 0) {
        operationResult = NSLocalizedString(@"record_open_success", @"");
    }else if(openLog.operationRet == 1)
    {
        operationResult = NSLocalizedString(@"record_open_failure", @"");
    }
    
    if ([operationResult isEqualToString:@"开门成功"]) {
        self.statusImageView.image = [UIImage imageNamed:@"ture_status"];
    }else{
        self.statusImageView.image = [UIImage imageNamed:@"false_status"];
    }
    
    self.messageLbl.text = openLog.devName;
    
    
    
}

-(void)setSubviewSelected:(BOOL)selected
{
    if (selected) {
        self.bigTimeLbl.textColor = [UIColor whiteColor];
//        self.smallTimeLbl.textColor = [UIColor whiteColor];
        self.messageLbl.textColor = [UIColor whiteColor];
    }else
    {
        self.bigTimeLbl.textColor = kLightGrayColor;
//        self.smallTimeLbl.textColor = kLightGrayColor;
        self.messageLbl.textColor = kLightGrayColor;
    }
}

//-(void)setSelected:(BOOL)selected
//{
//    NSLog(@"%d", selected);
//}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
