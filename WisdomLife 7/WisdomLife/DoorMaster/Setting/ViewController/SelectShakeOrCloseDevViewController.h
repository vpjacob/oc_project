//
//  SelectShakeOrCloseDevViewController.h
//  SmartDoor
//
//  Created by 宏根 张 on 19/05/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "CommonViewController.h"
typedef enum {
    SHAKETYPE = 0,
    NEAROPENTYPE = 1,
}SELECTTYPE;
@interface SelectShakeOrCloseDevViewController : CommonViewController

@property (nonatomic) SELECTTYPE type;

@end
