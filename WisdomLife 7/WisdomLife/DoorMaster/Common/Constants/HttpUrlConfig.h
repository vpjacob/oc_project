//
//  HttpUrlConfig.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/5.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#ifndef HttpUrlConfig_h
#define HttpUrlConfig_h


/**
 post

 @return 发动临时密令
 */
#define kOpenCode @"/doormaster/app/commands"

/**
 GET

 @return 验证码请求
 */
#define kCodeUrl @"/doormaster/app/verifynums"

/**
 GET
 
 @return 社区公告
 */
#define kAnnouncementUrl @"/doormaster/app/announcement"

/**
 GET
 
 @return 社区广告
 */
#define kAdvertisementUrl @"/doormaster/app/advertisement"

/**
 POST

 @return 登陆请求
 */
#define kLoginUrl @"/doormaster/app/connection"

/**
 GET

 @return 注册手机账号
 */
#define kRegisterUrl @"/doormaster/app/users"

/**
 POST

@return 注册手机账号
*/
#define kRegisterEmailUrl @"/doormaster/app/users?method=email"

/**
 GET

 @return 获取用户的门权限
 */
#define kDoorInfoUrl @"/doormaster/app/users/userinfo/rid"

/**
 PUT

 @return 修改密码
 */
#define kChangePswUrl @"/doormaster/app/users/userinfo/password?method=modify"


/**
 PUT
 
 @return 忘记密码
 */
#define kForgetPswUrl @"/doormaster/app/users/userinfo/password?method=forgot"


/**
 POST
 
 @return 上传开锁记录
 */
#define kUploadOpenDoorUrl @"/doormaster/app/commands"


/**
 POST
 
 @return 远程开门
 */
#define kRemoteOpenDoor @"/doormaster/app/access/control"


/**
 PUT
 
 @return 远程开门
 */
#define kRealTimeResult @"/doormaster/app/rtdatas/result"

#endif /* HttpUrlConfig_h */
