//
//  SendEKeyViewController.h
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "CommonViewController.h"
@class DoorReaderDto;
@interface SendEKeyViewController : CommonViewController

@property (nonatomic, strong) DoorReaderDto *devModel;
@property (nonatomic, strong) NSString *devName;

@end
