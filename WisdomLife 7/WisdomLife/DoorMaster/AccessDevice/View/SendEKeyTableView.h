//
//  SendEKeyTableView.h
//  DoorMaster
//  发送电子钥匙tableViewCell
//  Created by 宏根 张 on 5/25/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DoorDto.h"

@interface SendEKeyTableView : UITableView

@property (nonatomic, strong) DoorReaderDto *devModel;
@property (nonatomic, copy) NSString *devName;
@property (nonatomic) BOOL isSuperAdmin;

// tableView的坐标
@property (nonatomic, assign) CGRect tableViewFrame;

// 存放Cell上各行textLabel值
@property (nonatomic, strong)NSMutableArray *textLabel_MArray;

// 存放Cell上各行imageView上图片
@property (nonatomic, copy)NSMutableArray *images_MArray;

// 存放Cell上各行detailLabel值
@property (nonatomic, copy)NSMutableArray *subtitle_MArray;

@end
