//
//  OpenDoorViewCell.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DoorDto.h"

@interface OpenDoorViewCell : UITableViewCell

@property (nonatomic,strong)UIImageView *stateImg;

@property (nonatomic,strong)UILabel *doorLbl;

@property (nonatomic,strong)UILabel *stateLbl;

@property (nonatomic,strong)UIButton *detailBtn;

- (void)setDataWith:(NSInteger)index list:(NSMutableArray *)list;

@end
