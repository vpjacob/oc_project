//
//  UserManager.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/8/29.
//  Copyright (c) 2015年 zhiguo. All rights reserved.
//

#import "UserManager.h"

@interface UserManager ()

@property (nonatomic, copy) NSString *userFilePath;
@end

@implementation UserManager

+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static UserManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:zone];
    });
    
    return instance;
}

+ (instancetype)manager
{
    return [[self alloc] init];
}


/**
 *  懒加载userFilePath
 */

- (NSString *)userFilePath
{
    if (_userFilePath == nil) {
        _userFilePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0] stringByAppendingPathComponent:@"user.dat"];
    }
    return _userFilePath;
}
//归档
- (UserModel *)user
{
    if (_user == nil) {
        _user = [NSKeyedUnarchiver unarchiveObjectWithFile:self.userFilePath];
        if (_user == nil) {
            _user = [[UserModel alloc] init];
        }
    }
    return _user;
}

- (BOOL)clearUser
{
    // 只保留username、client_id用于记录最近一次登录的账号
    _user.nickname = nil;
    _user.identity = nil;
    _user.cardno = nil;
    [self saveUser];
    return YES;
}

- (BOOL)saveUser
{
    if (self.userFilePath == nil) {
        return NO;
    }
    return [NSKeyedArchiver archiveRootObject:_user toFile:self.userFilePath];
}

//#ifdef USER_TEST
//-(void)test
//{
//    UserManager *manger = [UserManager manager] ;
//    // test
//    //UserModel *user = [[UserModel alloc] init];
//    UserModel *user = [manger user];
//    user.access_token = @"access_tocken1";
//    user.nickname = @"neckname1";
//    user.username = @"username1";
//    user.phone = @"phone1";
//    
//     DEBUG_PRINT(@"empty load user %@-%@-%@-%@",manger.user.access_token,manger.user.nickname,manger.user.phone,manger.user.username);
//    [manger saveUser];
//    user = nil;
//    
//    //user = [manger user];
//    user = manger.user;
//    
//    DEBUG_PRINT(@"read user %@-%@-%@-%@",user.access_token,user.nickname,user.phone,user.username);
//    /*
//     @property (nonatomic, copy) NSString *access_token;
//     @property (nonatomic, copy) NSString *nickname;
//     @property (nonatomic, copy) NSString *username;
//     @property (nonatomic, copy) NSString *password;
//     @property (nonatomic, copy) NSString *phone;
//     */
//    //user->
//    user.access_token = @"access_tocken2";
//    user.nickname = @"neckname2";
//    user.username = @"username2";
//    user.phone = @"phone2";
//    [manger saveUser];
//    
//    user = [manger user];
//    DEBUG_PRINT(@"read user 2 %@-%@-%@-%@",user.access_token,user.nickname,user.phone,user.username);
//
//}
//#endif
@end
