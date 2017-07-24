//
//  GongGaoCell.h
//  SmartDoor
//
//  Created by 朱攀峰 on 17/2/27.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import <UIKit/UIKit.h>
@class MessageModel;
@class AnnouncementModel;
@class DevOpenLogModel;

@interface GongGaoCell : UITableViewCell

@property (nonatomic,strong)UILabel *bigTimeLbl;

//@property (nonatomic,strong)UILabel *smallTimeLbl;

@property (nonatomic,strong)UILabel *messageLbl;


@property (nonatomic,strong)AnnouncementModel *announcementModel;  //公告

-(void)setSubviewSelected:(BOOL)selected;

-(void)setMessage:(MessageModel *)message;

-(void)setOpenLog:(DevOpenLogModel *)openLog;

@end
