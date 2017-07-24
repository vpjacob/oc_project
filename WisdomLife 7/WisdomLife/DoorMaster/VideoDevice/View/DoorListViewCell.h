//
//  DoorListViewCell.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/1.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DoorListViewCell : UICollectionViewCell

@property (nonatomic,strong)UIImageView *doorImg;

@property (nonatomic,strong)UILabel *titleLbl;

- (void)setDataWith:(NSInteger)index;

@end
