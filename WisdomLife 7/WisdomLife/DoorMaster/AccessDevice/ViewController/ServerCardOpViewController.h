//
//  ServerCardOpViewController.h
//  SmartDoor
//
//  Created by 宏根 张 on 31/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "CommonViewController.h"

@interface ServerCardOpViewController : CommonViewController

@property (nonatomic, strong) LibDevModel *libDevModel;
@property (nonatomic, strong) NSString *cardOpStatus; // 批量卡操作状态，值： add， del

@end
