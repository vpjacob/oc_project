//
//  InsureValidate.h
//  Storm
//
//  Created by 朱攀峰 on 15/11/25.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface InsureValidate : NSObject

//验证身份证的长度字符以及出生日期的合法性
+ (NSString *)validateCertificate:(NSString *)certificateNo;

//根据身份证号获取生日
+ (NSString *)getBirthdayFromCertificate:(NSString *)certificateNo;

//验证邮箱是否合法
+ (BOOL) validateEmail:(NSString *)email;

//验证手机号码的合法性
+ (BOOL) validateMobile:(NSString *)mobile;

//用户名
+ (BOOL) validateUserName:(NSString *)name;

//验证姓名为2-10汉字
+ (BOOL)validateChinese:(NSString *)name;

//从今天起往后推month个月day天
+ (NSDate *)todayAfterSeveralMonths:(NSInteger)months andDays:(NSInteger)days;

//从今天往后推day天
+ (NSDate *)todayAfterSeveralDays:(NSInteger)days;

//校验输入的是正数（包含小数）
+ (BOOL)vlidateNumber:(NSString *)number;

//textfield输入字符串加入空格
+ (NSString *)addWhiteSpaceInStr:(NSString *)text responString:(NSString *)string range:(NSRange)range index:(int)index;
+ (NSString *)addWhiteSpaceInStr:(NSString *)text responString:(NSString *)string range:(NSRange)range index:(int)index index1:(int)index1;

//去除字符串空白部分
+ (NSString *)deleteWhiteSpaceInStr:(NSString *)string;

//校验正整数
+ (BOOL)validateUnsignInteger:(NSString *)number;

//校验正整数
+ (BOOL)validateInteger:(NSString *)number;

//手机号隐位处理
+ (NSString *)phonenum:(NSString *)phone;

//邮箱隐位处理
+ (NSString *)email:(NSString *)email;

//身份证隐位处理
+ (NSString *)idCard:(NSString *)idCard;

//姓名隐位处理
+ (NSString *)name:(NSString *)name;

//手机号码加空格
+ (NSString *)addWhiteSpaceInStrForPhoneNumber:(NSString *)phoneNumer;

//去除特殊字符（去除加号）
+ (NSString *)deleteSpecialStr:(NSString *)string;

//去除特殊字符（去除分割杠）
+ (NSString *)deleteSpecialStr1:(NSString *)string;

//手机通讯录过滤
+ (NSString *)checkMobilePhoneWithStr:(NSString *)phoneStr;

//获取钥匙串设备号
//需要用到SFHFkeychainUtils第三方
+ (NSString *)keychainDevice;

+ (BOOL)validateZipCode:(NSString *)zipCode;
@end
