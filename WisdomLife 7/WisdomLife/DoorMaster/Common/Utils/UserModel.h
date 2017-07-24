//
//  UerModel.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/8/29.
//  Copyright (c) 2015年 zhiguo. All rights reserved.
//

#import "BaseModel.h"

@interface UserModel : BaseModel

@property (nonatomic) BOOL autoUploadOpenLog; // 自动上传开锁记录，该参数由服务器后台设置，app界面不展示
@property (nonatomic, copy) NSString *nickname;
@property (nonatomic, copy) NSString *username;
@property (nonatomic, copy) NSString *identity;
@property (nonatomic, copy) NSString *cardno;
@property (nonatomic, copy) NSString *client_id;
@property (nonatomic, copy) NSString *token_pwd;
@property (nonatomic) BOOL  isLogin;

@end
