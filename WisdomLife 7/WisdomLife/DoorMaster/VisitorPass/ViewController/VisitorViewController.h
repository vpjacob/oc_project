//
//  VisitorViewController.h
//  SmartDoor
//
//  Created by 朱攀峰 on 17/3/7.
//  Copyright © 2017年 朱攀峰. All rights reserved.
//

#import "CommonViewController.h"

@interface VisitorViewController : CommonViewController

@property (nonatomic,strong) NSString *selectedDevSn; //选中的设备SN
@property (nonatomic,strong) NSString *selectedDevName; //选中的设备名称
@property (nonatomic,assign) int type;  //选中设备的类型,用于区分发送二维码或者是密码 1:临时密码， 2:二维码密码
@property (nonatomic,assign) BOOL isFromDeviceDetail; //是否是由设备详情页面跳转过来的
 
@end
