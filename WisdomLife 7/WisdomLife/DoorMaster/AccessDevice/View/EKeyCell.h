//
//  EKeyCell.h
//  DoorMaster
//
//  Created by 宏根 张 on 5/30/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface EKeyCell : UITableViewCell

+(instancetype)eKeyCellWithTableView:(UITableView *)tableView;

- (void)setEKeyCell:(NSString *)appAccount startDate:(NSString *)startDate endDate:(NSString *)endDate privilege:(int)privilege createDate:(NSString*)createDate;

@end
