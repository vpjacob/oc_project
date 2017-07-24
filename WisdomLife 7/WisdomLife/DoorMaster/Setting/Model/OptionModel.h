//
//  OptionModel.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/12/22.
//  Copyright © 2015年 zhiguo. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum{
    SHAKE_OPEN = 0, //摇一摇开门
    NEAR_OPEN = 1,  //靠近开门
    ONCE_OPEN = 2   //一键开门
}OptinType;

@interface OptionModel : NSObject

@property (nonatomic) BOOL autoUploadOpenLog; // 自动上传开锁记录，该参数由服务器后台设置，app界面不展示
@property (nonatomic) BOOL useShake; // 打开摇一摇功能
@property (nonatomic) BOOL useNearOpen; // 打开靠近开门功能
@property (nonatomic) int shakeOpenDistance; //摇一摇距离选择：0 不限制距离，1 很近（即大于-55），  2 近距离（即大于-65）， 3 中距离（即大于-75）
@property (nonatomic) int nearOpenDistance; // 摇一摇距离选择：0 不限制距离，1 很近（即大于-55），  2 近距离（即大于-63）， 3 中距离（即大于-70）
@property (nonatomic, copy) NSString *appVersion; // app版本

@property (nonatomic) BOOL nearOpenLimit; //靠近开门限制打开相同设备的最短时间的功能
@property (nonatomic) int nearOpenLimitInterval; //靠近开门打开相同设备的最短时间

@end
