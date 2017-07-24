//
//  OpenDoorViewCell.m
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "OpenDoorViewCell.h"
#import "Masonry.h"

@implementation OpenDoorViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
        [self addSubview:self.stateImg];
        [self addSubview:self.doorLbl];
        [self addSubview:self.stateLbl];
        [self addSubview:self.detailBtn];
    }
    return self;
}

#pragma mark - Layout
+ (BOOL)requiresConstraintBasedLayout{
    return true;
}

- (void)updateConstraints{
    
    [self.doorLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.offset(jjSCREENW(40));
        make.centerY.equalTo(self);
    }];
    
    [self.stateLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.doorLbl.mas_right).mas_offset(5);
        make.centerY.equalTo(self);
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

- (void)setDataWith:(NSInteger)index list:(NSMutableArray *)list
{
    DoorListDto *dto = [list safeObjectAtIndex:index];
    
    self.doorLbl.text = [NSString stringWithFormat:@"%@:",dto.show_name];
    
    DoorReaderDto *readerDto = [dto.readerArr safeObjectAtIndex:0];
    if (readerDto.hasSearch == NO) {
        if ([readerDto.privilege intValue] == 1) {
            self.stateImg.image = [UIImage imageNamed:@"icon_y"];
        }else if([readerDto.privilege intValue] == 2)
        {
            self.stateImg.image = [UIImage imageNamed:@"icon-t1"];
        }else
        {
            self.stateImg.image = [UIImage imageNamed:@"icon_b1"];
        }
        self.stateLbl.text = NSLocalizedString(@"sdk_error_code-106", @"");
    } else {
        if ([readerDto.privilege intValue] == 1) {
            self.stateImg.image = [UIImage imageNamed:@"icon_y1"];
        }else if([readerDto.privilege intValue] == 2)
        {
            self.stateImg.image = [UIImage imageNamed:@"icon_t"];
        }else
        {
            self.stateImg.image = [UIImage imageNamed:@"lock"];
        }
        self.stateLbl.text = NSLocalizedString(@"idle", @"");
    }
}

- (UIImageView *)stateImg
{
    if (!_stateImg) {
        _stateImg = [[UIImageView alloc] initWithFrame:CGRectMake(jjSCREENW(15), (jjSCREENH(60)-jjSCREENW(24))/2, jjSCREENW(19), jjSCREENW(24))];
        _stateImg.image = [UIImage imageNamed:@"admin_close_blue"];
    }
    return _stateImg;
}

- (UILabel *)doorLbl
{
    if (!_doorLbl) {
        _doorLbl = [[UILabel alloc] init];
        _doorLbl.text = @"1棟1单元：";
        _doorLbl.textColor = [UIColor colorWithHexString:@"797979"];
        _doorLbl.font = kSystem(15);
    }
    return _doorLbl;
}

- (UILabel *)stateLbl
{
    if (!_stateLbl) {
        _stateLbl = [[UILabel alloc] init];
        _stateLbl.textColor = [UIColor colorWithHexString:@"797979"];
        _stateLbl.text = NSLocalizedString(@"sdk_error_code-106", @"");
        _stateLbl.font = kSystem(15);
    }
    return _stateLbl;
}

-(UIButton *)detailBtn
{
    if (!_detailBtn) {
        _detailBtn = [[UIButton alloc] initWithFrame:CGRectMake(kDeviceWidth - kCurrentWidth(50), 0, kCurrentWidth(50), kCurrentWidth(65))];
    }
    return _detailBtn;
}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
