//
//  JJDoorListViewCell.h
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/9.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface JJDoorListViewCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UISwitch *refuseSwitch;
- (void)setDataWith:(NSInteger)index;
@end
