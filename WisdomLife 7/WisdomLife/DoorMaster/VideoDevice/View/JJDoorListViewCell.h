//
//  JJDoorListViewCell.h
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/9.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import <UIKit/UIKit.h>

@class JJDoorListViewCell;
@protocol JJDoorListViewCellDelegate <NSObject>

-(void)JJDoorListView:(JJDoorListViewCell *)doorListCell withSwitch:(UISwitch *)sw didSelectIndex:(NSInteger)index;

@end

typedef void(^JJSwichValueChangeBlock)(NSInteger tag);

@interface JJDoorListViewCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UISwitch *refuseSwitch;
@property (nonatomic, strong) UISwitch *sw;
@property (nonatomic, copy)JJSwichValueChangeBlock switchBlock;
@property (nonatomic, weak) id<JJDoorListViewCellDelegate> delegate;
- (void)setDataWith:(NSInteger)index;


@end
