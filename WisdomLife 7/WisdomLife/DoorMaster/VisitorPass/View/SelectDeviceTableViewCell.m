//
//  SelectDeviceTableViewCell.m
//  SmartDoor
//
//  Created by 宏根 张 on 22/04/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "SelectDeviceTableViewCell.h"

@implementation SelectDeviceTableViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        
        [self addSubview:self.deviceImage];
        [self addSubview:self.deviceName];
        [self addSubview:self.useLB];
    }
    return self;
}

- (void)drawRect:(CGRect)rect {
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [UIColor clearColor].CGColor);
    CGContextFillRect(context, rect);
    CGContextSetStrokeColorWithColor(context, [UIColor colorWithHexString:@"d3d3d3"].CGColor);
    CGContextStrokeRect(context, CGRectMake(0, kCurrentWidth(60), rect.size.width, 0.5));
}

-(UIImageView *)deviceImage
{
    if (!_deviceImage) {
        _deviceImage = [[UIImageView alloc] initWithFrame:CGRectMake(kCurrentWidth(25), kCurrentWidth(10), kCurrentWidth(30), kCurrentWidth(40))];
    }
    return _deviceImage;
}

-(UILabel *)deviceName
{
    if (!_deviceName) {
        _deviceName = [[UILabel alloc] initWithFrame:CGRectMake(self.deviceImage.right+kCurrentWidth(25), kCurrentWidth(20), kCurrentWidth(150), kCurrentWidth(25))];
        _deviceName.font = kSystem(15);
        _deviceName.textColor = kGrayColor;
    }
    return _deviceName;
}

-(UILabel *)useLB
{
    if (!_useLB) {
        _useLB = [[UILabel alloc] initWithFrame:CGRectMake(kDeviceWidth - kCurrentWidth(75), kCurrentWidth(20), kCurrentWidth(50), kCurrentWidth(25))];
        _useLB.textAlignment = NSTextAlignmentRight;
        _useLB.font = kSystem(15);
    }
    return _useLB;
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
