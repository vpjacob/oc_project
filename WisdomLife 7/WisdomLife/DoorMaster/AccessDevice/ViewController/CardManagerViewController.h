//
//  CardManagerViewController.h
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "CommonViewController.h"
@class DoorReaderDto;
@interface CardManagerViewController : CommonViewController

@property (nonatomic, strong) DoorReaderDto *devModel;

@end
